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
let harleyUnread=true,adnanUnread=false,unknownUnread=false;
let keyboardVisible=false,keyboardSoundEnabled=true,keyboardAudioContext=null,lastKeyFeedback=0,typingRun=0;
let harleyAutoplayStarted=false,harleyNextTimer=null,harleyAutoSendTimer=null;
const inHarley=()=>state.screen==='app'&&state.app==='messages'&&state.view==='convo'&&state.thread==='harley';
const inScripted=()=>state.screen==='app'&&state.app==='messages'&&state.view==='convo'&&['harley','adnan','unknown'].includes(state.thread);
const activeTimeline=()=>state.thread==='unknown'?unknownTimeline:state.thread==='adnan'?adnanTimeline:timeline;
const activeIndex=()=>state.thread==='unknown'?unknownCursor:state.thread==='adnan'?adnanCursor:cursor;
const setIndex=(id,i)=>{if(id==='unknown')unknownCursor=i;else if(id==='adnan')adnanCursor=i;else cursor=i};
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
 const count=Number(harleyUnread)+Number(adnanUnread)+Number(unknownUnread);
 unreadBadge.textContent=String(count);
 unreadBadge.setAttribute('aria-label',count+' unread messages');
 unreadBadge.classList.toggle('is-hidden',!count||state.screen==='lock');
}
function markHarleyRead(){
 harleyUnread=false;
 hideNotif();
 syncHarleyBadge();
}
function markAdnanRead(){
 adnanUnread=false;
 hideNotif();
 syncHarleyBadge();
}
function markUnknownRead(){
 unknownUnread=false;
 hideNotif();
 syncHarleyBadge();
}
function setNotification(id){
 const t=threadById(id);
 if(!t)return;
 notif.dataset.thread=id;
 notif.querySelector('strong').textContent=t.name;
 notif.querySelector('.harley-au-notif-body span:last-child > span').textContent=t.messages[0]?.text||'';
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
 if(id==='adnan')markAdnanRead();else if(id==='unknown')markUnknownRead();else markHarleyRead();
 openApp('messages');state.thread=id;state.view='convo';render();
}
notif.querySelector('.harley-au-notif-body').addEventListener('click',()=>openStoryThread(notif.dataset.thread||'harley'));
notif.querySelector('.harley-au-notif-close').addEventListener('click',hideNotif);

/* Fictional incoming-call sequence following the final Harley message. */
let unknownQueued=false,unknownStage='idle',unknownAttempt=0,unknownInterrupted=false;
let unknownCursor=1,aftermathTriggered=false,adnanIncidentPending=false,phoneRecentsFilter='all',callConnectedAt=0;
const unknownMessageText='Saya rasa peringatan tadi sudah cukup jelas, Pak Nakula. Berhenti mengusut Zona B. Anda masih punya kesempatan untuk mundur.';
const unknownTimeline=[{me:false,time:'23.57',text:unknownMessageText}];
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
  ?'Pak, mohon maaf menghubungi selarut ini. Ada intimidasi terkait perkara Zona B. Penelepon anonim menyebut PBK Group dan meminta penyelidikan dihentikan.'+declinedAdnan+' Saya memutus sambungan pertama, tetapi ia menelepon lagi dengan nada jauh lebih agresif dan menyebut nama lengkap saya. Riwayat panggilan beserta pernyataannya sudah saya catat. Besok pagi saya ingin membahas langkah perlindungan, Pak.'
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
  '<button type="button" class="nakula-call-decline" data-nakula-call="decline" aria-label="Decline call"><span class="nakula-call-icon">✕</span><small>Decline</small></button>'+
  '<button type="button" class="nakula-call-accept" data-nakula-call="accept" aria-label="Answer call"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 2.6 3.5 5.7c-1.8 2.3 1.2 8.1 5.6 12.4 4.4 4.4 10.3 7.4 12.5 5.6l2.9-3.2-5.3-4.1-2.7 2.8c-2.8-1.3-5.3-3.8-6.6-6.6l2.7-2.7-4-5.3Z"/></svg><small>Accept</small></button>'+
 '</div>'+
 '<button type="button" class="nakula-call-hangup" data-nakula-call="hangup" hidden>End call</button>';
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
 // Keep records in memory for this playthrough, not across website visits.
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

