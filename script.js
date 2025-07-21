let gold = Number(localStorage.getItem("gold")) || 0;
let passiveGold = Number(localStorage.getItem("passiveGold")) || 0;
let clicks = Number(localStorage.getItem("clicks")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let xpToNext = Number(localStorage.getItem("xpToNext")) || 10;
let vaultLevel = Number(localStorage.getItem("vaultLevel")) || 1;
let vaultCapacity = vaultLevel * 20;

let defaultBusinesses = [
  { id: 'kiosk', name: 'Kiosk', level: 0, max: 10, income: 0.2, price: 20 },
  { id: 'taxi', name: 'Taxi Co.', level: 0, max: 10, income: 1, price: 100 },
  { id: 'office', name: 'Office', level: 0, max: 10, income: 3, price: 250 },
  { id: 'mall', name: 'Mall', level: 0, max: 10, income: 6, price: 500 },
  { id: 'bank', name: 'Bank', level: 0, max: 10, income: 12, price: 1000 },
  { id: 'airline', name: 'Airline', level: 0, max: 10, income: 25, price: 2000 },
  { id: 'hotel', name: 'Hotel', level: 0, max: 10, income: 45, price: 4000 },
  { id: 'construct', name: 'Construct', level: 0, max: 10, income: 75, price: 8000 },
  { id: 'startup', name: 'Startup', level: 0, max: 10, income: 120, price: 12000 },
  { id: 'crypto', name: 'Crypto', level: 0, max: 10, income: 200, price: 20000 }
];

// اگه business ذخیره شده سالم نبود یا کمتر بود، ریست کن
let businesses;
try {
  let fromStore = JSON.parse(localStorage.getItem("businesses"));
  if (!Array.isArray(fromStore) || fromStore.length !== defaultBusinesses.length) throw "";
  businesses = fromStore;
} catch {
  businesses = JSON.parse(JSON.stringify(defaultBusinesses));
}

function saveAll() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("passiveGold", passiveGold);
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("xpToNext", xpToNext);
  localStorage.setItem("vaultLevel", vaultLevel);
  localStorage.setItem("businesses", JSON.stringify(businesses));
}

function updateUI() {
  document.getElementById("gold").textContent = Math.floor(gold);
  document.getElementById("clicks").textContent = clicks;
  document.getElementById("level").textContent = level;
  document.getElementById("xp").textContent = xp;
  document.getElementById("xp-next").textContent = xpToNext;
  document.getElementById("passiveGold").textContent = Math.floor(passiveGold);
  document.getElementById("vault-capacity").textContent = vaultCapacity;
  updateBusinessCards();
  // XP Bar
  let percent = Math.min(Math.floor((xp / xpToNext) * 100), 100);
  document.getElementById("xp-fill").style.width = percent + "%";
  saveAll();
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
    let canUpgrade = b.level < b.max;
    let btnText = b.level === 0 ? `Buy (${b.price})` :
      canUpgrade ? `Upgrade (${b.price})` : `Maxed`;
    card.innerHTML = `
      <h3>${b.name} (Lvl ${b.level})</h3>
      <p>Income: ${Math.floor(b.income * b.level)}/sec</p>
      <p>Upgrade cost: ${canUpgrade ? b.price : '---'}</p>
      <button class="upgrade-btn" onclick="buyBusiness('${b.id}')" ${canUpgrade ? '' : 'disabled'}>${btnText}</button>
    `;
    container.appendChild(card);
  });
}

window.buyBusiness = function(id) {
  const b = businesses.find(x => x.id === id);
  if (!b || b.level >= b.max) return;
  if (gold >= b.price) {
    gold -= b.price;
    b.level++;
    b.income = Math.round((b.income) * 1.16 * 10) / 10;
    b.price = Math.floor(b.price * 1.5);
    updateUI();
  } else {
    alert("Not enough gold!");
  }
}

document.getElementById("click-btn").addEventListener("click", (e) => {
  gold += level;
  xp++;
  clicks++;
  if (xp >= xpToNext) {
    xp -= xpToNext;
    level++;
    xpToNext = Math.floor(xpToNext * 1.5);
  }

  // افکت Drop طلا روی دکمه
  let drop = document.createElement("div");
  drop.className = "gold-drop";
  drop.textContent = "+ZDC";
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 950);

  // انیمیشن دکمه
  e.target.style.transform = "scale(0.94)";
  setTimeout(() => e.target.style.transform = "", 110);

  updateUI();
});

document.getElementById("collect-btn").addEventListener("click", () => {
  gold += Math.floor(passiveGold);
  passiveGold = 0;
  updateUI();
});

document.getElementById("upgrade-vault-btn").addEventListener("click", () => {
  let cost = vaultLevel * 200;
  if (gold >= cost) {
    gold -= cost;
    vaultLevel++;
    vaultCapacity = vaultLevel * 20;
    updateUI();
  } else {
    alert("Not enough gold for Vault upgrade!");
  }
});

document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light");
  saveAll();
});

function earnPassive() {
  let income = 0;
  businesses.forEach(b => income += b.level * b.income);
  if (passiveGold < vaultCapacity) {
    passiveGold += income;
    if (passiveGold > vaultCapacity) passiveGold = vaultCapacity;
    updateUI();
  }
}

setInterval(earnPassive, 1000);
updateUI();
