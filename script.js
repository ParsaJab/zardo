// script.js

let gold = 0;
let level = 1;
let xp = 0;
let xpToNextLevel = 20;
let vault = 0;
let vaultCapacity = 100;
let vaultLevel = 1;
let clickCount = 0;
let totalEarnings = 0;
let darkMode = false;
let robotOwned = false;
let robotPower = 1;
let robotUpgradeCost = 100;
let businessStarted = false;

const goldDisplay = document.getElementById("gold-count");
const vaultAmount = document.getElementById("vault-amount");
const vaultFill = document.getElementById("vault-fill");
const vaultUpgradeCostDisplay = document.getElementById("vault-upgrade-cost");
const levelDisplay = document.getElementById("level");
const xpFill = document.getElementById("xp-fill");
const profileInfo = document.getElementById("profile-info");
const clickBtn = document.getElementById("click-button");
const robotStatus = document.getElementById("robot-status");
const robotUpgrade = document.getElementById("robot-upgrade");
const robotPowerDisplay = document.getElementById("robot-power");
const robotUpgradeDisplay = document.getElementById("robot-upgrade-cost");
const businessList = document.getElementById("business-list");

function updateUI() {
  goldDisplay.textContent = gold;
  vaultAmount.textContent = vault;
  vaultFill.style.width = `${(vault / vaultCapacity) * 100}%`;
  vaultUpgradeCostDisplay.textContent = vaultLevel * 50;
  levelDisplay.textContent = `Lvl ${level}`;
  xpFill.style.width = `${(xp / xpToNextLevel) * 100}%`;

  profileInfo.innerHTML = `
    <p>Level: ${level}</p>
    <p>Income/Minute: ${robotOwned ? robotPower : 0}</p>
    <p>Clicks: ${clickCount}</p>
    <p>Total Earnings: ${totalEarnings}</p>
  `;

  if (robotOwned) {
    robotStatus.classList.add("hidden");
    robotUpgrade.classList.remove("hidden");
    robotPowerDisplay.textContent = robotPower;
    robotUpgradeDisplay.textContent = robotUpgradeCost;
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

clickBtn.addEventListener("click", () => {
  const earned = level;
  if (vault + earned <= vaultCapacity) {
    vault += earned;
  } else {
    vault = vaultCapacity;
  }
  gainXP(1);
  clickCount++;
  totalEarnings += earned;
  clickBtn.classList.add("clicked");
  setTimeout(() => clickBtn.classList.remove("clicked"), 100);
  updateUI();
});

document.getElementById("collect-button").addEventListener("click", () => {
  gold += vault;
  vault = 0;
  updateUI();
});

document.getElementById("upgrade-vault-button").addEventListener("click", () => {
  const cost = vaultLevel * 50;
  if (gold >= cost) {
    gold -= cost;
    vaultLevel++;
    vaultCapacity = vaultLevel * 100;
    updateUI();
  }
});

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkMode = !darkMode;
});

document.getElementById("buy-robot").addEventListener("click", () => {
  if (gold >= 200) {
    gold -= 200;
    robotOwned = true;
    setInterval(() => {
      if (vault + robotPower <= vaultCapacity) {
        vault += robotPower;
      } else {
        vault = vaultCapacity;
      }
      updateUI();
    }, 6000);
    updateUI();
  }
});

document.getElementById("upgrade-robot").addEventListener("click", () => {
  if (gold >= robotUpgradeCost) {
    gold -= robotUpgradeCost;
    robotPower++;
    robotUpgradeCost = Math.floor(robotUpgradeCost * 1.6);
    updateUI();
  }
});

document.getElementById("start-business").addEventListener("click", () => {
  if (!businessStarted) {
    for (let i = 1; i <= 10; i++) {
      const biz = document.createElement("div");
      biz.className = "business-item";
      biz.innerHTML = `
        <p>Business ${i}</p>
        <p>Income: <span id="biz-income-${i}">1</span>/min</p>
        <p>Upgrade Cost: <span id="biz-cost-${i}">${i * 50}</span> Gold</p>
        <button onclick="upgradeBusiness(${i})">Upgrade</button>
      `;
      businessList.appendChild(biz);
    }
    businessStarted = true;
  }
});

function upgradeBusiness(id) {
  const costEl = document.getElementById(`biz-cost-${id}`);
  const incomeEl = document.getElementById(`biz-income-${id}`);
  let cost = parseInt(costEl.textContent);
  let income = parseInt(incomeEl.textContent);
  if (gold >= cost) {
    gold -= cost;
    income += 1;
    cost = Math.floor(cost * 1.5);
    costEl.textContent = cost;
    incomeEl.textContent = income;
    updateUI();
  }
}

// Init
updateUI();
