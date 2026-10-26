/* Nakula Phone AU: fictional iMessage story and on-screen notification. */
(function(){
'use strict';
const timeline=[{"me":false,"time":"20.20","text":"Na, masih bangun? Need a quick legal perspective buat tulisan editorial gue besok. Off the record kok."},{"me":true,"time":"20.20","text":"Saya sedang drafting defense statement, make it quick. Ada apa?"},{"me":false,"time":"20.21","text":"Ini soal isu PHK massal di anak perusahaan logistik itu. Whistleblower gue di HR mereka bilang, alasan efisiensi itu cuma kedok biar perusahaannya bisa hindarin bayar pesangon secara penuh. Perundingan bipartitnya gagal total kemarin."},{"me":true,"time":"20.21","text":"Typical corporate playbook. Mereka pasti ingin frame situasinya sebagai force majeure atau kerugian finansial berat untuk justify pesangon minim menggunakan aturan baru. Saat bipartit, perusahaannya memberikan audited financial statements tidak, untuk membuktikan kerugian tersebut?"},{"me":false,"time":"20.22","text":"Nggak ada. Press release yang dikirim ke newsroom gue cuma pure PR bullshit. Katanya \"restrukturisasi strategis demi long-term sustainability\", my ass. Kalau serikat pekerjanya mutusin buat ajuin class-action lawsuit, what are their actual odds di pengadilan?"},{"me":true,"time":"20.23","text":"Slim to none, kalau grounds-nya tidak solid. Gugatan perwakilan kelompok di PHI itu exceptionally messy. Serikat pekerjanya harus memegang risalah perundingan bipartit yang gagal itu dulu sebelum mereka bahkan bisa eskalasi ke Disnaker untuk mediasi."},{"me":true,"time":"20.23","text":"Parahnya lagi, kalau perusahaannya sengaja mengajukan PKPU hanya untuk menunda pembayaran pesangon, pekerjanya otomatis akan turun status menjadi kreditur konkuren. It’s a legal bloodbath."},{"me":false,"time":"20.23","text":"Gila........."},{"me":false,"time":"20.24","text":"Jadi mereka secara legal ngeksploitasi loophole buat bikin pekerjanya berdarah-darah."},{"me":false,"time":"20.24","text":"Can I quote you on that? Gue pake anonymous attribution deh, \"Menurut seorang corporate litigator ternama di SCBD...\" 😂"},{"me":true,"time":"20.24","text":"Absolutely not. Do not even try. Saya tidak akan mengambil risiko melanggar conflict of interest policy firma saya hanya untuk scoop kamu, Harley. Keep my existence out of your headline."},{"me":false,"time":"20.25","text":"Chill, man. 🙈"},{"me":false,"time":"20.25","text":"Gue paham kode etik jurnalistik. Gue nggak bakal bakar source gue sendiri. Lagian embargo-nya sampai cetakan cetak besok pagi kok."},{"me":false,"time":"20.25","text":"Btw, lu beneran nggak mau ngasih gue exclusive interview soal kasus tambangnya PBK Group? On the record, kali ini. It would be a massive front-page feature."},{"me":true,"time":"20.26","text":"Harley, saya block ya if this conversation turn into an ambush interview."},{"me":false,"time":"20.26","text":"Oh you won’t."},{"me":false,"time":"20.26","text":"Halo?"},{"me":false,"time":"20.26","text":"Nakula. 🥺"}];
const adnanTimeline=[{"me":false,"time":"18.42","text":"Nakula, good evening. Sudah sempat review berkas yang Nirmala kirim sore tadi?"},{"me":true,"time":"18.43","text":"Sudah, Pak. Ada dua bagian di kronologi yang perlu diverifikasi lagi. Saya tandai di file."},{"me":false,"time":"18.43","text":"Alright. No rush tonight. Saya hanya mau pastikan besok kita punya versi yang sama untuk dibahas dengan tim."},{"me":true,"time":"18.44","text":"Understood. Saya rapikan catatan revisinya malam ini, besok pagi tinggal kita cross-check."},{"me":false,"time":"18.45","text":"Bagus. By the way, Nirmala bilang kamu belum makan sejak siang. Jangan dibiasakan, Nakula."},{"me":true,"time":"18.45","text":"She's exaggerating, Pak. Saya sempat makan. Kopi juga."},{"me":false,"time":"18.46","text":"Kopi is not a meal. Lima belas tahun di firma ini mengajarkan saya satu hal: tidak ada brief yang membaik karena lawyer-nya lupa istirahat."},{"me":true,"time":"18.46","text":"Noted, Pak. I'll get dinner before continuing."},{"me":false,"time":"18.47","text":"Good. See you tomorrow. And please, no email at 3 AM this time."},{"me":true,"time":"18.47","text":"No promises, Pak. But I'll try."}];

const $au=(id)=>document.getElementById(id);
threads=[
{id:'harley',name:'Harley Mahira',role:'Journalist',initials:'HM',date:'now',messages:[{...timeline[0]}]},
{id:'adnan',name:'Adnan W. (Managing Partner)',role:'Managing Partner',initials:'AW',date:'18.47',messages:adnanTimeline.map(m=>({...m}))},
{id:'damar',name:'Mas Damar',role:'HHP',initials:'MD',date:'',messages:[]},
{id:'nirmala',name:'Nirmala',role:'Junior Assoc. AHP',initials:'N',date:'',messages:[]}
];
let cursor=1,adnanCursor=adnanTimeline.length,typing=false,ready=false,incomingThread=null,typingTimer=null,audioContext=null;
let harleyUnread=true,adnanUnread=false,unknownUnread=false,nirmalaUnread=false;
let keyboardVisible=false,keyboardSoundEnabled=true,keyboardAudioContext=null,lastKeyFeedback=0,typingRun=0;
let harleyAutoplayStarted=false,adnanAutoplayStarted=false,harleyNextTimer=null,harleyAutoSendTimer=null,adnanNextTimer=null,adnanAutoSendTimer=null;
const inHarley=()=>state.screen==='app'&&state.app==='messages'&&state.view==='convo'&&state.thread==='harley';
const inScripted=()=>state.screen==='app'&&state.app==='messages'&&state.view==='convo'&&(['harley','adnan','unknown'].includes(state.thread)||(state.thread==='nirmala'&&day2NirmalaDelivered));
const activeTimeline=()=>state.thread==='unknown'?unknownTimeline:state.thread==='adnan'?adnanTimeline:state.thread==='nirmala'?nirmalaTimeline:timeline;
const activeIndex=()=>state.thread==='unknown'?unknownCursor:state.thread==='adnan'?adnanCursor:state.thread==='nirmala'?nirmalaCursor:cursor;
const setIndex=(id,i)=>{if(id==='unknown')unknownCursor=i;else if(id==='adnan')adnanCursor=i;else if(id==='nirmala')nirmalaCursor=i;else cursor=i};
const threadById=id=>threads.find(t=>t.id===id);
const isReceiving=()=>incomingThread===state.thread;
const notif=document.createElement('div');notif.id='harley-au-notification';notif.className='harley-au-notification';
notif.innerHTML='<button class="harley-au-notif-body" type="button"><span class="harley-au-notif-icon">●</span><span><small>MESSAGES · now</small><strong>Harley Mahira</strong><span>Na, masih bangun? Need a quick legal perspective buat tulisan editorial gue besok.</span></span></button><button type="button" class="harley-au-notif-close" aria-label="Close notification">×</button>';
$au('phone').appendChild(notif);
// The unread badge lives outside the icon artwork so it isn't clipped by the icon's rounded mask.
const messagesDockIcon=document.querySelector('#dock .app-button[data-app="messages"]');
const unreadBadge=document.createElement('span');
unreadBadge.className='harley-au-unread-badge is-hidden';
unreadBadge.textContent='1';
unreadBadge.setAttribute('aria-label','1 unread message');
messagesDockIcon?.querySelector('.app-icon')?.insertAdjacentElement('afterend',unreadBadge);
function syncHarleyBadge(){
 const count=Number(harleyUnread)+Number(adnanUnread)+Number(unknownUnread)+Number(nirmalaUnread);
 unreadBadge.textContent=String(count);
 unreadBadge.setAttribute('aria-label',count+' unread messages');
 unreadBadge.classList.toggle('is-hidden',!count||state.screen==='lock');
}
function markHarleyRead(){
 harleyUnread=false;
 saveStoryState('read-harley');
 hideNotif();
 syncHarleyBadge();
}
function markAdnanRead(){
 adnanUnread=false;
 saveStoryState('read-adnan');
 hideNotif();
 syncHarleyBadge();
}
function markUnknownRead(){
 unknownUnread=false;
 saveStoryState('read-unknown');
 hideNotif();
 syncHarleyBadge();
}
function markNirmalaRead(){
 nirmalaUnread=false;
 saveStoryState('read-nirmala');
 hideNotif();
 syncHarleyBadge();
}
function setNotification(id){
 const t=threadById(id);
 if(!t)return;
 notif.dataset.thread=id;
 notif.querySelector('strong').textContent=t.name;
 notif.querySelector('.harley-au-notif-body span:last-child > span').textContent=((id==='adnan'&&day2Stage!=='none')||id==='nirmala'||(id==='unknown'&&day2MentariPhotoDelivered)?t.messages[t.messages.length-1]?.text:t.messages[0]?.text)||'';
 notif.querySelector('.harley-au-notif-body small').textContent='MESSAGES · now';
}

function sound(){
 try{
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  audioContext=audioContext||new AC();
  if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
  const t=audioContext.currentTime+.016;
  [[0,880],[.13,1175]].forEach(([delay,f])=>{
    const o=audioContext.createOscillator(),g=audioContext.createGain();
    o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t+delay);
    g.gain.exponentialRampToValueAtTime(.075,t+delay+.018);
    g.gain.exponentialRampToValueAtTime(.0001,t+delay+.24);
    o.connect(g).connect(audioContext.destination);o.start(t+delay);o.stop(t+delay+.25);
  });
 }catch(e){} // Audio may be restricted until a user interacts with the browser.
}
function hideNotif(){notif.classList.remove('show')}
function showNotif(play=false){
 // Never show the incoming message until the phone has been unlocked with the PIN.
 if(state.screen!=='home'||!harleyUnread)return;
 setNotification('harley');
 notif.classList.add('show');
 if(play)sound();
}
function openStoryThread(id){
 if(state.screen!=='home'&&state.screen!=='app')return;
 if(id==='adnan')markAdnanRead();else if(id==='unknown')markUnknownRead();else if(id==='nirmala')markNirmalaRead();else markHarleyRead();
 openApp('messages');state.thread=id;state.view='convo';render();
}
notif.querySelector('.harley-au-notif-body').addEventListener('click',()=>openStoryThread(notif.dataset.thread||'harley'));
notif.querySelector('.harley-au-notif-close').addEventListener('click',hideNotif);

/* Fictional incoming-call sequence following the final Harley message. */
let unknownQueued=false,unknownStage='idle',unknownAttempt=0,unknownInterrupted=false;
let unknownCursor=1,aftermathTriggered=false,adnanIncidentPending=false,phoneRecentsFilter='all',callConnectedAt=0;
const unknownMessageText='Saya rasa peringatan tadi sudah cukup jelas, Pak Nakula. Berhenti mengusut Zona B. Anda masih punya kesempatan untuk mundur.';
const unknownTimeline=[{me:false,time:'23.57',text:unknownMessageText}];
// Short, factual reporting in Nakula's professional tone.
const conciseAngryAdnanText="Pak, saya menerima panggilan anonim terkait Zona B. Penelepon meminta saya menghentikan penyelidikan PBK Group. Saya akhiri sambungannya, tetapi ia menelepon kembali dengan nada mengancam. Sudah saya catat. Detailnya saya sampaikan besok pagi.";
function migrateOldAngryAdnanMessage(message){
 if(!message||message.me!==true||typeof message.text!=='string')return message;
 const prior=message.text.startsWith('Pak, mohon maaf menghubungi selarut ini. Ada intimidasi terkait perkara Zona B.')
  && message.text.includes('Besok pagi saya ingin membahas langkah perlindungan, Pak.');
 return prior?{...message,text:conciseAngryAdnanText}:message;
}
/* Two incident accounts. A declined call does not mean the caller became angry:
   only hanging up on an answered call unlocks the angry callback. */
function buildUnknownIncidentReport(){
 const declinedCalls=unknownCallHistory.filter(call=>call.kind==='Declined').length;
 const angry=unknownInterrupted;
 const declinedNote=declinedCalls
  ?'Sebelum tersambung, saya menolak '+declinedCalls+' panggilan. Nomor yang sama terus menghubungi.'
  :'Saya menjawab panggilan pertama dari nomor yang tidak dikenal.';
 const declinedAdnan=declinedCalls
  ?' Saya sempat menolak '+declinedCalls+' panggilan sebelum menjawab.':'';
 const noteBody=[
  'CATATAN PANGGILAN — PRIBADI','',
  'Nomor penelepon: Disembunyikan / Tidak dikenal.',
  declinedNote,
  'Penelepon menyebut PBK Group dan meminta saya menghentikan penelusuran insiden Zona B.'
 ];
 if(angry){
  noteBody.push('Saya mengakhiri sambungan pertama sebelum percakapan selesai. Penelepon kembali menghubungi, membentak, menyebut nama lengkap saya, dan mengulangi ancamannya.');
 }else{
  noteBody.push('Ancaman disampaikan dalam satu percakapan tersambung. Saya membiarkan penelepon selesai berbicara sebelum sambungan berakhir.');
 }
 noteBody.push('','TINDAK LANJUT',
  '• Simpan riwayat panggilan dan catat pernyataan penelepon secara akurat.',
  '• Identitas penelepon dan keterkaitannya dengan PBK Group belum terverifikasi.',
  '• Jangan membagikan berkas klien atau menanggapi penelepon lebih lanjut.',
  angry
   ?'• Segera laporkan eskalasi ancaman kepada Pak Adnan dan bahas langkah perlindungan.'
   :'• Laporkan ancaman kepada Pak Adnan untuk evaluasi tindak lanjut.'
 );
 const adnanMessage=angry
  ?conciseAngryAdnanText
  :'Pak, mohon maaf menghubungi malam-malam. Saya baru menerima panggilan dari nomor tak dikenal terkait Zona B. Penelepon menyebut PBK Group dan meminta saya menghentikan penelusuran perkara.'+declinedAdnan+' Saya mendengarkan sampai percakapan selesai dan sudah mencatat waktu serta isi peringatannya. Identitas penelepon belum diketahui. Besok pagi akan saya laporkan kronologi lengkapnya, Pak.';
 return {branch:angry?'angry':'regular',declinedCalls,noteBody:noteBody.join('\n'),adnanMessage};
}
// Phone Recents are generated by the live storyline. Each new page visit starts
// with a clean call log; revisiting Phone within this playthrough keeps its entries.
let unknownCallHistory=[];
try{localStorage.removeItem('myphone-ios-nakula-unknown-call-history')}catch{}
let callRetryTimer=null,callSubtitleTimer=null,callRingTimer=null,callLineIndex=0;
const unknownLines=[
 'Pak Nakula, saya sarankan Anda berhenti mengusut insiden Zona B.',
 'PBK Group sudah menawarkan penyelesaian kepada keluarga itu. Jangan bawa perkara ini lebih jauh.',
 'Ada orang-orang yang tidak ingin berkas itu dibuka lagi. Anda mengerti maksud saya?',
 'Hentikan penyelidikannya. Anggap ini peringatan terakhir.'
];
const unknownAngryLines=[
 'BERANI-BERANINYA ANDA MEMATIKAN TELEPON SAAT SAYA SEDANG BICARA?!',
 'SAYA BELUM SELESAI, NAKULA SHANKARA BUMI!',
 'SAYA SUDAH MEMPERINGATKAN ANDA UNTUK MENJAUH DARI PERKARA PBK GROUP!',
 'JANGAN PERNAH MENGANGGAP PERINGATAN SAYA SEBAGAI LELUCON!'
];
const callScreen=document.createElement('div');
callScreen.id='nakula-unknown-call';
callScreen.className='nakula-unknown-call';
callScreen.hidden=true;
callScreen.setAttribute('role','dialog');
callScreen.setAttribute('aria-label','Incoming call from Unknown');
callScreen.innerHTML=
 '<div class="nakula-call-top"><span class="nakula-call-network">INDOSAT</span><span class="nakula-call-signal">●●●◖</span></div>'+
 '<div class="nakula-call-content">'+
   '<div class="nakula-call-avatar" aria-hidden="true"><svg viewBox="0 0 64 64" fill="currentColor"><circle cx="32" cy="22" r="12"/><path d="M8 56c0-14 9-22 24-22s24 8 24 22Z"/></svg></div>'+
   '<div class="nakula-call-name">Unknown</div>'+
   '<div class="nakula-call-status" id="nakula-call-status">incoming call…</div>'+
   '<div class="nakula-call-voice" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'+
   '<div class="nakula-call-caption" id="nakula-call-caption" aria-live="polite"></div>'+
 '</div>'+
 '<div class="nakula-call-actions">'+  // Button text remains accessible for screenreaders
  '<button type="button" class="nakula-call-decline" data-nakula-call="decline" aria-label="Decline call"><span class="nakula-call-icon">✕</span><small>Tolak</small></button>'+
  '<button type="button" class="nakula-call-accept" data-nakula-call="accept" aria-label="Answer call"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 2.6 3.5 5.7c-1.8 2.3 1.2 8.1 5.6 12.4 4.4 4.4 10.3 7.4 12.5 5.6l2.9-3.2-5.3-4.1-2.7 2.8c-2.8-1.3-5.3-3.8-6.6-6.6l2.7-2.7-4-5.3Z"/></svg><small>Angkat</small></button>'+
 '</div>'+
 '<button type="button" class="nakula-call-hangup" data-nakula-call="hangup" hidden>Akhiri</button>';
$au('phone').appendChild(callScreen);
const callStatus=callScreen.querySelector('#nakula-call-status');
const callCaption=callScreen.querySelector('#nakula-call-caption');
function clearUnknownTimers(){
 clearInterval(callRingTimer);callRingTimer=null;
 clearTimeout(callRetryTimer);callRetryTimer=null;
 clearTimeout(callSubtitleTimer);callSubtitleTimer=null;
}
function ringPulse(){
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
  audioContext=audioContext||new Audio();
  if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
  const t=audioContext.currentTime+.025;
  [0,.2,.4].forEach((delay,i)=>{
   const osc=audioContext.createOscillator(),gain=audioContext.createGain();
   osc.type='sine';osc.frequency.value=i%2?490:440;
   gain.gain.setValueAtTime(.0001,t+delay);
   gain.gain.linearRampToValueAtTime(.055,t+delay+.02);
   gain.gain.exponentialRampToValueAtTime(.0001,t+delay+.17);
   osc.connect(gain).connect(audioContext.destination);
   osc.start(t+delay);osc.stop(t+delay+.18);
  });
 }catch(e){}
}

