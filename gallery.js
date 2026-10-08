(() => {
 const root=document.querySelector('.gallery-page');if(!root)return;
 const items=[...root.querySelectorAll('.gallery-item')],chapters=[...root.querySelectorAll('[data-chapter]')],filters=[...root.querySelectorAll('[data-filter]')];
 const mobileFilter=root.querySelector('#gallery-mobile-filter');
 let visible=[],active=0,previousFocus;
 root.querySelector('.gallery-toolbar').hidden=false;
 const applyFilter=filter=>{
  mobileFilter.value=filter;
  filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===filter)));
  chapters.forEach(chapter=>{chapter.hidden=filter==='all'?chapter.dataset.chapter==='moments':chapter.dataset.chapter!==filter;});
  visible=items.filter(item=>!item.closest('[data-chapter]').hidden);
  root.querySelector('#gallery-status').textContent=visible.length+' photographs';
 };
 filters.forEach(button=>button.addEventListener('click',()=>applyFilter(button.dataset.filter)));
 mobileFilter.addEventListener('change',()=>applyFilter(mobileFilter.value));
 applyFilter('all');
 const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
 const viewer=document.createElement('div');viewer.className='gallery-viewer';viewer.hidden=true;
 viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-label','Photograph viewer');
 viewer.innerHTML='<div class="gallery-viewer-header"><span data-count role="status" aria-live="polite"></span><button data-close aria-label="Close photograph viewer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12m0-12L6 18"/></svg></button></div><div class="gallery-viewer-stage"><button data-prev aria-label="Previous photograph">'+arrow.replace('viewBox=','style="transform:rotate(180deg)" viewBox=')+'</button><button data-next aria-label="Next photograph">'+arrow+'</button></div><div class="gallery-viewer-caption" aria-live="polite"></div>';
 const image=document.createElement('img');image.alt='';
 viewer.querySelector('.gallery-viewer-stage').insertBefore(image,viewer.querySelector('[data-next]'));document.body.append(viewer);
 const stage=viewer.querySelector('.gallery-viewer-stage');
 const message=document.createElement('div');message.className='gallery-viewer-message';message.hidden=true;
 message.innerHTML='<p role="status" aria-live="polite"></p><button type="button" data-retry hidden>Try again</button>';
 stage.append(message);
 const retry=message.querySelector('[data-retry]');
 const closeButton=viewer.querySelector('[data-close]');
 const background=[...document.body.children].filter(node=>node!==viewer&&!['SCRIPT','STYLE'].includes(node.tagName));
 let inertBefore=[],imageRequest=0;
 const render=()=>{
  const item=visible[active],request=++imageRequest;
  stage.classList.remove('is-error');stage.classList.add('is-loading');stage.setAttribute('aria-busy','true');
  message.hidden=false;message.querySelector('p').textContent='Loading photograph…';retry.hidden=true;
  image.src=item.querySelector('a').href;image.alt=item.querySelector('img').alt;
  image.decode().then(()=>{
   if(request!==imageRequest)return;
   stage.classList.remove('is-loading');stage.setAttribute('aria-busy','false');message.hidden=true;
  }).catch(()=>{
   if(request!==imageRequest)return;
   stage.classList.remove('is-loading');stage.classList.add('is-error');stage.setAttribute('aria-busy','false');
   message.querySelector('p').textContent='This photograph could not load.';retry.hidden=false;
  });
  viewer.querySelector('[data-count]').textContent=(active+1)+' / '+visible.length;
  viewer.querySelector('.gallery-viewer-caption').replaceChildren(...[...item.querySelector('figcaption').childNodes].map(node=>node.cloneNode(true)));
 };
 const close=()=>{viewer.hidden=true;imageRequest++;image.removeAttribute('src');document.body.classList.remove('gallery-viewer-open');background.forEach((node,i)=>{node.inert=inertBefore[i];});previousFocus?.focus();};
 const step=direction=>{active=(active+direction+visible.length)%visible.length;render();};
 items.forEach(item=>item.querySelector('a').addEventListener('click',event=>{
  event.preventDefault();active=visible.indexOf(item);previousFocus=document.activeElement;render();viewer.hidden=false;
  inertBefore=background.map(node=>node.inert);background.forEach(node=>{node.inert=true;});
  document.body.classList.add('gallery-viewer-open');closeButton.focus();
 }));
 closeButton.addEventListener('click',close);
 retry.addEventListener('click',()=>{render();closeButton.focus();});
 viewer.querySelector('[data-prev]').addEventListener('click',()=>step(-1));viewer.querySelector('[data-next]').addEventListener('click',()=>step(1));
 viewer.addEventListener('click',event=>{if(event.target===viewer||event.target.classList.contains('gallery-viewer-stage'))close();});
 viewer.addEventListener('keydown',event=>{
  if(event.key==='Escape')close();
  if(event.key==='ArrowRight'){event.preventDefault();step(1);}if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}
  if(event.key!=='Tab')return;
  const buttons=[...viewer.querySelectorAll('button')].filter(button=>button.getClientRects().length);
  if(event.shiftKey&&document.activeElement===buttons[0]){event.preventDefault();buttons.at(-1).focus();}
  else if(!event.shiftKey&&document.activeElement===buttons.at(-1)){event.preventDefault();buttons[0].focus();}
 });
 let start;
 image.addEventListener('touchstart',event=>{start=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});
 image.addEventListener('touchcancel',()=>{start=null;},{passive:true});
 image.addEventListener('touchend',event=>{
  if(!start||!event.changedTouches.length)return;
  const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;start=null;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)step(dx<0?1:-1);
 },{passive:true});
})();

