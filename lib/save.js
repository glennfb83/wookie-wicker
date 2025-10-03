// save.js - autosave and export/import
const Save = (function(){
  function save(player){
    const data = {
      cookies: player.cookies,
      clickPower: player.clickPower,
      heavenlyChips: player.heavenlyChips,
      buildings: Buildings.exportState(),
      upgrades: [] // not tracked fully in this simple save
    };
    localStorage.setItem('cookie_clone_save', btoa(JSON.stringify(data)));
  }
  function load(player){
    const raw = localStorage.getItem('cookie_clone_save');
    if(!raw) return false;
    try{
      const data = JSON.parse(atob(raw));
      player.cookies = data.cookies||0;
      player.clickPower = data.clickPower||1;
      player.heavenlyChips = data.heavenlyChips||0;
      Buildings.importState(data.buildings||{});
      player.recalculate();
      return true;
    }catch(e){console.error('load err',e); return false;}
  }
  function exportSave(){
    const raw = localStorage.getItem('cookie_clone_save') || btoa(JSON.stringify({}));
    const blob = new Blob([raw],{type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download='cookie-clone-save.txt'; a.click();
    URL.revokeObjectURL(url);
  }
  function importFromFile(file, player){
    const reader = new FileReader();
    reader.onload = e=>{
      try{
        localStorage.setItem('cookie_clone_save', e.target.result);
        load(player);
        alert('Imported!');
      }catch(err){alert('Bad save file');}
    };
    reader.readAsText(file);
  }
  return {save,load,exportSave,importFromFile};
})();
