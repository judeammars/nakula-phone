/* Nakula Phone AU: fictional iMessage story and on-screen notification. */
(function(){
'use strict';
const timeline=[{"me":false,"time":"20.20","text":"Na, masih bangun? Need a quick legal perspective buat tulisan editorial gue besok. Off the record kok."},{"me":true,"time":"20.20","text":"Saya sedang drafting defense statement, make it quick. Ada apa?"},{"me":false,"time":"20.21","text":"Ini soal isu PHK massal di anak perusahaan logistik itu. Whistleblower gue di HR mereka bilang, alasan efisiensi itu cuma kedok biar perusahaannya bisa hindarin bayar pesangon secara penuh. Perundingan bipartitnya gagal total kemarin."},{"me":true,"time":"20.21","text":"Typical corporate playbook. Mereka pasti ingin frame situasinya sebagai force majeure atau kerugian finansial berat untuk justify pesangon minim menggunakan aturan baru. Saat bipartit, perusahaannya memberikan audited financial statements tidak, untuk membuktikan kerugian tersebut?"},{"me":false,"time":"20.22","text":"Nggak ada. Press release yang dikirim ke newsroom gue cuma pure PR bullshit. Katanya \"restrukturisasi strategis demi long-term sustainability\", my ass. Kalau serikat pekerjanya mutusin buat ajuin class-action lawsuit, what are their actual odds di pengadilan?"},{"me":true,"time":"20.23","text":"Slim to none, kalau grounds-nya tidak solid. Gugatan perwakilan kelompok di PHI itu exceptionally messy. Serikat pekerjanya harus memegang risalah perundingan bipartit yang gagal itu dulu sebelum mereka bahkan bisa eskalasi ke Disnaker untuk mediasi."},{"me":true,"time":"20.23","text":"Parahnya lagi, kalau perusahaannya sengaja mengajukan PKPU hanya untuk menunda pembayaran pesangon, pekerjanya otomatis akan turun status menjadi kreditur konkuren. It’s a legal bloodbath."},{"me":false,"time":"20.23","text":"Gila........."},{"me":false,"time":"20.24","text":"Jadi mereka secara legal ngeksploitasi loophole buat bikin pekerjanya berdarah-darah."},{"me":false,"time":"20.24","text":"Can I quote you on that? Gue pake anonymous attribution deh, \"Menurut seorang corporate litigator ternama di SCBD...\" 😂"},{"me":true,"time":"20.24","text":"Absolutely not. Do not even try. Saya tidak akan mengambil risiko melanggar conflict of interest policy firma saya hanya untuk scoop kamu, Harley. Keep my existence out of your headline."},{"me":false,"time":"20.25","text":"Chill, man. 🙈"},{"me":false,"time":"20.25","text":"Gue paham kode etik jurnalistik. Gue nggak bakal bakar source gue sendiri. Lagian embargo-nya sampai cetakan cetak besok pagi kok."},{"me":false,"time":"20.25","text":"Btw, lu beneran nggak mau ngasih gue exclusive interview soal kasus tambangnya PBK Group? On the record, kali ini. It would be a massive front-page feature."},{"me":true,"time":"20.26","text":"Harley, saya block ya if this conversation turn into an ambush interview."},{"me":false,"time":"20.26","text":"Oh you won’t."},{"me":false,"time":"20.26","text":"Halo?"},{"me":false,"time":"20.26","text":"Nakula. 🥺"}];

const $au=(id)=>document.getElementById(id);
threads=[
{id:'harley',name:'Harley Mahira',role:'Journalist',initials:'HM',date:'now',messages:[{...timeline[0]}]},
{id:'adnan',name:'Adnan W',role:'Managing Partner',initials:'AW',date:'',messages:[]},
{id:'damar',name:'Mas Damar',role:'HHP',initials:'MD',date:'',messages:[]},
{id:'nirmala',name:'Nirmala',role:'Junior Assoc. AHP',initials:'N',date:'',messages:[]}
];
let cursor=1,typing=false,ready=false,incoming=false,pendingOpen=false,typingTimer=null,audioContext=null;
const inHarley=()=>state.screen==='app'&&state.app==='messages'&&state.view==='convo'&&state.thread==='harley';
const notif=document.createElement('div');notif.id='harley-au-notification';notif.className='harley-au-notification';
notif.innerHTML='<button class="harley-au-notif-body" type="button"><span class="harley-au-notif-icon">●</span><span><small>MESSAGES · now</small><strong>Harley Mahira</strong><span>Na, masih bangun? Need a quick legal perspective buat tulisan editorial gue besok.</span></span></button><button type="button" class="harley-au-notif-close" aria-label="Close notification">×</button>';
$au('phone').appendChild(notif);
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
function showNotif(play=false){if(state.screen==='app')return;notif.classList.add('show');if(play)sound()}
function openHarley(){
 hideNotif();
 if(state.screen==='lock'){pendingOpen=true;requestUnlock();return}
 pendingOpen=false;openApp('messages');state.thread='harley';state.view='convo';render();
}
notif.querySelector('.harley-au-notif-body').addEventListener('click',openHarley);
notif.querySelector('.harley-au-notif-close').addEventListener('click',hideNotif);
const oldEnterPIN=enterPasscodeDigit;
enterPasscodeDigit=function(digit){
 const wasLocked=state.screen==='lock';
 oldEnterPIN(digit);
 if(wasLocked&&state.screen==='home'){
   if(pendingOpen){openHarley();sound()}else showNotif(true);
 }
};
const oldLayer=layer;
layer=function(which){oldLayer(which);$au('phone').classList.toggle('harley-au-mode',which==='app'&&state.app==='messages')};
const oldOpenApp=openApp;
openApp=function(id){hideNotif();oldOpenApp(id)};
threadMarkup=function(arr){
 return arr.map(t=>'<button class="thread" data-thread="'+esc(t.id)+'"><span class="avatar harley-au-avatar '+esc(t.id)+'">'+esc(t.initials)+'</span><span class="thread-main"><span class="thread-line"><span class="thread-name">'+esc(t.name)+'</span><span class="thread-date">'+esc(t.date)+'</span></span><span class="thread-preview">'+esc(t.messages[t.messages.length-1]?.text||t.role)+'</span><span class="harley-au-role">'+esc(t.role)+'</span></span><span class="thread-arrow">›</span></button>').join('');
};
const oldRender=render;
render=function(){
 $au('phone').classList.toggle('harley-au-mode',state.screen==='app'&&state.app==='messages');
 if(!inHarley()){oldRender();return}
 const thread=threads[0],next=timeline[cursor],done=!next&&!incoming;
 const bubbles=thread.messages.map(m=>'<div class="bubble-row '+(m.me?'me':'them')+'"><div class="bubble"><div>'+esc(m.text)+'</div><small class="harley-au-time">'+esc(m.time||'')+(m.me?' ✓✓':'')+'</small></div></div>').join('');
 const dots=incoming?'<div class="bubble-row them"><div class="bubble harley-au-dots"><i></i><i></i><i></i></div></div>':'';
 const place=done?'Conversation complete':incoming?'Harley is typing…':next?.me?'Tap to type Nakula’s reply':'iMessage';
 $au('app-header').innerHTML='<button class="plain-btn" data-action="back"><span class="chev-left">‹</span> Messages</button><div class="harley-au-head"><span class="harley-au-head-avatar">HM</span><span><strong>Harley Mahira</strong><small>iMessage</small></span></div><span class="harley-au-head-icons" aria-hidden="true">▹ ♧</span>';
 $au('app-content').innerHTML='<div class="conversation"><div class="convo-scroll" id="chat-scroll"><div class="date-divider">Today · 20.20</div><div class="harley-au-privacy">🔒 Fictional messages from Nakula’s phone.</div>'+bubbles+dots+'</div><form class="convo-foot" id="chat-form"><button type="button" class="plus-btn" data-action="attach">+</button><textarea class="chat-input" id="chat-input" rows="1" readonly placeholder="'+esc(place)+'" aria-label="Tap to type Nakula’s reply"></textarea><button class="send-btn" type="submit" aria-label="Send scripted reply" '+(ready?'':'disabled')+'>↑</button></form><div class="convo-local">'+(done?'End of this chapter. Refresh to replay.':incoming?'Harley is replying…':'Tap the message field to type Nakula’s reply, then send.')+'</div></div>';
 $au('app-screen').classList.add('in-conversation');
 $au('app-content').style.padding='0';$au('app-content').style.overflow='hidden';
 const sc=$au('chat-scroll');if(sc)sc.scrollTop=sc.scrollHeight;
};
function beginAutoType(){
 if(!inHarley()||typing||incoming||ready)return;
 const message=timeline[cursor];if(!message?.me)return;
 typing=true;let index=0;
 function step(){
  if(!inHarley()){typing=false;return}
  const field=$au('chat-input');if(!field){typing=false;return}
  index=Math.min(message.text.length,index+Math.max(2,Math.ceil(message.text.length/80)));
  field.value=message.text.slice(0,index);
  field.style.height='36px';field.style.height=Math.min(100,Math.max(36,field.scrollHeight))+'px';
  if(index<message.text.length)typingTimer=setTimeout(step,22);
  else{typing=false;ready=true;const btn=document.querySelector('#chat-form .send-btn');if(btn)btn.disabled=false}
 }step();
}
function receive(){
 if(incoming)return;incoming=true;if(inHarley())render();
 function one(){
  const next=timeline[cursor];
  if(!next||next.me){incoming=false;if(inHarley())render();return}
  threads[0].messages.push({...next});cursor++;
  if(inHarley()){render();sound()}
  setTimeout(one,next.text.length>160?1100:750);
 }
 setTimeout(one,950);
}
function sendScripted(){
 if(!inHarley())return;
 if(typing){clearTimeout(typingTimer);typing=false;ready=true}
 if(!ready){beginAutoType();return}
 const m=timeline[cursor];if(!m?.me)return;
 threads[0].messages.push({...m});cursor++;ready=false;render();
 if(timeline[cursor]&&!timeline[cursor].me)receive();
}
document.addEventListener('click',e=>{
 if(e.target.closest('#chat-input')&&inHarley()){e.preventDefault();e.stopImmediatePropagation();beginAutoType()}
},true);
document.addEventListener('submit',e=>{
 if(e.target.id==='chat-form'&&inHarley()){e.preventDefault();e.stopImmediatePropagation();sendScripted()}
},true);
setTimeout(()=>{if(state.screen==='lock')showNotif(false)},1200);
})();