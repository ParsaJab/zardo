
let gold = 0, level = 1, xp = 0, xpToNextLevel = 20, vault = 0, vaultCapacity = 100, vaultLevel = 1, clickCount = 0, totalEarnings = 0;
let robotOwned = false, robotPower = 1, robotUpgradeCost = 100, businessStarted = false, darkMode = false;

// هر بیزنس: {id, name, owned, level, income, baseCost}
const businessDefs = [
  {id:1, name:"Bakery", baseCost:100},
  {id:2, name:"Cafe", baseCost:250},
  {id:3, name:"Shop", baseCost:500},
  {id:4, name:"Restaurant", baseCost:1200},
  {id:5, name:"Bookstore", baseCost:2600},
  {id:6, name:"Pharmacy", baseCost:5400},
  {id:7, name:"Gym", baseCost:9000},
  {id:8, name:"Hotel", baseCost:16000},
  {id:9, name:"Factory", baseCost:25000},
  {id:10, name:"Bank", baseCost:44000}
];
let businesses = []; // {id, level, income}
let bizInterval = null;

function getBusiness(id) {
  return businesses.find(b=>b.id===id);
}
function businessUpgradeCost(biz) {
  return Math.floor(businessDefs[biz.id-1].baseCost * Math.pow(1.7, biz.level));
}

// ذخیره و لود بازی
function loadGame() {
  try {
    const data = JSON.parse(localStorage.getItem('zardoSave'));
    if (!data) return;
    gold = data.gold || 0;
    level = data.level || 1;
    xp = data.xp || 0;
    xpToNextLevel = data.xpToNextLevel || 20;
    vault = data.vault || 0;
    vaultCapacity = data.vaultCapacity || 100;
    vaultLevel = data.vaultLevel || 1;
    clickCount = data.clickCount || 0;
    totalEarnings = data.totalEarnings || 0;
    robotOwned = data.robotOwned || false;
    robotPower = data.robotPower || 1;
    robotUpgradeCost = data.robotUpgradeCost || 100;
    darkMode = data.darkMode || false;
    businesses = data.businesses || [];
    if (darkMode) document.body.classList.add('dark');
  } catch {}
}
function saveGame() {
  const data = {
    gold, level, xp, xpToNextLevel, vault, vaultCapacity, vaultLevel,
    clickCount, totalEarnings, robotOwned, robotPower, robotUpgradeCost, darkMode,
    businesses
  };
  localStorage.setItem('zardoSave', JSON.stringify(data));
}

// ==== TAB SWITCHER ====
const allTabs = document.querySelectorAll('.tab');
const allPanels = document.querySelectorAll('.panel');
allTabs.forEach(tab => {
  tab.onclick = () => {
    allTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    allPanels.forEach(p => p.classList.add('hidden'));
    document.getElementById(tab.dataset.panel).classList.remove('hidden');
    if(tab.dataset.panel==="panel-business") renderBusinesses();
    if(tab.dataset.panel==="panel-robot") renderRobotPanel();
  }
});
document.getElementById("settings-open").onclick = () => {
  allPanels.forEach(p => p.classList.add("hidden"));
  document.getElementById("settings-panel").classList.remove("hidden");
  showProfileInfo();
};

function updateUI() {
  document.getElementById("gold-count").textContent = gold;
  document.getElementById("vault-amount").textContent = vault;
  document.getElementById("vault-fill").style.width = `${(vault/vaultCapacity)*100}%`;
  document.getElementById("vault-upgrade-cost").textContent = vaultLevel * 50;
  document.getElementById("level").textContent = `Lvl ${level}`;
  document.getElementById("xp-fill").style.width = `${(xp/xpToNextLevel)*100}%`;
  // آپدیت امتیاز گلد در صفحات بیزنس و ربات
  let bizGold = document.getElementById("biz-gold-amount");
  if(bizGold) bizGold.textContent = gold;
  let robotGold = document.getElementById("robot-gold-amount");
  if(robotGold) robotGold.textContent = gold;
  saveGame();
}

function showProfileInfo() {
  document.getElementById("profile-info-settings").innerHTML =
    `<div style="border-radius:12px;background:#e9e9e9;padding:10px 14px;">
      <p><b>Level:</b> ${level}</p>
      <p><b>Income/Minute:</b> ${robotOwned ? robotPower : 0}</p>
      <p><b>Clicks:</b> ${clickCount}</p>
      <p><b>Total Earnings:</b> ${totalEarnings}</p>
      <button id="reset-game-btn" style="margin-top:18px;background:#ff4848;color:#fff;padding:8px 18px;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">Reset Game</button>
    </div>`;
  document.getElementById("reset-game-btn").onclick = () => {
    if(confirm("Are you sure? All your progress will be lost!")){
      localStorage.removeItem('zardoSave');
      location.reload();
    }
  }
}

