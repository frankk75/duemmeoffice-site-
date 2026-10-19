/* DUEMME V54: navigazione + invio diretto moduli tramite servizio HTTPS (GitHub Pages). */
(()=>{'use strict';
const menu=document.getElementById('menu'),nav=document.getElementById('links');
if(menu&&nav){const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'};menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});}

/* DUEMME V57 — testata compatta durante lo scorrimento, comune a tutte le pagine. */
function initCompactHeader(){
  const header=document.querySelector('.du-top-v39');
  const row=header&&header.querySelector('.du-nav-row');
  const brand=header&&header.querySelector('.du-header-brand');
  if(!header||!row||!brand||row.querySelector('.du-compact-brand'))return;
  const compactBrand=document.createElement('a');
  compactBrand.className='du-compact-brand';
  compactBrand.href='index.html';
  compactBrand.setAttribute('aria-label','DUEMME S.r.l. — Torna alla homepage');
  const image=brand.querySelector('img');
  if(image){const mini=image.cloneNode(true);mini.removeAttribute('width');mini.removeAttribute('height');mini.alt='DUEMME S.r.l.';compactBrand.appendChild(mini)}
  row.prepend(compactBrand);
  const phone=document.createElement('a');
  phone.className='du-compact-phone';
  phone.href='tel:+390931759890';
  phone.textContent='☎ 0931 759890';
  phone.setAttribute('aria-label','Chiama DUEMME al numero 0931 759890');
  row.appendChild(phone);
  const css=`
    .du-top-v39 .du-header-upper{max-height:260px;overflow:hidden;transition:max-height .26s ease,opacity .22s ease;opacity:1}
    .du-top-v39.du-header-compact .du-header-upper{max-height:0;opacity:0;visibility:hidden}
    .du-top-v39 .du-nav-row .du-compact-brand,.du-top-v39 .du-nav-row .du-compact-phone{display:none!important}
    .du-top-v39.du-header-compact .du-nav-strip{box-shadow:0 5px 18px #0e35521c!important}
    .du-top-v39.du-header-compact .du-nav-row{display:flex;align-items:center;justify-content:space-between;gap:clamp(6px,1.3vw,22px);min-height:66px;max-width:1160px;margin:0 auto}
    .du-top-v39.du-header-compact .du-nav-row .du-compact-brand{display:flex!important;flex:none;align-items:center;justify-content:center;padding:3px 0!important;margin-right:auto;line-height:1!important;max-width:110px}
    .du-top-v39.du-header-compact .du-nav-row .du-compact-brand img{display:block;width:108px;max-width:100%;max-height:56px;object-fit:contain}
    .du-top-v39.du-header-compact .du-nav-row .du-compact-brand::after,.du-top-v39.du-header-compact .du-nav-row .du-compact-phone::after{display:none!important;content:none!important}
    .du-top-v39.du-header-compact .du-nav-row .du-compact-phone{display:flex!important;flex:none;white-space:nowrap;font-size:12px!important;font-weight:750!important;color:#125b8e;padding:8px 2px!important;margin-left:auto}
    .du-top-v39.du-header-compact .du-nav-strip .du-nav-row>a:not(.du-compact-brand):not(.du-compact-phone){font-size:clamp(12px,1.1vw,15px)!important;padding:17px 2px!important}
    html.du-header-is-compact{scroll-padding-top:86px}
    @media(max-width:1050px){.du-top-v39.du-header-compact .du-nav-row .du-compact-phone{display:none!important}.du-top-v39.du-header-compact .du-nav-row{gap:clamp(3px,1vw,15px)}}
    @media(max-width:680px){
      .du-top-v39.du-header-compact .du-nav-row{min-height:54px;width:calc(100% - 20px);gap:1px;justify-content:space-between}
      .du-top-v39.du-header-compact .du-nav-row .du-compact-brand{max-width:57px;margin-right:2px;padding:2px 0!important}
      .du-top-v39.du-header-compact .du-nav-row .du-compact-brand img{width:56px;max-height:45px}
      .du-top-v39.du-header-compact .du-nav-strip .du-nav-row>a:not(.du-compact-brand):not(.du-compact-phone){font-size:clamp(9px,2.2vw,11px)!important;letter-spacing:-.025em;padding:15px 1px!important}
      html.du-header-is-compact{scroll-padding-top:70px}
    }
    @media(max-width:360px){.du-top-v39.du-header-compact .du-nav-row .du-compact-brand{max-width:48px}.du-top-v39.du-header-compact .du-nav-row .du-compact-brand img{width:47px}.du-top-v39.du-header-compact .du-nav-strip .du-nav-row>a:not(.du-compact-brand):not(.du-compact-phone){font-size:8.8px!important}}
    @media(prefers-reduced-motion:reduce){.du-top-v39 .du-header-upper{transition:none}}
  `;
  const style=document.createElement('style');style.id='du-v57-header-compact';style.textContent=css;document.head.appendChild(style);
  let last=null;
  function sync(){const compact=window.scrollY>95;if(compact===last)return;last=compact;header.classList.toggle('du-header-compact',compact);document.documentElement.classList.toggle('du-header-is-compact',compact)}
  window.addEventListener('scroll',sync,{passive:true});sync();
}
initCompactHeader();

/* DUEMME V62 — illustrazioni nella parte libera della testata (solo desktop). */
function initHeaderIllustrations(){
  if(!document.querySelector('.du-top-v39 .du-header-upper') || document.getElementById('du-v62-header-art'))return;
  const style=document.createElement('style');
  style.id='du-v62-header-art';
  style.textContent=`
    @media (min-width:1120px){
      .du-top-v39 .du-header-upper{position:relative;isolation:isolate}
      .du-top-v39 .du-header-upper::after{
        content:'';position:absolute;right:0;top:0;bottom:0;
        width:min(39vw,680px);pointer-events:none;z-index:0;
        background-image:url('assets/duemme-header-illustrazioni.webp');
        background-repeat:no-repeat;background-position:right center;background-size:contain;
        opacity:.98
      }
      .du-top-v39 .du-header-inner{position:relative;z-index:1}
      .du-top-v39 .du-header-contacts{max-width:590px}
    }
    @media(max-width:1119px){.du-top-v39 .du-header-upper::after{content:none!important}}
    @media(min-width:1120px) and (max-width:1280px){
      .du-top-v39 .du-header-upper::after{width:32vw;opacity:.85}
    }
    .du-top-v39.du-header-compact .du-header-upper::after{opacity:0}
  `;
  document.head.appendChild(style);
}
initHeaderIllustrations();


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
