
let gold = 0, level = 1, xp = 0, xpToNextLevel = 20, vault = 0, vaultCapacity = 100, vaultLevel = 1, clickCount = 0, totalEarnings = 0;
let robotOwned = false, robotPower = 1, robotUpgradeCost = 100, businessStarted = false, darkMode = false;

// LOAD DATA FROM LOCALSTORAGE
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
    if (darkMode) document.body.classList.add('dark');
  } catch {}
}
// SAVE DATA TO LOCALSTORAGE
function saveGame() {
  const data = {
    gold, level, xp, xpToNextLevel, vault, vaultCapacity, vaultLevel,
    clickCount, totalEarnings, robotOwned, robotPower, robotUpgradeCost, darkMode
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
  saveGame();
}

function showProfileInfo() {
  document.getElementById("profile-info-settings").innerHTML =
    `<div style="border-radius:12px;background:#e9e9e9;padding:10px 14px;">
      <p><b>Level:</b> ${level}</p>
      <p><b>Income/Minute:</b> ${robotOwned ? robotPower : 0}</p>
      <p><b>Clicks:</b> ${clickCount}</p>
      <p><b>Total Earnings:</b> ${totalEarnings}</p>
    </div>`;
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
  vault = Math.min(vault + earned, vaultCapacity);
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
document.getElementById("start-business").onclick = () => {
  if (!businessStarted) {
    for (let i = 1; i <= 10; i++) {
      let biz = document.createElement("div");
      biz.className = "business-item";
      biz.innerHTML = `
        <p>Business ${i}</p>
        <p>Income: <span id="biz-income-${i}">1</span>/min</p>
        <p>Upgrade Cost: <span id="biz-cost-${i}">${i*50}</span> Gold</p>
        <button onclick="upgradeBusiness(${i})">Upgrade</button>
      `;
      document.getElementById("business-list").appendChild(biz);
    }
    businessStarted = true;
  }
};
window.upgradeBusiness = function(id){
  let costEl = document.getElementById(`biz-cost-${id}`);
  let incomeEl = document.getElementById(`biz-income-${id}`);
  let cost = parseInt(costEl.textContent);
  let income = parseInt(incomeEl.textContent);
  if (gold >= cost) {
    gold -= cost;
    income += 1;
    cost = Math.floor(cost*1.5);
    costEl.textContent = cost;
    incomeEl.textContent = income;
    updateUI();
  }
};
// ===== INIT =====
loadGame();
updateUI();
