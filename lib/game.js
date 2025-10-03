// game.js - main loop and player state
const playerState = {
  cookies: 0,
  clickPower: 1,
  cps: 0,
  heavenlyChips: 0,
  tempMultipliers: [], // {mult,expiresAt}
  addTempMultiplier(mult,secs){
    this.tempMultipliers.push({mult,expiresAt:Date.now()+secs*1000});
    this.recalculate();
  },
  recalculate(){
    // base cps = buildings + base passive
    let base = Buildings.totalCps();
    // apply temp multipliers
    const now = Date.now();
    this.tempMultipliers = this.tempMultipliers.filter(t=>t.expiresAt>now);
    let mult = this.tempMultipliers.reduce((m,t)=>m*t.mult,1);
    // heavenly chips boost: 1% per chip unlocked after first buy
    const hcMult = 1 + (this.heavenlyChips*0.01);
    this.cps = base * mult * hcMult;
    UI.setCpsText(this.cps);
  }
};

function init(){
  Buildings.renderBuildings(playerState);
  Upgrades.render(playerState);
  attachHandlers();
  Save.load(playerState);
  UI.setCookiesText(playerState.cookies);
  UI.setCpsText(playerState.cps);
  startGameLoop();
  startGoldenSpawner();
  startAutosave();
  startSugarLumpGrowth();
  startNewsTicker();
}

function attachHandlers(){
  const canvas = document.getElementById('big-cookie');
  canvas.onclick = ()=>{
    playerState.cookies += playerState.clickPower;
    UI.pulse();
    UI.setCookiesText(playerState.cookies);
    playerState.recalculate();
  };
  document.getElementById('ascend-btn').onclick = ()=>{
    // simple ascend: convert cookies to heavenly chips: 1 per 1e12 cookies baked (simplified)
    const gained = Math.floor(playerState.cookies / 1e6);
    if(gained>0){
      playerState.heavenlyChips += gained;
      playerState.cookies = 0;
      Buildings.importState({}); // reset buildings
      playerState.recalculate();
      UI.setCookiesText(playerState.cookies);
      document.getElementById('heavenly-chips').innerText = `Heavenly Chips: ${playerState.heavenlyChips}`;
      showTicker(`Ascended! +${gained} Heavenly Chips`);
    }else{
      alert('Not enough cookies to ascend yet.');
    }
  };
  document.getElementById('export-save').onclick = ()=>Save.exportSave();
  document.getElementById('import-save').onclick = ()=>document.getElementById('import-file').click();
  document.getElementById('import-file').onchange = e=>{
    const f = e.target.files[0];
    if(f) Save.importFromFile(f, playerState);
  };
  // tab switching
  document.querySelectorAll('#tabs button').forEach(b=>{
    b.onclick = ()=>{
      document.querySelectorAll('.tab-pane').forEach(p=>p.classList.add('hidden'));
      document.getElementById(b.getAttribute('data-tab')).classList.remove('hidden');
    };
  });
}

function startGameLoop(){
  let last = Date.now();
  function tick(){
    const now = Date.now();
    const dt = (now-last)/1000;
    last = now;
    // accumulate cookies from cps
    playerState.cookies += playerState.cps * dt;
    UI.setCookiesText(Math.floor(playerState.cookies));
    // occasionally spawn wrinklers and golden cookies handled elsewhere
    requestAnimationFrame(tick);
  }
  tick();
}

function startGoldenSpawner(){
  setInterval(()=>{
    if(Math.random() < 0.08){
      Upgrades.spawnGolden(playerState);
    }
  }, 15000);
}

function startAutosave(){
  setInterval(()=>Save.save(playerState), 15000);
}

// sugar lump system (simplified): available once total cookies baked crosses threshold
let totalEverBaked = 0;
function startSugarLumpGrowth(){
  setInterval(()=>{
    totalEverBaked += playerState.cps * 15; // 15s tick assumption
    if(totalEverBaked > 1e9 && document.getElementById('sugar-status').innerText === 'Locked'){
      document.getElementById('sugar-status').innerText = 'Growing (00:10:00)';
      // simplified: give sugar lumps every 22 hours in real game - we will provide a button for immediate harvest for demo
      document.getElementById('sugar-status').innerHTML = '<button id="harvest-sugar">Harvest 1 LUMP</button>';
      document.getElementById('harvest-sugar').onclick = ()=>{
        playerState.heavenlyChips += 0; // sugar lumps in this simple clone can be used for building levels; implement as needed
        alert('You harvested a sugar lump (demo). In the real game, sugar lumps are a resource that grow over time and can be spent to level buildings.');
      };
    }
  },15000);
}

// news ticker (simple rotating messages)
const tickerMessages = [
  "Local bakery reports record production.",
  "Scientists baffled as cookies cause reality bending.",
  "Grandmas spotted knitting suspicious items.",
  "Strange wrinkler activity detected."
];
function startNewsTicker(){
  let i=0;
  setInterval(()=>{
    showTicker(tickerMessages[i%tickerMessages.length]);
    i++;
  },10000);
}
function showTicker(msg){
  const el = document.getElementById('news-ticker');
  el.innerText = msg;
}

// start
init();