function recordUnknownCall(kind){
 const duration=callConnectedAt?Math.max(1,Math.round((Date.now()-callConnectedAt)/1000)):0;
 unknownCallHistory.unshift({id:Date.now()+'-'+unknownAttempt,kind,
  time:window.nakulaNarrativeClock.time().replace(':','.'),duration});
 unknownCallHistory=unknownCallHistory.slice(0,30);
 saveStoryState('call-log');
 if(state.screen==='app'&&state.app==='phone')render();
}
function finishUnknownIncident(){
 // Nothing is written until a fully answered call ends, for either branch.
 if(aftermathTriggered||unknownStage!=='finished'||!unknownCallHistory.some(call=>call.kind==='Answered'))return;
 aftermathTriggered=true;
 const report=buildUnknownIncidentReport();
 if(!notes.some(n=>Number(n.id)===9901)){
  notes.unshift({
   id:9901,
   title:'PANGGILAN TAK DIKENAL / catatan insiden',
   date:window.nakulaNarrativeClock.dateLabel(),
   body:report.noteBody
  });
  // This incident note exists only during this playthrough until Continue is implemented.
 }
 if(!adnanIncidentPending){
  adnanIncidentPending=true;
  adnanTimeline.push({
   me:true,
   time:window.nakulaNarrativeClock.time().replace(':','.'),
   text:report.adnanMessage
  });
 }
 if(!threadById('unknown')){
  unknownTimeline[0].time=window.nakulaNarrativeClock.time().replace(':','.');
  threads.unshift({id:'unknown',name:'Unknown',role:'Unknown Number',initials:'?',date:unknownTimeline[0].time,
   messages:unknownTimeline.map(m=>({...m}))});
 }
 unknownUnread=true;
 saveStoryState('CP01-call-aftermath');
 syncHarleyBadge();
 if(state.screen==='app'&&(state.app==='phone'||(state.app==='messages'&&state.view!=='convo')))render();
 if(state.screen!=='lock'){
  setNotification('unknown');
  notif.classList.add('show');
  sound();
 }
}
function renderNakulaRecents(){
 const entries=unknownCallHistory.filter(x=>phoneRecentsFilter==='all'||x.kind==='Declined');
 $au('app-header').innerHTML='<button class="plain-btn" data-action="back"><span class="chev-left">‹</span> Home</button><span class="app-title">Phone</span><span style="width:58px"></span>';
 $au('app-content').innerHTML='<div class="nakula-phone-recents"><div class="large-title">Recents</div>'+
  '<div class="nakula-call-filter"><button data-au-recents="all" class="'+(phoneRecentsFilter==='all'?'selected':'')+'">All</button><button data-au-recents="missed" class="'+(phoneRecentsFilter==='missed'?'selected':'')+'">Missed</button></div>'+
  (entries.length?'<div class="nakula-call-history">'+entries.map(x=>
   '<div class="nakula-call-history-row"><span class="nakula-recents-avatar">?</span><span class="nakula-recents-main"><strong class="'+(x.kind==='Declined'?'missed':'')+'">Unknown</strong><small>'+(x.kind==='Declined'?'Declined call':'Incoming · '+x.duration+'s')+'</small></span><span class="nakula-recents-time">'+esc(x.time)+'</span></div>'
  ).join('')+'</div>':'<p class="nakula-recents-empty">No recent calls yet.</p>')+
  '<button type="button" class="nakula-recents-contacts" data-au-phone-contact>View Nakula’s contact card</button></div>';
 $au('app-content').style.padding='14px 18px 38px';
 $au('app-content').style.overflowY='auto';
}
document.addEventListener('click',e=>{
 const filter=e.target.closest('[data-au-recents]');
 if(filter&&state.screen==='app'&&state.app==='phone'){
  e.preventDefault();e.stopImmediatePropagation();
  phoneRecentsFilter=filter.dataset.auRecents==='missed'?'missed':'all';
  renderNakulaRecents();return;
 }
 const contact=e.target.closest('[data-au-phone-contact]');
 if(contact&&state.screen==='app'&&state.app==='phone'){
  e.preventDefault();e.stopImmediatePropagation();openApp('about');return;
 }
 const forward=e.target.closest('[data-au-open-adnan]');
 if(forward&&aftermathTriggered){
  e.preventDefault();e.stopImmediatePropagation();openStoryThread('adnan');
 }
},true);

function showUnknownCall(resumeSameAttempt=false){
 if(unknownStage==='answered'||unknownStage==='finished')return;
 // Resume an interrupted ringing call without duplicating it in Recents.
 if(!resumeSameAttempt){
  if(unknownAttempt===0)window.nakulaNarrativeClock.set(23,57);
  else window.nakulaNarrativeClock.advance(1);
  unknownAttempt++;
 }
 callConnectedAt=0;
 unknownStage='ringing';
 callScreen.hidden=false;
 callScreen.classList.remove('is-connected','is-angry');
 callCaption.classList.remove('is-visible');
 callStatus.textContent='incoming call…';
 callCaption.textContent='';
 callScreen.querySelector('.nakula-call-actions').hidden=false;
 callScreen.querySelector('.nakula-call-hangup').hidden=true;
 ringPulse();
 callRingTimer=setInterval(ringPulse,2700);
 saveStoryState(resumeSameAttempt?'resumed-ringing':'incoming-call');
}
function queueUnknownCall(){
 if(unknownQueued)return;
 unknownQueued=true;
 saveStoryState('call-queued');
 callRetryTimer=setTimeout(showUnknownCall,1450);
}
function closeUnknownCall(){
 window.nakulaNarrativeClock.advance(2); // Connected conversation advances two story minutes.
 recordUnknownCall('Answered');
 clearUnknownTimers();
 callScreen.hidden=true;
 callScreen.classList.remove('is-connected','is-angry');
 callCaption.classList.remove('is-visible');
 unknownStage='finished';
 saveStoryState('call-completed');
 // Both endings of the call generate evidence; only the content depends on the branch.
 setTimeout(finishUnknownIncident,2300);
}
function retryUnknownAfterHangup(){
 // Hanging up while connected makes this same caller redial with an angrier script.
 window.nakulaNarrativeClock.advance(1);
 recordUnknownCall('Answered');
 clearUnknownTimers();
 unknownInterrupted=true;
 callScreen.hidden=true;
 callScreen.classList.remove('is-connected','is-angry');
 callCaption.classList.remove('is-visible');
 unknownStage='retrying';
 saveStoryState('angry-redial');
 callRetryTimer=setTimeout(showUnknownCall,3200);
}
function nextUnknownSubtitle(){
 if(unknownStage!=='answered')return;
 const lines=unknownInterrupted?unknownAngryLines:unknownLines;
 if(callLineIndex>=lines.length){callSubtitleTimer=setTimeout(closeUnknownCall,1200);return}
 callCaption.classList.remove('is-visible');
 callSubtitleTimer=setTimeout(()=>{
  if(unknownStage!=='answered')return;
  callCaption.textContent=lines[callLineIndex++];
  callCaption.classList.add('is-visible');
  callSubtitleTimer=setTimeout(nextUnknownSubtitle,unknownInterrupted?2800:(callLineIndex===1?3700:3400));
 },210);
}
callScreen.addEventListener('click',e=>{
 const button=e.target.closest('[data-nakula-call]');
 if(!button)return;
 const action=button.dataset.nakulaCall;
 if(['queued','ringing','answered'].includes(day2MentariCallStage)){
  handleDay2MentariCallButton(action);return;
 }
 if(action==='decline'&&unknownStage==='ringing'){
  // Refusing five times unlocks an OPTIONAL noncanon ending; answering remains possible.
  recordUnknownCall('Declined');
  clearUnknownTimers();
  callScreen.hidden=true;
  unknownStage='retrying';
  if(unknownCallHistory.filter(x=>x.kind==='Declined').length>=5){
   storyAwaitingSilenceChoice=true;
   saveStoryState('fifth-decline-decision');
   showSilenceDecision();
  }else{
   saveStoryState('declined-call');
   callRetryTimer=setTimeout(showUnknownCall,2000);
  }
 }else if(action==='accept'&&unknownStage==='ringing'){
  clearUnknownTimers();
  unknownStage='answered';
  callConnectedAt=Date.now();
  callLineIndex=0;
  callScreen.classList.add('is-connected');
  callScreen.classList.toggle('is-angry',unknownInterrupted);
  callStatus.textContent='00:00 · connected';
  callScreen.querySelector('.nakula-call-actions').hidden=true;
  callScreen.querySelector('.nakula-call-hangup').hidden=false;
  saveStoryState('call-answered');
  callSubtitleTimer=setTimeout(nextUnknownSubtitle,750);
 }else if(action==='hangup'&&unknownStage==='answered')retryUnknownAfterHangup();
});



/* CHAPTER 02.5 — SOMEONE YOU REMEMBER.
   The first Unknown caller is complete before this second encounter.
   Existing call UI and the existing Mentari gallery photo are reused. */
let day2MentariCallStage='none',day2MentariCallDueAt=0,day2MentariCallTimer=null;
let day2MentariLineIndex=0,day2MentariCallOutcome=null;
let day2MentariPhotoDelivered=false,day2MentariPhotoDueAt=0,day2MentariPhotoTimer=null;
let day2MentariPhotoOpened=false,day2MentariEvidenceSaved=false;
const MENTARI_PHOTO_SRC='./gallery/portrait.jpg';
const DAY2_MENTARI_LINES=[
 'UNKNOWN: Selamat pagi, Pak Nakula. Rupanya peringatan saya semalam belum cukup.',
 'NAKULA: Kalau Anda ingin membicarakan Zona B, silakan melalui kuasa hukum perusahaan Anda.',
 'UNKNOWN: Anda selalu bicara soal hukum. Bukti. Prosedur. Seolah semuanya bisa diselesaikan dengan begitu.',
 'NAKULA: Silakan langsung pada intinya.',
 'UNKNOWN: Apa Anda memang selalu sesulit ini ketika diminta melepaskan sesuatu?',
 'UNKNOWN: Bahkan setelah bertahun-tahun?',
 'NAKULA: Get to the point.',
 'UNKNOWN: Mentari.',
 'UNKNOWN: Masih menyimpan fotonya, ya?',
 'NAKULA: Apa yang Anda mau?',
 'UNKNOWN: Check your messages, Pak Nakula.'
];
function queueDay2MentariCall(){
 if(!day2FamilyPriority||day2MentariCallStage!=='none'||currentStoryEnding)return;
 day2MentariCallStage='queued';
 day2MentariCallDueAt=Date.now()+6500;
 saveStoryState('CP02-05-call-queued');
 scheduleDay2MentariCall();
}
function scheduleDay2MentariCall(){
 if(!['queued','ringing'].includes(day2MentariCallStage)||day2MentariCallTimer
  ||currentStoryEnding||state.screen==='lock')return;
 const delay=day2MentariCallStage==='ringing'
  ?650:Math.max(200,(day2MentariCallDueAt||Date.now()+650)-Date.now());
 day2MentariCallTimer=setTimeout(()=>{
  day2MentariCallTimer=null;
  if(state.screen==='lock')return;
  if(!['queued','ringing'].includes(day2MentariCallStage))return;
  if(day2FamilyTaskModal&&!day2FamilyTaskModal.hidden){day2MentariCallTimer=setTimeout(()=>{day2MentariCallTimer=null;scheduleDay2MentariCall()},600);return}
  showDay2MentariCall();
 },delay);
}
function showDay2MentariCall(){
 if(!['queued','ringing'].includes(day2MentariCallStage)||state.screen==='lock')return;
 hideNotif();
 day2MentariCallStage='ringing';
 callConnectedAt=0;
 callLineIndex=0;
 window.nakulaNarrativeClock.set(10,24,1);
 callScreen.hidden=false;
 callScreen.classList.remove('is-connected','is-angry');
 callCaption.classList.remove('is-visible');
 callCaption.textContent='';
 callStatus.textContent='incoming call…';
 callScreen.querySelector('.nakula-call-actions').hidden=false;
 callScreen.querySelector('.nakula-call-hangup').hidden=true;
 ringPulse();
 clearInterval(callRingTimer);
 callRingTimer=setInterval(ringPulse,2700);
 saveStoryState('CP02-05-ringing');
}
function scheduleDay2MentariPhoto(){
 if(day2MentariPhotoDelivered||day2MentariPhotoTimer||!day2MentariCallOutcome)return;
 const remaining=Math.max(200,(day2MentariPhotoDueAt||Date.now()+2200)-Date.now());
 day2MentariPhotoTimer=setTimeout(()=>{
  day2MentariPhotoTimer=null;
  deliverDay2MentariPhoto();
 },remaining);
}
function finishDay2MentariCall(outcome){
 if(!['ringing','answered'].includes(day2MentariCallStage)||day2MentariCallOutcome)return;
 const answered=day2MentariCallStage==='answered';
 day2MentariCallOutcome=outcome;
 recordUnknownCall(answered?'Answered':'Declined');
 clearUnknownTimers();
 callScreen.hidden=true;
 callScreen.classList.remove('is-connected','is-angry');
 callCaption.textContent='';
 callCaption.classList.remove('is-visible');
 day2MentariCallStage='done';
 window.nakulaNarrativeClock.set(10,28,1);
 day2MentariPhotoDueAt=Date.now()+(outcome==='declined'?3000:1700);
 saveStoryState('CP02-05-call-'+outcome);
 scheduleDay2MentariPhoto();
}
function nextDay2MentariSubtitle(){
 if(day2MentariCallStage!=='answered')return;
 if(day2MentariLineIndex>=DAY2_MENTARI_LINES.length){
  callSubtitleTimer=setTimeout(()=>finishDay2MentariCall('answered'),1150);
  return;
 }
 callCaption.classList.remove('is-visible');
 callSubtitleTimer=setTimeout(()=>{
  if(day2MentariCallStage!=='answered')return;
  const index=day2MentariLineIndex++;
  callCaption.textContent=DAY2_MENTARI_LINES[index];
  callCaption.classList.add('is-visible');
  // A longer beat before the name Mentari is spoken.
  callSubtitleTimer=setTimeout(nextDay2MentariSubtitle,index===7?2900:2500);
 },210);
}
function handleDay2MentariCallButton(action){
 if(action==='decline'&&day2MentariCallStage==='ringing'){
  finishDay2MentariCall('declined');
 }else if(action==='accept'&&day2MentariCallStage==='ringing'){
  clearUnknownTimers();
  day2MentariCallStage='answered';
  callConnectedAt=Date.now();
  day2MentariLineIndex=0;
  callScreen.classList.add('is-connected');
  callScreen.classList.remove('is-angry');
  callStatus.textContent='00:00 · connected';
  callScreen.querySelector('.nakula-call-actions').hidden=true;
  callScreen.querySelector('.nakula-call-hangup').hidden=false;
  saveStoryState('CP02-05-answered');
  callSubtitleTimer=setTimeout(nextDay2MentariSubtitle,850);
 }else if(action==='hangup'&&day2MentariCallStage==='answered'){
  finishDay2MentariCall('ended-early');
 }
}
function deliverDay2MentariPhoto(){
 if(day2MentariPhotoDelivered||!day2MentariCallOutcome)return;
 const t=threadById('unknown');
 if(!t)return;
 if(!t.messages.some(m=>m.day2MentariPhoto)){
  t.messages.push({me:false,time:'10.28',dayOffset:1,day2MentariPhoto:true,
   text:day2MentariCallOutcome==='declined'
    ?'Masih menyimpannya, ya?'
    :'Some people are harder to let go of, aren’t they, Mr. Bumi?'});
 }
 t.date='10.28';
 day2MentariPhotoDelivered=true;
 unknownUnread=true;
 const i=threads.findIndex(t=>t.id==='unknown');
 if(i>0)threads.unshift(...threads.splice(i,1));
 saveStoryState('CP02-05-mentari-photo');
 syncHarleyBadge();
 if(state.screen==='app'&&state.app==='messages'&&state.view!=='convo')render();
 if(state.screen!=='lock'){
  setNotification('unknown');notif.classList.add('show');sound();
 }
}
function openDay2MentariPhoto(){
 if(!day2MentariPhotoDelivered)return;
 day2MentariPhotoOpened=true;
 saveStoryState('CP02-05-mentari-photo-opened');
 const index=photoItems.findIndex(p=>p.src===MENTARI_PHOTO_SRC);
 if(index<0)return;
 openApp('photos');
 state.view='photo';state.photo=index;
 render();
}
function preserveDay2MentariEvidence(){
 if(!day2MentariPhotoDelivered||day2MentariEvidenceSaved)return;
 day2MentariEvidenceSaved=true;
 const incident=notes.find(n=>Number(n.id)===9901);
 if(incident&&!incident.body.includes('FOTO DARI PENELEPON · 26 OKTOBER')){
  incident.body+='\n\nFOTO DARI PENELEPON · 26 OKTOBER\nPukul 10.28, nomor anonim mengirim foto pribadi setelah panggilan. Foto dan isi pesan disimpan sebagai bagian dari kronologi. Sumber foto, identitas pengirim, serta kaitannya dengan PBK belum dapat dipastikan.';
 }
 saveStoryState('CP02-05-photo-preserved');
 render();
}

/* FASE A.2: one local story slot. This stores storyline data separately from
   the user's ordinary Notes, Photos and appearance. Browser time never drives
   the in-story timestamps. The Lock Screen's Continue/New Game UI is A.3. */
const STORY_SLOT_KEY='story-save-v1';
const STORY_SLOT_VERSION=1;
const STORY_ENDINGS_KEY='story-endings-v1';
let currentStoryEnding=null,storyAwaitingSilenceChoice=false;
let storySaveReady=false,storyNeedsCallResume=false,storyResumeSameCall=false;
let storyCallResumeScheduled=false,storyHarleyResumeScheduled=false;
/* Day 2 persists in the existing story slot, so refreshing during the
   transition/alarm never skips the required Stop interaction. */
let day2Stage='none',day2TransitionRunning=false,day2TransitionTimer=null,day2TransitionDueAt=0;
// Leave a deliberate story beat after the last Chapter 01 message.
const DAY2_TRANSITION_PAUSE_MS=7000;
let day2BriefPrepared=false,day2BriefChoice=null,day2NirmalaDelivered=false,day2BriefKickoffScheduled=false,day2NirmalaNotifyTimer=null;
const DAY2_MORNING_MINUTES=1440+7*60+12;
const DAY2_ADNAN_MESSAGE={
 angry:'Pagi, Na. Saya sudah baca laporanmu semalam. Saya lihat ada panggilan kedua setelah sambungan kamu putus. Nomor dan waktunya sama? Simpan semua riwayatnya. Kita bahas bersama Nirmala pagi ini.',
 normal:'Pagi, Na. Saya sudah baca laporanmu semalam. Selain PBK dan Zona B, apakah penelepon menyebut nama atau istilah lain? Simpan riwayat panggilannya. Kita bahas bersama Nirmala pagi ini.'
};
/* Keep only one opening message at 07.12. Older saves contained an
   additional 07.14 “Pagi, Na” from the route-specific briefing. This
   migration removes that one redundant bubble and script step while
   preserving cursors, decisions, later dialogue and autoplay. */
function day2MorningIntroText(){
 return unknownInterrupted?DAY2_ADNAN_MESSAGE.angry:DAY2_ADNAN_MESSAGE.normal;
}
function reconcileDay2MorningIntro(){
 const adnan=threadById('adnan');
 if(!adnan)return;
 const opening=adnan.messages.find(m=>m.day2Morning===true);
 if(!opening)return;
 opening.text=day2MorningIntroText();
 const redundant=m=>m?.day2Brief===true&&m.time==='07.14'
  &&typeof m.text==='string'&&m.text.startsWith('Pagi, Na.');
 let removedBeforeCursor=0;
 for(let i=adnanTimeline.length-1;i>=0;i--){
  if(!redundant(adnanTimeline[i]))continue;
  if(i<adnanCursor)removedBeforeCursor++;
  adnanTimeline.splice(i,1);
 }
 adnanCursor=Math.max(0,adnanCursor-removedBeforeCursor);
 if(adnan.messages.some(redundant)){
  adnan.messages=adnan.messages.filter(m=>!redundant(m));
 }
}
/* CHAPTER 02.1 — THE MORNING BRIEF
   Optional incident-call path has lasting dialogue consequences, but neither
   path locks the ending. A second choice records which concern Nakula raises.
   All timeline entries live in the existing story save slot. */
const DAY2_BRIEF_REPLY_OPTIONS=Object.freeze({
 evidence:'Saya prioritaskan verifikasi nomor revisi dan metadata bersama Nirmala, Pak. Kalau ada ketidaksesuaian, saya tandai sebelum briefing.',
 safety:'Saya koordinasi berkas dengan Nirmala, Pak. Untuk ancaman semalam, apakah kronologinya perlu saya pisahkan untuk evaluasi tim?'
});
const DAY2_NIRMALA_TEASER='Selamat pagi, Mas Nakula. Maaf mengganggu. Saya dan tim IT forensik menemukan sesuatu terkait dokumen persetujuan AMDAL PBK Group. Ada salinan yang perlu Mas periksa.';

/* CHAPTER 02.2 — NIRMALA / THE PAPER TRAIL. Times follow the 07.25
   notification, never the obsolete 06.xx timestamps in the reference chat. */
