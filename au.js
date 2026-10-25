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
let cursor=1,typing=false,ready=false,incoming=false,typingTimer=null,audioContext=null;
let harleyUnread=true;
let keyboardVisible=false,keyboardSoundEnabled=true,keyboardAudioContext=null,lastKeyFeedback=0,typingRun=0;
const inHarley=()=>state.screen==='app'&&state.app==='messages'&&state.view==='convo'&&state.thread==='harley';
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
 unreadBadge.classList.toggle('is-hidden',!harleyUnread||state.screen==='lock');
}
function markHarleyRead(){
 harleyUnread=false;
 hideNotif();
 syncHarleyBadge();
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
 notif.classList.add('show');
 if(play)sound();
}
function openHarley(){
 if(state.screen!=='home'&&state.screen!=='app')return;
 markHarleyRead();
 openApp('messages');
 state.thread='harley';state.view='convo';render();
}
notif.querySelector('.harley-au-notif-body').addEventListener('click',openHarley);
notif.querySelector('.harley-au-notif-close').addEventListener('click',hideNotif);
const oldEnterPIN=enterPasscodeDigit;
enterPasscodeDigit=function(digit){
 const wasLocked=state.screen==='lock';
 oldEnterPIN(digit);
 if(wasLocked&&state.screen==='home'){
   syncHarleyBadge();
   showNotif(true);
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
 if(e.target.closest('[data-thread="harley"]')&&state.screen==='app'&&state.app==='messages'){
   markHarleyRead();
 }
},true);
const oldOpenApp=openApp;
openApp=function(id){hideNotif();oldOpenApp(id)};
threadMarkup=function(arr){
 return arr.map(t=>'<button class="thread" data-thread="'+esc(t.id)+'"><span class="avatar harley-au-avatar '+esc(t.id)+'">'+esc(t.initials)+'</span><span class="thread-main"><span class="thread-line"><span class="thread-name">'+esc(t.name)+'</span><span class="thread-date">'+esc(t.date)+'</span></span><span class="thread-preview">'+esc(t.messages[t.messages.length-1]?.text||t.role)+'</span><span class="harley-au-role">'+esc(t.role)+'</span></span><span class="thread-arrow">›</span></button>').join('');
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

const oldRender=render;
render=function(){
 $au('phone').classList.toggle('harley-au-mode',state.screen==='app'&&state.app==='messages');
 if(!inHarley()){
   keyboardVisible=false;typingRun++;if(typingTimer)clearTimeout(typingTimer);typing=false;ready=false;
   oldRender();
   if(state.screen==='app'&&state.app==='messages'){
     const oldCaption=document.querySelector('#app-content .convo-local');
     if(oldCaption)oldCaption.remove();
   }
   return;
 }
 const thread=threads[0],next=timeline[cursor],done=!next&&!incoming;
 const bubbles=thread.messages.map(m=>'<div class="bubble-row '+(m.me?'me':'them')+'"><div class="bubble" title="'+esc(m.time||'')+'">'+esc(m.text)+'</div></div>').join('');
 const dots=incoming?'<div class="bubble-row them"><div class="bubble harley-au-dots"><i></i><i></i><i></i></div></div>':'';
 const camera='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h4l2-2h6l2 2h4v12H3z"/><circle cx="12" cy="14" r="4"/></svg>';
 const mic='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8"/></svg>';
 const plus='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg>';
 const back='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3 6 12l9 9"/></svg>';
 const video='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2" y="6" width="15" height="12" rx="3"/><path d="M17 10l5-3v10l-5-3"/></svg>';
 const phone='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 3 4 6c-1 2 3 8 6 11s8 5 10 3l1-3-5-3-3 3a18 18 0 0 1-6-6l3-3z"/></svg>';
 const sendArrow='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>';
 $au('app-header').innerHTML='<button class="harley-au-back" data-action="back" aria-label="Back to Messages">'+back+'<span>Messages</span></button><div class="harley-au-head"><span class="harley-au-head-avatar">HM</span><span class="harley-au-head-name">Harley Mahira<span class="harley-au-chevron">›</span></span></div><div class="harley-au-head-actions"><span aria-label="Video call" role="img">'+video+'</span><span aria-label="Phone call" role="img">'+phone+'</span></div>';
 $au('app-content').innerHTML='<div class="conversation harley-au-conversation'+(keyboardVisible?' keyboard-visible':'')+'"><div class="convo-scroll" id="chat-scroll"><div class="date-divider">Today 20.20</div>'+bubbles+dots+'</div><form class="convo-foot harley-au-composer'+(ready?' has-reply':'')+'" id="chat-form"><span class="harley-au-plus" aria-hidden="true">'+plus+'</span><div class="harley-au-textbox"><textarea class="chat-input" id="chat-input" rows="1" readonly placeholder="iMessage" aria-label="iMessage"></textarea><span class="harley-au-camera" aria-hidden="true">'+camera+'</span></div><button class="send-btn" type="submit" aria-label="Send message" '+(ready?'':'disabled')+'>'+sendArrow+'</button><span class="harley-au-mic" aria-hidden="true">'+mic+'</span></form>'+auKeyboardMarkup()+'</div>';
 $au('app-screen').classList.add('in-conversation');
 $au('app-content').style.padding='0';$au('app-content').style.overflow='hidden';
 const sc=$au('chat-scroll');if(sc)sc.scrollTop=sc.scrollHeight;
};
function beginAutoType(){
 if(!inHarley()||incoming)return;
 const message=timeline[cursor];if(!message?.me)return;
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
  if(currentRun!==typingRun||!inHarley()){typing=false;return}
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
  }
 }
 typingTimer=setTimeout(step,175);
}
function receive(){
 if(incoming)return;incoming=true;if(inHarley())render();
 function one(){
  const next=timeline[cursor];
  if(!next||next.me){incoming=false;if(inHarley())render();return}
  threads[0].messages.push({...next});cursor++;
  if(inHarley()){render();sound()}
  setTimeout(one,next.text.length>160?1800:1250);
 }
 setTimeout(one,1550);
}
function sendScripted(){
 if(!inHarley())return;
 if(typing){clearTimeout(typingTimer);typing=false;ready=true}
 if(!ready){beginAutoType();return}
 const m=timeline[cursor];if(!m?.me)return;
 typingRun++;clearTimeout(typingTimer);keyboardVisible=false;
 threads[0].messages.push({...m});cursor++;ready=false;render();
 if(timeline[cursor]&&!timeline[cursor].me)receive();
}
document.addEventListener('click',e=>{
 if(e.target.closest('#chat-input')&&inHarley()){e.preventDefault();e.stopImmediatePropagation();beginAutoType()}
},true);

document.addEventListener('click',e=>{
 if(!inHarley())return;
 const k=e.target.closest('[data-au-key]');
 if(k){
   e.preventDefault();e.stopImmediatePropagation();
   auArmKeyboardAudio();
   const c=k.dataset.auKey;
   auKeyFeedback(c,true);
   if(c==='return'&&ready){sendScripted();return}
   if(!typing&&!ready)beginAutoType();
 }
},true);

document.addEventListener('submit',e=>{
 if(e.target.id==='chat-form'&&inHarley()){e.preventDefault();e.stopImmediatePropagation();sendScripted()}
},true);
})();