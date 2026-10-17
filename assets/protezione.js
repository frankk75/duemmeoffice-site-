/* DUEMME V48 – Deterrenti leggeri (non impediscono screenshot/DevTools).
   Conservare funzionamento di link, form, area privacy e funzioni di accessibilità. */
(()=>{'use strict';
 const editable=(target)=>{
   const el=target && (target.nodeType===1?target:target.parentElement);
   return !!(el && el.closest('form, input, textarea, select, [contenteditable="true"], .du-allow-copy'));
 };
 document.addEventListener('contextmenu', (event)=>{
   if(!editable(event.target))event.preventDefault();
 });
 document.addEventListener('dragstart',(event)=>{
   const target=event.target && (event.target.nodeType===1?event.target:event.target.parentElement);
   if(target && target.closest('img, picture, svg, [draggable="true"]'))event.preventDefault();
 });
 document.addEventListener('copy',(event)=>{
   if(!editable(event.target))event.preventDefault();
 });
 document.addEventListener('cut',(event)=>{
   if(!editable(event.target))event.preventDefault();
 });
 document.addEventListener('keydown',(event)=>{
   if(!(event.ctrlKey||event.metaKey)||event.altKey||editable(event.target))return;
   const key=event.key.toLowerCase();
   if(key==='c'||key==='x')event.preventDefault();
 });
 document.querySelectorAll('img').forEach(img=>{img.draggable=false});
})();
