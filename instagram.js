/* NAKULA PHONE · Instagram-style fictional in-phone application.
 * Reference screenshots guide layout only. No reference people, images,
 * captions, follower totals or bio are used as content.
 * Future character data can be placed in IG_PROFILE and IG_POSTS below.
 */
(function () {
'use strict';
const IG_PROFILE = Object.freeze({
  username: 'nakula.shankara', // provisional handle, replace when supplied
  name: 'Nakula Shankara Bumi',
  avatar: null,               // user will supply
  bio: '',                    // user will supply
  followers: null,            // no invented statistics
  following: null
});
const IG_POSTS = Object.freeze([]); // fill only with approved Nakula photos & captions
const iconPaths = {
 home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
 search:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5.5 5.5"/>',
 add:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7v10M7 12h10"/>',
 heart:'<path d="M20.4 5.6a5.2 5.2 0 0 0-7.3 0L12 6.7l-1.1-1.1a5.2 5.2 0 0 0-7.3 7.3L12 21l8.4-8.1a5.2 5.2 0 0 0 0-7.3z"/>',
 user:'<circle cx="12" cy="8.2" r="3.4"/><path d="M4.7 21a7.3 7.3 0 0 1 14.6 0"/>',
 grid:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
 reels:'<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 11h18M8 6l4 5M15 6l4 5M10 14l6 3.1-6 3.1z"/>',
 tagged:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/>',
 camera:'<path d="M3 7h4l2-2h6l2 2h4v13H3z"/><circle cx="12" cy="13.5" r="4"/>',
 send:'<path d="m22 2-8 20-4.2-8.8L1 9 22 2zM9.8 13.2 22 2"/>',
 bookmark:'<path d="M5 3h14v19l-7-5-7 5z"/>',
 dots:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 back:'<path d="m15 5-7 7 7 7"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 close:'<path d="M5 5l14 14M19 5 5 19"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 18 5-5 3 3 3-4 6 6"/>',
 chat:'<path d="M21 11.4A8.8 8.8 0 0 1 12 20a10 10 0 0 1-4-.8L3 21l1.5-4.3A8.7 8.7 0 0 1 3 11.4 9 9 0 0 1 12 3a9 9 0 0 1 9 8.4z"/>',
 check:'<path d="m5 12 4.5 4.5L19 7"/>'
};
function icon(id, cls=''){
  return '<svg class="ig-svg'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">'+(iconPaths[id]||iconPaths.image)+'</svg>';
}
const e=v=>esc(String(v??''));
let tab='home', profileTab='grid', sheet=null, selectedPost=null, likedPosts=new Set();
function avatar(size=''){
  const a=IG_PROFILE.avatar
    ?'<img src="'+e(IG_PROFILE.avatar)+'" alt="" loading="lazy">'
    :icon('user');
  return '<span class="ig-avatar'+(size?' ig-avatar-'+size:'')+'">'+a+'</span>';
}
function header(){
 if(tab==='profile'){
   return '<div class="ig-head-inner ig-head-profile">'+
    '<button type="button" class="ig-head-icon" data-ig-act="leave" aria-label="Back to phone">'+icon('back')+'</button>'+
    '<strong class="ig-handle">'+e(IG_PROFILE.username)+'</strong>'+
    '<button type="button" class="ig-head-icon" data-ig-act="options" aria-label="Profile options">'+icon('dots')+'</button></div>';
 }
 if(tab==='home'){
  return '<div class="ig-head-inner ig-head-feed">'+
   '<button type="button" class="ig-head-icon" data-ig-nav="compose" aria-label="Camera">'+icon('camera')+'</button>'+
   '<strong class="ig-wordmark">Instagram</strong>'+
   '<button type="button" class="ig-head-icon" data-ig-nav="activity" aria-label="Direct messages (placeholder)">'+icon('send')+'</button></div>';
 }
 const label=tab==='search'?'Explore':tab==='activity'?'Activity':'New post';
 return '<div class="ig-head-inner ig-head-sub"><button type="button" class="ig-head-icon" data-ig-nav="home" aria-label="Back to Feed">'+icon('back')+'</button><strong>'+label+'</strong><span class="ig-head-icon" aria-hidden="true"></span></div>';
}
function nav(){
 const items=[
  ['home','home','Home'],['search','search','Search'],['compose','add','Add post'],['activity','heart','Activity'],['profile','user','Profile']];
 return '<nav class="ig-nav" aria-label="Instagram sections">'+
 items.map(([id,glyph,label])=>'<button type="button" class="ig-nav-item'+(tab===id?' is-active':'')+'" data-ig-nav="'+id+'" aria-label="'+label+'" aria-current="'+(tab===id?'page':'false')+'">'+(id==='profile'?avatar('tiny'):icon(glyph))+'</button>').join('')+'</nav>';
}
function profile(){
 const p=IG_PROFILE;
 const counts=[
  [IG_POSTS.length,'posts'],[p.followers==null?'—':p.followers,'followers'],[p.following==null?'—':p.following,'following']
 ];
 const tabs=[['grid','grid','Posts'],['reels','reels','Reels'],['tagged','tagged','Tagged']];
 return '<section class="ig-profile" aria-label="Nakula Instagram profile">'+
  '<div class="ig-summary"><div class="ig-main-avatar">'+avatar('large')+'</div>'+
  '<div class="ig-stats">'+counts.map(([n,l])=>'<div class="ig-stat"><strong>'+e(n)+'</strong><span>'+e(l)+'</span></div>').join('')+'</div></div>'+
  '<div class="ig-bio"><strong>'+e(p.name)+'</strong>'+
   (p.bio?'<p>'+e(p.bio)+'</p>':'<p class="ig-pending-copy">Bio belum diisi</p>')+'</div>'+
  '<button class="ig-edit-profile" type="button" data-ig-act="edit">Edit profile</button>'+
  '<div class="ig-profile-tabs" role="tablist" aria-label="Profile content">'+
   tabs.map(([id,glyph,label])=>'<button type="button" role="tab" aria-selected="'+(profileTab===id)+'" aria-label="'+label+'" class="'+(profileTab===id?'selected':'')+'" data-ig-profile-tab="'+id+'">'+icon(glyph)+'</button>').join('')+'</div>'+
  '<div class="ig-profile-grid">'+profileContent()+'</div>'+
  '</section>';
}
function profileContent(){
 if(profileTab==='reels'||profileTab==='tagged'){
  return '<div class="ig-blank-view">'+icon(profileTab==='reels'?'reels':'tagged')+
   '<strong>'+ (profileTab==='reels'?'Belum ada Reels':'Belum ada foto ditandai')+'</strong>'+
   '<p>Bagian ini akan diisi jika kontennya sudah tersedia.</p></div>';
 }
 if(!IG_POSTS.length){
  return '<div class="ig-grid-pending"><div class="ig-placeholder-grid">'+
   Array.from({length:3},()=>'<div class="ig-placeholder-tile">'+icon('image')+'</div>').join('')+
   '</div><p>Foto dan postingan Nakula akan ditambahkan di sini.</p></div>';
 }
 return '<div class="ig-post-grid">'+IG_POSTS.map((post,i)=>
  '<button type="button" class="ig-post-tile" data-ig-post="'+i+'" aria-label="Open post '+(i+1)+'"><img src="'+e(post.src)+'" alt="'+e(post.alt||'Nakula post')+'" loading="lazy"></button>').join('')+'</div>';
}
function feed(){
 if(!IG_POSTS.length){
  return '<section class="ig-feed" aria-label="Instagram feed">'+
   '<div class="ig-feed-placeholder-head">'+avatar('small')+'<div><strong>'+e(IG_PROFILE.username)+'</strong><span>Draft feed</span></div>'+icon('dots')+'</div>'+
   '<div class="ig-feed-image-placeholder">'+icon('image')+'<span>Tempat foto postingan</span></div>'+
   '<div class="ig-post-actions"><span>'+icon('heart')+icon('chat')+icon('send')+'</span>'+icon('bookmark')+'</div>'+
   '<div class="ig-pending-caption"><strong>'+e(IG_PROFILE.username)+'</strong><span>Caption dan komentar akan ditambahkan setelah konten diterima.</span></div>'+
   '<div class="ig-feed-status">Belum ada postingan yang diisi.</div>'+
   '</section>';
 }
 return '<section class="ig-feed" aria-label="Instagram feed">'+IG_POSTS.map((post,i)=>{
  const liked=likedPosts.has(i);
  return '<article class="ig-post"><div class="ig-feed-placeholder-head">'+avatar('small')+'<div><strong>'+e(IG_PROFILE.username)+'</strong></div>'+icon('dots')+'</div>'+
   '<img class="ig-post-image" src="'+e(post.src)+'" alt="'+e(post.alt||'Nakula photo')+'" loading="lazy">'+
   '<div class="ig-post-actions"><span><button type="button" data-ig-like="'+i+'" aria-label="'+(liked?'Unlike':'Like')+' post" class="'+(liked?'is-liked':'')+'">'+icon('heart')+'</button>'+
   '<button type="button" data-ig-post="'+i+'" aria-label="View comments">'+icon('chat')+'</button>'+icon('send')+'</span>'+icon('bookmark')+'</div>'+
   '<p class="ig-post-caption"><strong>'+e(IG_PROFILE.username)+'</strong> '+e(post.caption||'')+'</p></article>';
 }).join('')+'</section>';
}
function emptyPage(section){
 const data={
  search:['search','Explore','Pencarian dan konten lainnya belum tersedia.'],
  activity:['heart','Activity','Aktivitas dan pesan akan muncul setelah konten ditambahkan.'],
  compose:['add','New post','Foto untuk postingan Nakula belum diberikan.']
 }[section]||['image','Not available',''];
 return '<div class="ig-centered-empty">'+icon(data[0])+'<strong>'+data[1]+'</strong><p>'+data[2]+'</p>'+
 (section==='compose'?'<button type="button" class="ig-empty-action" data-ig-nav="profile">Lihat profil</button>':'')+'</div>';
}
function postDetail(index){
 const post=IG_POSTS[index];if(!post)return profile();
 return '<section class="ig-feed">'+
  '<div class="ig-feed-placeholder-head">'+avatar('small')+'<div><strong>'+e(IG_PROFILE.username)+'</strong></div>'+icon('dots')+'</div>'+
  '<img class="ig-post-image" src="'+e(post.src)+'" alt="'+e(post.alt||'Nakula photo')+'">'+
  '<div class="ig-post-actions"><span>'+icon('heart')+icon('chat')+icon('send')+'</span>'+icon('bookmark')+'</div>'+
  '<p class="ig-post-caption"><strong>'+e(IG_PROFILE.username)+'</strong> '+e(post.caption||'')+'</p>'+
  '</section>';
}
function popup(){
 if(!sheet)return '';
 const copy=sheet==='edit'?'Foto profil, bio, username final, dan konten Nakula akan ditambahkan saat kamu mengirimkan asetnya.':
  'Instagram ini merupakan simulasi di dalam Nakula Phone. Belum terhubung ke akun Instagram sungguhan.';
 return '<div class="ig-modal-backdrop" data-ig-act="dismiss"><section class="ig-modal" role="dialog" aria-modal="true" aria-label="Instagram placeholder information">'+
  '<button class="ig-modal-close" data-ig-act="dismiss" aria-label="Close">'+icon('close')+'</button>'+
  '<strong>'+ (sheet==='edit'?'Profil Nakula':'Instagram') +'</strong><p>'+copy+'</p>'+
  '<button type="button" class="ig-modal-done" data-ig-act="dismiss">OK</button>'+
  '</section></div>';
}
function renderInstagram(){
 const phone=document.getElementById('phone');
 if(!phone||state.screen!=='app'||state.app!=='instagram')return;
 phone.classList.add('nakula-instagram-mode');
 const app=document.getElementById('app-screen');
 const head=document.getElementById('app-header'),content=document.getElementById('app-content');
 if(!head||!content)return;
 app.classList.remove('in-conversation','np-photo-page');
 head.innerHTML=header();
 const body=selectedPost!=null?postDetail(selectedPost):tab==='profile'?profile():tab==='home'?feed():emptyPage(tab);
 content.innerHTML='<div class="ig-shell"><div class="ig-main-scroll" data-ig-scroll>'+body+'</div>'+nav()+popup()+'</div>';
 content.style.padding='0';content.style.overflow='hidden';content.style.overflowY='hidden';
}
const previousRender=render;
render=function(){
 if(state.screen==='app'&&state.app==='instagram'){renderInstagram();return}
 document.getElementById('phone')?.classList.remove('nakula-instagram-mode');
 return previousRender();
};
const previousLayer=layer;
layer=function(where){
 previousLayer(where);
 document.getElementById('phone')?.classList.toggle('nakula-instagram-mode',where==='app'&&state.app==='instagram');
};
const previousOpenApp=openApp;
openApp=function(id){
 if(id==='instagram'){tab='home';profileTab='grid';sheet=null;selectedPost=null}
 return previousOpenApp(id);
};
const previousBack=back;
back=function(){
 if(state.screen==='app'&&state.app==='instagram'){
  if(sheet){sheet=null;renderInstagram();return}
  if(selectedPost!=null){selectedPost=null;tab='profile';renderInstagram();return}
  if(tab!=='home'){tab='home';renderInstagram();return}
  goHome();return;
 }
 return previousBack();
};
document.addEventListener('click',ev=>{
 if(state.screen!=='app'||state.app!=='instagram')return;
 const navButton=ev.target.closest('[data-ig-nav]');
 if(navButton){
  ev.preventDefault();ev.stopImmediatePropagation();
  tab=navButton.dataset.igNav;selectedPost=null;sheet=null;renderInstagram();return;
 }
 const subtab=ev.target.closest('[data-ig-profile-tab]');
 if(subtab){
  ev.preventDefault();ev.stopImmediatePropagation();
  profileTab=subtab.dataset.igProfileTab;selectedPost=null;renderInstagram();return;
 }
 const post=ev.target.closest('[data-ig-post]');
 if(post){
  ev.preventDefault();ev.stopImmediatePropagation();
  selectedPost=Number(post.dataset.igPost);renderInstagram();return;
 }
 const like=ev.target.closest('[data-ig-like]');
 if(like){
  ev.preventDefault();ev.stopImmediatePropagation();
  const id=Number(like.dataset.igLike);if(likedPosts.has(id))likedPosts.delete(id);else likedPosts.add(id);
  renderInstagram();return;
 }
 const action=ev.target.closest('[data-ig-act]');
 if(!action)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const name=action.dataset.igAct;
 if(name==='leave'){goHome();return}
 if(name==='edit'||name==='options'){sheet=name;renderInstagram();return}
 if(name==='dismiss'){sheet=null;renderInstagram();return}
},true);
window.nakulaInstagramTemplate=Object.freeze({
 get profile(){return {...IG_PROFILE}},
 get postCount(){return IG_POSTS.length}
});
})();