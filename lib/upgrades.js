// upgrades.js - basic upgrade system and golden cookie
const Upgrades = (function(){
  const defs = [
    {id:'double-click',name:'Clicking gains +1 per click',price:100,apply:player=>player.clickPower+=1},
    {id:'cursor-boost',name:'Cursors are stronger',price:500,apply:player=>{
      Buildings.state.cursor.baseCps *= 1.5;
    }},
    // ... more
  ];
  const owned = new Set();

  function render(player){
    const el = document.getElementById('upgrades');
    el.innerHTML = '<div class="upgrade-grid"></div>';
    const grid = el.querySelector('.upgrade-grid');
    defs.forEach(u=>{
      const btn = document.createElement('div');
      btn.className='upgrade';
      btn.innerText = `${u.name}\n(${UI.formatNumber(u.price)})`;
      btn.onclick=()=>buy(u,player,btn);
      grid.appendChild(btn);
    });
  }

  function buy(u,player,btn){
    if(owned.has(u.id)) return;
    if(player.cookies>=u.price){
      player.cookies-=u.price;
      u.apply(player);
      owned.add(u.id);
      player.recalculate();
      UI.setCookiesText(player.cookies);
      btn.style.opacity=0.5;
    }
  }

  // golden cookie event simplified
  function spawnGolden(player){
    const el = document.getElementById('golden-cookie');
    el.classList.remove('hidden');
    el.onclick = ()=>{
      el.classList.add('hidden');
      const r = Math.random();
      if(r<0.5){
        // frenzy: 7x CpS for 77s simplified
        player.addTempMultiplier(7,77);
        showTicker('Golden cookie: Frenzy! 7x CpS');
      } else {
        player.cookies += 1000 + player.cps*10;
        UI.setCookiesText(player.cookies);
        showTicker('Golden cookie: +cookies!');
      }
    };
    // auto-hide after 15s
    setTimeout(()=>el.classList.add('hidden'),15000);
  }

  return {render,spawnGolden};
})();
