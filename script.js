
let gold = 0;
let passiveGold = 0;
let clicks = 0;
let xp = 0;
let level = 1;
let xpToNext = 10;
let storageLevel = 1;
let storageLimit = storageLevel * 20;

const businesses = [
  { id: 'kiosk', name: 'Kiosk', count: 0, income: 0.2, price: 20 },
  { id: 'taxi', name: 'Taxi Co.', count: 0, income: 1, price: 100 },
  { id: 'office', name: 'Office', count: 0, income: 3, price: 250 },
  { id: 'mall', name: 'Mall', count: 0, income: 6, price: 500 },
  { id: 'bank', name: 'Bank', count: 0, income: 12, price: 1000 },
  { id: 'airline', name: 'Airline', count: 0, income: 25, price: 2000 },
  { id: 'hotel', name: 'Hotel', count: 0, income: 45, price: 4000 },
  { id: 'construct', name: 'Construct', count: 0, income: 75, price: 8000 },
  { id: 'startup', name: 'Startup', count: 0, income: 120, price: 12000 },
  { id: 'crypto', name: 'Crypto', count: 0, income: 200, price: 20000 }
];

function updateUI() {
  document.getElementById("gold").textContent = Math.floor(gold);
  document.getElementById("clicks").textContent = clicks;
  document.getElementById("level").textContent = level;
  document.getElementById("xp").textContent = xp;
  document.getElementById("xp-next").textContent = xpToNext;
  document.getElementById("passiveGold").textContent = Math.floor(passiveGold);

  const percent = Math.floor((xp / xpToNext) * 100);
  document.getElementById("xp-fill").style.width = percent + "%";
}

function initBusinesses() {
  const container = document.getElementById("business-list");
  businesses.forEach(b => {
    const div = document.createElement("div");
    div.className = "business-card";
    div.id = `card-${b.id}`;
    div.innerHTML = `
      <span>${b.name}: ${b.count}</span>
      <button onclick="buyBusiness('${b.id}')">Buy (${b.price})</button>
    `;
    container.appendChild(div);
  });
}

function buyBusiness(id) {
  const b = businesses.find(x => x.id === id);
  if (gold >= b.price) {
    gold -= b.price;
    b.count++;
    b.price = Math.floor(b.price * 1.5);
    updateBusinesses();
  } else {
    alert("Not enough gold!");
  }
}

function updateBusinesses() {
  businesses.forEach(b => {
    document.querySelector(`#card-${b.id} span`).textContent = `${b.name}: ${b.count}`;
    document.querySelector(`#card-${b.id} button`).textContent = `Buy (${b.price})`;
  });
  updateUI();
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
  if (passiveGold < storageLimit) {
    passiveGold += income;
    if (passiveGold > storageLimit) passiveGold = storageLimit;
  }
  updateUI();
}

function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

initBusinesses();
setInterval(earnPassive, 1000);
updateUI();
