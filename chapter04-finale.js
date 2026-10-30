/* NAKULA PHONE · CHAPTER 04.4–04.5
 * Publish or Protect / Sources in the Dark.
 * Stateful, branch-dependent choices inside fictional iMessage, Mail and Safari.
 * The source's identity is never broadcast on a safe branch. Ending is evaluated
 * later; no Chapter 05 or legal result is fabricated here.
 */
(function(){
'use strict';
const chapter=window.nakulaChapter04;
const api=window.nakulaChapter04Bridge;
if(!chapter||!api)return;
const PHASES=new Set(['idle','briefing','choice-a','choice-a-reply','choice-b','choice-b-reply','fallout','finished']);
const intro=[
 {time:'09.02',text:'Na, Raka sudah terima surat keberatan dari kuasa hukum PBK. Redaksinya belum menurunkan artikel. Mereka sedang memeriksa ulang setiap klaim tentang Zona B.'},
 {time:'09.03',text:'Dia menyiapkan lanjutan investigasi, judul kerjanya ENAM MENIT SEBELUM LONGSOR. Tapi dia belum punya log primer buat menyebut siapa pemberi perintah. Jangan sampai indeks yang belum diautentikasi kita perlakukan seperti putusan.'},
 {time:'09.04',text:'Ada permintaan bahan mentah lewat jalur redaksi. Gue bisa teruskan sikap resmi AHP, bukan identitas kontak yang datang ke lo. Kita publish yang mana, Na?'}
];
const PUB={
 protect:{
 label:'Lindungi sumber, amankan salinan',detail:'Pertahankan rantai bukti dan arahkan klarifikasi melalui saluran resmi',
 out:'Harley, tahan semua data mentah dan identitas sumber. Raka boleh mengutip fakta yang sudah terverifikasi, dengan hak jawab. Bahan kami akan diamankan untuk pemeriksaan resmi.',
 reply:'Got it. Gue sampaikan hanya posisi resmi AHP. Raka akan tetap mengecek tanggal, hak jawab, dan bukti pendukung. Tidak ada nama sumber dalam draft.',
 effects:{E:1,W:0,S:2,L:0}
 },
 raw:{
 label:'Serahkan berkas mentah ke redaksi',detail:'Tekanan publik lebih cepat, tetapi dokumen bisa mengungkap jejak sumber',
 out:'Harley, saya akan kirim salinan indeksnya untuk redaksi. Jelaskan bahwa ini belum terverifikasi, tapi saya ingin publik tahu ada pertanyaan soal jalur audit.',
 reply:'Na, gue harus ingetin: label belum terverifikasi nggak menghapus risiko metadata atau nama yang tertinggal. Raka akan cek dulu, tapi ini membuat kendali atas distribusinya jauh lebih sulit.',
 effects:{E:0,W:0,S:-1,L:2}
 },
 wait:{
 label:'Tunda sampai sumber dan keluarga korban setuju',detail:'Minta persetujuan dan dokumentasikan kebutuhan keselamatan',
 out:'Tunda publikasi detailnya. Kita perlu mendengar keluarga korban dan memastikan sumber paham risikonya. Raka boleh menulis perkembangan proses yang sudah tercatat saja.',
 reply:'Understood. Gue minta Raka menunggu hasil konsultasi, bukan menarik liputan. Hak keluarga untuk menentukan sikap dan keamanan kontak lo harus didahulukan.',
 effects:{E:0,W:1,S:1,L:0}
 }
};
const SOURCE={
 verify:{
 label:'Verifikasi tanpa menyebut nama Marjorie',detail:'Bandingkan metadata dengan catatan independen, lewat saluran sah',
 out:'Ibu Marjorie, saya tidak akan menyebarkan identitas Anda. Kami akan periksa rujukan itu secara independen melalui dokumen resmi, metadata dan saksi lain.',
 reply:'Terima kasih, Pak. Kalau ada hal yang perlu saya jelaskan, mohon gunakan jalur yang aman. Saya tidak ingin orang lain dikenai masalah karena percakapan ini.',
 effects:{E:1,W:0,S:1,L:0}
 },
 disclose:{
 label:'Ungkap nama Marjorie sebagai penguat klaim',detail:'Identitas sumber menjadi mudah ditelusuri dan risiko pembalasan meningkat',
 out:'Ibu Marjorie, untuk menjelaskan asal petunjuk tersebut, identitas Anda akan disebutkan dalam pernyataan lanjutan kami. Saya memahami ini membawa risiko.',
 reply:'Pak Nakula, saya tidak menyetujui nama saya dibuka. Saya meminta Anda menjaga identitas saya. Tolong hentikan penyebarannya selagi masih mungkin.',
 effects:{E:0,W:0,S:-1,L:2}
 },
 reject:{
 label:'Tolak informasi yang belum dapat diautentikasi',detail:'Tidak menambah risiko kebocoran, tetapi juga kehilangan petunjuk',
 out:'Ibu Marjorie, kami belum dapat menggunakan informasi tersebut. Untuk saat ini kami tidak akan mengambil langkah berdasarkan pesan pribadi yang belum terverifikasi.',
 reply:'Saya mengerti, Pak. Saya berharap masih ada jalur pemeriksaan yang tepat. Tolong tetap jaga kerahasiaan percakapan ini.',
 effects:{E:0,W:0,S:0,L:0}
 }
};
const cached=chapter.getState().final;
const f={
 phase:PHASES.has(cached?.phase)?cached.phase:'idle',
 introCount:Math.min(3,Math.max(0,Number(cached?.introCount)||0)),
 introAt:Number(cached?.introAt)||0,
 pub:Object.hasOwn(PUB,cached?.pub)?cached.pub:null,
 pubReplyAt:Number(cached?.pubReplyAt)||0,pubReplyDone:!!cached?.pubReplyDone,
 source:Object.hasOwn(SOURCE,cached?.source)?cached.source:null,
 discloseConfirm:!!cached?.discloseConfirm,
 sourceReplyAt:Number(cached?.sourceReplyAt)||0,sourceReplyDone:!!cached?.sourceReplyDone,
 falloutAt:Number(cached?.falloutAt)||0,falloutDone:!!cached?.falloutDone,
 mailOpened:!!cached?.mailOpened,safariOpened:!!cached?.safariOpened,
 complete:!!cached?.complete,
 scores: cached?.scores&&typeof cached.scores==='object'
 ? Object.fromEntries(['E','W','S','L'].map(k=>[k,Math.max(-4,Math.min(12,Number(cached.scores[k])||0))]))
 :{E:0,W:0,S:0,L:0},
 flags:cached?.flags&&typeof cached.flags==='object'?{...cached.flags}:{}
};
if(f.complete)f.phase='finished';
let timer=null,finalOverlay=null;
const thread=id=>threads.find(t=>t.id===id);
const escText=x=>esc(String(x));
function persist(reason,phase=f.phase){
 f.phase=phase;
 chapter.updateFinal({...f,scores:{...f.scores},flags:{...f.flags}},phase,reason);
}
function updateClock(h,m){api.clock(h,m,3)}
function front(t){if(!t)return;const i=threads.indexOf(t);if(i>0){threads.splice(i,1);threads.unshift(t)}}
function append(id,marker,time,text,isMine=false){
 const t=thread(id);if(!t)return;
 if(!t.messages.some(m=>m[marker]))t.messages.push({me:isMine,time,dayOffset:3,[marker]:true,text});
 t.date=time;front(t);
 if(!isMine){if(id==='marjorie')chapter.markIncoming('marjorie');else api.markIncoming(id)};
}
function announce(id){
 api.syncBadge();
 if(state.screen==='app'&&state.app==='messages')render();
 if(state.screen==='home')api.notify(id);
}
function arm(key,ms,callback){
 if(timer||f.complete)return;
 const at=f[key]||Date.now()+ms;f[key]=at;
 persist('CP04-pending-'+key);
 timer=setTimeout(()=>{timer=null;f[key]=0;callback()},Math.max(0,at-Date.now()));
}
function start(){
 if(!chapter.getState().complete||f.complete)return;
 if(f.phase==='idle'||chapter.getState().stage==='reviewed'){
  f.phase='briefing';persist('CP04-04-Publish-or-Protect');
 }
 if(state.screen==='app'&&state.app==='files')render();
 resume();
}
function nextIntro(){
 if(f.phase!=='briefing'||f.introCount>=3)return;
 const m=intro[f.introCount];
 append('harley','day4PublishIntro'+f.introCount,m.time,m.text);
 f.introCount++;updateClock(9,1+f.introCount);
 if(f.introCount===3)f.phase='choice-a';
 persist('CP04-04-Harley-publishing-'+f.introCount);announce('harley');resume();
}
function choiceA(id){
 if(f.phase!=='choice-a'||!Object.hasOwn(PUB,id))return;
 f.pub=id;f.flags.publication=id;f.flags.protectsHarley=id!=='raw';f.flags.consultedFamily=id==='wait';
 for(const k of ['E','W','S','L'])f.scores[k]+=PUB[id].effects[k];
 append('harley','day4PubOutgoing','09.07',PUB[id].out,true);
 updateClock(9,7);f.phase='choice-a-reply';f.pubReplyAt=Date.now()+3700;
 persist('CP04-A-'+id);render();resume();
}
function replyA(){
 if(f.phase!=='choice-a-reply'||!f.pub)return;
 append('harley','day4PubReply','09.08',PUB[f.pub].reply);
 append('marjorie','day4RiskCheck','09.10',
  f.pub==='raw'
  ?'Pak Nakula, saya mendengar ada bahan mentah yang hendak beredar. Saya tidak pernah memberikan izin nama atau petunjuk mengenai posisi saya dipublikasikan.'
  :'Pak Nakula, saya hanya ingin memastikan daftar yang saya sebut tidak dipakai untuk menebak siapa pemberi informasi. Saya masih khawatir.');
 f.pubReplyDone=true;f.phase='choice-b';
 updateClock(9,10);persist('CP04-B-source-choices-open');announce('marjorie');resume();
}
function choiceB(id){
 if(f.phase!=='choice-b'||!Object.hasOwn(SOURCE,id))return;
 if(id==='disclose'&&!f.discloseConfirm){
  f.discloseConfirm=true;persist('CP04-B-identity-disclosure-confirmation');render();return;
 }
 f.source=id;
 f.flags.sourceProtected=id==='verify';f.flags.identityExposed=id==='disclose';f.flags.independentCheck=id==='verify';
 for(const k of ['E','W','S','L'])f.scores[k]+=SOURCE[id].effects[k];
 append('marjorie','day4SourceOutgoing','09.14',SOURCE[id].out,true);
 f.phase='choice-b-reply';f.sourceReplyAt=Date.now()+3700;
 updateClock(9,14);persist('CP04-B-'+id);render();resume();
}
function cancelDisclosure(){
 if(f.phase!=='choice-b'||!f.discloseConfirm)return;
 f.discloseConfirm=false;persist('CP04-B-disclosure-cancelled');render();
}
function replyB(){
 if(f.phase!=='choice-b-reply'||!f.source)return;
 append('marjorie','day4SourceReply','09.15',SOURCE[f.source].reply);
 f.sourceReplyDone=true;updateClock(9,15);
 f.falloutAt=Date.now()+4500;
 f.phase='fallout';persist('CP04-05-Sources-in-the-Dark');announce('marjorie');resume();
}
function outcomes(){
 if(f.phase!=='fallout'||f.falloutDone||!f.sourceReplyDone)return;
 let nirmalaText,harleyText,marjorieText;
 if(f.flags.identityExposed){
  nirmalaText='Mas, salah satu jalur komunikasi sudah memuat identitas kontak yang seharusnya terlindungi. Saya buat laporan insiden dan meminta semua pihak berhenti meneruskan salinannya. Kita perlu mendokumentasikan risiko ini.';
  marjorieText='Pak, saya tidak bisa lagi menggunakan nomor ini untuk berbicara soal dokumen. Mohon jangan menghubungi rekan kantor saya.';
  harleyText='Raka nggak akan mencetak nama Marjorie. Tapi screenshot yang sudah beredar di luar redaksi sulit ditarik. Gue pastikan tim kami menyimpan semua permintaan hak jawab.';
 }else if(f.pub==='raw'){
  nirmalaText='Mas, salinan mentah sudah keluar dari lingkungan kerja kita. Saya sedang memetakan distribusinya. Kita belum tahu ada metadata yang bisa mengarahkan orang ke sumber atau tidak.';
  marjorieText='Saya berharap Anda tidak membagikan asal percakapan ini, Pak. Saya belum tahu sejauh mana salinan itu sudah diteruskan.';
  harleyText='Raka menahan sebagian isi indeks dari publikasi sambil cek metadata dan hak jawab. Tapi begitu file mentah keluar, risiko jejak sumber tetap ada.';
 }else if(f.source==='reject'){
  nirmalaText='Mas, kita tidak akan menggunakan petunjuk dari kontak itu. Saya pertahankan indeks tersensor sebagai bahan kerja terpisah, bukan bukti yang kita ajukan.';
  marjorieText='Terima kasih sudah membalas, Pak. Saya mengerti jika informasi ini belum bisa digunakan.';
  harleyText='Raka lanjut dengan fakta yang bisa dia verifikasi sendiri. Liputan belum akan mengutip petunjuk pengalihan audit yang tidak bisa dibuktikan.';
 }else{
  nirmalaText='Mas, salinan bukti dan identitas sumber sudah dipisah. Permintaan verifikasi ke vendor akan berjalan lewat jalur resmi. Tidak ada kesimpulan hukum baru sebelum log primer diperoleh.';
  marjorieText='Terima kasih sudah memisahkan identitas saya dari dokumen, Pak. Saya akan menunggu jalur pemeriksaan yang aman.';
  harleyText='Raka setuju: pembaruan liputan hanya tentang fakta yang terverifikasi dan respons PBK. Identitas sumber tidak masuk naskah.';
 }
 append('nirmala','day4FalloutNirmala','09.26',nirmalaText);
 append('nirmala','day4FalloutNakula','09.27',
  f.flags.identityExposed?'Saya sudah catat risikonya. Hentikan penyebaran lanjutan dan minta prosedur perlindungan segera. Jangan hubungi sumber lewat kanal tak aman.':
  'Terima kasih. Pastikan semua komunikasi tercatat dan tidak ada identitas yang disertakan tanpa dasar. Kita tetap menunggu bukti primer.',true);
 append('marjorie','day4FalloutMarjorie','09.29',marjorieText);
 append('harley','day4FalloutHarley','09.31',harleyText);
 f.falloutDone=true;updateClock(9,31);persist('CP04-05-communication-fallout');announce('nirmala');
}
function mailContent(){
 return {
 from:'Legal Department · PBK Group (via HHP)',
 subject:'Formal Objection & Request for Correction · Zona B Coverage',
 to:'Redaksi The Civic Ledger · cc: AHP Counsel',
 date:'28 Oktober 2026 · 09.33 WIB',
 body:'Pihak PBK menyampaikan keberatan atas dugaan penyajian hubungan sebab-akibat dan otorisasi yang belum diuji. Mereka meminta koreksi dan ruang hak jawab serta menyatakan sedang mempertimbangkan langkah hukum terhadap pemberitaan.\n\nSurat ini adalah pernyataan pihak PBK, bukan penetapan bahwa pemberitaan melanggar hukum. AHP diminta menanggapi hanya berdasarkan dokumen yang telah diverifikasi, tanpa membagikan identitas sumber yang tidak diperlukan.'
 };
}
function headline(){
 if(f.flags.identityExposed)
 return {title:'Sumber kasus Zona B dilaporkan terancam teridentifikasi setelah distribusi informasi',summary:'Redaksi menahan identitas yang beredar dan meminta klarifikasi. Pemeriksaan asal dokumen masih berlangsung.',body:'The Civic Ledger belum memublikasikan identitas sumber. Beredarnya informasi melalui jalur lain membuat perlindungan kontak menjadi isu tersendiri. Tidak ada temuan hukum final tentang pengalihan audit.'};
 if(f.pub==='raw')
 return {title:'Dokumen tentang Zona B beredar, redaksi menunda klaim jalur otorisasi',summary:'Indeks distribusi belum diautentikasi; PBK meminta hak jawab.',body:'The Civic Ledger mencatat beredarnya salinan indeks vendor, namun belum memverifikasi penerima maupun tahapan pengesahannya. Raka Pradipta menyatakan liputan lanjutan akan memisahkan temuan yang dapat diuji dari klaim yang belum terbukti.'};
 if(f.pub==='wait')
 return {title:'Liputan Zona B berlanjut, rincian bukti menunggu verifikasi dan konsultasi korban',summary:'Redaksi menerima permintaan klarifikasi tanpa mengungkap identitas sumber.',body:'Raka Pradipta menyiapkan laporan ENAM MENIT SEBELUM LONGSOR. Keluarga korban dan pihak pendamping tengah meninjau keamanan pengungkapan. PBK telah dimintai tanggapan resmi.'};
 return {title:'Enam Menit Sebelum Longsor: redaksi memeriksa ulang rantai keselamatan Zona B',summary:'Catatan distribusi ditahan dari publikasi sambil diverifikasi independen.',body:'Raka Pradipta melanjutkan investigasi mengenai peringatan keselamatan dan tanggung jawab operasional. Hak jawab PBK dimuat; sumber yang belum terverifikasi tidak diidentifikasi dalam laporan.'};
}
function noticePanel(){
 return '<section class="nakula-ch04-fallout-actions"><small>CHAPTER 04.5 · SOURCES IN THE DARK</small>'+
  '<h3>Periksa dampak keputusan</h3><p>Surat keberatan tersedia di Mail. Perkembangan liputan tersedia di Safari. Keduanya harus diperiksa sebelum menyelesaikan Chapter 04.</p>'+
  '<div class="nakula-ch04-review-buttons">'+
  '<button type="button" data-ch04-open-mail>'+(f.mailOpened?'✓ Surat telah dibaca':'Buka Mail · Surat PBK')+'</button>'+
  '<button type="button" data-ch04-open-safari>'+(f.safariOpened?'✓ Artikel telah dibaca':'Buka Safari · The Civic Ledger')+'</button></div>'+
  (f.mailOpened&&f.safariOpened?'<button type="button" class="nakula-ch04-finish-button" data-ch04-finish-chapter>Selesaikan Chapter 04</button>':'')+
  '</section>';
}
function renderMail(){
 if(state.screen!=='app'||state.app!=='mail'||!f.falloutDone)return;
 const root=document.getElementById('app-content');if(!root||root.querySelector('.nakula-ch04-mail-card'))return;
 const m=mailContent();
 const card=document.createElement('section');card.className='nakula-ch04-mail-card';
 card.innerHTML='<small>28 OCT 2026 · INBOX</small><button type="button" data-ch04-read-mail><strong>'+escText(m.subject)+'</strong><span>'+escText(m.from)+'</span><em>'+(f.mailOpened?'Dibaca':'Belum dibaca')+'</em></button>'+
 (f.mailOpened?'<article class="nakula-ch04-report-body"><h3>'+escText(m.subject)+'</h3>'+
 '<div>From: '+escText(m.from)+'</div><div>To: '+escText(m.to)+'</div>'+
 '<p>'+escText(m.body).replace(/\n/g,'<br>')+'</p><small>Salinan fiktif · bukan dokumen hukum asli</small></article>':'');
 root.prepend(card);
 root.insertAdjacentHTML('beforeend',noticePanel());
}
function renderSafari(){
 if(state.screen!=='app'||state.app!=='safari'||!f.falloutDone)return;
 const root=document.getElementById('app-content');if(!root||root.querySelector('.nakula-ch04-safari-card'))return;
 const h=headline();const el=document.createElement('section');
 el.className='nakula-ch04-safari-card';
 el.innerHTML='<small>THE CIVIC LEDGER · 28 OCT 2026</small><button type="button" data-ch04-read-safari><strong>'+escText(h.title)+'</strong><span>'+escText(h.summary)+'</span><em>'+(f.safariOpened?'Dibaca':'Baca liputan')+'</em></button>'+
 (f.safariOpened?'<article class="nakula-ch04-report-body"><p>'+escText(h.body)+'</p><small>Raka Pradipta · Investigasi Zona B · Simulasi berita</small></article>':'');
 root.prepend(el);
 root.insertAdjacentHTML('beforeend',noticePanel());
}
function decorate(){
 if(state.screen!=='app'||!chapter.getState().complete||f.phase==='idle')return;
 const scroll=document.getElementById('chat-scroll');
 if(state.app==='messages'&&state.view==='convo'&&scroll){
  if(state.thread==='harley'&&f.phase==='choice-a'){
   const panel=document.createElement('section');panel.className='nakula-ch04-choice';
   panel.innerHTML='<small>CHAPTER 04.4 · PUBLISH OR PROTECT</small><p>Dokumen belum diautentikasi. Sikap Nakula akan memengaruhi bukti, sumber, dan liputan.</p>'+
   Object.entries(PUB).map(([id,o])=>'<button type="button" data-ch04-publish="'+id+'"><strong>'+escText(o.label)+'</strong><span>'+escText(o.detail)+'</span></button>').join('');
   scroll.appendChild(panel);scroll.scrollTop=scroll.scrollHeight;
  }
  if(state.thread==='harley'&&['choice-b','choice-b-reply'].includes(f.phase)){
   scroll.insertAdjacentHTML('beforeend','<div class="nakula-ch04-navigate"><p>Marjorie membutuhkan respons mengenai keamanan sumber.</p><button type="button" data-ch04-open-marjorie>Buka Pesan Marjorie</button></div>');
   scroll.scrollTop=scroll.scrollHeight;
  }
  if(state.thread==='marjorie'&&f.phase==='choice-b'){
   const panel=document.createElement('section');panel.className='nakula-ch04-choice';
   const choices=Object.entries(SOURCE).map(([id,o])=>'<button type="button" data-ch04-source="'+id+'"><strong>'+escText(o.label)+'</strong><span>'+escText(o.detail)+'</span></button>').join('');
   panel.innerHTML='<small>CHAPTER 04.4 · PROTECT THE SOURCE</small>'+
    (f.discloseConfirm?'<p class="nakula-ch04-warning">Nama Marjorie dapat tersebar dan sulit ditarik. Ia belum menyetujui pengungkapan identitas. Tetap lakukan?</p>'+
    '<button type="button" data-ch04-source="disclose">Ya, tetap ungkap nama sumber</button><button type="button" class="secondary" data-ch04-cancel-disclose>Batal, lindungi sumber</button>':
    '<p>Langkah ini memengaruhi keselamatan Marjorie serta integritas petunjuk.</p>'+choices);
   scroll.appendChild(panel);scroll.scrollTop=scroll.scrollHeight;
  }
  if(f.falloutDone&&['harley','nirmala','marjorie'].includes(state.thread)){
   scroll.insertAdjacentHTML('beforeend',noticePanel());scroll.scrollTop=scroll.scrollHeight;
  }
 }
 if(state.app==='files'&&['briefing','choice-a','choice-a-reply'].includes(f.phase)&&!document.querySelector('[data-ch04-open-harley]')){
  const root=document.getElementById('app-content');
  if(root)root.insertAdjacentHTML('beforeend','<button class="nakula-ch04-file-to-chat" data-ch04-open-harley>Buka pesan Harley · Pembaruan Investigasi</button>');
 }
 renderMail();renderSafari();
}
function finishChapter(){
 if(!f.falloutDone||!f.mailOpened||!f.safariOpened||f.complete)return;
 f.complete=true;f.phase='finished';updateClock(9,45);
 persist('CP04-SOURCES-IN-THE-DARK');
 if(!finalOverlay){
  finalOverlay=document.createElement('section');finalOverlay.className='nakula-ch03-finale nakula-ch04-whole-finale';
  finalOverlay.setAttribute('role','dialog');finalOverlay.setAttribute('aria-modal','true');
  finalOverlay.setAttribute('aria-label','Chapter 04 complete');
  finalOverlay.innerHTML='<div class="nakula-ch03-finale-inner"><small>CHAPTER 04 COMPLETE</small>'+
   '<h2>SOURCES IN THE DARK</h2><div class="nakula-ch03-finale-rule"></div>'+
   '<p>Every document has a history. Every source has a life beyond the page.</p>'+
   '<span>CP04 tersimpan · Pilihan publikasi dan keselamatan sumber akan berpengaruh pada chapter selanjutnya.</span>'+
   '<button type="button" data-ch04-close-finale>Tutup Chapter 04</button></div>';
  document.getElementById('phone').appendChild(finalOverlay);
 }
 finalOverlay.hidden=false;requestAnimationFrame(()=>finalOverlay?.classList.add('visible'));
}
function resume(){
 if(timer||!chapter.getState().complete||f.complete)return;
 if(f.phase==='briefing'&&f.introCount<3){arm('introAt',f.introCount===0?1200:3200,nextIntro);return}
 if(f.phase==='choice-a-reply'&&!f.pubReplyDone){arm('pubReplyAt',3600,replyA);return}
 if(f.phase==='choice-b-reply'&&!f.sourceReplyDone){arm('sourceReplyAt',3600,replyB);return}
 if(f.phase==='fallout'&&!f.falloutDone){arm('falloutAt',4500,outcomes)}
}
window.nakulaChapter04Finale=Object.freeze({start,resume,decorate,getState:()=>({...f,scores:{...f.scores}})});
const renderPrevious=render;
render=function(){renderPrevious();decorate()};
document.addEventListener('click',event=>{
 const pub=event.target.closest('[data-ch04-publish]');
 if(pub){event.preventDefault();event.stopImmediatePropagation();choiceA(pub.dataset.ch04Publish);return}
 const src=event.target.closest('[data-ch04-source]');
 if(src){event.preventDefault();event.stopImmediatePropagation();choiceB(src.dataset.ch04Source);return}
 if(event.target.closest('[data-ch04-cancel-disclose]')){event.preventDefault();event.stopImmediatePropagation();cancelDisclosure();return}
 if(event.target.closest('[data-ch04-open-harley]')){
  event.preventDefault();event.stopImmediatePropagation();
  openApp('messages');if(state.app==='messages'){state.view='convo';state.thread='harley';api.markRead('harley');render()}return;
 }
 if(event.target.closest('[data-ch04-open-marjorie]')){
  event.preventDefault();event.stopImmediatePropagation();
  openApp('messages');if(state.app==='messages'){
   state.view='convo';state.thread='marjorie';chapter.markRead('marjorie');render()
  }return;
 }
 if(event.target.closest('[data-ch04-open-mail]')){
  event.preventDefault();event.stopImmediatePropagation();openApp('mail');return;
 }
 if(event.target.closest('[data-ch04-open-safari]')){
  event.preventDefault();event.stopImmediatePropagation();openApp('safari');return;
 }
 if(event.target.closest('[data-ch04-read-mail]')&&f.falloutDone){
  event.preventDefault();event.stopImmediatePropagation();
  f.mailOpened=true;persist('CP04-05-PBK-letter-read');render();return;
 }
 if(event.target.closest('[data-ch04-read-safari]')&&f.falloutDone){
  event.preventDefault();event.stopImmediatePropagation();
  f.safariOpened=true;persist('CP04-05-coverage-read');render();return;
 }
 if(event.target.closest('[data-ch04-finish-chapter]')){
  event.preventDefault();event.stopImmediatePropagation();finishChapter();return;
 }
 if(event.target.closest('[data-ch04-close-finale]')){
  event.preventDefault();event.stopImmediatePropagation();
  if(finalOverlay){finalOverlay.classList.remove('visible');finalOverlay.hidden=true}
  goHome();
 }
},true);
// For saved CP04-03 from the previous build, continue rather than trapping the
// player on the old interstitial. Completed chapters stay complete on restore.
if(chapter.getState().complete&&!f.complete){start();resume()}
})();
