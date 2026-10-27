/* CHAPTER 02.8 — BETWEEN TWO COUNSELS (story scene, before DAY 3).
   Loaded before au.js so the story engine can access the scene state.
   The source image for Damar's avatar was supplied by the creator. */
let day2DamarDelivered=false,day2DamarCursor=0,day2DamarDone=false,damarUnread=false;
let damarAutoplayStarted=false,damarNextTimer=null,damarAutoSendTimer=null,damarFinalTimer=null;
const DAY2_DAMAR_PHOTO='./damar-avatar.svg';
const day2DamarTimeline=[
 {me:false,time:'11.25',dayOffset:1,text:'Nakula. Selamat pagi.'},
 {me:false,time:'11.25',dayOffset:1,text:'Saya baru lihat draft subpoena dari AHP di meja saya pagi ini. Kamu maju sebagai lead counsel warga desa untuk melawan PBK Group? Quite a bold move.'},
 {me:true,time:'11.26',dayOffset:1,text:'Selamat pagi, Mas Damar.'},
 {me:true,time:'11.26',dayOffset:1,text:'Ya, AHP yang memegang representasi untuk kasus tersebut.'},
 {me:false,time:'11.27',dayOffset:1,text:'Saya dengar kamu menargetkan full discovery untuk dokumen AMDAL dan mengincar nama Jenoah Pangestu. Corporate criminal liability, Nakula? Kamu benar-benar mau bawa ini sejauh itu.'},
 {me:false,time:'11.27',dayOffset:1,text:'Waktu kamu masih jadi junior associate saya di HHP dulu, saya tidak pernah mengajari kamu untuk bertindak segabah ini. 😅'},
 {me:true,time:'11.28',dayOffset:1,text:'Mas Damar memang mengajari saya cara membangun pertahanan korporasi yang sempurna. Tapi Columbia mengajari saya cara meruntuhkannya.'},
 {me:true,time:'11.28',dayOffset:1,text:"The approval date and the digital signature timestamp don't match, Mas. Kita berdua tahu itu bukan hal yang bisa diabaikan."},
 {me:false,time:'11.29',dayOffset:1,text:'Hukum bukan tentang apa yang kamu tahu, Na. Tapi tentang apa yang bisa kamu buktikan dengan admissible evidence di pengadilan.'},
 {me:false,time:'11.30',dayOffset:1,text:'My client has unlimited resources. Abian Pangestu tidak akan membiarkan putranya, apalagi perusahaannya, jatuh.'},
 {me:false,time:'11.31',dayOffset:1,text:'Tarik subpoena-nya. Kita bisa selesaikan ini lewat out-of-court settlement. Klien saya bersedia memberikan kompensasi ganti rugi yang sangat layak untuk keluarga korban berdalih good faith.'},
 {me:false,time:'11.31',dayOffset:1,text:'Tolong bersikap realistis. Saya tidak ingin menghancurkan karier mantan associate terbaik saya di meja hijau.'},
 {me:true,time:'11.32',dayOffset:1,text:'Saya tidak mencari uang kompensasi, Mas. Dua nyawa hilang. Saya mencari pertanggungjawaban atas keputusan yang menyebabkan mereka kehilangan nyawa.'},
 {me:true,time:'11.32',dayOffset:1,text:'Saya tidak akan menyetujui penyelesaian apa pun tanpa persetujuan keluarga korban, Mas. Dan selama pertanggungjawaban belum jelas, perkara ini tidak akan saya tutup begitu saja.'},
 {me:false,time:'11.33',dayOffset:1,text:"You haven't changed. Still the stubborn idealist from Leiden. 😂"},
 {me:false,time:'11.34',dayOffset:1,text:'Kalau itu keputusanmu, persiapkan timmu dengan baik. HHP akan menenggelamkan AHP dengan eksepsi, keberatan formil, praperadilan, dan manuver prosedural sampai klienmu kehabisan napas.'},
 {me:false,time:'11.34',dayOffset:1,text:"I won't go easy on you just because I trained you."},
 {me:true,time:'11.35',dayOffset:1,text:'I am counting on it, Mas. See you at the mediation table.'}
];
function ensureDay2DamarContact(){
 let t=threadById('damar');
 if(!t){
  t={id:'damar',name:'Mas Damar. (HHP)',role:'HHP Legal Counsel · Opposing Counsel',initials:'D',date:'11.25',messages:[]};
  threads.unshift(t);
 }else{
  t.name='Mas Damar. (HHP)';t.role='HHP Legal Counsel · Opposing Counsel';t.initials='D';
 }
 return t;
}
function setDay2DamarClock(m){
 const parts=String(m?.time||'').split('.');
 if(parts.length===2){
  const hour=Number(parts[0]),minute=Number(parts[1]);
  if(Number.isInteger(hour)&&Number.isInteger(minute)&&hour===11&&minute>=25&&minute<=35)
   window.nakulaNarrativeClock.set(hour,minute,1);
 }
}
function openDay2DamarChat(){
 if(!day2InvitationOpened||day2Chapter2Completed||day3Stage!=='none')return;
 ensureDay2DamarContact();
 if(!day2DamarDelivered){
  day2DamarDelivered=true;day2DamarCursor=0;
 }
 const ix=threads.findIndex(t=>t.id==='damar');
 if(ix>0)threads.unshift(...threads.splice(ix,1));
 damarAutoplayStarted=true;damarUnread=false;
 saveStoryState('CP02-08-Damar-chat-opened');
 hideDay2OfferNotice();
 openApp('messages');state.view='convo';state.thread='damar';render();
 resumeDay2DamarConversation();
}
function resumeDay2DamarConversation(){
 if(!day2DamarDelivered||day2DamarDone||state.screen!=='app'||state.app!=='messages'
  ||state.view!=='convo'||state.thread!=='damar'||incomingThread)return;
 if(day2DamarCursor>=day2DamarTimeline.length){scheduleDay2DamarFinale();return}
 if(day2DamarTimeline[day2DamarCursor].me)scheduleDamarReply(450);
 else receive('damar');
}
function scheduleDamarReply(delay=650){
 if(!damarAutoplayStarted||!inScripted()||state.thread!=='damar'||incomingThread||
    typing||ready||keyboardVisible||damarNextTimer)return;
 if(!day2DamarTimeline[day2DamarCursor]?.me)return;
 damarNextTimer=setTimeout(()=>{
  damarNextTimer=null;
  if(!inScripted()||state.thread!=='damar'||incomingThread||typing||ready||keyboardVisible)return;
  if(day2DamarTimeline[day2DamarCursor]?.me)beginAutoType();
 },delay);
}
function scheduleDay2DamarFinale(){
 if(day2DamarDone||day2Chapter2Completed||day2DamarCursor<day2DamarTimeline.length||damarFinalTimer)return;
 damarFinalTimer=setTimeout(()=>{
  damarFinalTimer=null;
  if(day2DamarDone||day2Chapter2Completed||day2DamarCursor<day2DamarTimeline.length)return;
  day2DamarDone=true;
  saveStoryState('CP02-08-between-two-counsels-complete');
  finishDay2Chapter2();
 },1800);
}
function backfillDay2DamarForCompletedSave(){
 // Keep existing DAY 3 save slots intact. Expose the new scene in the
 // Messages archive without rewinding the player or replaying its animations.
 if(!day2Chapter2Completed||day2DamarDelivered)return;
 const t=ensureDay2DamarContact();
 t.messages=day2DamarTimeline.map(m=>({...m,day2Damar:true}));
 t.date='11.35';
 day2DamarDelivered=true;day2DamarCursor=day2DamarTimeline.length;
 day2DamarDone=true;damarUnread=false;
}
