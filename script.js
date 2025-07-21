let gold = 0, level = 1, xp = 0, xpToNextLevel = 20, vault = 0, vaultCapacity = 100, vaultLevel = 1, clickCount = 0, totalEarnings = 0;
let robotOwned = false, robotPower = 1, robotUpgradeCost = 100, businessStarted = false, darkMode = false;

const panels = {
  "tab-main": document.getElementById("main-panel"),
  "tab-business": document.getElementById("business-panel"),
  "tab-robot": document.getElementById("robot-panel"),
  "tab-referral": document.getElementById("referral-panel"),
};
const allTabs = document.querySelectorAll(".tab");
const allPanels = Object.values(panels);

allTabs.forEach(tab => {
  tab.onclick = () => {
    allTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    allPanels.forEach(p => p.classList.add("hidden"));
    panels[tab.id].classList.remove("hidden");
  };
});
document.getElementById("settings-open").onclick = () => {
  allPanels.forEach(p => p.classList.add("hidden"));
  document.getElementById("settings-panel").classList.remove("hidden");
};

function updateUI() {
  document.getElementById("gold-count").textContent = gold;
  document.getElementById("vault-amount").textContent = vault;
  document.getElementById("vault-fill").style.width = `${(vault/vaultCapacity)*100}%`;
  document.getElementById("vault-upgrade-cost").textContent = vaultLevel * 50;
  document.getElementById("level").textContent = `Lvl ${level}`;
  document.getElementById("xp-fill").style.width = `${(xp/xpToNextLevel)*100}%`;
  document.getElementById("profile-info").innerHTML =
    `<p>Level: ${level}</p>
    <p>Income/Minute: ${robotOwned ? robotPower : 0}</p>
    <p>Clicks: ${clickCount}</p>
    <p>Total Earnings: ${totalEarnings}</p>`;
  if (robotOwned) {
    document.getElementById("robot-status").classList.add("hidden");
    document.getElementById("robot-upgrade").classList.remove("hidden");
    document.getElementById("robot-power").textContent = robotPower;
    document.getElementById("robot-upgrade-cost").textContent = robotUpgradeCost;
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
updateUI();