const nirmalaTimeline=[
 {me:true,time:'07.26',text:'Pagi, Nirmala. Go ahead. Dari mana asal salinan dokumennya?'},
 {me:false,time:'07.27',text:'Server utama divisi operasional PBK memang tertutup. Kami tidak mengakses server internal mereka. Tapi vendor logistik di Kalimantan pernah meneruskan PDF persetujuan AMDAL ke pihak asuransi alat berat untuk klaim kerusakan.'},
 {me:false,time:'07.27',text:'Pihak asuransi memberikan salinan email beserta lampiran aslinya untuk ditelaah. Tim forensik menyimpan salinan dan mencatat sumbernya.'},
 {me:true,time:'07.28',text:'Good. Kita perlu pastikan keaslian berkas dan chain of custody. Ada hasil pemeriksaan tanda tangan digitalnya?'},
 {me:false,time:'07.29',text:'Ada, Mas. Timestamp yang terbaca di salinan itu Selasa, 20 Oktober pukul 02.00. Dua hari setelah insiden longsor tanggal 18. Tapi tanggal persetujuan di halaman dokumen tercantum 15 Oktober.'},
 {me:false,time:'07.30',text:'Saya sudah masukkan salinan persetujuan, email vendor ke asuransi, dan laporan pemeriksaan metadata ke Files → PBK Group. Tolong cek dua berkas utama itu, Mas.',unlockFiles:true},
 {me:true,time:'07.33',text:'Saya sudah cocokkan tanggal dalam dokumen dengan laporan metadata. Ada ketidaksesuaian yang harus kita verifikasi lebih lanjut.',requiresFilesReview:true},
 {me:false,time:'07.34',text:'Betul, Mas. Salinan ini mengindikasikan perubahan atau penandatanganan setelah insiden. Tapi tim forensik belum menyimpulkan siapa yang mengubahnya.'},
 {me:true,time:'07.35',text:'Excellent work, Nirmala. Apakah tim HHP atau pihak internal PBK tahu salinan ini pernah dikirim ke asuransi?'},
 {me:false,time:'07.36',text:'Sejauh yang dapat kami pastikan, belum ada bukti mereka mengetahui keberadaan salinan di pihak ketiga. Pak Damar tampaknya fokus pada akses ke server internal.'},
 {me:false,time:'07.37',text:'Temuan ini perlu saya masukkan ke draf permohonan dokumen sekarang, Mas?'},
 {me:true,time:'07.38',text:'Not yet. Amankan salinan asli, email sumber, dan catatan pemeriksaannya. Jangan menuduh ada pemalsuan sebelum verifikasi ahli selesai.'},
 {me:true,time:'07.38',text:'Cetak salinan dan laporan metadata dalam map merah. Letakkan di meja saya sebelum pukul 08.00. Saya mau Pak Adnan melihatnya sebelum briefing pukul sembilan.'},
 {me:false,time:'07.39',text:'Copy that, Mas. The red folder will be ready.'}
].map(m=>({...m,dayOffset:1,day2NirmalaScript:true}));
let nirmalaCursor=0,nirmalaAutoplayStarted=false,nirmalaNextTimer=null,nirmalaAutoSendTimer=null;
let day2FilesReceived=false,day2FilesInspected={approval:false,metadata:false};
let day2InvestigationChoice=null,day2RedFolderDelivered=false,day2RedFolderTimer=null;
const day2FilesInspectedCore=()=>!!(day2FilesInspected.approval&&day2FilesInspected.metadata);
const day2FilesReviewed=()=>day2FilesInspectedCore()&&!!day2InvestigationChoice;
function applyDay2InvestigationChoice(choice){
 if(!['verify','source'].includes(choice))return false;
 const outgoing=nirmalaTimeline.find(m=>m.requiresFilesReview);
 const incoming=nirmalaTimeline.find(m=>m.time==='07.34');
 if(outgoing)outgoing.text=choice==='verify'
  ?'Saya sudah cocokkan tanggalnya. Prioritaskan validasi sertifikat dan tanda tangan digital, Nirmala. Jangan menuduh ada pemalsuan sebelum ada laporan ahli.'
  :'Saya sudah cocokkan tanggalnya. Prioritaskan asal salinan dari pihak asuransi dan riwayat email vendor. Kita harus menjaga rantai penguasaan dokumen.';
 if(incoming)incoming.text=choice==='verify'
  ?'Siap, Mas. Tim forensik akan memeriksa validitas sertifikat, timestamp, dan tanda tangan secara independen. Kejanggalan ini belum cukup untuk menetapkan pelakunya.'
  :'Siap, Mas. Kami akan meminta konfirmasi email asli, riwayat lampiran, dan catatan penerimaan asuransi. Salinan sumber tetap kami amankan tanpa perubahan.';
 return true;
}
function selectDay2Investigation(choice){
 if(day2InvestigationChoice||!day2FilesReceived||!day2FilesInspectedCore()||!applyDay2InvestigationChoice(choice))return;
 day2InvestigationChoice=choice;
 saveStoryState('CP02-investigation-choice');
 if(nirmalaCursor>=nirmalaTimeline.length)scheduleDay2RedFolder();
 render();
}
function deliverDay2RedFolder(){
 if(day2RedFolderDelivered||nirmalaCursor<nirmalaTimeline.length||!day2FilesReviewed())return;
 const adnan=threadById('adnan');
 if(!adnan)return;
 const text='Na, Nirmala sudah menyiapkan map merah. Bawa salinan email sumber dan hasil pemeriksaan ke ruangan saya pukul 09.00. I want to see what we can actually prove.';
 if(!adnan.messages.some(m=>m.day2RedFolder)){
  adnan.messages.push({me:false,time:'08.00',dayOffset:1,day2RedFolder:true,text});
  adnan.date='08.00';
 }
 day2RedFolderDelivered=true;
 adnanUnread=true;
 const idx=threads.findIndex(t=>t.id==='adnan');
 if(idx>0)threads.unshift(...threads.splice(idx,1));
 window.nakulaNarrativeClock.set(8,0,1);
 saveStoryState('CP02-red-folder-ready');
 syncHarleyBadge();
 if(state.screen==='app'&&state.app==='messages'&&state.view!=='convo')render();
 if(state.screen==='home'||state.screen==='app'){
  setNotification('adnan');notif.classList.add('show');sound();
 }
}
function scheduleDay2RedFolder(){
 if(day2RedFolderDelivered||day2RedFolderTimer||nirmalaCursor<nirmalaTimeline.length||!day2FilesReviewed())return;
 day2RedFolderTimer=setTimeout(()=>{day2RedFolderTimer=null;deliverDay2RedFolder()},1500);
}


/* CHAPTER 02.3 & 02.4 — BEHIND THE RED FOLDER / THE FAMILIES
   Runs inside the existing iPhone Calendar, Files and Messages apps.
   Separate saved checkpoints prevent repeats after page refresh. */
let day2CaseBriefRead=false,day2BriefingDone=false,day2CalendarBriefOpen=false;
let day2FamiliesReceived=false,day2FamilyDocsRead={statements:false,client:false};
let day2FamilyPriority=null,day2FamilyFollowup=false;
let day2FamilyTaskDismissed=false,day2FamilyTaskModal=null,day2FamilyTaskTimer=null;
function day2FamilyTaskAvailable(){
 return day2FamiliesReceived&&day2FamilyDocsReady()&&!day2FamilyPriority;
}
function ensureDay2FamilyTaskModal(){
 if(day2FamilyTaskModal)return day2FamilyTaskModal;
 const modal=document.createElement('div');
 modal.className='nakula-family-task-overlay';
 modal.hidden=true;
 modal.setAttribute('role','dialog');
 modal.setAttribute('aria-modal','true');
 modal.setAttribute('aria-labelledby','nakula-family-task-heading');
 modal.setAttribute('aria-describedby','nakula-family-task-description');
 modal.innerHTML=
  '<div class="nakula-family-task-backdrop" data-nakula-family-task-later aria-hidden="true"></div>'+
  '<div class="nakula-family-task-dialog">'+
   '<div class="nakula-family-task-app-icon" aria-hidden="true"><span>✓</span></div>'+
   '<div class="nakula-family-task-overline">TUGAS BARU · ZONA B</div>'+
   '<h2 id="nakula-family-task-heading">Pilih Langkah Berikutnya</h2>'+
   '<p id="nakula-family-task-description">Kedua dokumen keluarga telah diperiksa. Apa yang perlu Nakula prioritaskan?</p>'+
   '<div class="nakula-family-task-options">'+
    '<button type="button" data-nakula-family-task-choice="consult"><span class="nakula-family-task-option-icon">01</span><span><strong>Konsultasi dengan Keluarga</strong><small>Dengarkan kebutuhan mereka, jelaskan pilihan hukum, dan minta persetujuan</small></span><span class="nakula-family-task-chevron">›</span></button>'+
    '<button type="button" data-nakula-family-task-choice="corroborate"><span class="nakula-family-task-option-icon">02</span><span><strong>Verifikasi Keterangan Saksi</strong><small>Periksa waktu dan lokasi dengan tetap menghormati persetujuan keluarga</small></span><span class="nakula-family-task-chevron">›</span></button>'+
   '</div>'+
   '<button type="button" class="nakula-family-task-later" data-nakula-family-task-later>Nanti</button>'+
  '</div>';
 $au('phone').appendChild(modal);
 day2FamilyTaskModal=modal;
 return modal;
}
function hideDay2FamilyTask(){
 if(day2FamilyTaskTimer){clearTimeout(day2FamilyTaskTimer);day2FamilyTaskTimer=null}
 if(day2FamilyTaskModal)day2FamilyTaskModal.hidden=true;
}
function openDay2FamilyTask(){
 if(!day2FamilyTaskAvailable()||state.screen!=='app')return;
 if(day2FamilyTaskTimer){clearTimeout(day2FamilyTaskTimer);day2FamilyTaskTimer=null}
 const modal=ensureDay2FamilyTaskModal();
 modal.hidden=false;
 modal.querySelector('[data-nakula-family-task-choice]')?.focus();
}
function deferDay2FamilyTask(){
 if(!day2FamilyTaskAvailable())return;
 hideDay2FamilyTask();
 day2FamilyTaskDismissed=true;
 saveStoryState('CP02-04-task-deferred');
}
function scheduleDay2FamilyTask(){
 if(!day2FamilyTaskAvailable()||day2FamilyTaskDismissed||day2FamilyTaskTimer
  ||state.screen!=='app'||state.app!=='files'||nakulaFilesPath==='document'
  ||(day2FamilyTaskModal&&!day2FamilyTaskModal.hidden))return;
 day2FamilyTaskTimer=setTimeout(()=>{
  day2FamilyTaskTimer=null;
  if(state.screen==='app'&&state.app==='files'&&nakulaFilesPath!=='document'&&!day2FamilyTaskDismissed)
   openDay2FamilyTask();
 },430);
}
function day2CaseBriefAvailable(){return day2RedFolderDelivered||day2BriefingDone}
function day2FamilyDocsReady(){return day2FamilyDocsRead.statements&&day2FamilyDocsRead.client}
function day2CaseBriefSummary(){
 return day2InvestigationChoice==='source'
  ?'Prioritas: konfirmasi keaslian email vendor, riwayat penerimaan pihak asuransi, dan rantai penguasaan lampiran. Tanggal digital tetap harus diperiksa ahli.'
  :'Prioritas: uji sertifikat dan timestamp tanda tangan elektronik melalui ahli independen. Jejak vendor-asuransi tetap harus diamankan.';
}
function deliverDay2Families(){
 if(day2FamiliesReceived||!day2BriefingDone)return;
 const n=threadById('nirmala');
 if(!n)return;
 if(!n.messages.some(m=>m.day2FamilyPacket)){
  n.messages.push({
   me:false,time:'09.30',dayOffset:1,day2FamilyPacket:true,
   text:'Mas, saya sudah kumpulkan keterangan awal dari Rania dan Harun terkait keluarga terdampak Zona B. Ada kebutuhan mendesak yang perlu kita dengarkan, selain soal dokumen AMDAL. Saya tempatkan catatan mereka di Files → PBK Group. Mohon cek sebelum kita menentukan langkah berikutnya.'
  });
  n.date='09.30';
 }
 day2FamiliesReceived=true;nirmalaUnread=true;
 const i=threads.findIndex(t=>t.id==='nirmala');
 if(i>0)threads.unshift(...threads.splice(i,1));
 window.nakulaNarrativeClock.set(9,30,1);
 saveStoryState('CP02-04-families-received');
 syncHarleyBadge();
 if(state.screen==='app'&&state.app==='messages'&&state.view!=='convo')render();
 if(state.screen==='app'||state.screen==='home'){
  setNotification('nirmala');notif.classList.add('show');sound();
 }
}
function finishDay2CalendarBriefing(){
 if(!day2CaseBriefAvailable()||!day2CaseBriefRead||day2BriefingDone)return;
 day2BriefingDone=true;day2CalendarBriefOpen=false;
 const a=threadById('adnan');
 if(a&&!a.messages.some(m=>m.day2BriefingOutcome)){
  a.messages.push({
   me:false,time:'09.18',dayOffset:1,day2BriefingOutcome:true,
   text:day2InvestigationChoice==='source'
    ?'Good work, Na. Rantai dokumen vendor dan asuransi perlu diverifikasi sebelum kita menjadikannya dasar argumentasi. Jangan abaikan validitas timestamp. Sekarang dengarkan keterangan keluarga korban.'
    :'Good work, Na. Timestamp itu petunjuk, bukan putusan. Minta laporan ahli dan amankan salinan sumber. Setelah ini, kita perlu mendengarkan keluarga korban.'
  });
  a.date='09.18';
 }
 saveStoryState('CP02-03-briefing-complete');
 deliverDay2Families();
 render();
}
function chooseDay2FamilyPriority(choice){
 if(!day2FamiliesReceived||!day2FamilyDocsReady()||day2FamilyPriority||!['consult','corroborate'].includes(choice))return;
 hideDay2FamilyTask();
 day2FamilyTaskDismissed=true;
 day2FamilyPriority=choice;
 const n=threadById('nirmala');
 if(n&&!n.messages.some(m=>m.day2FamilyFollowup)){
  const text=choice==='consult'
   ?'Siap, Mas. Saya akan menghubungi Rania dan Harun terlebih dahulu untuk meminta persetujuan dan menentukan waktu yang nyaman. Kebutuhan keluarga kita catat terpisah dari strategi perkara.'
   :'Siap, Mas. Saya akan memeriksa kecocokan waktu dan lokasi kesaksian Rania serta Harun dengan catatan lapangan, setelah memperoleh persetujuan mereka. Kebutuhan mendesak keluarga tetap kita tindak lanjuti.';
  n.messages.push({me:false,time:'10.20',dayOffset:1,day2FamilyFollowup:true,text});
  n.date='10.20';
 }
 day2FamilyFollowup=true;nirmalaUnread=true;
 queueDay2MentariCall();
 const i=threads.findIndex(t=>t.id==='nirmala');
 if(i>0)threads.unshift(...threads.splice(i,1));
 window.nakulaNarrativeClock.set(10,20,1);
 saveStoryState('CP02-04-family-decision');
 syncHarleyBadge();
 if(state.screen==='app'||state.screen==='home'){
  setNotification('nirmala');notif.classList.add('show');sound();
 }
 render();
}
function renderDay2Calendar(){
 if(state.screen!=='app'||state.app!=='calendar'||!day2CaseBriefAvailable())return;
 const content=$au('app-content');
 if(!content)return;
 // The existing Calendar shell and clock are still rendered by index.html.
 const section=document.createElement('section');
 section.className='nakula-case-calendar';
 const unlocked=day2CaseBriefAvailable();
 const summary=day2CaseBriefSummary();
 const isToday=day2Stage!=='none';
 section.innerHTML=
  '<div class="nakula-case-kicker">MONDAY, 26 OCTOBER 2026 · STORY CALENDAR</div>'+
  '<div class="nakula-calendar-event"><div class="nakula-calendar-event-time">09.00<span>09.30</span></div>'+
   '<div class="nakula-calendar-event-body"><strong>PBK Group · Internal Case Briefing</strong><small>Managing Partner’s Office · Adnan W., Nakula, Nirmala</small>'+
   '<p>'+esc(unlocked?'Map merah disiapkan. Periksa case brief untuk membawa fakta yang dapat diverifikasi.':'Scheduled case review · Zona B')+'</p>'+
   (unlocked&&!day2CaseBriefRead?'<button type="button" data-nakula-calendar-case-file>Open Case Brief in Files</button>':
    unlocked&&!day2BriefingDone?'<button type="button" data-nakula-calendar-briefing>Start 09.00 Briefing</button>':
    day2BriefingDone?'<span class="nakula-calendar-complete">✓ Briefing completed</span>':'')+
   '</div></div>'+
  (day2CalendarBriefOpen&&!day2BriefingDone?
   '<div class="nakula-calendar-meeting"><small>09.00 · PRIVATE CASE BRIEFING</small><h3>Behind the Red Folder</h3>'+
   '<p><b>Adnan:</b> “Walk me through what we know, Na. Not what we suspect.”</p>'+
   '<p><b>Nakula:</b> “Tanggal yang tercetak dan waktu tanda tangan digital tidak sama. Dokumennya berasal dari lampiran vendor yang diterima asuransi.”</p>'+
   '<p><b>Adnan:</b> “And what can we prove today?”</p>'+
   '<p><b>Nakula:</b> “'+esc(summary)+'”</p>'+
   '<p><b>Adnan:</b> “Good. Jaga sumber bukti dan jangan menjanjikan hasil kepada klien. Sebelum kita memutuskan langkah hukum, dengarkan kebutuhan keluarga korban.”</p>'+
   '<button type="button" data-nakula-calendar-finish>Finish Briefing · 09.18</button></div>':'')+
  (day2BriefingDone?'<div class="nakula-calendar-event family"><div class="nakula-calendar-event-time">09.30<span>10.30</span></div>'+
   '<div class="nakula-calendar-event-body"><strong>Zona B · Families & Witness Notes</strong><small>Client communication · Nirmala / Files</small>'+
   '<p>Keterangan Rania dan Harun tersedia untuk ditelaah, dengan privasi dan persetujuan klien tetap dijaga.</p>'+
   '<button type="button" data-nakula-calendar-families>Review Family Records in Files</button>'+
   (day2FamilyTaskAvailable()?'<button type="button" class="nakula-calendar-task-open" data-nakula-family-task-open>TUGAS BARU · Pilih Tindak Lanjut</button>':'')+
   (day2FamilyPriority?'<span class="nakula-calendar-complete">✓ Family follow-up recorded</span>':'')+'</div></div>':'')+
  (!isToday?'<p class="nakula-case-muted">This schedule unlocks during Chapter 02.</p>':'');
 content.appendChild(section);
}

