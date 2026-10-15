/* Static HTML adapter for the user-specified MagicBento configuration.
   No React, build pipeline, libraries, or global animation changes required. */
(() => {
  'use strict';
  const grid = document.getElementById('aboutMagicBento');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.mbp-card')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  const config = Object.freeze({columns:4,rowHeight:200,gap:12,radius:20,enableBorderGlow:true,enableSpotlight:true,spotlightRadius:300,clickEffect:true,enableStars:false,particleCount:24,enableTilt:false,enableMagnetism:false,textAutoHide:true,intro:true,theme:'dark',glowColor:'#7fd6f6'});
  // Read-only diagnostics; preserve the exact requested interaction settings.
  grid.dataset.config = 'classic';
  cards.forEach((card,i)=>{
    card.style.setProperty('--mbp-order', String(i));
    let scheduled = false, nextX = 0, nextY = 0;
    card.addEventListener('pointermove',event=>{
      if (!finePointer.matches || !config.enableSpotlight) return;
      const r=card.getBoundingClientRect();
      nextX=event.clientX-r.left;nextY=event.clientY-r.top;
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{
        card.style.setProperty('--mbp-x', `${nextX}px`);
        card.style.setProperty('--mbp-y', `${nextY}px`);
        card.classList.add('mbp-hot');
        scheduled=false;
      });
    },{passive:true});
    card.addEventListener('pointerleave',()=>card.classList.remove('mbp-hot'),{passive:true});
    if(config.clickEffect)card.addEventListener('click',event=>{
      if(reduce.matches)return;
      const rect=card.getBoundingClientRect();
      const ripple=document.createElement('span');
      ripple.className='mbp-ripple';
      ripple.setAttribute('aria-hidden','true');
      ripple.style.left=`${event.clientX-rect.left}px`;
      ripple.style.top=`${event.clientY-rect.top}px`;
      card.appendChild(ripple);
      ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});
    });
  });
  const reveal=()=>{
    grid.classList.add('mbp-revealed');
    cards.forEach(c=>c.classList.add('mbp-in-view'));
  };
  if(config.intro && !reduce.matches && 'IntersectionObserver' in window){
    grid.classList.add('mbp-animate');
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();reveal();
    },{threshold:0.1});
    observer.observe(grid);
  } else reveal();
  // Existing portfolio rain and scroll engines remain untouched.
})();