function gainXP(amount) {
  xp += amount;
  if (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
  }
}
document.getElementById("click-button").onclick = () => {
  const earned = level;
  gold += earned; // مستقیم به Gold اضافه شود
  gainXP(1);
  clickCount++;
  totalEarnings += earned;
  document.getElementById("click-button").classList.add("clicked");
  setTimeout(()=>document.getElementById("click-button").classList.remove("clicked"), 100);
  updateUI();
};
document.getElementById("collect-button").onclick = () => {
  gold += vault; vault = 0; updateUI();
};
document.getElementById("upgrade-vault-button").onclick = () => {
  let cost = vaultLevel*50;
  if (gold >= cost) { gold -= cost; vaultLevel++; vaultCapacity = vaultLevel*100; updateUI(); }
};
document.getElementById("toggle-theme").onclick = () => {
  document.body.classList.toggle("dark");
  darkMode = document.body.classList.contains('dark');
  saveGame();
};
document.getElementById("buy-robot").onclick = () => {
  if (gold >= 200) {
    gold -= 200; robotOwned = true;
    setInterval(() => {
      vault = Math.min(vault + robotPower, vaultCapacity);
      updateUI();
    }, 6000);
    updateUI();
  }
};
document.getElementById("upgrade-robot").onclick = () => {
  if (gold >= robotUpgradeCost) {
    gold -= robotUpgradeCost; robotPower++; robotUpgradeCost = Math.floor(robotUpgradeCost*1.6); updateUI();
  }
};

// درآمد بیزنس‌ها هر دقیقه به Vault اضافه شود
function startBusinessIncome() {
  if(bizInterval) clearInterval(bizInterval);
  bizInterval = setInterval(()=>{
    let total = 0;
    businesses.forEach(biz=>{ total+=biz.income; });
    if(total>0){
      vault = Math.min(vault+total, vaultCapacity);
      updateUI();
    }
  }, 60000);
}
function renderBusinesses() {
  const bizList = document.getElementById("business-list");
  bizList.innerHTML = "";
  // نمایش Gold
  let goldDiv = document.createElement("div");
  goldDiv.style = "font-size:17px;font-weight:bold;text-align:right;margin:8px 0 4px 0;";
  goldDiv.innerHTML = `Gold: <span id="biz-gold-amount">${gold}</span>`;
  bizList.appendChild(goldDiv);
  if(businesses.length===0) {
    let startBox = document.createElement("div");
    startBox.className = "business-item business-locked";
    startBox.style.margin = "40px auto 0 auto"; startBox.style.textAlign="center";
    startBox.innerHTML = `<button class="biz-buy-btn" style="font-size:19px;min-width:180px;min-height:54px;">Start Business</button>`;
    startBox.querySelector(".biz-buy-btn").onclick = ()=>{
      let list = businessDefs.filter(def=>!getBusiness(def.id));
      if(list.length>0){
        let select = prompt("Choose Business:
" + list.map((b,i)=>`${i+1}- ${b.name} (${b.baseCost} Gold)`).join('\n'));
        let idx = parseInt(select)-1;
        if(!isNaN(idx) && list[idx] && gold>=list[idx].baseCost){
          gold-=list[idx].baseCost;
          businesses.push({id:list[idx].id,level:1,income:5});
          updateUI();
          renderBusinesses();
          startBusinessIncome();
        }
      }
    };
    bizList.appendChild(startBox);
    return;
  }
  // Owned Businesses
  bizList.innerHTML += "<h3 style='margin:8px 0;'>Your Businesses</h3>";
  businesses.forEach(biz => {
    const def = businessDefs[biz.id-1];
    let box = document.createElement("div");
    box.className = "business-item business-owned";
    box.innerHTML = `<div class="biz-title">${def.name} <span class="biz-lvl">Lvl ${biz.level}</span></div>
      <div class="biz-income">Income: <b>${biz.income}</b>/min</div>
      <button class="biz-upgrade-btn" ${biz.level>=10?"disabled":""}>
        Upgrade (${businessUpgradeCost(biz)} Gold)
      </button>
    `;
    box.querySelector(".biz-upgrade-btn").onclick = ()=>{
      let upCost = businessUpgradeCost(biz);
      if(gold>=upCost && biz.level<10) {
        gold-=upCost;
        biz.level+=1;
        biz.income+=2;
        updateUI();
        renderBusinesses();
      }
    };
    bizList.appendChild(box);
  });
  // Start Business (only for NOT OWNED businesses)
  let startDiv = document.createElement("div");
  startDiv.innerHTML = "<h3 style='margin:12px 0 5px 0;'>Start New Business</h3>";
  businessDefs.filter(def=>!getBusiness(def.id)).forEach(def=>{
    let startBox = document.createElement("div");
    startBox.className = "business-item business-locked";
    startBox.innerHTML = `<div class="biz-title">${def.name}</div>
    <div class="biz-income">Income: <b>5</b>/min</div>
    <button class="biz-buy-btn">
      Buy (${def.baseCost} Gold)
    </button>`;
    startBox.querySelector(".biz-buy-btn").onclick = ()=>{
      if(gold>=def.baseCost) {
        gold-=def.baseCost;
        businesses.push({id:def.id,level:1,income:5});
        updateUI();
        renderBusinesses();
        startBusinessIncome();
      }
    };
    startDiv.appendChild(startBox);
  });
  bizList.appendChild(startDiv);
}

// Gold در ربات
function renderRobotPanel() {
  let panel = document.getElementById("panel-robot");
  let goldDiv = panel.querySelector("#robot-gold-row");
  if(!goldDiv) {
    goldDiv = document.createElement("div");
    goldDiv.id = "robot-gold-row";
    goldDiv.style = "font-size:17px;font-weight:bold;text-align:right;margin:8px 0 4px 0;";
    goldDiv.innerHTML = `Gold: <span id="robot-gold-amount">${gold}</span>`;
    panel.insertBefore(goldDiv, panel.firstChild);
  }
  else {
    goldDiv.innerHTML = `Gold: <span id="robot-gold-amount">${gold}</span>`;
  }
}

loadGame();
updateUI();
startBusinessIncome();
