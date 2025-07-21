
let gold = parseInt(localStorage.getItem("gold")) || 0;
let passiveGold = parseFloat(localStorage.getItem("passiveGold")) || 0;
let clicks = parseInt(localStorage.getItem("clicks")) || 0;
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let xpToNext = parseInt(localStorage.getItem("xpToNext")) || 10;
let storageLevel = parseInt(localStorage.getItem("storageLevel")) || 1;
let storageLimit = storageLevel * 20;
let isDark = JSON.parse(localStorage.getItem("isDark")) ?? true;

let businesses = JSON.parse(localStorage.getItem("businesses")) || {
  shop: 0,
  factory: 0,
  bank: 0
};

const clickSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_99fa8233be.mp3?filename=click-124467.mp3");

function updateUI() {
  document.getElementById("gold").textContent = gold;
  document.getElementById("clicks").textContent = clicks;
  document.getElementById("level").textContent = level;
  document.getElementById("xp").textContent = xp;
  document.getElementById("xp-next").textContent = xpToNext;
  document.getElementById("passiveGold").textContent = Math.floor(passiveGold);
  document.getElementById("shop-count").textContent = businesses.shop;
  document.getElementById("factory-count").textContent = businesses.factory;
  document.getElementById("bank-count").textContent = businesses.bank;
  document.getElementById("storage-capacity").textContent = "Lvl " + storageLevel;

  const percent = Math.floor((xp / xpToNext) * 100);
  document.getElementById("xp-fill").style.width = percent + "%";
}

document.getElementById("click-btn").addEventListener("click", () => {
  gold += level;
  xp += 1;
  clicks += 1;
  if (xp >= xpToNext) {
    xp -= xpToNext;
    level += 1;
    xpToNext = Math.floor(xpToNext * 1.5);
  }

  const btn = document.getElementById("click-btn");
  btn.classList.add("clicked");
  setTimeout(() => btn.classList.remove("clicked"), 100);

  clickSound.currentTime = 0;
  clickSound.play();

  saveData();
  updateUI();
});

document.getElementById("collect-btn").addEventListener("click", () => {
  gold += Math.floor(passiveGold);
  passiveGold = 0;
  saveData();
  updateUI();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light");
  isDark = !document.body.classList.contains("light");
  localStorage.setItem("isDark", JSON.stringify(isDark));
});

function buyBusiness(type, cardId) {
  const prices = { shop: 50, factory: 200, bank: 1000 };
  if (gold >= prices[type]) {
    gold -= prices[type];
    businesses[type]++;

    // انیمیشن خرید کارت مربوطه
    if (cardId) {
      const card = document.getElementById(cardId);
      card.classList.add("animate-buy");
      setTimeout(() => card.classList.remove("animate-buy"), 200);
    }

    saveData();
    updateUI();
  } else {
    alert("Not enough gold!");
  }
}

function upgradeStorage() {
  const cost = 500;
  if (gold >= cost) {
    gold -= cost;
    storageLevel++;
    storageLimit = storageLevel * 20;
    saveData();
    updateUI();
  } else {
    alert("Not enough gold!");
  }
}

function earnPassiveGold() {
  let income = businesses.shop * 0.2 + businesses.factory * 1 + businesses.bank * 5;
  if (passiveGold < storageLimit) {
    passiveGold += income;
    if (passiveGold > storageLimit) passiveGold = storageLimit;
    saveData();
    updateUI();
  }
}

function saveData() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("passiveGold", passiveGold);
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("xpToNext", xpToNext);
  localStorage.setItem("storageLevel", storageLevel);
  localStorage.setItem("businesses", JSON.stringify(businesses));
}

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

if (!isDark) document.body.classList.add("light");

setInterval(earnPassiveGold, 1000);
updateUI();
