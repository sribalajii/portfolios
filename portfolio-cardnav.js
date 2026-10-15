/* React Bits CardNav: one-time automatic 'rise' intro once HERO Contact glow finishes.
   Preserves the original navbar HTML/visuals; standard click navigation remains available.
   Settings: openOn=click, surface=glass, stagger=.12, bounce=.2, speed=1,
   cardHeight=176, maxWidth=800, intro=true. */
(()=>{'use strict';
const panel=document.getElementById('portfolioCardNav');
const contact=document.getElementById('contactNavTrigger');
if(!panel||!contact)return;
const cards=Array.from(panel.querySelectorAll('.portfolio-card-nav__card'));
const reduce=window.matchMedia('(prefers-reduced-motion:reduce)');
let open=false, cinematicUsed=false, hideTimer=0, autoCloseTimer=0, autoOpened=false;

function clearTimers(){
  window.clearTimeout(hideTimer);
  window.clearTimeout(autoCloseTimer);
}
function runCinematicIntro(){
  if(reduce.matches)return;
  // One-time CardNav spring/rise sequence; never replay on subsequent clicks.
  if(typeof panel.animate==='function'){
    panel.animate([
      {clipPath:'inset(0% 49% 0% 49% round 40px)',opacity:.35},
      {clipPath:'inset(0% 0% 0% 0% round 20px)',opacity:1}
    ],{duration:820,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  cards.forEach((card,index)=>{
    card.getAnimations().forEach(a=>a.cancel());
    card.animate([
      {opacity:0,transform:'translateY(26px) scale(.97)'},
      {opacity:1,transform:'translateY(-3px) scale(1.004)',offset:.80},
      {opacity:1,transform:'translateY(0) scale(1)'}
    ],{duration:680,delay:index*120,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
  });
}
function setOpen(next,{cinematic=false,automatic=false}={}){
  if(next===open)return;
  open=next;
  clearTimers();
  if(next){
    panel.hidden=false;
    panel.removeAttribute('inert');
    contact.dataset.cardnavOpen='';
    contact.setAttribute('aria-expanded','true');
    autoOpened=automatic;
    requestAnimationFrame(()=>{
      if(!open)return;
      panel.dataset.open='';
      if(cinematic)runCinematicIntro();
    });
  }else{
    panel.removeAttribute('data-open');
    panel.setAttribute('inert','');
    contact.removeAttribute('data-cardnav-open');
    contact.setAttribute('aria-expanded','false');
    cards.forEach(card=>card.getAnimations().forEach(a=>a.cancel()));
    autoOpened=false;
    hideTimer=window.setTimeout(()=>{if(!open)panel.hidden=true},reduce.matches?0:330);
  }
}
// The existing HERO Contact glow emits this event exactly when its 2600ms sequence ends.
window.addEventListener('portfolio:contact-glow-complete',()=>{
  if(cinematicUsed)return;
  cinematicUsed=true;
  if(reduce.matches||open)return;
  setOpen(true,{cinematic:true,automatic:true});
  // Introduction is self-contained: the cards close again without changing the URL.
  autoCloseTimer=window.setTimeout(()=>{
    if(autoOpened&&open&&!panel.matches(':hover'))setOpen(false);
  },4200);
},{once:true});

// Preserve the existing Contact action: while the menu is open, Contact navigates
// to #contact. When closed, clicking opens the glass cards without intro replay.
contact.addEventListener('click',event=>{
  if(open){setOpen(false);return}
  event.preventDefault();
  event.stopImmediatePropagation();
  setOpen(true);
},true);
panel.addEventListener('click',event=>{
  if(event.target.closest('a'))setOpen(false);
});
panel.addEventListener('pointerenter',()=>{
  if(autoOpened)window.clearTimeout(autoCloseTimer);
});
panel.addEventListener('pointerleave',()=>{
  if(autoOpened&&open)autoCloseTimer=window.setTimeout(()=>{
    if(open&&autoOpened)setOpen(false);
  },1150);
});
document.addEventListener('pointerdown',event=>{
  if(!open)return;
  if(panel.contains(event.target)||contact.contains(event.target))return;
  setOpen(false);
});
document.addEventListener('keydown',event=>{
  if(!open||event.key!=='Escape')return;
  setOpen(false);contact.focus();
});
window.addEventListener('hashchange',()=>{if(open)setOpen(false)});
})();
