// buildings.js - building definitions and purchase logic
const Buildings = (function(){
  const defs = [
    {id:'cursor',name:'Cursor',basePrice:15,baseCps:0.1},
    {id:'grandma',name:'Grandma',basePrice:100,baseCps:1},
    {id:'farm',name:'Farm',basePrice:1100,baseCps:8},
    {id:'mine',name:'Mine',basePrice:12000,baseCps:47},
    {id:'factory',name:'Factory',basePrice:130000,baseCps:260},
    {id:'bank',name:'Bank',basePrice:1400000,baseCps:1400},
    {id:'temple',name:'Temple',basePrice:20000000,baseCps:7800},
    // add more as desired
  ];
  const state = {};
  defs.forEach(d=>state[d.id]={...d,amount:0,level:0});
  function priceFor(b){
    // exponential price growth ~1.15^n
    return Math.floor(b.basePrice * Math.pow(1.15, b.amount));
  }
  function cpsFor(b){
    // building base cps times amount and level scaling
    let mult = 1 + b.level*0.05;
    return b.baseCps * b.amount * mult;
  }
  function buy(id, player){
    const b = state[id];
    const price = priceFor(b);
    if(player.cookies >= price){
      player.cookies -= price;
      b.amount += 1;
      player.recalculate();
      UI.setCookiesText(player.cookies);
      renderBuildings(player);
      return true;
    }
    return false;
  }
  function levelUp(id, player){
    const b = state[id];
    const cost = Math.floor(priceFor(b)*10);
    if(player.cookies>=cost){
      player.cookies-=cost;
      b.level++;
      player.recalculate();
      UI.setCookiesText(player.cookies);
      renderBuildings(player);
      return true;
    }
    return false;
  }
  function renderBuildings(player){
    const container = document.getElementById('buildings');
    container.innerHTML = '';
    defs.forEach(d=>{
      const s = state[d.id];
      const el = document.createElement('div');
      el.className='building';
      el.innerHTML = `
        <img src="" alt="${d.name}">
        <div class="meta">
          <div><strong>${d.name}</strong> (x${s.amount})</div>
          <div>Price: ${UI.formatNumber(priceFor(s))} — CpS: ${UI.formatNumber((s.baseCps * s.amount * (1 + s.level*0.05)))} </div>
        </div>
        <div>
          <button data-buy="${d.id}">Buy</button>
          <button data-level="${d.id}">Level+</button>
        </div>
      `;
      container.appendChild(el);
    });
    // attach handlers
    container.querySelectorAll('[data-buy]').forEach(btn=>btn.onclick=()=>{
      buy(btn.getAttribute('data-buy'), playerState);
    });
    container.querySelectorAll('[data-level]').forEach(btn=>btn.onclick=()=>{
      levelUp(btn.getAttribute('data-level'), playerState);
    });
  }

  function totalCps(){
    let t=0;
    Object.values(state).forEach(b=>t+=cpsFor(b));
    return t;
  }

  function exportState(){ return JSON.parse(JSON.stringify(state)); }
  function importState(s){ Object.keys(s).forEach(k=>{ if(state[k]) Object.assign(state[k], s[k]); }) }

  return {defs,state,priceFor,cpsFor,buy,levelUp,renderBuildings,totalCps,exportState,importState};
})();
