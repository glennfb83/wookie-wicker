// ui.js - handles DOM helpers, cookie canvas, basic animations
const UI = (function(){
  const bigCookie = document.getElementById('big-cookie');
  const ctx = bigCookie.getContext('2d');
  function drawCookie(radius=100){
    const cx = bigCookie.width/2, cy = bigCookie.height/2;
    ctx.clearRect(0,0,bigCookie.width,bigCookie.height);
    // base cookie
    const grad = ctx.createRadialGradient(cx-20,cy-15,20,cx,cy,140);
    grad.addColorStop(0,'#fff0d6');
    grad.addColorStop(0.6,'#ffd38a');
    grad.addColorStop(1,'#e0a64a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx,cy,radius,0,Math.PI*2);
    ctx.fill();
    // chips
    for(let i=0;i<18;i++){
      const a = i*(Math.PI*2/18) + (Math.random()-0.5)*0.2;
      const r = radius*0.65 + Math.random()*radius*0.25;
      ctx.fillStyle = '#6b3a1a';
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a)*r, cy + Math.sin(a)*r, 8, 6, a, 0, Math.PI*2);
      ctx.fill();
    }
  }
  drawCookie();

  // click ripple
  function pulse() {
    const el = bigCookie;
    el.animate([{transform:'scale(1)'},{transform:'scale(0.98)'},{transform:'scale(1)'}],{duration:200, easing:'ease-out'});
  }

  // set top stats
  function setCookiesText(n){
    document.getElementById('cookies-display').innerText = `${formatNumber(n)} cookies`;
  }
  function setCpsText(n){
    document.getElementById('cps-display').innerText = `${formatNumber(n)} CpS`;
  }
  function formatNumber(n){
    if(n>=1e12) return (n/1e12).toFixed(2)+' T';
    if(n>=1e9) return (n/1e9).toFixed(2)+' B';
    if(n>=1e6) return (n/1e6).toFixed(2)+' M';
    if(n>=1000) return (n/1000).toFixed(2)+' k';
    return Math.floor(n).toString();
  }

  return {drawCookie,pulse,setCookiesText,setCpsText,formatNumber};
})();
