/* DUEMME V87 — progressive enhancement; no JSON/catalog CMS modifications. */
(()=>{'use strict';
const root=document.querySelector('.du-service-catalog');if(!root)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function enhance(card){
 if(card.dataset.duInteractive)return;card.dataset.duInteractive='1';
 const photo=card.querySelector('.du-model-fullphoto');
 if(!photo)return;
 let processed=false;
 const observer=new MutationObserver(()=>{
  if(processed)return;
  const img=photo.querySelector('img');if(!img)return;
  processed=true;observer.disconnect();
  img.loading='lazy';img.decoding='async';img.tabIndex=0;
  img.setAttribute('role','button');img.setAttribute('aria-label','Ingrandisci fotografia del prodotto');
  const controls=document.createElement('div');controls.className='du-v87-controls';
  const zoom=document.createElement('button');zoom.type='button';zoom.textContent='Ingrandisci fotografia +';
  controls.append(zoom);photo.append(controls);
  function show(){
   const dialog=document.createElement('dialog');dialog.className='du-v87-dialog';
   const close=document.createElement('button');close.type='button';close.textContent='Chiudi ×';close.className='du-v87-close';
   const big=img.cloneNode(false);big.removeAttribute('role');big.removeAttribute('tabindex');big.removeAttribute('aria-label');big.loading='eager';
   dialog.append(close,big);document.body.append(dialog);
   close.onclick=()=>dialog.close();
   dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
   dialog.addEventListener('close',()=>dialog.remove(),{once:true});
   try{dialog.showModal()}catch(e){dialog.remove()}
  }
  zoom.onclick=show;img.onclick=show;img.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show()}};
 });
 observer.observe(photo,{childList:true,subtree:true});
 if(photo.querySelector('img'))observer.takeRecords(),observer.disconnect(),processed=false,observer.observe(photo,{childList:true,subtree:true});
 card.addEventListener('toggle',()=>{if(card.open&&!reduce){card.classList.remove('du-v87-enter');void card.offsetWidth;card.classList.add('du-v87-enter')}});
}
const mo=new MutationObserver(()=>root.querySelectorAll('.du-model-card').forEach(enhance));
mo.observe(root,{childList:true,subtree:true});root.querySelectorAll('.du-model-card').forEach(enhance);
})();
