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

const goldDisplay = document.getElementById("gold-count");
const vaultAmount = document.getElementById("vault-amount");
const vaultFill = document.getElementById("vault-fill");
const vaultUpgradeCostDisplay = document.getElementById("vault-upgrade-cost");
const levelDisplay = document.getElementById("level");
const xpFill = document.getElementById("xp-fill");
const profileInfo = document.getElementById("profile-info");

function updateUI() {
  goldDisplay.textContent = gold;
  vaultAmount.textContent = vault;
  vaultFill.style.width = `${(vault / vaultCapacity) * 100}%`;
  vaultUpgradeCostDisplay.textContent = vaultLevel * 50;
  levelDisplay.textContent = `Lvl ${level}`;
  xpFill.style.width = `${(xp / xpToNextLevel) * 100}%`;

  profileInfo.innerHTML = `
    <p>لول: ${level}</p>
    <p>درآمد/دقیقه: 0</p>
    <p>تعداد کلیک: ${clickCount}</p>
    <p>درآمد کل: ${totalEarnings}</p>
  `;
}

function gainXP(amount) {
  xp += amount;
  if (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
  }
}

document.getElementById("click-button").addEventListener("click", () => {
  const earned = level;
  if (vault + earned <= vaultCapacity) {
    vault += earned;
  } else {
    vault = vaultCapacity;
  }
  gainXP(1);
  clickCount++;
  totalEarnings += earned;
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

// Initialize UI
updateUI();
