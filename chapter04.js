/* NAKULA PHONE AU · CHAPTER 04.1–04.3
 * Confidential Information. Loaded after au.js. All chapter-specific state is
 * kept in the existing story slot; publication choices begin in 04.4.
 */
(function(){
'use strict';
const api=window.nakulaChapter04Bridge;
if(!api)return;
const FILE_ID='distribution_index_redacted';
const START_MINUTES=3*1440+7*60+18;
const harley=[
 {time:'07.18',text:"Na, sorry for texting this early. Raka got a letter from PBK's counsel last night. They're asking his newsroom to pull his story about the meeting."},
 {time:'07.19',text:"Belum ada perintah pengadilan. Tapi mereka sudah pakai kata 'defamation'. Raka hanya menulis bahwa pertemuan itu terjadi, bukan bahwa settlement sudah disetujui."},
 {time:'07.20',text:"Ada kabar soal daftar distribusi adendum Zona B yang mungkin lebih tua dari file yang kalian periksa. Don't quote me. Dan jangan tanya siapa yang pertama kali dengar."}
];
const marjorie=[
 {time:'08.04',text:'Selamat pagi, Pak Nakula. Saya Marjorie Kathrina. Saya mendapatkan nomor ini dari kontak kantor yang tersedia untuk umum. Maaf menghubungi tanpa janji.'},
 {time:'08.05',text:'Saya pernah melihat daftar distribusi dan rujukan pengalihan audit keselamatan Zona B ke entitas perantara. Saya tidak punya akses baru ke server internal PBK, dan tidak tahu apakah catatan yang saya lihat lengkap.'},
 {time:'08.06',text:'Saya tidak ingin nama saya beredar. Bisakah kita mulai dari daftar judul dan tanggal saja? Saya tidak akan mengirim data pribadi atau materi internal mentah lewat nomor ini.'}
];
const replies={
 index:{label:'Minta indeks tanpa identitas sumber',out:'Ibu Marjorie, terima kasih. Jangan kirim dokumen internal atau data identitas melalui nomor ini. Jika ada daftar berkas yang boleh disebutkan, cukup judul dan tanggal tanpa penanda sumber.',reply:'Saya mengerti, Pak. Ada dua nama berkas yang perlu dibandingkan: daftar distribusi dan memo pengalihan audit. Sebaiknya Anda cek terhadap lampiran vendor yang sudah tersedia. Saya tidak meminta dokumen diterima atas nama saya.'},
 protocol:{label:'Arahkan ke verifikasi melalui jalur resmi',out:'Ibu Marjorie, saya belum dapat membahas atau menerima materi rahasia melalui pesan pribadi. Asal informasi dan prosedur yang sah harus diperiksa terlebih dahulu. Tolong jangan mengirim apa pun yang bisa mengidentifikasi Anda.',reply:'Understood. Saya hanya ingin menyebut ada dua jenis catatan: distribution list dan audit-routing memorandum. Tolong verifikasi secara independen. Saya tidak meminta Anda memercayai dugaan saya.'}
};
const nirmala=[
 {time:'08.17',text:'Mas, saya memeriksa lagi lampiran vendor yang kita simpan kemarin. Ada satu lembar indeks distribusi yang belum masuk bundel kerja. Ini bukan hasil akses baru ke server PBK.'},
 {time:'08.18',text:'Ada rujukan pemindahan jalur audit keselamatan ke entitas perantara. Nomor revisi dan alamat distribusinya belum lengkap. Saya samarkan seluruh nama penerima di salinan telaah.'},
 {time:'08.19',text:'Extract tersensornya sudah saya taruh di Files, folder PBK Group. Ini belum membuktikan siapa pengambil keputusan, apalagi identitas orang yang menghubungi Mas.'}
];
const allowed=['none','transition','alarm','harley','contact','evidence','reviewed'];
const raw=window.__nakulaChapter04Cached;
const s={
 stage:allowed.includes(raw?.stage)&&api.day3Complete()?raw.stage:'none',
 harleyCount:Math.max(0,Math.min(3,Number(raw?.harleyCount)||0)),
 harleySeen:!!raw?.harleySeen,
 marjorieCount:Math.max(0,Math.min(3,Number(raw?.marjorieCount)||0)),
 marjorieUnread:!!raw?.marjorieUnread,
 choice:Object.prototype.hasOwnProperty.call(replies,raw?.choice)?raw.choice:null,
 replyDone:!!raw?.replyDone,
 nirmalaCount:Math.max(0,Math.min(3,Number(raw?.nirmalaCount)||0)),
 fileOpened:!!raw?.fileOpened,complete:!!raw?.complete,
 transitionAt:Number(raw?.transitionAt)||0,harleyAt:Number(raw?.harleyAt)||0,
 contactAt:Number(raw?.contactAt)||0,replyAt:Number(raw?.replyAt)||0,nirmalaAt:Number(raw?.nirmalaAt)||0
};
if(!s.choice)s.replyDone=false;
if(!s.replyDone)s.nirmalaCount=0;
let timer=null,transitioning=false,overlay=null;
const current=()=>s.stage!=='none';
const save=reason=>{window.__nakulaChapter04Cached={...s};api.save(reason)};
const bumpTime=(h,m)=>api.clock(h,m,3);
const thread=id=>threads.find(x=>x.id===id);
function front(t){const i=threads.indexOf(t);if(i>0){threads.splice(i,1);threads.unshift(t)}}
function deliver(t,m,flag,offset=3){
 if(!t.messages.some(x=>x[flag]&&x.time===m.time))t.messages.push({me:false,time:m.time,dayOffset:offset,[flag]:true,text:m.text});
 t.date=m.time;front(t);
}
function notify(id){
 if(state.screen==='app'&&state.app==='messages')render();
 if(state.screen==='home')api.notify(id);
 api.syncBadge();
}
function delay(nextAt,ms,fn){
 clearTimeout(timer);
 const when=s[nextAt]||Date.now()+ms;s[nextAt]=when;
 timer=setTimeout(()=>{timer=null;s[nextAt]=0;fn()},Math.max(0,when-Date.now()));
 save('CP04-timer-'+nextAt);
}
function begin(){
 if(s.stage!=='none'||!api.day3Complete())return;
 s.stage='transition';s.transitionAt=Date.now()+850;
 save('CP04-transition-queued');resume();
}
function fade(){
 if(s.stage!=='transition'||transitioning||state.screen==='lock')return;
 transitioning=true;
 const screen=document.querySelector('.nakula-day2-curtain');
 if(!screen)return;
 screen.querySelector('.nakula-day2-title').textContent='DAY 4';
 screen.hidden=false;screen.setAttribute('aria-hidden','false');
 requestAnimationFrame(()=>screen.classList.add('is-dark'));
 setTimeout(()=>screen.classList.add('show-title'),480);
 setTimeout(()=>{
  if(s.stage!=='transition')return;
  api.restoreClock(START_MINUTES);
  s.stage='alarm';s.transitionAt=0;
  state.app=null;state.view=null;state.thread=null;
  hidePasscode();layer('lock');save('CP04-day4-0718');
  screen.classList.remove('show-title');
 },2550);
 setTimeout(()=>screen.classList.remove('is-dark'),3050);
 setTimeout(()=>{screen.hidden=true;screen.setAttribute('aria-hidden','true');transitioning=false;showAlarm()},3600);
}
function showAlarm(){
 if(s.stage!=='alarm')return;
 api.showAlarm('07:18','Case Review','Stop alarm untuk memulai Day 4');
}
function stopAlarm(){
 if(s.stage!=='alarm')return;
 api.stopAlarm();s.stage='harley';save('CP04-01-alarm-stopped');
 const notice=document.querySelector('.nakula-day2-morning-notice');
 if(notice){
  notice.innerHTML='<span class="nakula-day2-message-icon">●</span><span class="nakula-day2-message-body">'+
  '<span class="nakula-day2-message-top"><strong>MESSAGES</strong><span>now</span></span>'+
  '<strong>Harley Mahira</strong><span>Na, Raka menerima surat dari kuasa hukum PBK...</span></span>';
 }
 nextHarley();
 if(state.screen==='lock'&&notice)notice.hidden=false;
}
function nextHarley(){
 if(s.stage!=='harley'||s.harleyCount>=3)return;
 const t=thread('harley');if(!t)return;
 const m=harley[s.harleyCount];deliver(t,m,'day4Harley');
 s.harleyCount++;bumpTime(7,18+s.harleyCount-1);api.markIncoming('harley');
 save('CP04-01-Harley-'+s.harleyCount);notify('harley');resume();
}
function markHarleySeen(){
 if(s.stage!=='harley'||s.harleyCount!==3||s.harleySeen||
 state.screen!=='app'||state.app!=='messages'||state.view!=='convo'||state.thread!=='harley')return;
 s.harleySeen=true;api.markRead('harley');save('CP04-01-Harley-read');resume();
}
function marjorieThread(){
 let t=thread('marjorie');
 if(!t){t={id:'marjorie',name:'Unknown Contact',initials:'?',role:'Nomor belum diverifikasi',date:'08.04',messages:[]};threads.unshift(t)}
 if(s.marjorieCount>=2){t.name='Marjorie Kathrina';t.initials='MK';t.role='Kontak belum diverifikasi'}
 return t;
}
function nextMarjorie(){
 if(!s.harleySeen||s.marjorieCount>=3)return;
 const t=marjorieThread(),m=marjorie[s.marjorieCount];
 deliver(t,m,'day4Marjorie');s.marjorieCount++;s.stage='contact';
 marjorieThread();s.marjorieUnread=true;
 bumpTime(8,3+s.marjorieCount);
 save('CP04-02-Marjorie-'+s.marjorieCount);notify('marjorie');resume();
}
function choose(id){
 if(s.stage!=='contact'||s.marjorieCount!==3||s.choice||!replies[id])return;
 s.choice=id;
 const t=marjorieThread();
 if(!t.messages.some(x=>x.day4Outgoing))t.messages.push({me:true,time:'08.11',dayOffset:3,day4Outgoing:true,text:replies[id].out});
 t.date='08.11';bumpTime(8,11);
 s.replyAt=Date.now()+3500;save('CP04-02-Marjorie-reply-'+id);render();resume();
}
function deliverReply(){
 if(!s.choice||s.replyDone)return;
 const t=marjorieThread();
 deliver(t,{time:'08.12',text:replies[s.choice].reply},'day4Followup');
 s.replyDone=true;s.stage='evidence';s.marjorieUnread=true;bumpTime(8,12);
 save('CP04-02-followup');notify('marjorie');resume();
}
function nextNirmala(){
 if(!s.replyDone||s.nirmalaCount>=3)return;
 const t=thread('nirmala');if(!t)return;
 const m=nirmala[s.nirmalaCount];
 deliver(t,m,'day4Nirmala');s.nirmalaCount++;api.markIncoming('nirmala');
 bumpTime(8,16+s.nirmalaCount);save('CP04-03-Nirmala-'+s.nirmalaCount);
 notify('nirmala');resume();
}
function docs(){
 if(s.nirmalaCount!==3)return [];
 return [{id:FILE_ID,name:'Vendor_Distribution_Index_Redacted.pdf',kind:'PDF Document',
 size:'188 KB',folder:'PBK Group',title:'ZONA B · DOCUMENT DISTRIBUTION INDEX',badge:'REDACTED REVIEW COPY · UNVERIFIED',
 metadata:[['Copy origin','Lampiran pertukaran vendor / asuransi yang sudah tersimpan'],['Prepared','28 Oktober 2026 · 08.19 WIB'],['Source identifiers','REDACTED'],['Completeness','Belum dikonfirmasi'],['Status','Working material · not an authenticated PBK record']],
 body:[
 ['DOCUMENT 01','Operational_Addendum_ZonaB.pdf · riwayat revisi dan daftar penerima belum sepenuhnya terlihat.'],
 ['DOCUMENT 02','Safety_Audit_Routing_Memo · catatan referensi pemindahan jalur audit ke entitas perantara; memo asli belum diperoleh.'],
 ['DISTRIBUTION CHAIN','Lampiran vendor menunjukkan rujukan lintas unit. Nama penerima dihapus dari salinan ini demi keselamatan sumber.'],
 ['COMPARISON','Cocokkan nomor revisi dengan halaman 312 dan Authorization_Routing_Extract.pdf. Nama akun saja tidak membuktikan tindakan atau kewenangannya.'],
 ['CAUTION','Indeks belum diautentikasi. Tidak membuktikan siapa menyusun, mengesahkan, atau memerintahkan pengalihan audit.']
 ]}];
}
function openFile(){
 if(s.nirmalaCount!==3)return;
 api.openDocument(FILE_ID);
}
function note(){
 if(!s.fileOpened||notes.some(x=>Number(x.id)===99307))return;
 notes.unshift({id:99307,date:'28 Oktober 2026 · 08.22',title:'28 OKT · CONFIDENTIAL INFORMATION',
 day4CaseNote:true,body:'ZONA B · CATATAN PEMERIKSAAN SUMBER\n\nKontak yang mengaku Marjorie Kathrina belum diverifikasi. Jangan mengungkap nama atau menyebarkan pesan pribadi sebagai bukti.\n\nNirmala menemukan extract tersensor dalam lampiran vendor yang telah tersedia. Ada rujukan daftar distribusi dan jalur audit perantara, tetapi tidak ada bukti final mengenai pengambil keputusan.\n\nNEXT: Tentukan apakah publikasi dapat dilakukan tanpa membahayakan sumber. Keputusan belum diambil.'});
}
function finish(){
 if(!s.fileOpened||s.complete)return;
 s.complete=true;s.stage='reviewed';bumpTime(8,22);save('CP04-03-COMPLETE');
 if(!overlay){
  overlay=document.createElement('div');overlay.className='nakula-ch03-finale nakula-ch04-finale';
  overlay.innerHTML='<div class="nakula-ch03-finale-inner"><small>CHAPTER 04 · PART 01–03 COMPLETE</small>'+
  '<h2>CONFIDENTIAL INFORMATION</h2><div class="nakula-ch03-finale-rule"></div>'+
  '<p>The document is here. The source is still at risk.</p>'+
  '<span>CP04-03 tersimpan · Berikutnya: Publish or Protect</span>'+
  '<button type="button" data-day4-close>Kembali ke Home</button></div>';
  document.getElementById('phone').appendChild(overlay);
 }
 overlay.hidden=false;requestAnimationFrame(()=>overlay.classList.add('visible'));
}
function decorate(){
 if(state.screen!=='app')return;
 if(state.app==='messages'&&state.view==='convo'){
  if(state.thread==='harley')markHarleySeen();
  if(state.thread==='marjorie'){
   if(s.marjorieUnread){s.marjorieUnread=false;save('CP04-read-Marjorie');api.syncBadge()}
   const scroll=document.getElementById('chat-scroll');if(!scroll)return;
   document.querySelector('#app-content .convo-local')?.remove();
   const input=document.getElementById('chat-input');if(input){input.readOnly=true;input.placeholder='Pilih respons di atas'}
   const submit=document.querySelector('#chat-form [type="submit"]');if(submit)submit.disabled=true;
   if(s.marjorieCount===3&&!s.choice){
    const panel=document.createElement('section');panel.className='nakula-ch04-choice';
    panel.innerHTML='<small>RESPONS NAKULA · 08.10</small><p>Informasi belum terverifikasi. Pilih balasan profesional.</p>'+
    Object.entries(replies).map(([id,v])=>'<button type="button" data-day4-choice="'+id+'">'+esc(v.label)+'</button>').join('');
    scroll.appendChild(panel);scroll.scrollTop=scroll.scrollHeight;
   }else if(s.choice&&!s.replyDone){
    scroll.insertAdjacentHTML('beforeend','<div class="bubble-row them"><div class="bubble harley-au-dots"><i></i><i></i><i></i></div></div>');
    scroll.scrollTop=scroll.scrollHeight;
   }
  }
  if(state.thread==='nirmala'&&s.nirmalaCount>0){api.markRead('nirmala')}
  if(state.thread==='nirmala'&&s.nirmalaCount===3&&!document.querySelector('[data-day4-open-file]')){
   const scroll=document.getElementById('chat-scroll');if(scroll){
    scroll.insertAdjacentHTML('beforeend','<button type="button" class="nakula-file-attachment nakula-ch04-attachment" data-day4-open-file><span class="nakula-file-attachment-icon">PDF</span><span><strong>Vendor_Distribution_Index_Redacted.pdf</strong><small>Salinan tersensor · Buka di Files</small></span><span aria-hidden="true">›</span></button>');
    scroll.scrollTop=scroll.scrollHeight;
   }
  }
 }
 if(state.app==='files'&&api.currentFile()===FILE_ID){
  if(!s.fileOpened){s.fileOpened=true;note();save('CP04-03-index-reviewed')}
  if(!s.complete&&!document.querySelector('[data-day4-finish]')){
   const pane=document.querySelector('#app-content .nakula-files-preview');
   if(pane)pane.insertAdjacentHTML('beforeend','<section class="nakula-ch04-file-action"><small>08.22 · CROSS-REFERENCE</small><p>Indeks telah diperiksa. Identitas sumber tetap tersensor. Klaim tentang audit belum diverifikasi.</p><button type="button" data-day4-finish>Simpan Temuan &amp; Lanjutkan</button></section>');
  }
 }
 if(state.app==='notes'&&state.view==='note'&&String(state.note)==='99307')
 document.querySelector('#app-content [data-action="edit-note"]')?.remove();
}
function resume(){
 if(!api.day3Complete()||timer)return;
 if(s.stage==='transition'){
  if(state.screen==='lock')return;
  const due=s.transitionAt||Date.now()+650;s.transitionAt=due;
  delay('transitionAt',650,fade);return;
 }
 if(s.stage==='alarm'){showAlarm();return}
 if(s.stage==='harley'&&s.harleyCount<3){delay('harleyAt',s.harleyCount===0?950:2900,nextHarley);return}
 if(s.harleySeen&&s.marjorieCount<3){delay('contactAt',s.marjorieCount===0?5300:3200,nextMarjorie);return}
 if(s.choice&&!s.replyDone){delay('replyAt',3500,deliverReply);return}
 if(s.replyDone&&s.nirmalaCount<3){delay('nirmalaAt',s.nirmalaCount===0?4400:2750,nextNirmala)}
}
function onLayer(which){
 if(which==='home'||which==='app'){if(s.stage==='transition')resume()}
 if(which==='lock'&&s.stage==='alarm')showAlarm();
 if(which==='lock'&&s.stage==='harley'){
  const el=document.querySelector('.nakula-day2-morning-notice');if(el&&s.harleyCount>0)el.hidden=false;
 }
}
window.nakulaChapter04=Object.freeze({
 getState:()=>({...s}),unreadCount:()=>Number(s.marjorieUnread),
 docs, start:begin, decorate, onLayer, resume, isStarted:current,
 markRead:id=>{if(id==='marjorie'){s.marjorieUnread=false;save('CP04-read-Marjorie');api.syncBadge()}},
 isMorningNotice:()=>s.stage==='harley'&&s.harleyCount>0
});
const renderPrevious=render;
render=function(){renderPrevious();decorate()};
const layerPrevious=layer;
layer=function(which){layerPrevious(which);onLayer(which)};
document.addEventListener('click',e=>{
 if(e.target.closest('[data-day2-stop]')&&s.stage==='alarm'){e.preventDefault();stopAlarm();return}
 const choice=e.target.closest('[data-day4-choice]');
 if(choice){e.preventDefault();e.stopImmediatePropagation();choose(choice.dataset.day4Choice);return}
 if(e.target.closest('[data-day4-open-file]')){e.preventDefault();e.stopImmediatePropagation();openFile();return}
 if(e.target.closest('[data-day4-finish]')){e.preventDefault();e.stopImmediatePropagation();finish();return}
 if(e.target.closest('[data-day4-close]')){
  e.preventDefault();e.stopImmediatePropagation();if(overlay){overlay.classList.remove('visible');overlay.hidden=true}goHome();return;
 }
 if(e.target.closest('[data-thread="marjorie"]'))window.nakulaChapter04.markRead('marjorie');
},true);
document.querySelector('.nakula-day2-morning-notice')?.addEventListener('click',()=>{
 if(s.stage==='harley'&&state.screen==='lock')requestUnlock();
});
document.addEventListener('submit',e=>{
 if(e.target.id==='chat-form'&&state.thread==='marjorie'){e.preventDefault();e.stopImmediatePropagation()}
},true);
if(s.fileOpened)note();
if(api.day3Complete()&&s.stage==='none')begin();
else resume();
})();
