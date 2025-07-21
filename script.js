let gold = 0;
let passiveGold = 0;
let clicks = 0;
let xp = 0;
let level = 1;
let xpToNext = 10;

const businesses = [
  { id: 'kiosk', name: 'Kiosk', count: 0, income: 0.2, price: 20, upgrade: 20 },
  { id: 'taxi', name: 'Taxi Co.', count: 0, income: 1, price: 100, upgrade: 100 },
  { id: 'office', name: 'Office', count: 0, income: 3, price: 250, upgrade: 250 },
  { id: 'mall', name: 'Mall', count: 0, income: 6, price: 500, upgrade: 500 },
  { id: 'bank', name: 'Bank', count: 0, income: 12, price: 1000, upgrade: 1000 },
  { id: 'airline', name: 'Airline', count: 0, income: 25, price: 2000, upgrade: 2000 },
  { id: 'hotel', name: 'Hotel', count: 0, income: 45, price: 4000, upgrade: 4000 },
  { id: 'construct', name: 'Construct', count: 0, income: 75, price: 8000, upgrade: 8000 },
  { id: 'startup', name: 'Startup', count: 0, income: 120, price: 12000, upgrade: 12000 },
  { id: 'crypto', name: 'Crypto', count: 0, income: 200, price: 20000, upgrade: 20000 }
];

function updateUI() {
  document.getElementById("gold").textContent = Math.floor(gold);
  document.getElementById("clicks").textContent = clicks;
  document.getElementById("level").textContent = level;
  document.getElementById("xp").textContent = xp;
  document.getElementById("xp-next").textContent = xpToNext;
  document.getElementById("passiveGold").textContent = Math.floor(passiveGold);
  updateBusinessCards();
  updateVault();
}

function updateVault() {
  // In this version, passiveGold is always visible in Vault box (in click tab)
  if (document.getElementById("passiveGold")) {
    document.getElementById("passiveGold").textContent = Math.floor(passiveGold);
  }
}

function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function updateBusinessCards() {
  const container = document.getElementById("business-list");
  container.innerHTML = "";
  businesses.forEach((b, i) => {
    let card = document.createElement("div");
    card.className = "business-card";
    card.innerHTML = `
      <h3>${b.name}</h3>
      <p>Owned: ${b.count}</p>
      <p>Income: ${b.income * b.count}/sec</p>
      <button class="upgrade-btn" onclick="buyBusiness('${b.id}')">Buy/Upgrade (${b.price})</button>
    `;
    container.appendChild(card);
  });
}

window.buyBusiness = function(id) {
  const b = businesses.find(x => x.id === id);
  if (gold >= b.price) {
    gold -= b.price;
    b.count++;
    b.income = Math.floor(b.income * 1.3 + 1); // درآمد بیزنس ارتقاء پیدا کنه
    b.price = Math.floor(b.price * 1.5); // قیمت خرید و ارتقاء ۱.۵ برابر بشه
    updateUI();
  } else {
    alert("Not enough gold!");
  }
}

document.getElementById("click-btn").addEventListener("click", () => {
  gold += level;
  xp++;
  clicks++;
  if (xp >= xpToNext) {
    xp -= xpToNext;
    level++;
    xpToNext = Math.floor(xpToNext * 1.5);
  }
  updateUI();
});

document.getElementById("collect-btn").addEventListener("click", () => {
  gold += Math.floor(passiveGold);
  passiveGold = 0;
  updateUI();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

function earnPassive() {
  let income = 0;
  businesses.forEach(b => income += b.count * b.income);
  passiveGold += income;
  updateUI();
}

setInterval(earnPassive, 1000);
updateUI();