function day2BriefMessage(me,time,text,extra={}){
 return {me,time,text,dayOffset:1,day2Brief:true,...extra};
}
function prepareDay2MorningBrief(){
 if(day2BriefPrepared||day2Stage!=='complete'||!threadById('adnan')?.messages.some(m=>m.day2Morning))return;
 const angry=unknownInterrupted;
 const tailored=angry?[
  day2BriefMessage(true,'07.15','Nomornya sama, Pak. Panggilan kedua lebih agresif. Saya simpan kedua log beserta kronologinya.'),
  day2BriefMessage(false,'07.16','Baik. Jangan hapus atau ubah catatan waktunya. Kalau ada panggilan baru, laporkan dulu kepada saya.')
 ]:[
  day2BriefMessage(true,'07.15','Tidak ada nama baru, Pak. Tapi dia tahu perkara yang sedang kita tangani. Saya catat kata-katanya tanpa menebak identitasnya.'),
  day2BriefMessage(false,'07.16','Good. That is the right approach. Kita bekerja dari fakta, bukan dari orang yang paling keras mengancam.')
 ];
 const common=[
  day2BriefMessage(false,'07.17','Now, about Zona B. Saya ingin indeks adendum PBK dicocokkan dengan salinan Jumat. Jangan menyimpulkan ada manipulasi sebelum kita periksa dokumen primer.'),
  day2BriefMessage(true,'07.18','', {choiceId:'day2-brief',choicePending:true}),
  day2BriefMessage(false,'07.19','', {choiceResponse:'day2-brief'}),
  day2BriefMessage(true,'07.20','Understood. Saya hubungi Nirmala sekarang, Pak.'),
  day2BriefMessage(false,'07.21','And please tell me you already had breakfast. Nirmala has been reporting on your coffee habits.'),
  day2BriefMessage(true,'07.22','Sudah, Pak. Actual food, not just coffee.'),
  day2BriefMessage(false,'07.23','Good. See you at nine. Bring the discrepancies, not assumptions.')
 ];
 adnanTimeline.push(...tailored,...common);
 reconcileDay2MorningIntro();
 day2BriefPrepared=true;
 saveStoryState('CP02-morning-brief-ready');
}
function syncDay2BriefClock(message){
 if(!message?.day2Brief&&!message?.day2NirmalaScript)return;
 const hhmm=String(message.time||'').split('.');
 if(hhmm.length===2)window.nakulaNarrativeClock.set(Number(hhmm[0]),Number(hhmm[1]),1);
}
function deliverDay2NirmalaTeaser(){
 if(day2NirmalaDelivered||!day2BriefPrepared||adnanCursor<adnanTimeline.length)return;
 const thread=threadById('nirmala');
 if(!thread)return;
 if(!thread.messages.some(m=>m.day2Nirmala)){
  thread.messages.push({me:false,time:'07.25',text:DAY2_NIRMALA_TEASER,dayOffset:1,day2Nirmala:true});
  thread.date='07.25';
 }
 day2NirmalaDelivered=true;
 nirmalaUnread=true;
 const idx=threads.findIndex(t=>t.id==='nirmala');
 if(idx>0)threads.unshift(...threads.splice(idx,1));
 window.nakulaNarrativeClock.set(7,25,1);
 saveStoryState('CP02-A-morning-brief');
 syncHarleyBadge();
 if(state.screen==='app'&&state.app==='messages'&&state.view!=='convo')render();
 if(state.screen==='home'||state.screen==='app'){
  setNotification('nirmala');notif.classList.add('show');sound();
 }
}
function finishDay2MorningBrief(){
 if(!day2BriefPrepared||adnanCursor<adnanTimeline.length||day2NirmalaDelivered||day2NirmalaNotifyTimer)return;
 day2NirmalaNotifyTimer=setTimeout(()=>{
  day2NirmalaNotifyTimer=null;
  deliverDay2NirmalaTeaser();
 },1250);
}
function queueDay2BriefIncoming(){
 if(!day2BriefPrepared||day2Stage!=='complete'||day2NirmalaDelivered)return;
 if(adnanCursor>=adnanTimeline.length){finishDay2MorningBrief();return}
 const next=adnanTimeline[adnanCursor];
 if(!next||next.me||incomingThread||day2BriefKickoffScheduled)return;
 day2BriefKickoffScheduled=true;
 setTimeout(()=>{
  day2BriefKickoffScheduled=false;
  if(day2Stage!=='complete'||adnanCursor>=adnanTimeline.length||incomingThread||!inScripted()||state.thread!=='adnan')return;
  if(adnanTimeline[adnanCursor]?.me!==false)return;
  receive('adnan');
 },1050);
}

function day2ReportSent(){
 const adnan=threadById('adnan');
 const report=adnanTimeline[adnanTimeline.length-1];
 return aftermathTriggered&&adnanIncidentPending&&adnanCursor>=adnanTimeline.length
  &&!!report?.me&&!!adnan?.messages.some(m=>m.me&&m.text===report.text);
}
function makeStorySnapshot(reason='progress'){
 const incident=notes.find(n=>Number(n.id)===9901);
 return {
  version:STORY_SLOT_VERSION,reason,savedAt:Date.now(),
  checkpoint:day2Stage!=='none'?'CP02':aftermathTriggered?'CP01':'CP00',
  chapter:currentStoryEnding?'ENDING':day2Stage!=='none'?'CH02':aftermathTriggered?'CH01_COMPLETE':'CH01',
  endingId:currentStoryEnding,
  storyMinutes:window.nakulaNarrativeClock.minutes(),
  progress:{
   harleyCursor:cursor,adnanCursor,unknownCursor,nirmalaCursor,nirmalaAutoplayStarted,
   day2FilesReceived,day2FilesInspected,day2InvestigationChoice,day2RedFolderDelivered,
   day2CaseBriefRead,day2BriefingDone,day2FamiliesReceived,day2FamilyDocsRead,day2FamilyPriority,day2FamilyFollowup,day2FamilyTaskDismissed,
   day2ReadFileIds:[...day2ReadFileIds],
   day2MentariCallStage,day2MentariCallDueAt,day2MentariCallOutcome,
   day2MentariPhotoDelivered,day2MentariPhotoDueAt,
   day2MentariPhotoOpened,day2MentariEvidenceSaved,
   harleyAutoplayStarted,adnanAutoplayStarted,harleyUnread,adnanUnread,unknownUnread,nirmalaUnread,
   day2BriefPrepared,day2BriefChoice,day2NirmalaDelivered,
   unknownQueued,unknownStage,unknownAttempt,unknownInterrupted,unknownResumeSameCall:storyResumeSameCall,aftermathTriggered,
   adnanIncidentPending,phoneRecentsFilter,storyAwaitingSilenceChoice,day2Stage,day2TransitionDueAt
  },
  threads:threads.map(t=>({...t,messages:t.messages.map(m=>({...m}))})),
  adnanTimeline:adnanTimeline.map(m=>({...m})),
  unknownTimeline:unknownTimeline.map(m=>({...m})),
  nirmalaTimeline:nirmalaTimeline.map(m=>({...m})),
  callLog:unknownCallHistory.map(x=>({...x})),
  incidentNote:aftermathTriggered&&incident?{...incident}:null
 };
}
function saveStoryState(reason='progress'){
 if(!storySaveReady)return false;
 const snapshot=makeStorySnapshot(reason);
 try{
  localStorage.setItem('myphone-ios-'+STORY_SLOT_KEY,JSON.stringify(snapshot));
  if(snapshot.checkpoint==='CP01'&&reason==='CP01-call-aftermath')showProgressToast();
  return true;
 }catch(e){return false}
}
function loadStoryState(){
 let saved;
 try{saved=getSaved(STORY_SLOT_KEY,null)}catch(e){return false}
 if(!saved||saved.version!==STORY_SLOT_VERSION||!saved.progress
  ||!Number.isInteger(saved.storyMinutes)||saved.storyMinutes<1220||saved.storyMinutes>1440*32
  ||!Array.isArray(saved.threads)||saved.threads.length<4||saved.threads.length>12
  ||!Array.isArray(saved.adnanTimeline)||saved.adnanTimeline.length>24
  ||!Array.isArray(saved.unknownTimeline)||saved.unknownTimeline.length>8
  ||(saved.nirmalaTimeline&&(!Array.isArray(saved.nirmalaTimeline)||saved.nirmalaTimeline.length>30))
  ||!Array.isArray(saved.callLog)||saved.callLog.length>30)return false;
 const p=saved.progress;
 if(!Number.isInteger(p.harleyCursor)||p.harleyCursor<1||p.harleyCursor>timeline.length
  ||!Number.isInteger(p.adnanCursor)||p.adnanCursor<0||p.adnanCursor>saved.adnanTimeline.length
  ||!Number.isInteger(p.unknownCursor)||p.unknownCursor<0||p.unknownCursor>saved.unknownTimeline.length
  ||(p.nirmalaCursor!==undefined&&(!Number.isInteger(p.nirmalaCursor)||p.nirmalaCursor<0||p.nirmalaCursor>(saved.nirmalaTimeline||nirmalaTimeline).length))
  ||!saved.threads.every(t=>t&&typeof t.id==='string'&&Array.isArray(t.messages)&&t.messages.length<=80)
  ||!saved.threads.some(t=>t.id==='harley')||!saved.threads.some(t=>t.id==='adnan')
  ||!window.nakulaNarrativeClock.restore(saved.storyMinutes))return false;
 threads=saved.threads.map(t=>({...t,messages:t.messages.map(m=>t.id==='adnan'?migrateOldAngryAdnanMessage({...m}):{...m})}));
 adnanTimeline.splice(0,adnanTimeline.length,...saved.adnanTimeline.map(m=>migrateOldAngryAdnanMessage({...m})));
 unknownTimeline.splice(0,unknownTimeline.length,...saved.unknownTimeline.map(m=>({...m})));
 if(Array.isArray(saved.nirmalaTimeline))nirmalaTimeline.splice(0,nirmalaTimeline.length,...saved.nirmalaTimeline.map(m=>({...m})));
 unknownCallHistory=saved.callLog.map(x=>({...x}));
 cursor=p.harleyCursor;adnanCursor=p.adnanCursor;unknownCursor=p.unknownCursor;
 nirmalaCursor=p.nirmalaCursor||0;
 nirmalaAutoplayStarted=!!p.nirmalaAutoplayStarted;
 day2FilesReceived=!!p.day2FilesReceived||!!saved.threads.find(t=>t.id==='nirmala')?.messages.some(m=>m.unlockFiles);
 day2FilesInspected={approval:!!p.day2FilesInspected?.approval,metadata:!!p.day2FilesInspected?.metadata};
 day2InvestigationChoice=['verify','source'].includes(p.day2InvestigationChoice)?p.day2InvestigationChoice:null;
 day2RedFolderDelivered=!!p.day2RedFolderDelivered||saved.threads.some(t=>t.id==='adnan'&&t.messages.some(m=>m.day2RedFolder));
 day2CaseBriefRead=!!p.day2CaseBriefRead;
 day2BriefingDone=!!p.day2BriefingDone||saved.threads.some(t=>t.id==='adnan'&&t.messages.some(m=>m.day2BriefingOutcome));
 day2FamiliesReceived=!!p.day2FamiliesReceived||saved.threads.some(t=>t.id==='nirmala'&&t.messages.some(m=>m.day2FamilyPacket));
 day2FamilyDocsRead={statements:!!p.day2FamilyDocsRead?.statements,client:!!p.day2FamilyDocsRead?.client};
 // Backfill previously opened documents in existing saves. All new reads
 // are stored by file ID, so every document can dim individually.
 day2ReadFileIds=new Set(Array.isArray(p.day2ReadFileIds)?
  p.day2ReadFileIds.filter(id=>typeof id==='string'&&/^[a-z_]{1,40}$/.test(id)).slice(0,24):[]);
 if(day2FilesInspected.approval)day2ReadFileIds.add('approval');
 if(day2FilesInspected.metadata)day2ReadFileIds.add('signature');
 if(day2CaseBriefRead)day2ReadFileIds.add('casebrief');
 if(day2FamilyDocsRead.statements)day2ReadFileIds.add('family_statements');
 if(day2FamilyDocsRead.client)day2ReadFileIds.add('family_intake');
 day2FamilyPriority=['consult','corroborate'].includes(p.day2FamilyPriority)?p.day2FamilyPriority:null;
 day2FamilyFollowup=!!p.day2FamilyFollowup||saved.threads.some(t=>t.id==='nirmala'&&t.messages.some(m=>m.day2FamilyFollowup));
 day2FamilyTaskDismissed=!!p.day2FamilyTaskDismissed||!!day2FamilyPriority;
 day2MentariCallStage=['none','queued','ringing','answered','done'].includes(p.day2MentariCallStage)?p.day2MentariCallStage:'none';
 day2MentariCallDueAt=Number(p.day2MentariCallDueAt)||0;
 day2MentariCallOutcome=['declined','answered','ended-early'].includes(p.day2MentariCallOutcome)?p.day2MentariCallOutcome:null;
 day2MentariPhotoDelivered=!!p.day2MentariPhotoDelivered||saved.threads.some(t=>t.id==='unknown'&&t.messages.some(m=>m.day2MentariPhoto));
 day2MentariPhotoDueAt=Number(p.day2MentariPhotoDueAt)||0;
 day2MentariPhotoOpened=!!p.day2MentariPhotoOpened;
 day2MentariEvidenceSaved=!!p.day2MentariEvidenceSaved;
 if(day2MentariCallStage==='answered')day2MentariCallStage='ringing';
 // Saves from before 02.5 still enter the new chapter normally.
 if(day2FamilyPriority&&day2MentariCallStage==='none'){
  day2MentariCallStage='queued';day2MentariCallDueAt=Date.now()+1100;
 }
 if(day2MentariPhotoDelivered)day2MentariCallStage='done';
 if(day2InvestigationChoice)applyDay2InvestigationChoice(day2InvestigationChoice);
 harleyAutoplayStarted=!!p.harleyAutoplayStarted;
 // Older CH02 saves have no Adnan auto-play flag, but their first Adnan
 // reply was already tapped and sent in Chapter 01. Respect that one tap.
 adnanAutoplayStarted=!!p.adnanAutoplayStarted||!!p.day2BriefChoice
  ||(p.day2Stage&&p.day2Stage!=='none');
 harleyUnread=!!p.harleyUnread;adnanUnread=!!p.adnanUnread;unknownUnread=!!p.unknownUnread;
 nirmalaUnread=!!p.nirmalaUnread;
 day2BriefPrepared=!!p.day2BriefPrepared||saved.adnanTimeline.some(m=>m.day2Brief);
 day2BriefChoice=['evidence','safety'].includes(p.day2BriefChoice)?p.day2BriefChoice:null;
 day2NirmalaDelivered=!!p.day2NirmalaDelivered||saved.threads.some(t=>t.id==='nirmala'&&t.messages.some(m=>m.day2Nirmala));
 if(day2NirmalaDelivered){
  const nm=threadById('nirmala');
  const first=nm?.messages.find(m=>m.day2Nirmala===true);
  if(first&&first.text.includes('indeks adendum PBK dengan salinan'))first.text=DAY2_NIRMALA_TEASER;
 }
 unknownQueued=!!p.unknownQueued;unknownAttempt=Math.max(0,Math.min(100,Number(p.unknownAttempt)||0));
 unknownInterrupted=!!p.unknownInterrupted;
 reconcileDay2MorningIntro();
 currentStoryEnding=isKnownStoryEnding(saved.endingId)?saved.endingId:null;
 storyAwaitingSilenceChoice=!!p.storyAwaitingSilenceChoice&&!currentStoryEnding;
 aftermathTriggered=!!p.aftermathTriggered;adnanIncidentPending=!!p.adnanIncidentPending;
 phoneRecentsFilter=p.phoneRecentsFilter==='missed'?'missed':'all';
 day2Stage=['none','transition','alarm','morning','complete'].includes(p.day2Stage)?p.day2Stage:'none';
 // Keep the intended seven-second pause across refreshes; older saves
 // never stored the deadline, so resume their pending transition promptly.
 day2TransitionDueAt=day2Stage==='transition'&&Number.isFinite(p.day2TransitionDueAt)&&p.day2TransitionDueAt>0
  ?p.day2TransitionDueAt:day2Stage==='transition'?Date.now()+650:0;
 // Legacy saves created before DAY 2: infer only after the real incident
 // report was sent, never just from the call having ended.
 if(!p.day2Stage&&day2Stage==='none'&&!currentStoryEnding&&day2ReportSent()){
  day2Stage='transition';
  day2TransitionDueAt=Date.now()+650;
 }
 if(day2Stage!=='none'&&day2Stage!=='transition'
  &&window.nakulaNarrativeClock.minutes()<DAY2_MORNING_MINUTES)
  window.nakulaNarrativeClock.restore(DAY2_MORNING_MINUTES);
 unknownStage=['idle','retrying','ringing','answered','finished'].includes(p.unknownStage)?p.unknownStage:'idle';
 callConnectedAt=0;callLineIndex=0;unknownQueued=unknownQueued||unknownAttempt>0;
 notes=notes.filter(n=>Number(n.id)!==9901);
 if(aftermathTriggered&&saved.incidentNote&&Number(saved.incidentNote.id)===9901
  &&typeof saved.incidentNote.body==='string'){
  notes.unshift({...saved.incidentNote});
 }
 // A browser refresh cannot restore in-flight audio/typing timers. Resume an
 // unanswered call as the SAME ringing attempt without adding a duplicate log.
 storyResumeSameCall=!!p.unknownResumeSameCall||unknownStage==='ringing'||unknownStage==='answered';
 if(storyResumeSameCall){unknownStage='retrying';unknownQueued=true;}
 if(cursor>=timeline.length&&!aftermathTriggered&&unknownStage==='idle'){
  unknownQueued=true;
 }
 storyNeedsCallResume=unknownQueued&&!aftermathTriggered&&!currentStoryEnding&&!storyAwaitingSilenceChoice&&unknownStage!=='finished';
 return true;
}
function resumePendingStoryCall(){
 if(!storyNeedsCallResume||storyCallResumeScheduled||state.screen==='lock')return;
 storyNeedsCallResume=false;storyCallResumeScheduled=true;
 const reuseAttempt=storyResumeSameCall;
 setTimeout(()=>{
  storyCallResumeScheduled=false;
  if(state.screen==='lock'||aftermathTriggered||unknownStage==='finished'){
   storyNeedsCallResume=!aftermathTriggered&&unknownStage!=='finished';
   return;
  }
  storyResumeSameCall=false;
  showUnknownCall(reuseAttempt);
 },1100);
}
function startFreshStory(){
 // Disable pagehide autosave before reload, or the old game would be
 // immediately written back over the newly cleared slot.
 storySaveReady=false;
 storyNeedsCallResume=false;
 try{localStorage.removeItem('myphone-ios-'+STORY_SLOT_KEY)}catch(e){}
 try{window.location.reload()}catch(e){}
}
/* Story tools live in Nakula's Settings, and unlike the ending menu they
   are accessible throughout Chapter 01 and Chapter 02.
   New Game wipes only the current story slot. The discovered-endings
   archive and normal Notes/Photos/appearance settings are preserved. */
const newGameConfirmation=document.createElement('div');
newGameConfirmation.className='nakula-new-game-confirm';
newGameConfirmation.hidden=true;
newGameConfirmation.setAttribute('role','dialog');
newGameConfirmation.setAttribute('aria-modal','true');
newGameConfirmation.setAttribute('aria-labelledby','nakula-new-game-title');
newGameConfirmation.innerHTML=
 '<div class="nakula-new-game-backdrop" data-nakula-new-game-action="cancel"></div>'+
 '<div class="nakula-new-game-dialog">'+
  '<div class="nakula-new-game-overline">STORY PROGRESS</div>'+
  '<h2 id="nakula-new-game-title">Start a New Game?</h2>'+
  '<p>Your current story progress will be reset to Chapter 01. Unlocked endings will stay in the Story Archive.</p>'+
  '<button type="button" class="nakula-new-game-danger" data-nakula-new-game-action="confirm">New Game</button>'+
  '<button type="button" class="nakula-new-game-cancel" data-nakula-new-game-action="cancel">Cancel</button>'+
 '</div>';
$au('phone').appendChild(newGameConfirmation);
function closeNewGameConfirmation(){
 newGameConfirmation.hidden=true;
}
function renderNewGameSettingsControl(){
 if(state.screen!=='app'||state.app!=='settings')return;
 const content=$au('app-content');
 if(!content||content.querySelector('[data-nakula-new-game-settings]'))return;
 const section=document.createElement('section');
 section.className='nakula-new-game-settings';
 section.dataset.nakulaNewGameSettings='true';
 section.innerHTML=
  '<div class="nakula-new-game-section-heading">STORY PROGRESS</div>'+
  '<div class="list-group">'+
   '<button type="button" class="ios-row nakula-new-game-row" data-nakula-new-game-open>'+
    '<span class="row-main"><strong>New Game</strong>'+
     '<span class="row-sub">Restart Nakula’s story from Chapter 01</span></span>'+
    '<span class="end">›</span>'+
   '</button>'+
  '</div>'+
  '<p class="nakula-new-game-info">Your progress is saved automatically. Starting over does not erase discovered endings, personal Notes, Photos, or appearance.</p>';
 const resetDemo=content.querySelector('[data-action="clear-demo"]');
 if(resetDemo)resetDemo.insertAdjacentElement('beforebegin',section);
 else content.appendChild(section);
}
document.addEventListener('click',e=>{
 const open=e.target.closest('[data-nakula-new-game-open]');
 if(open){
  e.preventDefault();e.stopImmediatePropagation();
  if(state.screen!=='app'||state.app!=='settings')return;
  newGameConfirmation.hidden=false;
  newGameConfirmation.querySelector('[data-nakula-new-game-action="cancel"].nakula-new-game-cancel')?.focus();
  return;
 }
 const action=e.target.closest('[data-nakula-new-game-action]');
 if(!action||newGameConfirmation.hidden)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(action.dataset.nakulaNewGameAction==='cancel'){closeNewGameConfirmation();return}
 if(action.dataset.nakulaNewGameAction==='confirm'){
  closeNewGameConfirmation();
  startFreshStory();
 }
},true);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!newGameConfirmation.hidden)closeNewGameConfirmation();
});

