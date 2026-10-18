/* DUEMME V54: navigazione + invio diretto moduli tramite servizio HTTPS (GitHub Pages). */
(()=>{'use strict';
const menu=document.getElementById('menu'),nav=document.getElementById('links');
if(menu&&nav){const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'};menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});}
const year=document.getElementById('year');if(year)year.textContent=String(new Date().getFullYear());
let scheduled=false;const sectionIds=['home','servizi','marchi','come-funziona','territorio','ecotek','azienda','assistenza','contatti'];
function updateNav(){scheduled=false;document.body.classList.toggle('is-scrolled',window.scrollY>15);if(!nav)return;let active='home';const offset=window.scrollY+Math.min(225,window.innerHeight*.32);sectionIds.forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top+window.scrollY<=offset)active=id});const hrefs={'come-funziona':'#servizi','marchi':'#servizi','territorio':'#servizi','ecotek':'#servizi'};nav.querySelectorAll('a[href^="#"]').forEach(a=>{const on=a.getAttribute('href')===(hrefs[active]||'#'+active);a.classList.toggle('is-active',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;window.requestAnimationFrame(updateNav)}},{passive:true});updateNav();
const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce&&'IntersectionObserver'in window){const items=[...document.querySelectorAll('.du-reveal')];if(items.length){const observer=new IntersectionObserver(entries=>{entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('is-visible');observer.unobserve(x.target)}})},{threshold:.07,rootMargin:'0px 0px 35px 0px'});items.forEach(e=>observer.observe(e));document.documentElement.classList.add('du-motion')}}
const need=document.getElementById('du-need');
if(need){const known=[...need.options].map(o=>o.value);const setNeed=v=>{if(known.includes(v))need.value=v};try{const fromUrl=new URLSearchParams(window.location.search).get('esigenza');if(fromUrl)setNeed(fromUrl)}catch(_){}
document.querySelectorAll('[data-request]').forEach(a=>a.addEventListener('click',()=>setNeed(a.getAttribute('data-request')||'Preventivo / informazioni')));}
const ENDPOINT='https://formsubmit.co/ajax/amministrazione@duemmeoffice.it';
function setStatus(status,text,state){if(!status)return;status.textContent=text;status.classList.remove('du-send-ok','du-send-error','du-send-progress');if(state)status.classList.add('du-send-'+state)}
function configureForm(form,statusId){if(!form)return;
const status=document.getElementById(statusId);const submit=form.querySelector('button[type="submit"]');const fallback=form.querySelector('.du-fallback-submit');if(fallback)fallback.addEventListener('click',()=>{if(!sending&&form.reportValidity())HTMLFormElement.prototype.submit.call(form)});
const originalLabel=submit?submit.textContent:'';let sending=false;
form.addEventListener('submit',async event=>{
event.preventDefault();if(sending||!form.reportValidity())return;
const honey=form.querySelector('[name="_honey"]');if(honey&&honey.value){setStatus(status,'Non è stato possibile completare la richiesta. Riprova.', 'error');return}
const fields=Object.fromEntries(new FormData(form).entries());
if(form.id==='du-request-form')fields._subject='DUEMME | Richiesta '+(fields.esigenza||'preventivo / informazioni');
if(fields.email)fields._replyto=String(fields.email).trim();
fields._url=window.location.href.split('#')[0];
sending=true;if(submit){submit.disabled=true;submit.setAttribute('aria-busy','true');submit.textContent='Invio in corso…'}
if(fallback)fallback.hidden=true;setStatus(status,'Invio della richiesta in corso…','progress');
const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),25000);
try{
const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(fields),signal:controller.signal,credentials:'omit'});
const data=await response.json().catch(()=>null);
if(!response.ok||!data||(data.success!==true&&data.success!=='true'))throw new Error(data&&data.message?String(data.message):'Il servizio di invio non ha confermato la richiesta.');
form.reset();setStatus(status,'Richiesta trasmessa con successo. DUEMME ti risponderà utilizzando i recapiti indicati.','ok');
}catch(err){setStatus(status,'Invio non confermato: '+(err.name==='AbortError'?'tempo di attesa scaduto.':err.message||'errore di rete.')+' I dati rimangono nel modulo: prova l’invio alternativo oppure chiama lo 0931 759890.','error');if(fallback)fallback.hidden=false;}
finally{clearTimeout(timeout);sending=false;if(submit){submit.disabled=false;submit.removeAttribute('aria-busy');submit.textContent=originalLabel}}
});}
configureForm(document.getElementById('du-request-form'),'du-form-status');
configureForm(document.getElementById('du-assistenza-form'),'du-tech-status');
})();
