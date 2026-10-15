/* React Bits CardNav (intro only) synchronized to the existing hero sequence.
   Sequence: split-flap "HI EVERYONE" -> 2600ms Contact button glow ->
   original navbar reveals from a centred capsule into its current full width.
   Uses the React Bits intro timing (820ms panel, 560ms children, 70ms stagger).
   The existing navbar and Contact button always keep their original functions.
   Intro runs at most once per page load; no dropdown or repeat on click. */
(()=>{'use strict';
  const nav=document.querySelector('.nav-wrap .navbar');
  if(!nav)return;

  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const validEntry=!window.location.hash || window.location.hash==='#home';
  const available=typeof nav.animate==='function' && typeof window.requestAnimationFrame==='function';
  if(reduce || !validEntry || !available)return;

  let started=false;
  let fallbackId=0;
  let finishId=0;
  const animated=[];

  // Keep the original navbar's footprint so it doesn't push or move the hero.
  nav.classList.add('cardnav-intro-waiting');

  function restore(){
    nav.classList.remove('cardnav-intro-waiting','cardnav-intro-playing');
    nav.style.removeProperty('pointer-events');
    nav.style.removeProperty('will-change');
    for(const a of animated){
      try{a.cancel()}catch(_){}
    }
    window.clearTimeout(finishId);
  }

  function reveal(){
    if(started)return;
    started=true;
    window.clearTimeout(fallbackId);
    // Measure live navbar dimensions (works on desktop, tablet and mobile).
    const width=nav.getBoundingClientRect().width;
    const height=nav.getBoundingClientRect().height;
    if(width<1||height<1){restore();return;}
    const edge=Math.max(0,(width-height)/2);
    const radius=Number.parseFloat(getComputedStyle(nav).borderTopLeftRadius)||20;
    const ease='cubic-bezier(0.22, 1, 0.36, 1)';

    nav.classList.remove('cardnav-intro-waiting');
    nav.classList.add('cardnav-intro-playing');

    // Same clip-path expansion as React Bits CardNav "intro":
    // central capsule -> entire existing glass navbar.
    const main=nav.animate([
      {clipPath:`inset(0px ${edge}px round ${height/2}px)`, opacity:0},
      {clipPath:`inset(0px 0px round ${radius}px)`, opacity:1}
    ],{duration:820,easing:ease,fill:'backwards'});
    animated.push(main);

    // Retain all current links; only fade/raise them once into view.
    const children=[nav.querySelector('.brand'),...nav.querySelectorAll('.nav-links a')].filter(Boolean);
    children.forEach((el,i)=>{
      animated.push(el.animate([
        {opacity:0,transform:'translateY(8px)'},
        {opacity:1,transform:'translateY(0)'}
      ],{duration:560,delay:220+i*70,easing:ease,fill:'backwards'}));
    });

    // Always clean up; never leave a clip-path or a disabled navbar behind.
    const finished=Promise.allSettled(animated.map(a=>a.finished));
    finished.then(restore);
    finishId=window.setTimeout(restore,1800);
  }

  // Important: the main HTML fires this exactly as its existing glow ends.
  window.addEventListener('portfolio:contact-glow-complete',reveal,{once:true});

  // Safety: navbar must never remain invisible if an unrelated intro fails.
  fallbackId=window.setTimeout(reveal,15000);
})();