function initializeStorySave(){
 const restored=loadStoryState();
 storySaveReady=true;
 if(restored&&unknownStage==='finished'&&!aftermathTriggered&&!currentStoryEnding
  &&unknownCallHistory.some(x=>x.kind==='Answered'))finishUnknownIncident();
 saveStoryState(restored?'resumed':'new-game');
 syncHarleyBadge();
 // The persistent Lock Screen card is only shown on a visit that restored
 // an existing, valid save; it is never shown by an in-session checkpoint.
 showReturningStoryNotice=restored&&!currentStoryEnding&&['none','complete'].includes(day2Stage);
 renderReturningStoryNotice();
 renderStoryEndingMenu();
 if(storyAwaitingSilenceChoice)showSilenceDecision();
 if(day2Stage==='alarm')showDay2Alarm();
 if(day2Stage==='morning')renderDay2MorningNotice();
 if(day2Stage==='complete'&&day2BriefPrepared&&adnanCursor>=adnanTimeline.length&&!day2NirmalaDelivered)finishDay2MorningBrief();
 if(day2Stage==='complete'&&day2FilesReviewed()&&!day2RedFolderDelivered&&nirmalaCursor>=nirmalaTimeline.length)scheduleDay2RedFolder();
 if(['queued','ringing'].includes(day2MentariCallStage))scheduleDay2MentariCall();
 if(day2MentariCallStage==='done'&&!day2MentariPhotoDelivered&&day2MentariCallOutcome)scheduleDay2MentariPhoto();
}
window.nakulaStorySave=Object.freeze({
 save:()=>saveStoryState('manual'),
 completeEnding:id=>completeStoryEnding(id),
 unlockedEndings:()=>getUnlockedStoryEndings().slice(),
 summary:()=>{const s=makeStorySnapshot('summary');return {chapter:s.chapter,checkpoint:s.checkpoint,storyTime:window.nakulaNarrativeClock.dateLabel(),savedAt:s.savedAt,branch:s.progress.aftermathTriggered?(s.progress.unknownInterrupted?'angry':'regular'):'pending'}},
 newGame:startFreshStory
});


/* FASE A.3 — Diegetic checkpoint toast, ending-unlocked menu and archive.
   No Continue button: the existing A.2 save restores automatically.
   The seven later endings are registrable but cannot appear until their
   respective chapters actually call completeStoryEnding(id). */
const STORY_ENDINGS=Object.freeze([
 {id:'good',label:'THE WEIGHT OF JUSTICE',kind:'GOOD'},
 {id:'bad',label:'CASE DISMISSED',kind:'BAD'},
 {id:'true',label:'JUSTICE, PENDING APPEAL',kind:'TRUE'},
 {id:'bittersweet',label:'THE COST OF TRUTH',kind:'BITTERSWEET'},
 {id:'false-good',label:'A BEAUTIFUL SETTLEMENT',kind:'FALSE GOOD'},
 {id:'tragic',label:'OBJECTION OVERRULED',kind:'TRAGIC'},
 {id:'secret',label:'THE MAN ON THE LINE',kind:'SECRET'},
 {id:'dead',label:'LINE DISCONNECTED',kind:'DEAD · NON-CANON'}
]);
const isKnownStoryEnding=id=>STORY_ENDINGS.some(e=>e.id===id);
const endingById=id=>STORY_ENDINGS.find(e=>e.id===id);
function getUnlockedStoryEndings(){
 const list=getSaved(STORY_ENDINGS_KEY,[]);
 return Array.isArray(list)?[...new Set(list.filter(isKnownStoryEnding))]:[];
}
function rememberStoryEnding(id){
 if(!isKnownStoryEnding(id))return false;
 const archive=getUnlockedStoryEndings();
 if(!archive.includes(id)){
  archive.push(id);
  try{localStorage.setItem('myphone-ios-'+STORY_ENDINGS_KEY,JSON.stringify(archive))}catch(e){}
 }
 return true;
}
const progressToast=document.createElement('div');
progressToast.className='nakula-story-toast';
progressToast.setAttribute('role','status');
progressToast.setAttribute('aria-live','polite');
progressToast.innerHTML='<span class="nakula-story-toast-mark">✓</span><span><strong>PROGRESS SAVED</strong><small>CHAPTER 01 · CALL AFTERMATH</small></span>';
$au('phone').appendChild(progressToast);
let progressToastTimeout=null;
function showProgressToast(){
 progressToast.classList.add('is-visible');
 clearTimeout(progressToastTimeout);
 progressToastTimeout=setTimeout(()=>progressToast.classList.remove('is-visible'),3200);
}
/* Persistent iOS-style save notification, visible only on a returning
   visit to the Lock Screen. Unlike the transient CP01 toast, this remains
   in the notification stack until Nakula's phone is unlocked. */
let showReturningStoryNotice=false;
const returningStoryNotice=document.createElement('button');
returningStoryNotice.type='button';
returningStoryNotice.className='nakula-story-return-notification';
returningStoryNotice.hidden=true;
returningStoryNotice.setAttribute('aria-label','Progress saved. Unlock Nakula phone to resume the story');
returningStoryNotice.innerHTML=
 '<span class="nakula-return-icon" aria-hidden="true">'+
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.7h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.7a1 1 0 0 1 1-1z"/><path d="m9 10 2 2 4-4"/></svg>'+
 '</span>'+
 '<span class="nakula-return-text">'+
  '<span class="nakula-return-heading"><strong>STORY PROGRESS</strong><span>Saved</span></span>'+
  '<span class="nakula-return-title">Progress Saved</span>'+
  '<span class="nakula-return-description">Last progress has been saved. Unlock to continue Nakula’s story.</span>'+
  '<span class="nakula-return-checkpoint"></span>'+
 '</span>';
const storyLockBottom=$au('lock-screen').querySelector('.lock-bottom');
if(storyLockBottom){
 storyLockBottom.insertBefore(returningStoryNotice,storyLockBottom.querySelector('.lock-actions'));
}else{
 $au('lock-screen').appendChild(returningStoryNotice);
}
function renderReturningStoryNotice(){
 const visible=showReturningStoryNotice&&!currentStoryEnding&&state.screen==='lock'&&['none','complete'].includes(day2Stage);
 returningStoryNotice.hidden=!visible;
 if(!visible)return;
 const label=aftermathTriggered?'CHAPTER 01 · CALL AFTERMATH':'CHAPTER 01 · IN PROGRESS';
 returningStoryNotice.querySelector('.nakula-return-checkpoint').textContent=
  label+' · '+window.nakulaNarrativeClock.time();
}
returningStoryNotice.addEventListener('click',()=>{
 if(!showReturningStoryNotice||currentStoryEnding||state.screen!=='lock')return;
 requestUnlock();
});

const storyEndingLockCard=document.createElement('button');
storyEndingLockCard.type='button';
storyEndingLockCard.className='nakula-story-lock-card';
storyEndingLockCard.hidden=true;
storyEndingLockCard.setAttribute('aria-label','Open Story Progress menu');
storyEndingLockCard.innerHTML='<span class="nakula-story-lock-icon">▣</span><span><small>STORY PROGRESS · ENDING DISCOVERED</small><strong class="nakula-story-lock-title"></strong><em>Tap to open story menu</em></span><span class="nakula-story-lock-chevron">›</span>';
$au('lock-screen').appendChild(storyEndingLockCard);
const storySheet=document.createElement('div');
storySheet.className='nakula-story-sheet';
storySheet.hidden=true;
storySheet.setAttribute('role','dialog');
storySheet.setAttribute('aria-modal','true');
storySheet.setAttribute('aria-label','Nakula story progress');
storySheet.innerHTML='<div class="nakula-story-shade" data-story-action="close"></div><div class="nakula-story-sheet-body"><div class="nakula-story-grabber"></div><button type="button" class="nakula-story-close" data-story-action="close" aria-label="Close story menu">×</button><div class="nakula-story-sheet-content"></div></div>';
$au('phone').appendChild(storySheet);
const silenceSheet=document.createElement('div');
silenceSheet.className='nakula-silence-sheet';
silenceSheet.hidden=true;
silenceSheet.setAttribute('role','dialog');
silenceSheet.setAttribute('aria-modal','true');
silenceSheet.setAttribute('aria-label','Unknown caller decision');
silenceSheet.innerHTML='<div class="nakula-silence-body"><div class="nakula-silence-icon">☾</div><small>TELEPON · NOMOR TAK DIKENAL</small><h2>Bisukan penelepon ini?</h2><p>Lima panggilan sudah ditolak. Nomor ini terus mencoba menghubungimu.</p><button type="button" data-story-action="answer-next">Angkat Panggilan Berikutnya</button><button type="button" class="nakula-silence-dnd" data-story-action="silence-caller">Jangan Ganggu</button></div>';
$au('phone').appendChild(silenceSheet);
function renderStoryEndingMenu(){
 const ending=endingById(currentStoryEnding);
 const visible=!!ending;
 if(visible)showReturningStoryNotice=false;
 renderReturningStoryNotice();
 storyEndingLockCard.hidden=!visible;
 if(ending){
  storyEndingLockCard.querySelector('.nakula-story-lock-title').textContent=ending.label;
 }
 if(!storySheet.hidden)renderStorySheet();
}
function renderStorySheet(section='menu'){
 const ending=endingById(currentStoryEnding);
 if(!ending){storySheet.hidden=true;return}
 const content=storySheet.querySelector('.nakula-story-sheet-content');
 const archive=getUnlockedStoryEndings();
 if(section==='archive'){
  content.innerHTML='<small class="nakula-story-overline">STORY ARCHIVE</small><h2>Discovered Endings</h2><p class="nakula-story-info">'+archive.length+' of 8 endings discovered</p><div class="nakula-story-archive">'+STORY_ENDINGS.map((e,i)=>{
    const unlocked=archive.includes(e.id);
    return '<div class="nakula-story-archive-item'+(unlocked?' unlocked':'')+'"><span>'+String(i+1).padStart(2,'0')+'</span><div><strong>'+(unlocked?e.label:'LOCKED ENDING')+'</strong><small>'+(unlocked?e.kind:'???')+'</small></div><span>'+(unlocked?'✓':'◌')+'</span></div>';
   }).join('')+'</div><button class="nakula-story-action secondary" type="button" data-story-action="menu">Back to Story Menu</button>';
 }else{
  const dead=ending.id==='dead';
  content.innerHTML='<small class="nakula-story-overline">ENDING DISCOVERED</small><h2>'+ending.label+'</h2><p class="nakula-story-info">'+ending.kind+' · '+archive.length+' of 8 endings discovered</p>'+
   (dead?'<p class="nakula-story-detail">You were supposed to answer the phone.</p><button class="nakula-story-action primary" type="button" data-story-action="retry">Retry Last Decision</button>':'')+
   '<button class="nakula-story-action'+(dead?' secondary':' primary')+'" type="button" data-story-action="new-game">New Game</button>'+
   '<button class="nakula-story-action secondary" type="button" data-story-action="archive">Story Archive</button>';
 }
}
function openStoryMenu(section='menu'){
 if(!currentStoryEnding)return;
 silenceSheet.hidden=true;
 storySheet.hidden=false;
 renderStorySheet(section);
}
function showSilenceDecision(){
 if(!storyAwaitingSilenceChoice||currentStoryEnding)return;
 if(state.screen==='lock')return; // Shown when the player unlocks again.
 silenceSheet.hidden=false;
}
function completeStoryEnding(id){
 if(!isKnownStoryEnding(id)||currentStoryEnding)return false;
 clearUnknownTimers();
 storyAwaitingSilenceChoice=false;
 storyNeedsCallResume=false;
 storyResumeSameCall=false;
 storyCallResumeScheduled=false;
 silenceSheet.hidden=true;
 callScreen.hidden=true;
 unknownStage='finished';
 currentStoryEnding=id;
 rememberStoryEnding(id);
 saveStoryState('ending-'+id);
 renderStoryEndingMenu();
 openStoryMenu();
 return true;
}
function retryDeadDecision(){
 if(currentStoryEnding!=='dead')return false;
 storySheet.hidden=true;
 silenceSheet.hidden=true;
 currentStoryEnding=null;
 storyAwaitingSilenceChoice=false;
 unknownStage='retrying';
 unknownQueued=true;
 storyNeedsCallResume=false;
 storyResumeSameCall=false;
 // Keep historical declines, but let the player answer the next ringing call.
 saveStoryState('retry-dead-choice');
 renderStoryEndingMenu();
 setTimeout(()=>{if(!currentStoryEnding&&state.screen!=='lock')showUnknownCall();else if(!currentStoryEnding){storyNeedsCallResume=true;}},500);
 return true;
}
function beginNewGameFromEnding(){
 if(!currentStoryEnding)return;
 if(!confirm('Start a new story? Your current progress will reset. Discovered endings stay in the archive.'))return;
 storySheet.hidden=true;
 startFreshStory();
}
storyEndingLockCard.addEventListener('click',()=>openStoryMenu());
document.addEventListener('click',e=>{
 const target=e.target.closest('[data-story-action]');
 if(!target)return;
 const action=target.dataset.storyAction;
 if(!['close','menu','archive','new-game','retry','answer-next','silence-caller'].includes(action))return;
 e.preventDefault();e.stopImmediatePropagation();
 if(action==='close'){storySheet.hidden=true;return}
 if(action==='menu'){openStoryMenu();return}
 if(action==='archive'){openStoryMenu('archive');return}
 if(action==='new-game'){beginNewGameFromEnding();return}
 if(action==='retry'){retryDeadDecision();return}
 if(action==='answer-next'&&storyAwaitingSilenceChoice){
  storyAwaitingSilenceChoice=false;silenceSheet.hidden=true;
  saveStoryState('chose-to-answer');
  setTimeout(()=>{if(!currentStoryEnding&&state.screen!=='lock')showUnknownCall();else if(!currentStoryEnding)storyNeedsCallResume=true},500);
 }else if(action==='silence-caller'&&storyAwaitingSilenceChoice){
  completeStoryEnding('dead');
 }
},true);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!storySheet.hidden){storySheet.hidden=true}
});
// Make pending fifth-call choice visible on return from lock screen.
function restoreStoryOverlay(){
 if(storyAwaitingSilenceChoice&&!currentStoryEnding)showSilenceDecision();
 if(currentStoryEnding)renderStoryEndingMenu();
}


/* CHAPTER 02 — DAY 2 / THE MORNING AFTER
   A cinematic midnight-to-morning transition, then a mandatory, dismissible
   Clock alarm over Nakula's Lock Screen. Adnan's new message is delivered
   only after the player stops the alarm. All steps survive reload. */
const day2Curtain=document.createElement('div');
day2Curtain.className='nakula-day2-curtain';
day2Curtain.hidden=true;
day2Curtain.setAttribute('aria-hidden','true');
day2Curtain.innerHTML='<div class="nakula-day2-title">DAY 2</div>';
$au('phone').appendChild(day2Curtain);

const day2Alarm=document.createElement('div');
day2Alarm.className='nakula-day2-alarm';
day2Alarm.hidden=true;
day2Alarm.setAttribute('role','dialog');
day2Alarm.setAttribute('aria-modal','true');
day2Alarm.setAttribute('aria-label','Alarm. 7:12 AM. Stop the alarm to continue');
day2Alarm.innerHTML=
 '<div class="nakula-day2-alarm-content">'+
  '<div class="nakula-day2-bell" aria-hidden="true">'+
   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.5A6 6 0 0 0 6 8.5c0 7-3 7.9-3 9h18c0-1.1-3-2-3-9Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>'+
  '</div>'+
  '<div class="nakula-day2-alarm-label">CLOCK · ALARM</div>'+
  '<div class="nakula-day2-alarm-time">07:12</div>'+
  '<div class="nakula-day2-alarm-name">Weekday Alarm</div>'+
  '<button type="button" class="nakula-day2-alarm-stop" data-day2-stop>Stop</button>'+
  '<div class="nakula-day2-alarm-hint">Stop the alarm to continue</div>'+
 '</div>';
$au('phone').appendChild(day2Alarm);

const day2MorningNotice=document.createElement('button');
day2MorningNotice.type='button';
day2MorningNotice.className='nakula-day2-morning-notice';
day2MorningNotice.hidden=true;
day2MorningNotice.setAttribute('aria-label','New message from Adnan W. Unlock to read');
day2MorningNotice.innerHTML=
 '<span class="nakula-day2-message-icon" aria-hidden="true">●</span>'+
 '<span class="nakula-day2-message-body">'+
  '<span class="nakula-day2-message-top"><strong>MESSAGES</strong><span>now</span></span>'+
  '<strong>Adnan W. (Managing Partner)</strong>'+
  '<span>Pagi, Na. Saya sudah baca laporanmu semalam. Simpan seluruh riwayat panggilannya...</span>'+
 '</span>';
const day2LockBottom=$au('lock-screen').querySelector('.lock-bottom');
if(day2LockBottom)day2LockBottom.insertBefore(day2MorningNotice,day2LockBottom.querySelector('.lock-actions'));
else $au('lock-screen').appendChild(day2MorningNotice);
day2MorningNotice.addEventListener('click',()=>{
 if(day2Stage==='morning'&&state.screen==='lock')requestUnlock();
});

let day2AlarmAudio=null,day2AlarmSoundTimer=null;
function playDay2AlarmChime(){
 if(day2Stage!=='alarm')return;
 try{
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return;
  day2AlarmAudio=day2AlarmAudio||new AC();
  if(day2AlarmAudio.state==='suspended')day2AlarmAudio.resume().catch(()=>{});
  const ctx=day2AlarmAudio,t=ctx.currentTime+.025;
  for(const [offset,freq] of [[0,784],[.23,1046],[.5,784],[.73,1046]]){
   const osc=ctx.createOscillator(),gain=ctx.createGain();
   osc.type='sine';osc.frequency.value=freq;
   gain.gain.setValueAtTime(.0001,t+offset);
   gain.gain.exponentialRampToValueAtTime(.055,t+offset+.025);
   gain.gain.exponentialRampToValueAtTime(.0001,t+offset+.19);
   osc.connect(gain).connect(ctx.destination);
   osc.start(t+offset);osc.stop(t+offset+.2);
  }
 }catch(e){} // Browsers can block alarm audio until user interaction.
}
function stopDay2AlarmAudio(){
 if(day2AlarmSoundTimer){clearInterval(day2AlarmSoundTimer);day2AlarmSoundTimer=null}
 if(day2AlarmAudio&&day2AlarmAudio.state==='running')day2AlarmAudio.suspend().catch(()=>{});
}
function showDay2Alarm(){
 if(day2Stage!=='alarm'||currentStoryEnding)return;
 day2Alarm.hidden=false;
 day2MorningNotice.hidden=true;
 if(!day2AlarmSoundTimer){
  playDay2AlarmChime();
  day2AlarmSoundTimer=setInterval(playDay2AlarmChime,2800);
 }
}
function renderDay2MorningNotice(){
 const visible=day2Stage==='morning'&&state.screen==='lock'&&!currentStoryEnding;
 day2MorningNotice.hidden=!visible;
 if(visible){showReturningStoryNotice=false;renderReturningStoryNotice()}
}
function deliverDay2MorningMessage(){
 const adnan=threadById('adnan');
 if(!adnan)return;
 if(!adnan.messages.some(m=>m.day2Morning===true)){
  adnan.messages.push({me:false,time:'07.12',text:day2MorningIntroText(),day2Morning:true,dayOffset:1});
  adnan.date='07.12';
 }
 reconcileDay2MorningIntro();
 adnanUnread=true;
 const idx=threads.findIndex(t=>t.id==='adnan');
 if(idx>0)threads.unshift(...threads.splice(idx,1));
 syncHarleyBadge();
}
function stopDay2Alarm(){
 if(day2Stage!=='alarm')return;
 stopDay2AlarmAudio();
 day2Alarm.hidden=true;
 day2Stage='morning';
 deliverDay2MorningMessage();
 saveStoryState('CP02-alarm-stopped');
 renderDay2MorningNotice();
 sound();
}
day2Alarm.querySelector('[data-day2-stop]').addEventListener('click',stopDay2Alarm);

