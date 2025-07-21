// ---- اطلاعات اولیه و ثابت ----

// 10 بیزنس واقعی و منظم
const defaultBusinesses = [
  { id: 'kiosk',      name: 'Kiosk',       price: 20,    income: 20 },
  { id: 'taxi',       name: 'Taxi',        price: 70,    income: 60 },
  { id: 'coffee',     name: 'Coffee Shop', price: 200,   income: 140 },
  { id: 'market',     name: 'Market',      price: 500,   income: 400 },
  { id: 'restaurant', name: 'Restaurant',  price: 1300,  income: 900 },
  { id: 'factory',    name: 'Factory',     price: 3100,  income: 2100 },
  { id: 'hotel',      name: 'Hotel',       price: 9000,  income: 6500 },
  { id: 'company',    name: 'Company',     price: 18000, income: 14000 },
  { id: 'bank',       name: 'Bank',        price: 35000, income: 32000 },
  { id: 'airport',    name: 'Airport',     price: 60000, income: 60000 }
];

// ------ متغیرهای کل بازی ------
let gold = Number(localStorage.getItem("gold")) || 0;
let passiveGold = Number(localStorage.getItem("passiveGold")) || 0;
let vaultLevel = Number(localStorage.getItem("vaultLevel")) || 1;
let vaultCapacity = vaultLevel * 20;
let vaultUpgradeCost = vaultLevel * 100;
let clickCount = Number(localStorage.getItem("clickCount")) || 0;
let goldPerClick = Number(localStorage.getItem("goldPerClick")) || 1;
let totalPassiveEarned = Number(localStorage.getItem("totalPassiveEarned")) || 0;
let botBought = localStorage.getItem("botBought") === "yes";
let bgChoice = localStorage.getItem("bgChoice") || "bg1";
let userName = localStorage.getItem("profileName") || "Player";
let userAvatar = localStorage.getItem("profileAvatar") || "avatar.png";

// --- خواندن لیست بیزنس‌ها از استوریج یا پیش‌فرض
let businesses;
try {
  let fromStore = JSON.parse(localStorage.getItem("businesses"));
  if (!Array.isArray(fromStore) || fromStore.length !== defaultBusinesses.length) throw "";
  businesses = fromStore;
} catch {
  businesses = defaultBusinesses.map(b => ({ ...b, level: 0, owned: false }));
  saveAll();
}

// ---- ذخیره همه داده‌ها
function saveAll() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("passiveGold", passiveGold);
  localStorage.setItem("vaultLevel", vaultLevel);
  localStorage.setItem("clickCount", clickCount);
  localStorage.setItem("goldPerClick", goldPerClick);
  localStorage.setItem("totalPassiveEarned", totalPassiveEarned);
  localStorage.setItem("businesses", JSON.stringify(businesses));
  localStorage.setItem("botBought", botBought ? "yes" : "no");
  localStorage.setItem("bgChoice", bgChoice);
  localStorage.setItem("profileName", userName);
  localStorage.setItem("profileAvatar", userAvatar);
}

// ---- آپدیت تمام UI
function updateUI() {
  // گلد
  document.getElementById("gold-amount").textContent = gold;
  document.getElementById("gold-amount-big").textContent = gold;
  // خزانه
  vaultCapacity = vaultLevel * 20;
  vaultUpgradeCost = vaultLevel * 100;
  let vaultPercent = Math.min(Math.floor(passiveGold / vaultCapacity * 100), 100);
  document.getElementById("vault-progress-fill").style.width = vaultPercent + "%";
  document.getElementById("vault-amount").textContent = passiveGold;
  document.getElementById("vault-capacity").textContent = vaultCapacity;
  document.getElementById("vault-upgrade-cost").textContent = vaultUpgradeCost;
  // پروفایل
  document.getElementById("profile-name").textContent = userName;
  document.getElementById("profile-pic").src = userAvatar;
  document.getElementById("profile-clicks").textContent = clickCount;
  document.getElementById("profile-gpc").textContent = goldPerClick;
  document.getElementById("profile-bizcount").textContent = businesses.filter(b => b.level > 0).length;
  document.getElementById("profile-passive").textContent = getPassivePerMin();
  document.getElementById("profile-totalpassive").textContent = totalPassiveEarned;

  // پس‌زمینه
  document.body.classList.remove("bg1", "bg2", "bg3");
  document.body.classList.add(bgChoice);

  // لیست بیزنس‌ها
  updateMarketList();
  updateMyBusinesses();
  // تنظیمات بات
  updateBot();
  saveAll();
}

// ---- درآمد پسیو در دقیقه
function getPassivePerMin() {
  return businesses.reduce((sum, b) => sum + (b.level > 0 ? b.income * b.level : 0), 0);
}

// ---- فعال/غیرفعال کردن تب‌ها
function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ---- کلیک فقط تب وسط فعال
document.getElementById("game-tab").addEventListener("click", function(e) {
  if (!document.getElementById("game-tab").classList.contains("active")) return;
  gold += goldPerClick;
  clickCount++;
  updateUI();
});

// ---- برداشت خزانه
document.getElementById("collect-btn").onclick = function() {
  if (passiveGold > 0) {
    gold += passiveGold;
    totalPassiveEarned += passiveGold;
    passiveGold = 0;
    updateUI();
  }
};

// ---- اپگرید خزانه
document.getElementById("upgrade-vault-btn").onclick = function() {
  if (gold >= vaultUpgradeCost) {
    gold -= vaultUpgradeCost;
    vaultLevel++;
    updateUI();
  } else {
    alert("Not enough gold!");
  }
};