function showUnknownCall(){
 if(unknownStage==='answered'||unknownStage==='finished')return;
 // Fictional jump: Harley's 20:26 becomes 23:57 only when the first call arrives.
 // Repeat calls move story time by one minute, regardless of actual waiting.
 if(unknownAttempt===0)window.nakulaNarrativeClock.set(23,57);
 else window.nakulaNarrativeClock.advance(1);
 unknownAttempt++;
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
}
function queueUnknownCall(){
 if(unknownQueued)return;
 unknownQueued=true;
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
 if(action==='decline'&&unknownStage==='ringing'){
  // Every rejection schedules another incoming call; only answering ends the loop.
  recordUnknownCall('Declined');
  clearUnknownTimers();
  callScreen.hidden=true;
  unknownStage='retrying';
  callRetryTimer=setTimeout(showUnknownCall,2000);
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
  callSubtitleTimer=setTimeout(nextUnknownSubtitle,750);
 }else if(action==='hangup'&&unknownStage==='answered')retryUnknownAfterHangup();
});

const oldEnterPIN=enterPasscodeDigit;
enterPasscodeDigit=function(digit){
 const wasLocked=state.screen==='lock';
 oldEnterPIN(digit);
 if(wasLocked&&state.screen==='home'){
   syncHarleyBadge();
   if(unknownUnread){setNotification('unknown');notif.classList.add('show');sound()}
   else showNotif(true);
 }
};
const oldLayer=layer;
layer=function(which){
 oldLayer(which);
 $au('phone').classList.toggle('harley-au-mode',which==='app'&&state.app==='messages');
 if(which!=='home')hideNotif();
 syncHarleyBadge();
};
// A chat read clears the unread badge, including when Harley is opened from the Messages list.
document.addEventListener('click',e=>{
 if(state.screen!=='app'||state.app!=='messages')return;
 const t=e.target.closest('[data-thread]');
 if(!t)return;
 if(t.dataset.thread==='harley')markHarleyRead();
 if(t.dataset.thread==='adnan')markAdnanRead();
 if(t.dataset.thread==='unknown')markUnknownRead();
},true);
const oldOpenApp=openApp;
openApp=function(id){hideNotif();oldOpenApp(id)};
threadMarkup=function(arr){
 return arr.map(t=>{
   const unread=(t.id==='harley'&&harleyUnread)||(t.id==='adnan'&&adnanUnread)||(t.id==='unknown'&&unknownUnread);
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

const oldRender=render;
render=function(){
 $au('phone').classList.toggle('harley-au-mode',state.screen==='app'&&state.app==='messages');
 if(!inHarley()){
   clearTimeout(harleyNextTimer);harleyNextTimer=null;
   clearTimeout(harleyAutoSendTimer);harleyAutoSendTimer=null;
 }
 if(!inScripted()){
   keyboardVisible=false;typingRun++;if(typingTimer)clearTimeout(typingTimer);typing=false;ready=false;
   oldRender();
   if(state.screen==='app'&&state.app==='phone')renderNakulaRecents();
   if(state.screen==='app'&&state.app==='messages'){
     const oldCaption=document.querySelector('#app-content .convo-local');
     if(oldCaption)oldCaption.remove();
   }
   return;
 }
 const thread=threadById(state.thread),script=activeTimeline(),index=activeIndex(),next=script[index],done=!next&&!isReceiving();
 const bubbles=thread.messages.map(m=>'<div class="bubble-row '+(m.me?'me':'them')+'"><div class="bubble" title="'+esc(m.time||'')+'">'+esc(m.text)+'</div></div>').join('');
 const dots=isReceiving()?'<div class="bubble-row them"><div class="bubble harley-au-dots"><i></i><i></i><i></i></div></div>':'';
 const aftermathCta=state.thread==='unknown'&&aftermathTriggered?
  '<div class="nakula-incident-cta"><small>CALL LOG SAVED · NOTE CREATED</small><button type="button" data-au-open-adnan>Message Adnan</button></div>':'';
 const delivered=state.thread==='adnan'&&adnanIncidentPending&&adnanCursor>=adnanTimeline.length?
  '<div class="nakula-message-delivered">Delivered</div>':'';
 const camera='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h4l2-2h6l2 2h4v12H3z"/><circle cx="12" cy="14" r="4"/></svg>';
 const mic='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8"/></svg>';
 const plus='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg>';
 const back='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3 6 12l9 9"/></svg>';
 const video='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2" y="6" width="15" height="12" rx="3"/><path d="M17 10l5-3v10l-5-3"/></svg>';
 const phone='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 3 4 6c-1 2 3 8 6 11s8 5 10 3l1-3-5-3-3 3a18 18 0 0 1-6-6l3-3z"/></svg>';
 const sendArrow='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>';
 $au('app-header').innerHTML='<button class="harley-au-back" data-action="back" aria-label="Back to Messages">'+back+'<span>Messages</span></button><div class="harley-au-head"><span class="harley-au-head-avatar '+esc(thread.id)+'">'+esc(thread.initials)+'</span><span class="harley-au-head-name">'+esc(thread.name)+'<span class="harley-au-chevron">›</span></span></div><div class="harley-au-head-actions"><span aria-label="Video call" role="img">'+video+'</span><span aria-label="Phone call" role="img">'+phone+'</span></div>';
 $au('app-content').innerHTML='<div class="conversation harley-au-conversation'+(keyboardVisible?' keyboard-visible':'')+'"><div class="convo-scroll" id="chat-scroll"><div class="date-divider">Today '+(state.thread==='unknown'?'23.57':state.thread==='adnan'?'18.42':'20.20')+'</div>'+bubbles+dots+delivered+aftermathCta+'</div><form class="convo-foot harley-au-composer'+(ready?' has-reply':'')+'" id="chat-form"><span class="harley-au-plus" aria-hidden="true">'+plus+'</span><div class="harley-au-textbox"><textarea class="chat-input" id="chat-input" rows="1" readonly placeholder="iMessage" aria-label="iMessage"></textarea><span class="harley-au-camera" aria-hidden="true">'+camera+'</span></div><button class="send-btn" type="submit" aria-label="Send message" '+(ready?'':'disabled')+'>'+sendArrow+'</button><span class="harley-au-mic" aria-hidden="true">'+mic+'</span></form>'+auKeyboardMarkup()+'</div>';
 $au('app-screen').classList.add('in-conversation');
 $au('app-content').style.padding='0';$au('app-content').style.overflow='hidden';
 const sc=$au('chat-scroll');if(sc)sc.scrollTop=sc.scrollHeight;
 if(inHarley())scheduleHarleyReply();
};
function beginAutoType(){
 if(!inScripted()||isReceiving())return;
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
    if(inHarley()&&harleyAutoplayStarted&&currentRun===typingRun){
      clearTimeout(harleyAutoSendTimer);
      harleyAutoSendTimer=setTimeout(()=>{
        harleyAutoSendTimer=null;
        if(inHarley()&&!typing&&ready&&timeline[cursor]===message)sendScripted();
      },620);
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
  const script=id==='unknown'?unknownTimeline:id==='adnan'?adnanTimeline:timeline;
  const current=id==='unknown'?unknownCursor:id==='adnan'?adnanCursor:cursor;
  const next=script[current];
  if(!next||next.me){
   incomingThread=null;
   if(inScripted()&&state.thread===id)render();
   if(id==='harley'&&current>=script.length)queueUnknownCall();
   return;
  }
  if(id==='harley')window.nakulaNarrativeClock.syncMessage(next.time);
  const thread=threadById(id);
  thread.messages.push({...next});thread.date=next.time;setIndex(id,current+1);
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
 if(!m?.me)return;
 typingRun++;clearTimeout(typingTimer);keyboardVisible=false;
 if(id==='harley')window.nakulaNarrativeClock.syncMessage(m.time);
 const thread=threadById(id);thread.messages.push({...m});thread.date=m.time;
 setIndex(id,current+1);ready=false;render();
 if(id==='adnan'&&adnanIncidentPending&&adnanCursor>=adnanTimeline.length){
  const idx=threads.findIndex(t=>t.id==='adnan');
  if(idx>0)threads.unshift(...threads.splice(idx,1));
 }
 if(script[current+1]&&!script[current+1].me)receive(id);
}
document.addEventListener('click',e=>{
 if(e.target.closest('#chat-input')&&inScripted()){
   e.preventDefault();e.stopImmediatePropagation();
   if(inHarley()){
     if(!harleyAutoplayStarted){
       harleyAutoplayStarted=true;
       beginAutoType();
     }
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
   if(inHarley()&&harleyAutoplayStarted)return;
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
   if(inHarley()&&harleyAutoplayStarted)return;
   sendScripted();
 }
},true);
})();