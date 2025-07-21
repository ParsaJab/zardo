let gold = Number(localStorage.getItem("gold")) || 0;
let passiveGold = Number(localStorage.getItem("passiveGold")) || 0;
let clicks = Number(localStorage.getItem("clicks")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let xpToNext = Number(localStorage.getItem("xpToNext")) || 10;
let vaultLevel = Number(localStorage.getItem("vaultLevel")) || 1;
let vaultCapacity = vaultLevel * 20;

const defaultBusinesses = [
  { id: 'kiosk', name: 'Kiosk', level: 0, max: 10, income: 1, price: 20 },
  { id: 'taxi', name: 'Taxi Co.', level: 0, max: 10, income: 5, price: 100 },
  { id: 'office', name: 'Office', level: 0, max: 10, income: 14, price: 250 },
  { id: 'mall', name: 'Mall', level: 0, max: 10, income: 32, price: 500 }
];
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
  // Gold bar
  let goldPercent = Math.min(Math.floor(gold / 20000 * 100), 100);
  document.getElementById("gold-bar-fill").style.width = goldPercent + "%";
  document.getElementById("gold-text").textContent = Math.floor(gold);

  // Level bar
  let levelPercent = Math.min(Math.floor(xp / xpToNext * 100), 100);
  document.getElementById("level-bar-fill").style.width = levelPercent + "%";
  document.getElementById("level-text").textContent = level;

  // Vault bar
  let vaultPercent = Math.min(Math.floor(passiveGold / vaultCapacity * 100), 100);
  document.getElementById("vault-progress-fill").style.width = vaultPercent + "%";
  document.getElementById("vault-amount").textContent = Math.floor(passiveGold);
  document.getElementById("vault-capacity").textContent = vaultCapacity;

  updateMarketList();
  updateMyBusinesses();
  saveAll();
}
function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function updateMarketList() {
  const market = document.getElementById("market-list");
  if (!market) return;
  market.innerHTML = '';
  businesses.filter(b=>b.level===0).forEach(b => {
    let card = document.createElement("div");
    card.className = "market-card";
    card.innerHTML = `
      <h4>${b.name}</h4>
      <p>Income/min: <b>${b.income*60}</b></p>
      <p>Price: <b>${b.price}</b></p>
      <button class="buy-btn" onclick="buyBusiness('${b.id}')">Buy</button>
    `;
    market.appendChild(card);
  });
  if(market.innerHTML==="") market.innerHTML = "<p style='color:#aaa; text-align:center;'>All businesses started!</p>";
}

function updateMyBusinesses() {
  const mylist = document.getElementById("my-biz-list");
  if (!mylist) return;
  mylist.innerHTML = '';
  businesses.filter(b=>b.level>0).forEach(b => {
    let canUpgrade = b.level < b.max;
    let upPrice = canUpgrade ? b.price : "---";
    let card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `
      <h4>${b.name} <span style="font-weight:normal">Lvl ${b.level}</span></h4>
      <p>Income/min: <b>${b.income*60*b.level}</b></p>
      <p>Upgrade: <b>${upPrice}</b></p>
      <button class="upgrade-btn" onclick="upgradeBusiness('${b.id}')" ${canUpgrade?"":"disabled"}>${canUpgrade?"Upgrade":"Maxed"}</button>
    `;
    mylist.appendChild(card);
  });
  if(mylist.innerHTML==="") mylist.innerHTML = "<p style='color:#bbb;text-align:center;'>No businesses started.</p>";
}

// خرید اولیه
window.buyBusiness = function(id) {
  const b = businesses.find(x => x.id === id);
  if (b && b.level===0 && gold >= b.price) {
    gold -= b.price;
    b.level = 1;
    updateUI();
  } else {
    alert("Not enough gold!");
  }
};
// اپگرید بیزنس
window.upgradeBusiness = function(id) {
  const b = businesses.find(x => x.id === id);
  if (b && b.level>0 && b.level<b.max && gold >= b.price) {
    gold -= b.price;
    b.level++;
    b.income = Math.round((b.income) * 1.11 * 10) / 10;
    b.price = Math.floor(b.price * 1.45);
    updateUI();
  } else {
    alert("Not enough gold or maxed!");
  }
}
// دکمه نمایش بازار
document.getElementById("show-market-btn").addEventListener("click", ()=>{
  const market = document.getElementById("market-list");
  market.style.display = (market.style.display==="none") ? "flex" : "none";
});
// کل منطقه اصلی کلیک
document.getElementById("click-zone").addEventListener("click", (e) => {
  if (e.target.closest('.tab')) return; // روی تب‌ها کلیک نشه
  gold += level;
  xp++;
  clicks++;
  if (xp >= xpToNext) {
    xp -= xpToNext;
    level++;
    xpToNext = Math.floor(xpToNext * 1.45);
  }
  updateUI();
});
// ریست بازی
document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
// تغییر تم (نمونه ساده)
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
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