function scheduleDay2Transition(){
 if(day2TransitionTimer){clearTimeout(day2TransitionTimer);day2TransitionTimer=null}
 if(day2Stage!=='transition'||day2TransitionRunning||currentStoryEnding||state.screen==='lock')return;
 // The due time is absolute, so re-entering Home or refreshing never
 // restarts an already-in-progress pause from seven full seconds.
 const due=day2TransitionDueAt||Date.now()+650;
 const remaining=Math.max(0,due-Date.now());
 day2TransitionTimer=setTimeout(()=>{
  day2TransitionTimer=null;
  startDay2Transition();
 },remaining);
}
function startDay2Transition(){
 if(day2Stage!=='transition'||day2TransitionRunning||currentStoryEnding||state.screen==='lock')return;
 if(day2TransitionTimer){clearTimeout(day2TransitionTimer);day2TransitionTimer=null}
 day2TransitionRunning=true;
 hideNotif();
 day2Curtain.hidden=false;
 day2Curtain.setAttribute('aria-hidden','false');
 // A frame is needed for the full-screen fade to animate in WebKit.
 requestAnimationFrame(()=>day2Curtain.classList.add('is-dark'));
 setTimeout(()=>day2Curtain.classList.add('show-title'),450);
 setTimeout(()=>{
  if(day2Stage!=='transition')return;
  // Sunday 25 Oct -> Monday 26 Oct 2026, 07:12 Jakarta.
  window.nakulaNarrativeClock.restore(DAY2_MORNING_MINUTES);
  day2Stage='alarm';
  day2TransitionDueAt=0;
  state.app=null;state.view=null;state.thread=null;
  hidePasscode();
  layer('lock');
  saveStoryState('CP02-day2-morning');
  day2Curtain.classList.remove('show-title');
 },2550);
 setTimeout(()=>{
  day2Curtain.classList.remove('is-dark');
 },3050);
 setTimeout(()=>{
  day2Curtain.hidden=true;
  day2Curtain.setAttribute('aria-hidden','true');
  day2TransitionRunning=false;
 },3580);
}

const oldEnterPIN=enterPasscodeDigit;
enterPasscodeDigit=function(digit){
 const wasLocked=state.screen==='lock';
 oldEnterPIN(digit);
 if(wasLocked&&state.screen==='home'){
   syncHarleyBadge();
   if(day2Stage==='complete'&&adnanUnread){setNotification('adnan');notif.classList.add('show');sound()}
   else if(unknownUnread){setNotification('unknown');notif.classList.add('show');sound()}
   else if(!currentStoryEnding)showNotif(true);
   restoreStoryOverlay();
 }
};
const oldLayer=layer;
layer=function(which){
 oldLayer(which);
 ensureNakulaFilesIcon();
 $au('phone').classList.toggle('harley-au-mode',which==='app'&&state.app==='messages');
 if(which!=='home')hideNotif();
 syncHarleyBadge();
 if(which==='home'){
  showReturningStoryNotice=false;
  if(day2Stage==='morning'){
   day2Stage='complete';
   saveStoryState('CP02-morning-unlocked');
  }
  renderReturningStoryNotice();
  renderDay2MorningNotice();
  resumePendingStoryCall();
  if(['queued','ringing'].includes(day2MentariCallStage))scheduleDay2MentariCall();
  if(day2Stage==='transition')scheduleDay2Transition();
 }
 if(which==='lock'){
  silenceSheet.hidden=true;
  renderReturningStoryNotice();
  renderStoryEndingMenu();
  if(day2Stage==='alarm')showDay2Alarm();
  renderDay2MorningNotice();
 }
 if(which==='home')restoreStoryOverlay();
};
// A chat read clears the unread badge, including when Harley is opened from the Messages list.
document.addEventListener('click',e=>{
 if(state.screen!=='app'||state.app!=='messages')return;
 const t=e.target.closest('[data-thread]');
 if(!t)return;
 if(t.dataset.thread==='harley')markHarleyRead();
 if(t.dataset.thread==='adnan')markAdnanRead();
 if(t.dataset.thread==='unknown')markUnknownRead();
 if(t.dataset.thread==='nirmala')markNirmalaRead();
},true);
const oldOpenApp=openApp;
openApp=function(id){hideNotif();oldOpenApp(id)};
threadMarkup=function(arr){
 return arr.map(t=>{
   const unread=(t.id==='harley'&&harleyUnread)||(t.id==='adnan'&&adnanUnread)||(t.id==='unknown'&&unknownUnread)||(t.id==='nirmala'&&nirmalaUnread);
   const preview=t.messages[t.messages.length-1]?.text||t.role||'';
   return '<button class="thread'+(unread?' is-unread':'')+'" data-thread="'+esc(t.id)+'" aria-label="'+esc(t.name)+(unread?', unread message':'')+'">'+
     (unread?'<span class="thread-unread" aria-hidden="true"></span>':'')+
     '<span class="avatar harley-au-avatar '+esc(t.id)+'">'+esc(t.initials)+'</span>'+
     '<span class="thread-main"><span class="thread-line"><span class="thread-name">'+esc(t.name)+'</span><span class="thread-date">'+esc(t.date||'')+'</span></span>'+
     '<span class="thread-preview">'+esc(preview)+'</span></span><span class="thread-arrow" aria-hidden="true">›</span></button>';
 }).join('');
};

/* In-page iOS-inspired keyboard, animating Nakula's scripted replies.
   This is a visual keyboard: iOS does not allow websites to control native key animations or system haptics. */
function auKeyboardMarkup(){
 if(!keyboardVisible)return '';
 const key=(char,label=char,extra='')=>{const iconKey=char==='shift'||char==='delete';const aria=iconKey?char:char==='globe'?'Language':char==='space'?'Space':char==='return'?'Return':label;return '<button type="button" class="au-key '+extra+'" data-au-key="'+esc(char)+'" aria-label="'+esc(aria)+'">'+(iconKey?label:esc(label))+'</button>'};
 const row=(letters,extra='')=>'<div class="au-key-row '+extra+'">'+Array.from(letters).map(char=>key(char,char)).join('')+'</div>';
 const shift='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 1.8 13h5.6v8h9.2v-8h5.6L12 2z"/></svg>';
 const del='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H22v16H9L1 12 9 4z"/><path d="m12 9 6 6m0-6-6 6"/></svg>';
 return '<div class="au-visual-keyboard" id="au-visual-keyboard" aria-label="iPhone style keyboard">'+
  row('qwertyuiop')+row('asdfghjkl','au-middle-row')+
  '<div class="au-key-row au-key-row-third">'+key('shift',shift,'au-key-modifier')+Array.from('zxcvbnm').map(char=>key(char,char)).join('')+key('delete',del,'au-key-modifier')+'</div>'+
  '<div class="au-key-row au-key-row-bottom">'+key('123','123','au-key-modifier au-key-numbers')+key('globe','◎','au-key-modifier au-key-globe')+key('space','space','au-key-space')+key('return','return','au-key-modifier au-key-return')+'</div>'+
  '<div class="au-keyboard-footer"><span></span></div></div>';
}
function auArmKeyboardAudio(){
 try{
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return;
  keyboardAudioContext=keyboardAudioContext||new AC();
  if(keyboardAudioContext.state==='suspended')keyboardAudioContext.resume().catch(()=>{});
 }catch(e){}
}
function auKeySound(){
 if(!keyboardSoundEnabled||!keyboardAudioContext||keyboardAudioContext.state!=='running')return;
 try{
  const t=keyboardAudioContext.currentTime;
  const osc=keyboardAudioContext.createOscillator();
  const gain=keyboardAudioContext.createGain();
  osc.type='triangle';
  osc.frequency.setValueAtTime(650,t);osc.frequency.exponentialRampToValueAtTime(370,t+.017);
  gain.gain.setValueAtTime(.0001,t);
  gain.gain.exponentialRampToValueAtTime(.048,t+.002);
  gain.gain.exponentialRampToValueAtTime(.0001,t+.022);
  osc.connect(gain).connect(keyboardAudioContext.destination);
  osc.start(t);osc.stop(t+.025);
 }catch(e){}
}
function auKeyFeedback(char,force=false){
 const keys=Array.from(document.querySelectorAll('#au-visual-keyboard [data-au-key]'));
 const value=char===' '?'space':String(char).toLowerCase();
 const preferred=['shift','delete','return','123','globe','space'].includes(value)?value:/^[a-z]$/.test(value)?value:/[0-9]/.test(value)?'123':/[.,!?]/.test(value)?'return':'space';
 const match=keys.find(k=>k.dataset.auKey===preferred)||keys.find(k=>k.dataset.auKey==='space');
 if(match){
  match.classList.remove('au-key-pressed');
  void match.offsetWidth;
  match.classList.add('au-key-pressed');
  clearTimeout(match.auPressTimer);
  match.auPressTimer=setTimeout(()=>match.classList.remove('au-key-pressed'),105);
 }
 const t=performance.now();
 if(force||t-lastKeyFeedback>=72){
  lastKeyFeedback=t;auKeySound();
  try{if(navigator.vibrate)navigator.vibrate(4)}catch(e){}
 }
}


/* Harley's conversation needs only one tap. Afterwards Nakula types each reply
   automatically, keeping the visible keyboard animation and incoming delays. */
function scheduleHarleyReply(delay=950){
 if(!harleyAutoplayStarted||!inHarley()||incomingThread||typing||ready||keyboardVisible||harleyNextTimer)return;
 if(!timeline[cursor]?.me)return;
 harleyNextTimer=setTimeout(()=>{
   harleyNextTimer=null;
   if(!inHarley()||incomingThread||typing||ready||!timeline[cursor]?.me)return;
   beginAutoType();
 },delay);
}


/* Nakula's Adnan conversation uses the same once-to-start
   type → auto-send → wait for reply → type loop as Harley. The choice
   placeholder is deliberately a hard stop until the player chooses. */
function scheduleAdnanReply(delay=900){
 if(!adnanAutoplayStarted||state.screen!=='app'||state.app!=='messages'
  ||state.view!=='convo'||state.thread!=='adnan'
  ||incomingThread||typing||ready||keyboardVisible||adnanNextTimer)return;
 const next=adnanTimeline[adnanCursor];
 if(!next?.me||next.choicePending)return;
 adnanNextTimer=setTimeout(()=>{
  adnanNextTimer=null;
  if(!adnanAutoplayStarted||!inScripted()||state.thread!=='adnan'
   ||incomingThread||typing||ready||keyboardVisible)return;
  const step=adnanTimeline[adnanCursor];
  if(step?.me&&!step.choicePending)beginAutoType();
 },delay);
}

/* Native-feeling iMessage chronology, based on the story clock rather than
   the actual visitor's date. Existing CH01 saves need no migration. */
function nakulaChatMessageDay(message){
 if(message.day2Morning===true)return 1;
 if(Number.isInteger(message.dayOffset)&&message.dayOffset>=0)return message.dayOffset;
 return 0;
}
function nakulaChatTimeMinutes(message){
 const parts=String(message.time||'').replace(':','.').split('.');
 if(parts.length!==2)return null;
 const hour=Number(parts[0]),min=Number(parts[1]);
 return Number.isInteger(hour)&&Number.isInteger(min)&&hour>=0&&hour<24&&min>=0&&min<60?hour*60+min:null;
}
function nakulaChatDayTitle(day){
 const currentDay=Math.floor(window.nakulaNarrativeClock.minutes()/1440);
 if(day===currentDay)return 'Today';
 if(day===currentDay-1)return 'Yesterday';
 const dayDate=new Date(Date.UTC(2026,9,25+day,5));
 return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'UTC'}).format(dayDate);
}
function nakulaChatHasPause(previous,current){
 if(!previous)return true;
 if(nakulaChatMessageDay(previous)!==nakulaChatMessageDay(current))return true;
 const prev=nakulaChatTimeMinutes(previous),cur=nakulaChatTimeMinutes(current);
 return prev!==null&&cur!==null&&cur-prev>=45;
}
function nakulaChatSameCluster(a,b){
 if(!a||!b||a.me!==b.me||nakulaChatMessageDay(a)!==nakulaChatMessageDay(b))return false;
 const timeA=nakulaChatTimeMinutes(a),timeB=nakulaChatTimeMinutes(b);
 return timeA!==null&&timeB!==null&&Math.abs(timeB-timeA)<=2;
}
function nakulaRenderChatBubbles(messages){
 return messages.map((m,i)=>{
  const previous=messages[i-1],next=messages[i+1];
  const start=nakulaChatHasPause(previous,m);
  const day=nakulaChatMessageDay(m);
  const stamp=String(m.time||'').replace(':','.');
  const title=nakulaChatDayTitle(day);
  const divider=start?'<div class="date-divider nakula-chat-time-divider" role="separator" aria-label="'+esc(title+' at '+stamp)+'">'+esc(title)+' <span>at '+esc(stamp)+'</span></div>':'';
  const joinsPrevious=!start&&nakulaChatSameCluster(previous,m);
  const joinsNext=!!next&&!nakulaChatHasPause(m,next)&&nakulaChatSameCluster(m,next);
  const classes='bubble-row '+(m.me?'me':'them')+
   (joinsPrevious?' chat-cluster-follow':'')+
   (joinsNext?' chat-cluster-has-next':'')+
   ((m.unlockFiles||m.day2RedFolder||m.day2FamilyPacket||m.day2MentariPhoto)?' chat-has-attachment':'');
  const attachment=m.day2MentariPhoto?
   '<div class="nakula-mentari-photo-block"><button type="button" class="nakula-mentari-image" data-day2-mentari-view aria-label="Lihat foto yang dikirim Unknown"><img src="'+MENTARI_PHOTO_SRC+'" alt="Foto yang dikirim Unknown" loading="lazy"></button>'+
    '<div class="nakula-mentari-actions"><button type="button" data-day2-mentari-view>Lihat di Foto</button>'+
     '<button type="button" data-day2-mentari-save>'+(day2MentariEvidenceSaved?'✓ Bukti tersimpan':'Simpan sebagai Bukti')+'</button></div></div>':
   m.unlockFiles?'<button type="button" class="nakula-file-attachment" data-nakula-files-open aria-label="Open evidence in Files"><span class="nakula-file-attachment-icon">PDF</span><span><strong>PBK Group · Evidence</strong><small>3 received documents · Open in Files</small></span><span aria-hidden="true">›</span></button>':
   m.day2RedFolder?'<button type="button" class="nakula-file-attachment" data-nakula-calendar-open><span class="nakula-file-attachment-icon">09</span><span><strong>Internal Case Briefing</strong><small>09.00 · Open Calendar</small></span><span aria-hidden="true">›</span></button>':
   m.day2FamilyPacket?'<button type="button" class="nakula-file-attachment" data-nakula-family-files-open><span class="nakula-file-attachment-icon">PDF</span><span><strong>Zona B · Family Records</strong><small>2 documents · Open in Files</small></span><span aria-hidden="true">›</span></button>':'';
  return divider+'<div class="'+classes+'"><div class="bubble" title="'+esc(m.time||'')+'">'+esc(m.text)+'</div>'+attachment+'</div>';
 }).join('');
}

const oldRender=render;
render=function(){
 $au('phone').classList.toggle('harley-au-mode',state.screen==='app'&&state.app==='messages');
 if(state.screen==='app'&&state.app==='files'){renderNakulaFilesApp();return}
 if(!inHarley()){
   clearTimeout(harleyNextTimer);harleyNextTimer=null;
   clearTimeout(harleyAutoSendTimer);harleyAutoSendTimer=null;
 }
 if(!(state.screen==='app'&&state.app==='messages'
  &&state.view==='convo'&&state.thread==='adnan')){
   clearTimeout(adnanNextTimer);adnanNextTimer=null;
   clearTimeout(adnanAutoSendTimer);adnanAutoSendTimer=null;
 }
 if(!(state.screen==='app'&&state.app==='messages'
  &&state.view==='convo'&&state.thread==='nirmala')){
   clearTimeout(nirmalaNextTimer);nirmalaNextTimer=null;
   clearTimeout(nirmalaAutoSendTimer);nirmalaAutoSendTimer=null;
 }
 if(!inScripted()){
   keyboardVisible=false;typingRun++;if(typingTimer)clearTimeout(typingTimer);typing=false;ready=false;
   oldRender();
   if(state.screen==='app'&&state.app==='settings')renderNewGameSettingsControl();
   if(state.screen==='app'&&state.app==='calendar')renderDay2Calendar();
   if(state.screen==='app'&&state.app==='phone')renderNakulaRecents();
   if(state.screen==='app'&&state.app==='messages'){
     const oldCaption=document.querySelector('#app-content .convo-local');
     if(oldCaption)oldCaption.remove();
   }
   return;
 }
 if(state.thread==='adnan'&&day2Stage==='complete')prepareDay2MorningBrief();
 const thread=threadById(state.thread),script=activeTimeline(),index=activeIndex(),next=script[index],done=!next&&!isReceiving();
 const bubbles=nakulaRenderChatBubbles(thread.messages);
 const dots=isReceiving()?'<div class="bubble-row them"><div class="bubble harley-au-dots"><i></i><i></i><i></i></div></div>':'';
 const day2ChoiceUI=state.thread==='adnan'&&next?.choiceId==='day2-brief'&&!day2BriefChoice?
  '<div class="nakula-day2-brief-choice" role="group" aria-label="Choose Nakula’s reply">'+
   '<span>BAGAIMANA NAKULA HARUS MERESPONS?</span>'+
   '<button type="button" data-day2-brief-choice="evidence">Verifikasi Bukti <small>Periksa silang dokumen PBK</small></button>'+
   '<button type="button" data-day2-brief-choice="safety">Tangani Ancaman <small>Minta prosedur penanganan ancaman</small></button>'+
  '</div>':'';
 const aftermathCta=state.thread==='unknown'&&aftermathTriggered&&!day2MentariPhotoDelivered?
  '<div class="nakula-incident-cta"><small>CALL LOG SAVED · NOTE CREATED</small><button type="button" data-au-open-adnan>Message Adnan</button></div>':'';
 const filesCta=state.thread==='nirmala'&&day2FilesReceived&&!day2FilesReviewed()
  ?'<div class="nakula-files-review-callout"><span>CASE EVIDENCE · ACTION REQUIRED</span><strong>Examine the PBK documents</strong><small>Open the approval and the signature report in Files to continue.</small><button type="button" data-nakula-files-open="1">Open Files</button></div>':'';
 const delivered=state.thread==='adnan'&&adnanIncidentPending&&adnanCursor>=adnanTimeline.length&&thread.messages.length>0&&thread.messages[thread.messages.length-1].me?
  '<div class="nakula-message-delivered">Delivered</div>':'';
 const camera='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h4l2-2h6l2 2h4v12H3z"/><circle cx="12" cy="14" r="4"/></svg>';
 const mic='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8"/></svg>';
 const plus='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg>';
 const back='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3 6 12l9 9"/></svg>';
 const video='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2" y="6" width="15" height="12" rx="3"/><path d="M17 10l5-3v10l-5-3"/></svg>';
 const phone='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 3 4 6c-1 2 3 8 6 11s8 5 10 3l1-3-5-3-3 3a18 18 0 0 1-6-6l3-3z"/></svg>';
 const sendArrow='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>';
 $au('app-header').innerHTML='<button class="harley-au-back" data-action="back" aria-label="Back to Messages">'+back+'<span>Messages</span></button><div class="harley-au-head"><span class="harley-au-head-avatar '+esc(thread.id)+'">'+esc(thread.initials)+'</span><span class="harley-au-head-name">'+esc(thread.name)+'<span class="harley-au-chevron">›</span></span></div><div class="harley-au-head-actions"><span aria-label="Video call" role="img">'+video+'</span><span aria-label="Phone call" role="img">'+phone+'</span></div>';
 $au('app-content').innerHTML='<div class="conversation harley-au-conversation'+(keyboardVisible?' keyboard-visible':'')+'"><div class="convo-scroll" id="chat-scroll">'+bubbles+dots+delivered+aftermathCta+day2ChoiceUI+filesCta+'</div><form class="convo-foot harley-au-composer'+(ready?' has-reply':'')+'" id="chat-form"><span class="harley-au-plus" aria-hidden="true">'+plus+'</span><div class="harley-au-textbox"><textarea class="chat-input" id="chat-input" rows="1" readonly placeholder="iMessage" aria-label="iMessage"></textarea><span class="harley-au-camera" aria-hidden="true">'+camera+'</span></div><button class="send-btn" type="submit" aria-label="Send message" '+(ready?'':'disabled')+'>'+sendArrow+'</button><span class="harley-au-mic" aria-hidden="true">'+mic+'</span></form>'+auKeyboardMarkup()+'</div>';
 $au('app-screen').classList.add('in-conversation');
 $au('app-content').style.padding='0';$au('app-content').style.overflow='hidden';
 const sc=$au('chat-scroll');if(sc)sc.scrollTop=sc.scrollHeight;
 if(state.thread==='nirmala')scheduleNirmalaReply();
 if(state.thread==='adnan'){
  if(day2Stage==='complete')queueDay2BriefIncoming();
  scheduleAdnanReply();
 }
 if(inHarley()){
  scheduleHarleyReply();
  // A fully received message is the resume boundary, not a partial keypress.
  if(harleyAutoplayStarted&&!incomingThread&&!typing&&!ready&&timeline[cursor]&&!timeline[cursor].me&&!storyHarleyResumeScheduled){
   storyHarleyResumeScheduled=true;
   setTimeout(()=>{
    storyHarleyResumeScheduled=false;
    if(inHarley()&&!incomingThread&&timeline[cursor]&&!timeline[cursor].me)receive('harley');
   },650);
  }
 }
};

