/* Personal history is always available, independently of story checkpoints. */
(function(){
'use strict';
const archive={id:'mentari',name:'Mentari',initials:'M',date:'Lama',messages:[
 {me:false,time:'20.14',section:'Suatu malam',text:'',profileSuggestionPhoto:true},
 {me:false,time:'20.15',text:'Tidak akan ada yang tertarik dengan pengacara tanpa foto profil tampan, Nakula, coba saja pakai'},
 {me:true,time:'20.16',text:'Saya pengacara, Mentari. Bukan model.'},
 {me:false,time:'20.16',text:'Itu foto profil Instagram, bukan iklan parfum.'},
 {me:true,time:'20.17',text:'Kapan kamu mengambil foto itu?'},
 {me:false,time:'20.17',text:'Tadi. Waktu kamu lebih sibuk dengan ponselmu daripada steak di depanmu.'},
 {me:true,time:'20.18',text:'Saya pertimbangkan.'},
 {me:false,time:'20.18',text:'Artinya iya. Jangan lupa dipasang, ya.'},
 {me:true,time:'20.19',text:'Iya, Mentari.'},
 {me:false,time:'18.12',section:'Suatu sore',text:'Meja dekat jendela masih kosong. Aku pesankan yang biasa?'},
 {me:true,time:'18.13',text:'Boleh. Saya masih di jalan.'},
 {me:false,time:'18.13',text:'Pelan-pelan. Kopinya bisa dipesan lagi.'},
 {me:true,time:'18.14',text:'Kali ini saya benar-benar sudah turun dari kantor.'},
 {me:false,time:'18.14',text:'Bagus. Aku sudah siap dengar pembelaanmu kalau ternyata masih di lift.'},
 {me:true,time:'18.15',text:'Tidak ada pembelaan. Lima menit.'},
 {me:true,time:'18.42',text:'Akhirnya sama-sama sempat.',photo:true},
 {me:false,time:'18.43',text:'Lain kali kita minta meja yang ini lagi, ya.'},
 {me:true,time:'18.44',text:'Boleh. Yang dekat jendela.'},
 {me:false,time:'21.08',section:'Di lain hari',text:'Minggu ini belum bisa, ya?'},
 {me:true,time:'21.10',text:'Sidangnya bergeser ke Jumat. Kamu sudah berangkat Sabtu pagi?'},
 {me:false,time:'21.11',text:'Iya. Nanti kalau jadwalmu sudah agak kosong, kita ke sana, ya.'},
 {me:true,time:'21.13',text:'Iya. Saya yang cari waktunya.'}
]};
// Replace only this built-in history; never splice events into active scripts.
threads=threads.filter(t=>t.id!==archive.id);
threads.push(structuredClone(archive));

const memoryPhoto=photoItems.findIndex(p=>p.src==='./gallery/window-table.jpg');
if(!Array.isArray(favorites))favorites=[];
if(memoryPhoto>=0&&!getSaved('mentari-favorite-seeded-v1',false)){
 if(!favorites.includes(memoryPhoto))favorites.push(memoryPhoto);
 setSaved('favorites',favorites);
 setSaved('mentari-favorite-seeded-v1',true);
}

// A local, fictional Reminders list, with no real notifications or schedules.
const reminderItems=[
 {id:'laundry',title:'Ambil jas dari laundry'},
 {id:'photo-paper',title:'Beli kertas foto'},
 {id:'same-date',title:'Cari tanggal yang sama-sama kosong.',note:'Mentari · meja dekat jendela',memory:true}
];
const savedReminders=getSaved('personal-reminders-v1',{});
const completed=new Set(reminderItems.filter(x=>savedReminders?.[x.id]===true).map(x=>x.id));
let showCompleted=false,archiveWasOpen=false,profilePhotoViewer=null;

icons.reminders='<rect x="9" y="5" width="46" height="54" rx="9" fill="#fafafa"/><g fill="#bd877e"><circle cx="21" cy="20" r="3.5"/></g><circle cx="21" cy="32" r="3.5" fill="#b4a178"/><circle cx="21" cy="44" r="3.5" fill="#849cae"/><path d="M30 20h15M30 32h15M30 44h15" stroke="#b7b8bc" stroke-width="2.4" stroke-linecap="round"/>';
if(!document.querySelector('#apps-grid [data-app="reminders"]')){
 const icon=document.createElement('div');
 icon.innerHTML=appIcon({id:'reminders',label:'Reminders'});
 $('apps-grid').appendChild(icon.firstElementChild);
}

function renderReminders(){
 const remaining=reminderItems.length-completed.size;
 $('app-header').innerHTML=pageHeader('Home','Reminders');
 const rows=reminderItems.filter(x=>showCompleted||!completed.has(x.id)).map(x=>{
  const checked=completed.has(x.id);
  return '<div class="nm-reminder-row'+(checked?' is-complete':'')+'"><button type="button" role="checkbox" aria-checked="'+checked+'" aria-label="'+esc(x.title)+'" data-personal-reminder="'+x.id+'" class="nm-reminder-check">'+(checked?'✓':'')+'</button><div><span class="nm-reminder-title">'+esc(x.title)+'</span>'+(x.note?'<p>'+esc(x.note)+'</p>':'')+(x.memory?'<button type="button" class="nm-text-link" data-mentari-open="chat">Mentari <span aria-hidden="true">›</span></button>':'')+'</div></div>';
 }).join('');
 $('app-content').innerHTML='<section class="nm-reminders"><div class="nm-reminder-heading"><h1>Pribadi</h1><span aria-label="'+remaining+' pengingat belum selesai">'+remaining+'</span></div><p class="nm-reminder-subtitle">Tanpa tanggal</p><div class="nm-reminder-list">'+(rows||'<p class="nm-reminder-empty">Semua pengingat selesai.</p>')+'</div><button type="button" class="nm-text-link nm-completed-toggle" data-personal-completed aria-expanded="'+showCompleted+'">'+(showCompleted?'Sembunyikan yang selesai':'Tampilkan yang selesai')+' ('+completed.size+')</button></section>';
}

function renderArchive(scrollTop){
 $('app-header').innerHTML='<button type="button" class="harley-au-back" data-action="back" aria-label="Back to Messages"><span aria-hidden="true">‹</span><span>Messages</span></button><div class="harley-au-head"><span class="harley-au-head-avatar mentari">M</span><span class="harley-au-head-name">Mentari</span></div><span class="nm-head-space"></span>';
 const bubbles=archive.messages.map((m,i)=>{
  const previous=archive.messages[i-1],next=archive.messages[i+1];
  const samePrevious=previous&&previous.me===m.me&&!m.section&&!previous.photo&&!previous.profileSuggestionPhoto;
  const sameNext=next&&next.me===m.me&&!next.section&&!m.photo&&!m.profileSuggestionPhoto;
  const divider=m.section?'<div class="date-divider nakula-chat-time-divider" role="separator">'+esc(m.section)+' <span>· '+esc(m.time)+'</span></div>':'';
  const image=m.profileSuggestionPhoto?'<button type="button" class="nm-chat-photo nm-chat-profile-photo" data-mentari-open="profile-photo" aria-label="Lihat foto Nakula yang dikirim Mentari"><img src="./gallery/nakula-mentari-dinner.webp" alt="Nakula melihat ponsel di restoran berdinding merah" loading="lazy" width="180" height="225"></button>':m.photo?'<button type="button" class="nm-chat-photo" data-mentari-open="photo" aria-label="Lihat foto meja dekat jendela di Photos"><img src="./gallery/window-table.jpg" alt="Dua gelas kopi di meja dekat jendela" loading="lazy" width="180" height="240"></button>':'';
  return divider+'<div class="bubble-row '+(m.me?'me':'them')+(samePrevious?' chat-cluster-follow':'')+(sameNext?' chat-cluster-has-next':'')+'">'+(m.text?'<div class="bubble" title="'+esc(m.time)+'">'+esc(m.text)+'</div>':'')+image+'</div>';
 }).join('');
 $('app-content').innerHTML='<div class="conversation harley-au-conversation nm-archive"><div class="convo-scroll" id="chat-scroll">'+bubbles+'</div><div class="nm-archive-footer">Percakapan lama</div></div>';
 const sc=$('chat-scroll');
 sc.scrollTop=scrollTop===null?sc.scrollHeight:scrollTop;
}

const priorRender=render;
render=function(){
 const isArchive=state.screen==='app'&&state.app==='messages'&&state.view==='convo'&&state.thread==='mentari';
 const scrollTop=isArchive&&archiveWasOpen?($('chat-scroll')?.scrollTop??null):null;
 priorRender(); // Preserve story timer cleanup and mandatory navigation rules.
 const inApp=state.screen==='app';
 $('phone').classList.toggle('nm-reminders-mode',inApp&&state.app==='reminders');
 if(inApp&&state.app==='reminders')renderReminders();
 if(isArchive)renderArchive(scrollTop);
 archiveWasOpen=isArchive;
};

document.addEventListener('click',e=>{
 if(state.screen!=='app')return;
 const checkbox=e.target.closest('[data-personal-reminder]');
 if(checkbox&&state.app==='reminders'){
  e.preventDefault();e.stopImmediatePropagation();
  const id=checkbox.dataset.personalReminder;
  if(!reminderItems.some(x=>x.id===id))return;
  if(completed.has(id))completed.delete(id);else completed.add(id);
  setSaved('personal-reminders-v1',Object.fromEntries(reminderItems.map(x=>[x.id,completed.has(x.id)])));
  render();
  ($('app-content').querySelector('[data-personal-reminder="'+id+'"]')||$('app-content').querySelector('[data-personal-completed]'))?.focus();
  return;
 }
 if(e.target.closest('[data-personal-completed]')&&state.app==='reminders'){
  e.preventDefault();e.stopImmediatePropagation();showCompleted=!showCompleted;render();return;
 }
 if(e.target.closest('[data-mentari-photo-dismiss]')){
  e.preventDefault();e.stopImmediatePropagation();
  if(profilePhotoViewer)profilePhotoViewer.hidden=true;
  return;
 }
 const link=e.target.closest('[data-mentari-open]');
 if(!link)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(link.dataset.mentariOpen==='chat'){
  openApp('messages');
  // openApp may keep the player in a mandatory Notes checklist.
  if(state.app!=='messages')return;
  state.thread='mentari';state.view='convo';render();
 }else if(link.dataset.mentariOpen==='profile-photo'){
  if(!profilePhotoViewer){
   profilePhotoViewer=document.createElement('div');
   profilePhotoViewer.className='nm-profile-photo-viewer';
   profilePhotoViewer.setAttribute('role','dialog');
   profilePhotoViewer.setAttribute('aria-modal','true');
   profilePhotoViewer.setAttribute('aria-label','Foto Nakula dari Mentari');
   profilePhotoViewer.innerHTML='<button type="button" class="nm-profile-photo-dismiss" data-mentari-photo-dismiss aria-label="Tutup foto">×</button><img src="./gallery/nakula-mentari-dinner.webp" alt="Foto Nakula saat makan malam">';
   $('phone').appendChild(profilePhotoViewer);
  }
  profilePhotoViewer.hidden=false;
  profilePhotoViewer.querySelector('[data-mentari-photo-dismiss]')?.focus();
 }else if(link.dataset.mentariOpen==='photo'&&memoryPhoto>=0){
  openApp('photos');
  if(state.app!=='photos')return;
  photoTab='albums';photoSection='favorites';state.photo=memoryPhoto;state.view='photo';photoInfoOpen=true;render();
 }
},true);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&profilePhotoViewer&&!profilePhotoViewer.hidden){
  e.preventDefault();e.stopImmediatePropagation();profilePhotoViewer.hidden=true;
 }
},true);
})();