// ---- کسب درآمد پسیو هر 2 ثانیه
setInterval(() => {
  let perSec = getPassivePerMin() / 60;
  if (perSec > 0 && passiveGold < vaultCapacity) {
    passiveGold += perSec;
    if (passiveGold > vaultCapacity) passiveGold = vaultCapacity;
    // اگر بات فعال بود و خزانه پر شد خودکار برداشت کن
    if (botBought && passiveGold >= vaultCapacity) {
      document.getElementById("collect-btn").click();
    }
    updateUI();
  }
}, 2000);

// ---- دکمه شروع بیزنس
document.getElementById("start-business-btn").onclick = function() {
  switchTab('business-tab');
  // اسکرول به پایین برای بخش بیزنس‌های جدید (اختیاری)
  document.getElementById("market-list").scrollIntoView({behavior:'smooth'});
};

// ---- خرید اولیه بیزنس
window.buyBusiness = function(id) {
  const b = businesses.find(x => x.id === id);
  if (b && !b.owned && gold >= b.price) {
    gold -= b.price;
    b.owned = true;
    b.level = 1;
    updateUI();
  } else {
    alert("Not enough gold!");
  }
};

// ---- اپگرید بیزنس
window.upgradeBusiness = function(id) {
  const b = businesses.find(x => x.id === id);
  if (b && b.owned && b.level < 10 && gold >= b.price) {
    gold -= b.price;
    b.level++;
    b.income = Math.round((b.income) * 1.45);
    b.price = Math.round(b.price * 1.5);
    updateUI();
  } else {
    alert("Not enough gold or maxed out!");
  }
};

// ---- لیست خرید بیزنس
function updateMarketList() {
  const market = document.getElementById("market-list");
  if (!market) return;
  market.innerHTML = '';
  businesses.filter(b => !b.owned).forEach(b => {
    let card = document.createElement("div");
    card.className = "market-card";
    card.innerHTML = `
      <h4>${b.name}</h4>
      <p>Income/min: <b>${b.income * 1}</b></p>
      <p>Price: <b>${b.price}</b></p>
      <button class="buy-btn" onclick="buyBusiness('${b.id}')">Buy</button>
    `;
    market.appendChild(card);
  });
  if (market.innerHTML === "") market.innerHTML = "<p style='color:#aaa; text-align:center;'>All businesses started!</p>";
}

// ---- لیست بیزنس‌های من
function updateMyBusinesses() {
  const mylist = document.getElementById("my-biz-list");
  if (!mylist) return;
  mylist.innerHTML = '';
  businesses.filter(b => b.owned).forEach(b => {
    let canUpgrade = b.level < 10;
    let upPrice = canUpgrade ? b.price : "---";
    let card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `
      <h4>${b.name} <span style="font-weight:normal">Lvl ${b.level}</span></h4>
      <p>Income/min: <b>${b.income * b.level}</b></p>
      <p>Upgrade: <b>${upPrice}</b></p>
      <button class="upgrade-btn" onclick="upgradeBusiness('${b.id}')" ${canUpgrade ? "" : "disabled"}>${canUpgrade ? "Upgrade" : "Maxed"}</button>
    `;
    mylist.appendChild(card);
  });
  if (mylist.innerHTML === "") mylist.innerHTML = "<p style='color:#bbb;text-align:center;'>No businesses started.</p>";
}

// ---- پروفایل (تغییر نام و عکس)
document.getElementById("profile-pic").onclick = () => {
  document.getElementById("avatar-input").click();
};
document.getElementById("avatar-input").onchange = function(event) {
  if (this.files && this.files[0]) {
    let reader = new FileReader();
    reader.onload = function(e) {
      userAvatar = e.target.result;
      updateUI();
    }
    reader.readAsDataURL(this.files[0]);
  }
};
document.getElementById("profile-name").onclick = () => {
  let name = prompt("Enter your name:", userName);
  if (name && name.length < 20) {
    userName = name;
    updateUI();
  }
};

// ---- تغییر پس زمینه از تنظیمات
document.getElementById("bg-select").value = bgChoice;
document.getElementById("bg-select").onchange = function() {
  bgChoice = this.value;
  updateUI();
};

// ---- دکمه ریست
document.getElementById("reset-btn").onclick = () => {
  if (confirm("Are you sure? All data will be lost!")) {
    localStorage.clear();
    location.reload();
  }
};

// ---- تم تاریک/روشن
window.onload = function() {
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  updateUI();
};

// ---- تب بات (ربات برداشت خودکار خزانه)
function updateBot() {
  const status = document.getElementById("bot-status");
  const btn = document.getElementById("buy-bot-btn");
  if (botBought) {
    status.innerHTML = "<b>Bot enabled!</b><br>Vault will be auto-collected.";
    btn.style.display = "none";
  } else {
    status.innerHTML = "<b>Bot not bought.</b>";
    btn.style.display = "";
  }
}
document.getElementById("buy-bot-btn").onclick = function() {
  if (gold >= 1000 && !botBought) {
    gold -= 1000;
    botBought = true;
    updateBot();
    updateUI();
  } else {
    alert("Not enough gold or already bought!");
  }
};

// ---- سوئیچ تب‌های پایین
window.switchTab = function(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  updateUI();
};

// ---- بک‌گراند کلاسیک/آبی/تیره
(function setBgChoices(){
  let styles = `
    body.bg1 { background: var(--bg-light); }
    body.bg2 { background: linear-gradient(135deg, #b2f2ff, #f2fcff 88%, #b0d7ff 100%); }
    body.bg3 { background: #23213a; }
  `;
  let s = document.createElement("style");
  s.innerHTML = styles;
  document.head.appendChild(s);
})();