function scheduleNirmalaReply(delay=880){
 if(!nirmalaAutoplayStarted||!day2NirmalaDelivered
   ||state.screen!=='app'||state.app!=='messages'||state.view!=='convo'||state.thread!=='nirmala'
   ||incomingThread||typing||ready||keyboardVisible||nirmalaNextTimer)return;
 const next=nirmalaTimeline[nirmalaCursor];
 if(!next?.me||(next.requiresFilesReview&&!day2FilesReviewed()))return;
 nirmalaNextTimer=setTimeout(()=>{
  nirmalaNextTimer=null;
  if(state.screen!=='app'||state.app!=='messages'||state.view!=='convo'||state.thread!=='nirmala'
   ||incomingThread||typing||ready||keyboardVisible)return;
  if(nirmalaTimeline[nirmalaCursor]?.me)beginAutoType();
 },delay);
}

function beginAutoType(){
 if(!inScripted()||isReceiving())return;
 if(state.thread==='adnan'&&activeTimeline()[activeIndex()]?.choicePending)return;
 if(state.thread==='nirmala'&&activeTimeline()[activeIndex()]?.requiresFilesReview&&!day2FilesReviewed())return;
 const message=activeTimeline()[activeIndex()];if(!message?.me)return;
 auArmKeyboardAudio();
 if(!keyboardVisible){
   keyboardVisible=true;
   render();
 }
 if(typing||ready)return;
 typing=true;
 const currentRun=++typingRun;
 const composer=$au('chat-form');if(composer)composer.classList.add('has-reply');
 let index=0;
 function step(){
  if(currentRun!==typingRun||!inScripted()){typing=false;return}
  const field=$au('chat-input');if(!field){typing=false;return}
  const nextIndex=Math.min(message.text.length,index+((message.text.length>160)?2:1));
  const typed=message.text.slice(index,nextIndex);
  index=nextIndex;
  field.value=message.text.slice(0,index);
  field.style.height='36px';
  field.style.height=Math.min(100,Math.max(36,field.scrollHeight))+'px';
  field.scrollTop=field.scrollHeight;
  auKeyFeedback(typed.slice(-1)||' ');
  if(index<message.text.length){
    const last=typed.slice(-1);
    const delay=/[.,?!]/.test(last)?105:last===' '?65:34;
    typingTimer=setTimeout(step,delay);
  }else{
    typing=false;ready=true;
    const btn=document.querySelector('#chat-form .send-btn');if(btn)btn.disabled=false;
    if(currentRun===typingRun){
      if(inHarley()&&harleyAutoplayStarted){
        clearTimeout(harleyAutoSendTimer);
        harleyAutoSendTimer=setTimeout(()=>{
          harleyAutoSendTimer=null;
          if(inHarley()&&!typing&&ready&&timeline[cursor]===message)sendScripted();
        },620);
      }else if(state.thread==='nirmala'&&nirmalaAutoplayStarted){
        clearTimeout(nirmalaAutoSendTimer);
        nirmalaAutoSendTimer=setTimeout(()=>{
          nirmalaAutoSendTimer=null;
          if(inScripted()&&state.thread==='nirmala'&&!typing&&ready&&nirmalaTimeline[nirmalaCursor]===message)sendScripted();
        },620);
      }else if(state.thread==='adnan'&&adnanAutoplayStarted){
        clearTimeout(adnanAutoSendTimer);
        adnanAutoSendTimer=setTimeout(()=>{
          adnanAutoSendTimer=null;
          if(inScripted()&&state.thread==='adnan'&&!typing&&ready
           &&adnanTimeline[adnanCursor]===message)sendScripted();
        },620);
      }
    }
  }
 }
 typingTimer=setTimeout(step,175);
}
function receive(id=state.thread){
 if(incomingThread)return;
 incomingThread=id;
 if(inScripted()&&state.thread===id)render();
 function one(){
  const script=id==='unknown'?unknownTimeline:id==='adnan'?adnanTimeline:id==='nirmala'?nirmalaTimeline:timeline;
  const current=id==='unknown'?unknownCursor:id==='adnan'?adnanCursor:id==='nirmala'?nirmalaCursor:cursor;
  const next=script[current];
  if(!next||next.me){
   incomingThread=null;
   if(inScripted()&&state.thread===id)render();
   if(id==='harley'&&current>=script.length)queueUnknownCall();
   if(id==='adnan'&&day2BriefPrepared&&day2Stage==='complete'&&current>=script.length)finishDay2MorningBrief();
   if(id==='nirmala'&&current>=script.length)scheduleDay2RedFolder();
   saveStoryState('incoming-sequence-finished');
   return;
  }
  if(id==='harley')window.nakulaNarrativeClock.syncMessage(next.time);
  syncDay2BriefClock(next);
  const thread=threadById(id);
  thread.messages.push({...next});thread.date=next.time;setIndex(id,current+1);
  if(id==='nirmala'&&next.unlockFiles)day2FilesReceived=true;
  saveStoryState('incoming-message');
  if(inScripted()&&state.thread===id){render();sound()}
  else if(state.screen==='app'&&state.app==='messages'&&state.view!=='convo')render();
  setTimeout(one,next.text.length>160?1800:1250);
 }
 setTimeout(one,1550);
}
function sendScripted(){
 if(!inScripted())return;
 if(typing){clearTimeout(typingTimer);typing=false;ready=true}
 if(!ready){beginAutoType();return}
 const id=state.thread,script=activeTimeline(),current=activeIndex(),m=script[current];
 if(!m?.me||m.choicePending||(id==='nirmala'&&m.requiresFilesReview&&!day2FilesReviewed()))return;
 typingRun++;clearTimeout(typingTimer);keyboardVisible=false;
 syncDay2BriefClock(m);
 if(id==='harley')window.nakulaNarrativeClock.syncMessage(m.time);
 const thread=threadById(id);thread.messages.push({...m});thread.date=m.time;
 setIndex(id,current+1);ready=false;
 saveStoryState('outgoing-message');
 render();
 if(id==='adnan'&&adnanIncidentPending&&adnanCursor>=adnanTimeline.length){
  const idx=threads.findIndex(t=>t.id==='adnan');
  if(idx>0)threads.unshift(...threads.splice(idx,1));
  if(day2Stage==='none'&&day2ReportSent()&&!currentStoryEnding){
   day2Stage='transition';
   day2TransitionDueAt=Date.now()+DAY2_TRANSITION_PAUSE_MS;
   saveStoryState('CP01-report-delivered');
   scheduleDay2Transition();
  }
 }
 if(script[current+1]&&!script[current+1].me)receive(id);
 if(id==='nirmala'&&nirmalaCursor>=nirmalaTimeline.length)scheduleDay2RedFolder();
}
/* Morning Brief reply selection. The selected version is the exact message
   the scripted keyboard types, with its consequence saved immediately. */
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-day2-brief-choice]');
 if(!btn||!inScripted()||state.thread!=='adnan')return;
 e.preventDefault();e.stopImmediatePropagation();
 if(day2BriefChoice||adnanTimeline[adnanCursor]?.choiceId!=='day2-brief')return;
 const choice=btn.dataset.day2BriefChoice;
 if(!Object.prototype.hasOwnProperty.call(DAY2_BRIEF_REPLY_OPTIONS,choice))return;
 day2BriefChoice=choice;
 adnanTimeline[adnanCursor]={...adnanTimeline[adnanCursor],text:DAY2_BRIEF_REPLY_OPTIONS[choice],choicePending:false};
 const response=adnanTimeline[adnanCursor+1];
 if(response?.choiceResponse==='day2-brief'){
  response.text=choice==='safety'
   ?'Ya. Pisahkan catatan ancaman dari berkas klien. Kita bahas langkah perlindungan setelah briefing pukul 09.00.'
   :'Good. Kirimkan daftar ketidaksesuaian, bukan kesimpulan. Kita bahas pukul 09.00.';
 }
 // Selecting a branching answer is an intentional player action and
 // also arms the same auto-send loop for the remainder of this thread.
 adnanAutoplayStarted=true;
 saveStoryState('CP02-brief-decision');
 render();
 beginAutoType();
},true);

document.addEventListener('click',e=>{
 if(e.target.closest('#chat-input')&&inScripted()){
   e.preventDefault();e.stopImmediatePropagation();
   if(inHarley()){
     if(!harleyAutoplayStarted){
       harleyAutoplayStarted=true;
       saveStoryState('harley-started');
       beginAutoType();
     }
     return;
   }
   if(state.thread==='adnan'){
     if(!adnanAutoplayStarted){
       adnanAutoplayStarted=true;
       saveStoryState('adnan-autotype-started');
     }
     beginAutoType();
     return;
   }
   if(state.thread==='nirmala'){
     if(!nirmalaAutoplayStarted){
       nirmalaAutoplayStarted=true;
       saveStoryState('nirmala-autotype-started');
     }
     beginAutoType();
     return;
   }
   beginAutoType();
 }
},true);

document.addEventListener('click',e=>{
 if(!inScripted())return;
 const k=e.target.closest('[data-au-key]');
 if(k){
   e.preventDefault();e.stopImmediatePropagation();
   if((inHarley()&&harleyAutoplayStarted)
     ||(state.thread==='adnan'&&adnanAutoplayStarted)
     ||(state.thread==='nirmala'&&nirmalaAutoplayStarted))return;
   auArmKeyboardAudio();
   const c=k.dataset.auKey;
   auKeyFeedback(c,true);
   if(c==='return'&&ready){sendScripted();return}
   if(!typing&&!ready)beginAutoType();
 }
},true);

document.addEventListener('submit',e=>{
 if(e.target.id==='chat-form'&&inScripted()){
   e.preventDefault();e.stopImmediatePropagation();
   if((inHarley()&&harleyAutoplayStarted)
     ||(state.thread==='adnan'&&adnanAutoplayStarted))return;
   sendScripted();
 }
},true);

// The index.html Notes editor writes personal Notes separately; capture edits
// of the story-created incident note into the independent story checkpoint.
document.addEventListener('submit',e=>{
 if(e.target&&e.target.id==='note-form')setTimeout(()=>saveStoryState('note-edited'),0);
});
window.addEventListener('pagehide',()=>saveStoryState('page-exit'));

/* CHAPTER 02.2 — FILES APP IMPLEMENTATION
   iOS-inspired interactive file browser rendered entirely on-device.
   Fictional case documents are browser previews, not claims about real litigation. */
const nakulaFilesDocs=Object.freeze([
 {id:'approval',name:'AMDAL_Approval_Final.pdf',kind:'PDF Document',size:'1.8 MB',folder:'PBK Group',icon:'pdf',
  title:'PBK GROUP · PERSETUJUAN LINGKUNGAN',badge:'SALINAN YANG DISERAHKAN',
  metadata:[['Document date','15 October 2026'],['Signature field','Jenoah Pangestu'],['Pages','7'],['File source','Vendor insurance attachment']],
  body:[
   ['JUDUL','Persetujuan Lingkungan / Operasional Area Zona B'],
   ['Nomor referensi','PBK-ENV/ZB/10-2026/041'],
   ['Tanggal tertulis','15 Oktober 2026'],
   ['Pihak terkait','PBK Group · Divisi Operasional'],
   ['Nama penanda tangan','Jenoah Pangestu'],
   ['Keterangan','Dokumen ini tercatat sebagai persetujuan aktivitas di Zona B. Salinan diperoleh melalui lampiran email vendor logistik kepada pihak asuransi.'],
   ['CATATAN PEMERIKSAAN','Tanggal yang tercetak perlu dibandingkan dengan waktu penandatanganan elektronik yang tercantum dalam laporan terpisah.']
  ]},
 {id:'revision',name:'AMDAL_Approval_Rev.pdf',kind:'PDF Document',size:'1.5 MB',folder:'PBK Group',icon:'pdf',
  title:'PBK GROUP · RIWAYAT REVISI',badge:'SALINAN PEMBANDING',
  metadata:[['Document date','15 October 2026'],['Revision','Revision B'],['Pages','5'],['Integrity','Pending validation']],
  body:[['JUDUL','Lembar Revisi Persetujuan Lingkungan'],['Dokumen','PBK-ENV/ZB/10-2026/041 · Rev. B'],['Tanggal tercantum','15 Oktober 2026'],['Catatan','Penomoran dan tanggal tercetak tidak serta-merta menunjukkan kapan berkas digital ditandatangani.'],['STATUS','Perbandingan terhadap salinan dari pihak asuransi masih berlangsung.']]},
 {id:'vendor',name:'Vendor_Insurance_Email.pdf',kind:'PDF Document',size:'930 KB',folder:'PBK Group',icon:'pdf',
  title:'EMAIL FORWARDED · VENDOR / INSURER',badge:'SOURCE RECORD',
  metadata:[['Email received','21 October 2026'],['Recipient','Claims Team · Heavy Equipment Insurer'],['Pages','3'],['Chain of custody','Documented by forensic team']],
  body:[['SUBJECT','Documentation for equipment damage claim · Zona B'],['FROM','Logistics Partner · Kalimantan Operations'],['TO','Insurance Claims Team'],['REFERENCE','PBK operational environmental-approval attachment'],['SUMMARY','Vendor meneruskan salinan dokumen AMDAL sebagai kelengkapan klaim asuransi peralatan. Salinan tersimpan pada penerima di luar sistem PBK.'],['NOTE','Identitas individu dan keaslian email masih memerlukan validasi formal.']]},
 {id:'signature',name:'Digital_Signature_Report.pdf',kind:'PDF Document',size:'420 KB',folder:'PBK Group',icon:'pdf',
  title:'DIGITAL SIGNATURE · INITIAL ANALYSIS',badge:'FORENSIC REVIEW',
  metadata:[['Visible document date','15 October 2026'],['Detected signature time','20 October 2026 · 02:00 WIB'],['Zona B incident','18 October 2026'],['Status','Discrepancy found · expert review pending']],
  body:[['FILE','AMDAL_Approval_Final.pdf'],['DATE PRINTED ON DOCUMENT','15 OCT 2026'],['OBSERVED SIGNATURE TIMESTAMP','20 OCT 2026 · 02:00 WIB'],['DATE OF ZONA B LANDSLIDE','18 OCT 2026'],['DIFFERENCE','Signature timestamp appears 2 days after the incident and 5 days after the date printed on the document.'],['PRELIMINARY FINDING','Ketidaksesuaian waktu teridentifikasi. Belum cukup untuk menyimpulkan pemalsuan atau atribusi pelaku tanpa validasi tanda tangan digital dan pemeriksaan ahli.']]},
 {id:'chronology',name:'Zona_B_Chronology.pdf',kind:'PDF Document',size:'680 KB',folder:'PBK Group',icon:'pdf',
  title:'ZONA B · CASE CHRONOLOGY',badge:'CONFIDENTIAL · WORKING DRAFT',
  metadata:[['Case','Zona B · PBK Group'],['Incident','18 October 2026'],['Prepared for','Adnan W. · Nakula Shankara Bumi'],['Status','Attorney work product']],
  body:[['15 OCT','Tanggal persetujuan yang tertulis pada salinan AMDAL.'],['18 OCT','Peristiwa longsor di area Zona B.'],['20 OCT · 02:00','Waktu tanda tangan yang terdeteksi pada hasil pemeriksaan awal.'],['21 OCT','Salinan dokumen terkirim ke pihak asuransi oleh vendor logistik.'],['26 OCT','Nirmala dan tim forensik mengidentifikasi ketidaksesuaian dalam salinan yang diterima.']]}
]);

/* Dynamic chapter documents are not merged into the original five evidence
   files until the story unlocks their contents. This prevents spoilers. */
function nakulaAdditionalDocs(){
 const files=[];
 if(day2CaseBriefAvailable())files.push({
  id:'casebrief',name:'CASE_BRIEF_PBK.pdf',kind:'PDF Document',size:'640 KB',folder:'PBK Group',
  title:'CASE BRIEF · ZONA B',badge:'ATTORNEY WORK PRODUCT · 09.00',
  metadata:[['Prepared for','Adnan W. · Managing Partner'],['Prepared by','Nakula Shankara Bumi'],['Date','26 October 2026'],['Review','Internal privileged discussion']],
  body:[
   ['OBJECTIVE','Menentukan apa yang sudah diketahui, apa yang masih perlu diverifikasi, dan langkah pembuktian yang tepat untuk membela korban Zona B.'],
   ['KEY FACTS','Longsor terjadi 18 Oktober. Salinan persetujuan menyebut 15 Oktober. Pemeriksaan awal mendeteksi timestamp tanda tangan 20 Oktober pukul 02.00.'],
   ['EVIDENCE STATUS','Email vendor dan salinan asuransi telah diterima untuk telaah. Keaslian, atribusi tanda tangan, dan rantai penguasaan tetap memerlukan verifikasi.'],
   ['INVESTIGATION PRIORITY',day2CaseBriefSummary()],
   ['INCIDENT CALL',unknownInterrupted?'Panggilan berulang dengan nada lebih agresif dicatat secara terpisah. Identitas penelpon belum diverifikasi.':'Peringatan melalui telepon dicatat secara terpisah. Identitas penelpon belum diverifikasi.'],
   ['RECOMMENDATION','Jaga salinan asli, lakukan pemeriksaan independen, dan konsultasikan strategi serta kebutuhan praktis keluarga korban sebelum mengambil tindakan.']
  ]
 });
 if(day2FamiliesReceived)files.push(
  {id:'family_statements',name:'Zona_B_Family_Statements.pdf',kind:'PDF Document',size:'520 KB',folder:'PBK Group',
   title:'ZONA B · FAMILY & WITNESS NOTES',badge:'RESTRICTED · CONSENT REQUIRED',
   metadata:[['Prepared by','Nirmala · Junior Associate'],['Date','26 October 2026'],['Contents','Preliminary statements'],['Status','Awaiting client confirmation']],
   body:[
    ['RANIA · FAMILY MEMBER','Rania menjelaskan bahwa keluarganya masih membutuhkan informasi yang dapat dipercaya mengenai kronologi kejadian dan proses pendampingan. Ia meminta agar perkembangan perkara disampaikan tanpa istilah hukum yang membingungkan.'],
    ['HARUN · COMMUNITY WITNESS','Harun menyampaikan ingatan awal tentang aktivitas dan kondisi akses menuju Zona B sebelum kejadian. Waktu tepatnya belum diverifikasi dengan rekaman atau catatan lapangan.'],
    ['FAMILY PRIORITIES','Komunikasi berkala, penjelasan mengenai pilihan hukum, dan tindak lanjut kebutuhan mendesak. Persetujuan klien diperlukan sebelum membagikan kesaksian.'],
    ['LEGAL CAUTION','Catatan ini adalah informasi awal dan belum merupakan pernyataan saksi terverifikasi. Jangan memublikasikan identitas atau menyimpulkan tanggung jawab dari catatan ini saja.']
   ]},
  {id:'family_intake',name:'Client_Contact_Plan.pdf',kind:'PDF Document',size:'340 KB',folder:'PBK Group',
   title:'CLIENT RELATIONS · FAMILY CONTACT PLAN',badge:'CONFIDENTIAL · INTERNAL',
   metadata:[['Responsible','Nakula · Nirmala'],['Date','26 October 2026'],['Classification','Privileged client intake'],['Status','Consent and follow-up pending']],
   body:[
    ['OUTREACH','Tawarkan waktu percakapan yang disepakati keluarga. Sampaikan tujuan wawancara, kerahasiaan, dan pilihan untuk tidak menjawab pertanyaan tertentu.'],
    ['PRACTICAL NEEDS','Dengarkan kebutuhan keselamatan, akses informasi, dokumen, dan dukungan darurat. Pisahkan permintaan ini dari evaluasi peluang menang di pengadilan.'],
    ['EVIDENCE CARE','Konfirmasi kronologi, identitas sumber, lokasi, dan waktu secara sukarela. Hindari pertanyaan yang menggiring jawaban.'],
    ['NEXT STEP','Rumuskan prioritas tindak lanjut bersama klien sebelum menggunakan pernyataan dalam berkas resmi.']
   ]}
 );
 if(day2FamilyPriority)files.push({
  id:'family_action',name:'Family_Followup_Plan.pdf',kind:'PDF Document',size:'230 KB',folder:'PBK Group',
  title:'ZONA B · FOLLOW-UP STRATEGY',badge:'WORKING PLAN · 10.20',
  metadata:[['Priority',day2FamilyPriority==='consult'?'Consult with families':'Corroborate witness statements'],['Date','26 October 2026'],['Lead','Nakula · Nirmala']],
  body:[
   ['DECISION',day2FamilyPriority==='consult'?'Mendahulukan konsultasi keluarga untuk menyepakati kebutuhan dan persetujuan penggunaan informasi.':'Mendahulukan verifikasi independen atas waktu dan lokasi dalam kesaksian, dengan persetujuan keluarga.'],
   ['SAFEGUARDS','Kebutuhan mendesak klien tetap dicatat; kesaksian tidak boleh dibagikan tanpa izin dan tidak dianggap final tanpa pemeriksaan.'],
   ['STATUS','Rencana tindak lanjut telah dikirim kepada Nirmala. Penilaian perkara dan keputusan hukum berikutnya masih menunggu dokumen tambahan.']
  ]
 });
 return files;
}
function nakulaFilesAvailableDocs(){return [...nakulaFilesDocs,...nakulaAdditionalDocs()]}

