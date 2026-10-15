/* React Bits ScrollExpand easing ported for the existing .site scroll container.
 * Exact settings: width42 height58 radius24->0 zoom1.35 distance1.2 hold.35 smooth.1 scrim.45.
 * ?scrollExpand=off disables the experiment and retains the original Contact card. */
(()=>{'use strict';
const root=document.getElementById('contactScrollExpand'),site=document.querySelector('.site');
if(!root||!site||new URLSearchParams(location.search).get('scrollExpand')==='off')return;
const supported=matchMedia('(min-width:901px) and (min-height:651px) and (prefers-reduced-motion:no-preference)');
if(!supported.matches)return;
const el=s=>root.querySelector(s),track=el('.se-contact__track'),stage=el('.se-contact__stage'),frame=el('.se-contact__frame'),media=el('.se-contact__media'),title=el('.se-contact__title'),overlay=el('.contact-card'),scrim=el('.se-contact__scrim'),hint=el('.se-contact__hint');
if(![track,stage,frame,media,title,overlay,scrim,hint].every(Boolean))return;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smoothstep=(a,b,x)=>{const t=clamp((x-a)/(b-a||1e-6),0,1);return t*t*(3-2*t)};
let stageH=0,current=0,target=0,raf=0,running=false,enabled=false;
function apply(p){
const e=smoothstep(0,1,p),w=42+(100-42)*e,h=58+(100-58)*e,ix=Math.max(0,(100-w)/2),iy=Math.max(0,(100-h)/2),r=24-24*e;
frame.style.clipPath='inset('+iy+'% '+ix+'% '+iy+'% '+ix+'% round '+r+'px)';
media.style.transform='scale('+(1.35+(1-1.35)*e)+')';
scrim.style.opacity=String(.45*e);
const out=smoothstep(.4,.88,p);title.style.opacity=String(1-out);title.style.translate='0 '+(-28*out)+'px';title.style.scale=String(1+.06*out);
hint.style.opacity=String(1-smoothstep(0,.12,p));
const inn=smoothstep(.68,1,p);overlay.style.opacity=String(inn);overlay.style.transform='translate3d(0,'+(18*(1-inn))+'px,0)';overlay.style.pointerEvents=p>.90?'auto':'none';
root.dataset.progress=String(Math.round(p*100));
root.dataset.progressFine=String(p);
const laserOn=smoothstep(.56,.88,p);
root.style.setProperty('--contact-laser-alpha',String((.66*laserOn).toFixed(3)));
}
function measure(){stageH=Math.max(520,site.clientHeight-108);stage.style.height=stageH+'px';track.style.height=stageH*(1+1.2+.35)+'px';root.style.setProperty('--se-stage-h',stageH+'px')}
function progress(){const top=track.getBoundingClientRect().top-site.getBoundingClientRect().top-94;return clamp(-top/(stageH*1.2),0,1)}
function tick(){const k=1-Math.exp(-1/(60*.1));current+=(target-current)*k;if(Math.abs(target-current)<.0004){current=target;running=false}apply(current);raf=running?requestAnimationFrame(tick):0}
function kick(){if(!enabled||running)return;running=true;if(!raf)raf=requestAnimationFrame(tick)}
function scroll(){if(!enabled)return;target=progress();kick()}
function resize(){if(!enabled)return;measure();target=progress();current=target;apply(current)}
function onMedia(){
 if(!supported.matches){enabled=false;if(raf)cancelAnimationFrame(raf);raf=0;running=false;root.classList.remove('se-contact--active');root.style.removeProperty('--se-stage-h');stage.style.removeProperty('height');track.style.removeProperty('height');frame.style.removeProperty('clip-path');media.style.removeProperty('transform');overlay.style.removeProperty('opacity');overlay.style.removeProperty('transform');overlay.style.removeProperty('pointer-events');delete root.dataset.progress;delete root.dataset.progressFine;root.style.removeProperty('--contact-laser-alpha');return}
 if(enabled)return;enabled=true;root.classList.add('se-contact--active');measure();target=progress();current=target;apply(current)
}
site.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize,{passive:true});supported.addEventListener('change',onMedia);if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(site);onMedia();
})();