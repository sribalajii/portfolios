/* React Bits CardNav (intro only) synchronized to the existing hero sequence.
   Sequence: split-flap "HI EVERYONE" reaches midpoint ->
   original navbar reveals from a centred capsule into its current full width.
   The existing Contact button glow continues independently afterwards.
   Uses the React Bits intro timing (820ms panel, 560ms children, 70ms stagger).
   The existing navbar and Contact button always keep their original functions.
   Intro runs at most once per page load; no dropdown or repeat on click. */
(()=>{'use strict';
  const nav=document.querySelector('.nav-wrap .navbar');
  if(!nav)return;

  // PillNav hover/fill/roll/dot, adapted to the original navbar links.
  // Adds only child spans: existing anchors, hrefs, dimensions and CSS glass stay.
  function setupPillNavHover(){
    const links=[...nav.querySelectorAll('.nav-links a[href^="#"]')];
    for(const link of links){
      if(link.dataset.pnReady)continue;
      const label=link.textContent.trim();
      if(!label)continue;
      const fill=document.createElement('span');
      fill.className='pn-fill';
      fill.setAttribute('aria-hidden','true');
      const face=document.createElement('span');
      face.className='pn-face';
      face.textContent=label;
      const alternate=document.createElement('span');
      alternate.className='pn-face-alt';
      alternate.textContent=label;
      alternate.setAttribute('aria-hidden','true');
      link.replaceChildren(fill,face,alternate);
      link.classList.add('pn-hover-item');
      link.dataset.pnReady='1';
    }
    const updateActive=()=>{
      const active=window.location.hash;
      links.forEach(link=>{
        const on=Boolean(active&&active!=='#home'&&link.getAttribute('href')===active);
        link.toggleAttribute('data-pn-active',on);
        if(on)link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    };
    updateActive();
    window.addEventListener('hashchange',updateActive);
    // The site's smooth-scroll handler uses history.replaceState (no hashchange).
    nav.addEventListener('click',event=>{
      if(event.target.closest('.nav-links a, .brand'))requestAnimationFrame(updateActive);
    });
    // Keep indicators correct after back/forward navigation.
    window.addEventListener('popstate',updateActive);
  }
  setupPillNavHover();


  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const available=typeof nav.animate==='function' && typeof window.requestAnimationFrame==='function';
  // Deep links should not disable the entrance; the hero can run on any load.
  if(reduce || !available)return;

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
    window.clearTimeout(fallbackId);
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

  // The hero's own animation fires this about halfway through the split flaps.
  window.addEventListener('portfolio:hero-midpoint',reveal,{once:true});

  // Reliable fallback is anchored to window load (when the hero intro begins).
  // If a custom event is lost, still reveal the navbar without a long blank bar.
  const scheduleFallback=()=>{if(!started)fallbackId=window.setTimeout(reveal,1700);};
  if(document.readyState==='complete')scheduleFallback();
  else window.addEventListener('load',scheduleFallback,{once:true});
})();