let nakulaFilesPath='root',nakulaFilesTab='browse',nakulaFilesDocId=null,nakulaFilesInfo=false;
let day2ReadFileIds=new Set();
const nakulaFilesReady=()=>day2Stage!=='none'&&!currentStoryEnding;
function ensureNakulaFilesIcon(){
 const grid=$au('apps-grid');
 if(!grid)return;
 const existing=grid.querySelector('[data-app="files"]');
 if(!nakulaFilesReady()){
  if(existing)existing.remove();
  return;
 }
 if(existing)return;
 const btn=document.createElement('button');
 btn.type='button';btn.className='app-button nakula-files-app-button';
 btn.dataset.app='files';btn.setAttribute('aria-label','Open Files');
 btn.innerHTML='<span class="app-icon icon-files"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="9" width="54" height="46" rx="12" fill="#fff"/><path d="M13 21h38v26H13z" fill="#f7faff"/><path d="M12 22h17l5-5h18c3 0 5 2 5 5v26c0 3-2 5-5 5H12c-3 0-5-2-5-5V27c0-3 2-5 5-5Z" fill="#438cf4"/><path d="M12 22h17l5-5h18" fill="none" stroke="#78b3ff" stroke-width="2.5"/></svg></span><span class="app-name">Files</span>';
 grid.appendChild(btn);
}
function nakulaFilesEsc(v){return esc(v)}
function nakulaFilesRow(doc){
 const read=day2ReadFileIds.has(doc.id);
 return '<button class="nakula-files-row'+(read?' is-read':'')+'" type="button" data-nakula-file="'+doc.id+
  '" aria-label="'+nakulaFilesEsc(doc.name)+(read?', already read':', unread')+'">'+
 '<span class="nakula-files-doc-icon" aria-hidden="true">PDF</span>'+
 '<span class="nakula-files-row-copy"><strong>'+nakulaFilesEsc(doc.name)+'</strong><small>'+doc.kind+' · '+doc.size+'</small></span>'+
 (read?'<span class="nakula-files-read-indicator" aria-hidden="true">✓ Read</span>':'')+
 '<span class="nakula-files-chevron" aria-hidden="true">›</span></button>';
}
function nakulaFilesFolder(id,name,details){
 return '<button type="button" class="nakula-files-folder" data-nakula-folder="'+id+'">'+
 '<span class="nakula-files-folder-icon"><svg viewBox="0 0 28 25"><path d="M2 6a4 4 0 0 1 4-4h6l3 3h7a4 4 0 0 1 4 4v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="currentColor"/></svg></span>'+
 '<span><strong>'+nakulaFilesEsc(name)+'</strong><small>'+nakulaFilesEsc(details)+'</small></span>'+
 '<span class="nakula-files-chevron">›</span></button>';
}
function renderNakulaFilesApp(){
 if(!nakulaFilesReady()){goHome();return}
 const head=$au('app-header'),content=$au('app-content');
 if(!head||!content)return;
 $au('app-screen').classList.remove('in-conversation');
 content.style.padding='0';content.style.overflowY='auto';content.style.overflow='auto';
 const root=nakulaFilesPath==='root';
 const detail=nakulaFilesPath==='document';
 const current=nakulaFilesAvailableDocs().find(d=>d.id===nakulaFilesDocId);
 const title=detail?'Quick Look':root?'Files':nakulaFilesPath==='pbk'?'PBK Group':nakulaFilesPath==='downloads'?'Downloads':'Personal';
 head.innerHTML='<button type="button" class="plain-btn nakula-files-nav-back" data-nakula-files-back>‹ <span>'+
 (detail?'PBK Group':root?'Home':'Browse')+'</span></button><span class="app-title">'+title+'</span>'+
 '<span class="nakula-files-head-right">'+(detail?'<button type="button" data-nakula-files-info aria-label="Get Info">ⓘ</button>':'')+'</span>';
 let body='';
 if(detail&&current){
  body='<div class="nakula-files-preview">'+
   '<div class="nakula-files-preview-top"><span class="nakula-files-doc-icon">PDF</span><div><strong>'+nakulaFilesEsc(current.name)+'</strong><small>'+current.size+' · Local preview</small></div></div>'+
   (nakulaFilesInfo?
    '<section class="nakula-files-info"><h2>Information</h2>'+current.metadata.map(([k,v])=>
      '<div class="nakula-files-info-row"><span>'+nakulaFilesEsc(k)+'</span><strong>'+nakulaFilesEsc(v)+'</strong></div>').join('')+
     '<p>These are case-story documents. Dates and metadata are fictional and provided for investigation gameplay.</p></section>':
    '<article class="nakula-files-sheet"><div class="nakula-files-watermark">PBK GROUP · CASE MATERIALS</div><div class="nakula-files-sheet-label">'+nakulaFilesEsc(current.badge)+'</div>'+
     '<h2>'+nakulaFilesEsc(current.title)+'</h2><div class="nakula-files-sheet-rule"></div>'+
     current.body.map(([k,v])=>'<div class="nakula-files-field"><strong>'+nakulaFilesEsc(k)+'</strong><p>'+nakulaFilesEsc(v)+'</p></div>').join('')+
    '<div class="nakula-files-sheet-footer">REVIEW COPY · LEGAL CASE FILE</div></article>')+
   '<div class="nakula-files-actions"><button type="button" data-nakula-files-info>'+ (nakulaFilesInfo?'Back to Preview':'Get Info')+'</button>'+
    (current.id==='casebrief'&&day2CaseBriefRead&&!day2BriefingDone
     ?'<button type="button" data-nakula-files-start-briefing>Mulai Briefing</button>'
     :'<button type="button" data-nakula-files-back>Back to PBK Group</button>')+'</div></div>';
 }else if(nakulaFilesPath==='pbk'){
  body='<div class="nakula-files-browser"><div class="nakula-files-kicker">ON MY IPHONE / CASES</div>'+
   '<h1>PBK Group</h1>'+
   (day2FilesReceived?
    '<p class="nakula-files-help">Shared by Nirmala · 26 Oct 2026</p><div class="nakula-files-document-list">'+nakulaFilesAvailableDocs().map(nakulaFilesRow).join('')+'</div>'+
    (day2FamiliesReceived
     ?(!day2FamilyDocsReady()?'<p class="nakula-files-tip">Review Zona_B_Family_Statements.pdf and Client_Contact_Plan.pdf to understand the families’ needs.</p>':'')
     :day2CaseBriefAvailable()
       ?(!day2CaseBriefRead?'<p class="nakula-files-tip">Open CASE_BRIEF_PBK.pdf before the 09.00 briefing.</p>':'')
       :!day2FilesReviewed()?'<p class="nakula-files-tip">Open AMDAL_Approval_Final.pdf and Digital_Signature_Report.pdf to compare the dates.</p>':''):
    '<div class="nakula-files-empty"><div>◌</div><strong>No documents yet</strong><span>Nirmala will send the case materials to this folder.</span></div>')+'</div>';
 }else if(nakulaFilesPath==='downloads'||nakulaFilesPath==='personal'){
  body='<div class="nakula-files-browser"><div class="nakula-files-kicker">ON MY IPHONE</div>'+
   '<h1>'+(nakulaFilesPath==='downloads'?'Downloads':'Personal')+'</h1>'+
   '<div class="nakula-files-empty"><div>◌</div><strong>Nothing here</strong><span>No files in this folder.</span></div></div>';
 }else{
  body='<div class="nakula-files-browser"><div class="nakula-files-kicker">ON MY IPHONE</div><h1>'+(nakulaFilesTab==='recents'?'Recents':'Browse')+'</h1>'+
   '<div class="nakula-files-search">⌕ <span>Search</span></div>'+
   (nakulaFilesTab==='recents'?
    (day2FilesReceived?'<div class="nakula-files-section-title">Recently Opened</div>'+nakulaFilesAvailableDocs().slice(-3).map(nakulaFilesRow).join(''):
    '<div class="nakula-files-empty"><div>◷</div><strong>No Recents</strong><span>Your recently opened case files will appear here.</span></div>'):
    '<div class="nakula-files-section-title">Locations</div><div class="nakula-files-location-list">'+
     nakulaFilesFolder('pbk','PBK Group',day2FilesReceived?nakulaFilesAvailableDocs().length+' items':'Waiting for shared documents')+
     nakulaFilesFolder('personal','Personal','On My iPhone')+
     nakulaFilesFolder('downloads','Downloads','On My iPhone')+
    '</div>')+'</div>'+
   '<nav class="nakula-files-tabs" aria-label="Files navigation"><button type="button" data-nakula-files-tab="recents" class="'+(nakulaFilesTab==='recents'?'active':'')+'"><span>◷</span>Recents</button>'+
   '<button type="button" data-nakula-files-tab="browse" class="'+(nakulaFilesTab==='browse'?'active':'')+'"><span>▦</span>Browse</button></nav>';
 }
 const investigationChoice=day2FilesInspectedCore()&&!day2InvestigationChoice&&day2FilesReceived?
  '<section class="nakula-files-decision" role="group" aria-label="Pilihan penyelidikan bukti"><small>07.35 · KEPUTUSAN PERKARA</small><h2>Apa yang harus Nakula lakukan?</h2><p>Kedua pilihan dapat melanjutkan cerita. Pilih pemeriksaan yang diprioritaskan.</p>'+
  '<button type="button" data-nakula-investigation-choice="verify"><strong>Verifikasi Tanda Tangan Digital</strong><span>Periksa sertifikat, timestamp, dan keasliannya</span></button>'+
  '<button type="button" data-nakula-investigation-choice="source"><strong>Telusuri Dokumen Asli</strong><span>Konfirmasi catatan vendor dan pihak asuransi</span></button></section>':'';
 const familyChoice=day2FamilyTaskAvailable()&&!detail?
  '<section class="nakula-family-task-banner"><span>TUGAS BARU · 10.10</span>'+
   '<strong>Tindak Lanjut Keluarga</strong><small>Kedua dokumen telah diperiksa. Pilih langkah berikutnya.</small>'+
   '<button type="button" data-nakula-family-task-open>Pilih Langkah</button></section>':'';
 const chapterNext=day2CaseBriefAvailable()&&!day2BriefingDone&&day2CaseBriefRead&&!detail?
  '<div class="nakula-files-return-bar"><span>✓ Case brief reviewed · 09.00</span><button type="button" data-nakula-calendar-open>Open Calendar Briefing</button></div>':'';
 // Completed tasks belong in the saved story state, not in permanent
 // status bars at the foot of every Files screen.
 const familyNext='';
 const callout=day2FilesReviewed()&&!day2RedFolderDelivered&&!day2BriefingDone&&!detail&&day2FilesReceived?
  '<div class="nakula-files-active-action"><span>Evidence review complete. Continue the conversation.</span><button type="button" data-nakula-files-return>Back to Nirmala’s Chat</button></div>':'';
 content.innerHTML='<div class="nakula-files-screen">'+familyChoice+callout+body+investigationChoice+chapterNext+familyNext+'</div>';
 if(!detail)scheduleDay2FamilyTask();
}
function nakulaOpenFilesDocument(id){
 const doc=nakulaFilesAvailableDocs().find(d=>d.id===id);
 if(!doc||!day2FilesReceived)return;
 nakulaFilesDocId=id;nakulaFilesPath='document';nakulaFilesInfo=false;
 day2ReadFileIds.add(id);
 if(id==='approval')day2FilesInspected.approval=true;
 if(id==='signature')day2FilesInspected.metadata=true;
 if(id==='casebrief')day2CaseBriefRead=true;
 if(id==='family_statements')day2FamilyDocsRead.statements=true;
 if(id==='family_intake')day2FamilyDocsRead.client=true;
 saveStoryState(id==='casebrief'?'CP02-03-case-brief-read':id.startsWith('family_')?'CP02-04-family-document-read':'CP02-files-investigation');
 render();
}
function nakulaReturnToNirmala(){
 // Explicit navigation, rather than relying on a stale in-document action.
 hideDay2FamilyTask();
 nakulaFilesPath='root';nakulaFilesDocId=null;nakulaFilesInfo=false;
 if(state.screen!=='app')return;
 openApp('messages');
 state.thread='nirmala';state.view='convo';
 markNirmalaRead();
 render();
}
function nakulaFilesBack(){
 if(nakulaFilesPath==='document'){nakulaFilesPath='pbk';nakulaFilesDocId=null;nakulaFilesInfo=false;render();return}
 if(nakulaFilesPath!=='root'){nakulaFilesPath='root';render();return}
 goHome();
}
const nakulaPriorBack=back;
back=function(){
 if(state.screen==='app'&&state.app==='files'){nakulaFilesBack();return}
 nakulaPriorBack();
};
document.addEventListener('click',e=>{
 const mentariView=e.target.closest('[data-day2-mentari-view]');
 if(mentariView){e.preventDefault();e.stopImmediatePropagation();openDay2MentariPhoto();return}
 const mentariSave=e.target.closest('[data-day2-mentari-save]');
 if(mentariSave){e.preventDefault();e.stopImmediatePropagation();preserveDay2MentariEvidence();return}
 const taskOpen=e.target.closest('[data-nakula-family-task-open]');
 if(taskOpen){e.preventDefault();e.stopImmediatePropagation();openDay2FamilyTask();return}
 const taskChoice=e.target.closest('[data-nakula-family-task-choice]');
 if(taskChoice){e.preventDefault();e.stopImmediatePropagation();chooseDay2FamilyPriority(taskChoice.dataset.nakulaFamilyTaskChoice);return}
 const taskLater=e.target.closest('[data-nakula-family-task-later]');
 if(taskLater){e.preventDefault();e.stopImmediatePropagation();deferDay2FamilyTask();return}
 const open=e.target.closest('[data-nakula-files-open]');
 if(open){e.preventDefault();e.stopImmediatePropagation();if(nakulaFilesReady()){nakulaFilesPath='pbk';openApp('files')}return}
 const goCalendar=e.target.closest('[data-nakula-calendar-open]');
 if(goCalendar){e.preventDefault();e.stopImmediatePropagation();openApp('calendar');return}
 const showCaseFile=e.target.closest('[data-nakula-calendar-case-file]');
 if(showCaseFile){e.preventDefault();e.stopImmediatePropagation();if(day2CaseBriefAvailable()){nakulaFilesPath='pbk';openApp('files');nakulaOpenFilesDocument('casebrief')}return}
 const briefFromFiles=e.target.closest('[data-nakula-files-start-briefing]');
 if(briefFromFiles&&state.screen==='app'&&state.app==='files'){
  e.preventDefault();e.stopImmediatePropagation();
  if(day2CaseBriefRead&&!day2BriefingDone){
   // Enter the meeting directly, without an intermediate Calendar tap.
   hideDay2FamilyTask();
   day2CalendarBriefOpen=true;
   window.nakulaNarrativeClock.set(9,0,1);
   nakulaFilesPath='pbk';nakulaFilesDocId=null;nakulaFilesInfo=false;
   saveStoryState('CP02-03-briefing-opened');
   openApp('calendar');
   render();
  }
  return;
 }
 const startBrief=e.target.closest('[data-nakula-calendar-briefing]');
 if(startBrief&&state.app==='calendar'&&day2CaseBriefRead&&!day2BriefingDone){
  e.preventDefault();e.stopImmediatePropagation();day2CalendarBriefOpen=true;render();return;
 }
 const finishBrief=e.target.closest('[data-nakula-calendar-finish]');
 if(finishBrief&&state.app==='calendar'){e.preventDefault();e.stopImmediatePropagation();finishDay2CalendarBriefing();return}
 const openFamily=e.target.closest('[data-nakula-calendar-families], [data-nakula-family-files-open]');
 if(openFamily){
  e.preventDefault();e.stopImmediatePropagation();
  if(day2FamiliesReceived){nakulaFilesPath='pbk';openApp('files')}
  return;
 }
 const chooseFamily=e.target.closest('[data-nakula-family-choice]');
 if(chooseFamily&&state.app==='files'){
  e.preventDefault();e.stopImmediatePropagation();chooseDay2FamilyPriority(chooseFamily.dataset.nakulaFamilyChoice);return;
 }
 const familyReturn=e.target.closest('[data-nakula-family-return]');
 if(familyReturn){e.preventDefault();e.stopImmediatePropagation();nakulaReturnToNirmala();return}
 const choice=e.target.closest('[data-nakula-investigation-choice]');
 if(choice&&state.screen==='app'&&state.app==='files'){
  e.preventDefault();e.stopImmediatePropagation();
  selectDay2Investigation(choice.dataset.nakulaInvestigationChoice);
  return;
 }
 const returnToNirmala=e.target.closest('[data-nakula-files-return]');
 if(returnToNirmala){e.preventDefault();e.stopImmediatePropagation();nakulaReturnToNirmala();return}
 if(state.screen!=='app'||state.app!=='files')return;
 const folder=e.target.closest('[data-nakula-folder]');
 if(folder){e.preventDefault();e.stopImmediatePropagation();nakulaFilesPath=folder.dataset.nakulaFolder;render();return}
 const row=e.target.closest('[data-nakula-file]');
 if(row){e.preventDefault();e.stopImmediatePropagation();nakulaOpenFilesDocument(row.dataset.nakulaFile);return}
 if(e.target.closest('[data-nakula-files-info]')){e.preventDefault();e.stopImmediatePropagation();nakulaFilesInfo=!nakulaFilesInfo;render();return}
 const tab=e.target.closest('[data-nakula-files-tab]');
 if(tab){e.preventDefault();e.stopImmediatePropagation();nakulaFilesTab=tab.dataset.nakulaFilesTab;nakulaFilesPath='root';render();return}
 if(e.target.closest('[data-nakula-files-back]')){e.preventDefault();e.stopImmediatePropagation();nakulaFilesBack()}
},true);

document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&day2FamilyTaskModal&&!day2FamilyTaskModal.hidden){
  e.preventDefault();deferDay2FamilyTask();
 }
});
initializeStorySave();
})();