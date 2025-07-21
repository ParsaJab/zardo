
let gold = parseInt(localStorage.getItem("gold")) || 0;
let clicks = parseInt(localStorage.getItem("clicks")) || 0;
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let xpToNext = parseInt(localStorage.getItem("xpToNext")) || 10;
let storageLevel = parseInt(localStorage.getItem("storageLevel")) || 1;
let storageLimit = storageLevel * 20;

let businesses = JSON.parse(localStorage.getItem("businesses")) || {
  shop: 0,
  factory: 0,
  bank: 0
};

const goldEl = document.getElementById("gold");
const clicksEl = document.getElementById("clicks");
const levelEl = document.getElementById("level");
const xpEl = document.getElementById("xp");
const xpNextEl = document.getElementById("xp-next");
const storageLimitEl = document.getElementById("storage-limit");
const storageCapEl = document.getElementById("storage-capacity");

function updateUI() {
  goldEl.textContent = gold;
  clicksEl.textContent = clicks;
  levelEl.textContent = level;
  xpEl.textContent = xp;
  xpNextEl.textContent = xpToNext;
  storageLimitEl.textContent = storageLimit;
  storageCapEl.textContent = "Level " + storageLevel;

  document.getElementById("shop-count").textContent = businesses.shop;
  document.getElementById("factory-count").textContent = businesses.factory;
  document.getElementById("bank-count").textContent = businesses.bank;
}

document.getElementById("click-btn").addEventListener("click", () => {
  gold += level;
  if (gold > storageLimit) gold = storageLimit;
  clicks += 1;
  xp += 1;

  if (xp >= xpToNext) {
    xp -= xpToNext;
    level += 1;
    xpToNext = Math.floor(xpToNext * 1.5);
  }

  saveData();
  updateUI();
});

function buyBusiness(type) {
  const prices = { shop: 50, factory: 200, bank: 1000 };
  if (gold >= prices[type]) {
    gold -= prices[type];
    businesses[type]++;
    saveData();
    updateUI();
  } else {
    alert("Not enough gold!");
  }
}

function upgradeStorage() {
  const upgradeCost = 500;
  if (gold >= upgradeCost) {
    gold -= upgradeCost;
    storageLevel++;
    storageLimit = storageLevel * 20;
    saveData();
    updateUI();
  } else {
    alert("Not enough gold to upgrade storage!");
  }
}

function earnPassiveGold() {
  if (gold >= storageLimit) return;

  gold += businesses.shop * 0.2;
  gold += businesses.factory * 1;
  gold += businesses.bank * 5;

  if (gold > storageLimit) gold = storageLimit;

  gold = Math.floor(gold);
  saveData();
  updateUI();
}

function saveData() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("xpToNext", xpToNext);
  localStorage.setItem("storageLevel", storageLevel);
  localStorage.setItem("businesses", JSON.stringify(businesses));
}

function resetGame() {
  localStorage.clear();
  location.reload();
}

document.getElementById("reset-btn").addEventListener("click", resetGame);

setInterval(earnPassiveGold, 1000);

updateUI();
