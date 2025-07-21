
let gold = parseInt(localStorage.getItem("gold")) || 0;
let clicks = parseInt(localStorage.getItem("clicks")) || 0;
let businesses = JSON.parse(localStorage.getItem("businesses")) || {
  shop: 0,
  factory: 0,
  bank: 0
};

const goldEl = document.getElementById("gold");
const clicksEl = document.getElementById("clicks");

function updateUI() {
  goldEl.textContent = gold;
  clicksEl.textContent = clicks;
  document.getElementById("shop-count").textContent = "x" + businesses.shop;
  document.getElementById("factory-count").textContent = "x" + businesses.factory;
  document.getElementById("bank-count").textContent = "x" + businesses.bank;
}

document.getElementById("click-btn").addEventListener("click", () => {
  gold += 3;
  clicks += 1;
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

function earnPassiveGold() {
  gold += businesses.shop * 1;
  gold += businesses.factory * 5;
  gold += businesses.bank * 20;
  saveData();
  updateUI();
}

function saveData() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("businesses", JSON.stringify(businesses));
}

// Passive income every second
setInterval(earnPassiveGold, 1000);

updateUI();
