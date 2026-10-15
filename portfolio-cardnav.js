/* React Bits CardNav rise, glass, stagger=.12, bounce=.2, speed=1
   adapted as a dropdown BELOW the original navbar. No replacement navigation. */
(()=>{'use strict';
const panel=document.getElementById('portfolioCardNav');
const contact=document.getElementById('contactNavTrigger');
const links=document.querySelector('.navbar .nav-links');
if(!panel||!contact||!links)return;
const cards=Array.from(panel.querySelectorAll('.portfolio-card-nav__card'));
const reduce=window.matchMedia('(prefers-reduced-motion:reduce)');
let open=false,closeTimer=0,firstOpen=true;
const animateIn=()=>{
 if(reduce.matches)return;
 cards.forEach((card,i)=>{
   card.getAnimations().forEach(a=>a.cancel());
   card.animate([
    {opacity:0,transform:'translateY(26px) scale(.97)'},
    {opacity:1,transform:'translateY(-2px) scale(1.005)',offset:.78},
    {opacity:1,transform:'translateY(0) scale(1)'}
   ],{duration:600,delay:i*120,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
 });
};
function setOpen(next){
 if(next===open)return;
 open=next;
 clearTimeout(closeTimer);
 if(next){
   panel.hidden=false;
   panel.removeAttribute('inert');
   contact.dataset.cardnavOpen='';
   contact.setAttribute('aria-expanded','true');
   requestAnimationFrame(()=>{
     if(!open)return;
     panel.dataset.open='';
     animateIn();
   });
   firstOpen=false;
 }else{
   panel.removeAttribute('data-open');
   panel.setAttribute('inert','');
   contact.removeAttribute('data-cardnav-open');
   contact.setAttribute('aria-expanded','false');
   cards.forEach(card=>card.getAnimations().forEach(a=>a.cancel()));
   const delay=reduce.matches?0:350;
   closeTimer=setTimeout(()=>{if(!open)panel.hidden=true},delay);
 }
}
// First click opens cards; a second click preserves the original #contact navigation.
contact.addEventListener('click',event=>{
 if(open){setOpen(false);return}
 event.preventDefault();event.stopImmediatePropagation();
 setOpen(true);
},true);
panel.addEventListener('click',event=>{
 if(event.target.closest('a'))setOpen(false);
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
