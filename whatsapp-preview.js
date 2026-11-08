/* Nakula Phone • WhatsApp visual experiment.
   Adds a skin and reversible DOM enhancements. Existing story handlers, checkpoint
   storage, call history, branching choices and message arrays remain authoritative. */
(function(){
  'use strict';
  const phone=document.getElementById('phone');
  const screen=document.getElementById('app-screen');
  const head=document.getElementById('app-header');
  const content=document.getElementById('app-content');
  if(!phone||!screen||!head||!content)return;
  phone.classList.add('wa-preview');
  let filter='all';
  let queued=false;
  const chatIsOpen=()=>typeof state!=='undefined'&&state.screen==='app'&&state.app==='messages';
  const currentView=()=>typeof state!=='undefined'?state.view:null;
  function setFilter(next){
    filter=next;
    const bar=content.querySelector('.wa-filters');
    if(bar){
      bar.querySelectorAll('[data-wa-filter]').forEach(btn=>{
        const selected=btn.getAttribute('data-wa-filter')===filter;
        btn.classList.toggle('is-active',selected);
        btn.setAttribute('aria-pressed',selected?'true':'false');
      });
    }
    const list=content.querySelector('#thread-list');
    if(!list)return;
    const rows=Array.from(list.querySelectorAll('.thread[data-thread]'));
    let visible=0;
    rows.forEach(row=>{
      const unread=row.classList.contains('is-unread');
      const isGroup=/group|grup/i.test(row.querySelector('.thread-name')?.textContent||'');
      const show=filter==='all'||(filter==='unread'&&unread)||(filter==='group'&&isGroup);
      row.hidden=!show;if(show)visible++;
    });
    let empty=content.querySelector('.wa-empty');
    if(!visible){
      if(!empty){empty=document.createElement('div');empty.className='wa-empty';list.after(empty)}
      const text=filter==='group'?'Belum ada percakapan grup.':filter==='unread'?'Semua pesan sudah dibaca.':'Belum ada percakapan.';
      if(empty.textContent!==text)empty.textContent=text;
    }else if(empty){empty.remove()}
  }
  function decorateList(){
    const title=head.querySelector('.app-title');
    if(title&&title.textContent!=='WhatsApp')title.textContent='WhatsApp';
    const large=content.querySelector('.large-title');
    if(large&&large.textContent!=='Chat')large.textContent='Chat';
    const search=content.querySelector('#message-search');
    if(search&&search.placeholder!=='Cari atau mulai chat')search.placeholder='Cari atau mulai chat';
    const list=content.querySelector('#thread-list');
    if(!list)return;
    if(!content.querySelector('.wa-filters')){
      const bar=document.createElement('div');
      bar.className='wa-filters';bar.setAttribute('role','group');bar.setAttribute('aria-label','Filter percakapan');
      [['all','Semua'],['unread','Belum Dibaca'],['group','Grup']].forEach(([id,label])=>{
        const btn=document.createElement('button');
        btn.type='button';btn.dataset.waFilter=id;btn.textContent=label;bar.appendChild(btn);
      });
      const caps=content.querySelector('.smallcaps');
      (caps||list).before(bar);
    }
    setFilter(filter);
  }
  function decorateConversation(){
    const back=head.querySelector('.harley-au-back span');
    if(back&&back.textContent!=='Chat')back.textContent='Chat';
    const backButton=head.querySelector('.harley-au-back');
    if(backButton&&backButton.getAttribute('aria-label')!=='Kembali ke Chat')backButton.setAttribute('aria-label','Kembali ke Chat');
    const input=content.querySelector('#chat-input');
    if(input&&input.placeholder!=='Ketik pesan...')input.placeholder='Ketik pesan...';
    if(input&&input.getAttribute('aria-label')==='iMessage')input.setAttribute('aria-label','Pesan');
    // Attach metadata to real story bubbles. The timestamp comes from its existing
    // title attribute, not from a newly generated fictional message.
    content.querySelectorAll('.convo-scroll .bubble-row').forEach(row=>{
      const bubble=row.querySelector('.bubble');
      if(!bubble||bubble.classList.contains('harley-au-dots')||bubble.querySelector('.wa-bubble-meta'))return;
      const when=bubble.getAttribute('title')||'';
      if(!/^\d{1,2}[.:]\d{2}$/.test(when))return;
      const meta=document.createElement('span');
      meta.className='wa-bubble-meta';
      meta.textContent=when;
      if(row.classList.contains('me')){
        const ticks=document.createElement('span');
        ticks.className='wa-ticks';ticks.setAttribute('aria-label','Terkirim');
        ticks.textContent='✓✓';meta.appendChild(ticks);
      }
      bubble.appendChild(meta);
    });
  }
  function decorate(){
    queued=false;
    const active=chatIsOpen();
    phone.classList.toggle('wa-mode-active',active);
    phone.classList.toggle('wa-mode-conversation',active&&currentView()==='convo');
    if(!active)return;
    if(currentView()==='convo')decorateConversation();
    else decorateList();
  }
  function schedule(){
    if(queued)return;
    queued=true;
    queueMicrotask(decorate);
  }
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-wa-filter]');
    if(!btn||!chatIsOpen()||currentView()==='convo')return;
    e.preventDefault();
    setFilter(btn.dataset.waFilter||'all');
  },true);
  const observer=new MutationObserver(schedule);
  observer.observe(screen,{childList:true,subtree:true});
  observer.observe(phone,{attributes:true,attributeFilter:['class']});
  schedule();
})();