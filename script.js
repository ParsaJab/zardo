window.Telegram.WebApp.ready();

const tg = window.Telegram.WebApp;

// مثال: اطلاعات کاربر تلگرام
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
  let telegramUser = tg.initDataUnsafe.user;
  // می‌تونی نمایش بدی: telegramUser.first_name, telegramUser.id و ...
  console.log('Telegram User:', telegramUser);
}

// مثال: اگر می‌خوای مثلاً رکورد کاربر رو به بات تلگرام ارسال کنی:
document.getElementById('send-score-btn').onclick = function() {
  // این فقط یه مثال ارسال داده است:
  tg.sendData(JSON.stringify({
    gold: gold,
    level: vaultLevel,
    clickCount: clickCount,
    time: Date.now()
  }));
  tg.close();
}

// ----- اطلاعات بیزنس -----
const defaultBusinesses = [
  { id: 'kiosk',      name: 'Kiosk',       price: 20,    income: 20, level: 0, owned: false },
  { id: 'taxi',       name: 'Taxi',        price: 70,    income: 60, level: 0, owned: false },
  { id: 'coffee',     name: 'Coffee Shop', price: 200,   income: 140, level: 0, owned: false },
  { id: 'market',     name: 'Market',      price: 500,   income: 400, level: 0, owned: false },
  { id: 'restaurant', name: 'Restaurant',  price: 1300,  income: 900, level: 0, owned: false },
  { id: 'factory',    name: 'Factory',     price: 3100,  income: 2100, level: 0, owned: false },
  { id: 'hotel',      name: 'Hotel',       price: 9000,  income: 6500, level: 0, owned: false },
  { id: 'company',    name: 'Company',     price: 18000, income: 14000, level: 0, owned: false },
  { id: 'bank',       name: 'Bank',        price: 35000, income: 32000, level: 0, owned: false },
  { id: 'airport',    name: 'Airport',     price: 60000, income: 60000, level: 0, owned: false }
];

let gold = Number(localStorage.getItem("gold")) || 0;
let passiveGold = Number(localStorage.getItem("passiveGold")) || 0;
let vaultLevel = Number(localStorage.getItem("vaultLevel")) || 1;
let vaultCapacity = vaultLevel * 20;
let vaultUpgradeCost = vaultLevel * 100;
let clickCount = Number(localStorage.getItem("clickCount")) || 0;
let goldPerClick = Number(localStorage.getItem("goldPerClick")) || 1;
let totalPassiveEarned = Number(localStorage.getItem("totalPassiveEarned")) || 0;
let botLevel = Number(localStorage.getItem("botLevel")) || 0; // 0 یعنی هنوز نخریده
let botBought = botLevel > 0;
let bgChoice = localStorage.getItem("bgChoice") || "bg1";
let userName = localStorage.getItem("profileName") || "Player";
let userAvatar = localStorage.getItem("profileAvatar") || "avatar.png";
let businesses;
try {
  let fromStore = JSON.parse(localStorage.getItem("businesses"));
  if (!Array.isArray(fromStore) || fromStore.length !== defaultBusinesses.length) throw "";
  businesses = fromStore;
} catch {
  businesses = JSON.parse(JSON.stringify(defaultBusinesses));
  saveAll();
}

// ----- ذخیره اطلاعات -----
function saveAll() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("passiveGold", passiveGold);
  localStorage.setItem("vaultLevel", vaultLevel);
  localStorage.setItem("clickCount", clickCount);
  localStorage.setItem("goldPerClick", goldPerClick);
  localStorage.setItem("totalPassiveEarned", totalPassiveEarned);
  localStorage.setItem("businesses", JSON.stringify(businesses));
  localStorage.setItem("botLevel", botLevel);
  localStorage.setItem("bgChoice", bgChoice);
  localStorage.setItem("profileName", userName);
  localStorage.setItem("profileAvatar", userAvatar);
}

// ----- اپدیت کل بازی -----
function updateUI() {
  document.getElementById("gold-amount").textContent = Math.round(gold);
  document.getElementById("gold-amount-big").textContent = Math.round(gold);
  // خزانه
  vaultCapacity = vaultLevel * 20;
  vaultUpgradeCost = vaultLevel * 100;
  let vaultPercent = Math.min(Math.floor(passiveGold / vaultCapacity * 100), 100);
  document.getElementById("vault-progress-fill").style.width = vaultPercent + "%";
  document.getElementById("vault-amount").textContent = Math.round(passiveGold);
  document.getElementById("vault-capacity").textContent = vaultCapacity;
  document.getElementById("vault-upgrade-cost").textContent = vaultUpgradeCost;
  // پروفایل
  document.getElementById("profile-name").textContent = userName;
  document.getElementById("profile-pic").src = userAvatar;
  document.getElementById("profile-clicks").textContent = clickCount;
  document.getElementById("profile-gpc").textContent = goldPerClick;
  document.getElementById("profile-bizcount").textContent = businesses.filter(b => b.owned).length;
  document.getElementById("profile-passive").textContent = getPassivePerMin();
  document.getElementById("profile-totalpassive").textContent = Math.round(totalPassiveEarned);
  // پس‌زمینه
  document.body.classList.remove("bg1", "bg2", "bg3");
  document.body.classList.add(bgChoice);
  // بیزنس‌های کاربر
  updateMyBusinesses();
  // وضعیت بات
  updateBot();
  saveAll();
}

// ----- درآمد پسیو دقیقه‌ای -----
function getPassivePerMin() {
  return businesses.reduce((sum, b) => sum + (b.owned ? Math.round(b.income * b.level) : 0), 0);
}

// ----- تب‌ها -----
window.switchTab = function(id) {
  // حذف کلاس 'active' از همه تب‌ها
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  
  // اضافه کردن کلاس 'active' به تب انتخاب شده
  const targetTab = document.getElementById(id);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // اگر gold داخل تب‌ها نمایش داره، بروزرسانی کن
  updateUI();
};

// ----- اپگرید خزانه -----
document.getElementById("upgrade-vault-btn").onclick = function() {
  if (gold >= vaultUpgradeCost) {
    gold -= vaultUpgradeCost;
    vaultLevel++;
    updateUI();
  } else {
    alert("Not enough gold!");
  }
};

// ----- کسب درآمد پسیو -----
setInterval(() => {
  let perSec = getPassivePerMin() / 60;
  if (perSec > 0 && passiveGold < vaultCapacity) {
    passiveGold += perSec;
    if (passiveGold > vaultCapacity) passiveGold = vaultCapacity;
    updateUI();
  }
}, 2000);

// ----- برداشت خودکار توسط بات -----
setInterval(() => {
  if (botLevel > 0 && passiveGold > 0) {
    // هر دقیقه لول × 50 برداشت کنه (در هر 2 ثانیه، این مقدار تقسیم بر 30 برداشت شود)
    let botTakePer2sec = (botLevel * 50) / 30;
    let take = Math.min(botTakePer2sec, passiveGold);
    gold += Math.floor(take);
    totalPassiveEarned += Math.floor(take);
    passiveGold -= take;
    if (passiveGold < 0) passiveGold = 0;
    updateUI();
  }
}, 2000);

// ----- خرید و اپگرید بات -----
document.getElementById("buy-bot-btn").onclick = function() {
  if (botLevel === 0 && gold >= 1000) {
    gold -= 1000;
    botLevel = 1;
    updateBot();
    updateUI();
  } else {
    alert("Not enough gold or already bought!");
  }
};

document.getElementById("upgrade-bot-btn").onclick = function() {
  let upgradeCost = (botLevel + 1) * 200;
  if (botLevel > 0 && botLevel < 10 && gold >= upgradeCost) {
    gold -= upgradeCost;
    botLevel++;
    updateBot();
    updateUI();
  } else {
    alert("Not enough gold or maxed out!");
  }
};

// ----- نمایش وضعیت بات -----
function updateBot() {
  const status = document.getElementById("bot-status");
  const buyBtn = document.getElementById("buy-bot-btn");
  const upBtn = document.getElementById("upgrade-bot-btn");
  if (botLevel === 0) {
    status.innerHTML = `<b>Not bought.</b>`;
    buyBtn.style.display = "";
    buyBtn.textContent = `Buy Bot (1000 Gold)`;
    upBtn.style.display = "none";
  } else {
    status.innerHTML = `<b>Bot Level ${botLevel}:</b> Auto collects <b>${botLevel*50}</b> per min from vault.`;
    buyBtn.style.display = "none";
    upBtn.style.display = botLevel < 10 ? "" : "none";
    upBtn.textContent = botLevel < 10 ? `Upgrade Bot (${(botLevel+1)*200} Gold)` : "Maxed";
  }
}

// ----- نمایش فقط بیزنس‌های خریداری شده -----
function updateMyBusinesses() {
  const mylist = document.getElementById("my-biz-list");
  mylist.innerHTML = '';
  businesses.filter(b => b.owned).forEach(b => {
    let canUpgrade = b.level < 10;
    let upPrice = canUpgrade ? b.price : "---";
    let card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `
      <h4>${b.name} <span style="font-weight:normal">Lvl ${b.level}</span></h4>
      <p>Income/min: <b>${Math.round(b.income * b.level)}</b></p>
      <p>Upgrade: <b>${upPrice}</b></p>
      <button class="upgrade-btn" onclick="upgradeBusiness('${b.id}')" ${canUpgrade ? "" : "disabled"}>${canUpgrade ? "Upgrade" : "Maxed"}</button>
    `;
    mylist.appendChild(card);
  });
  if (mylist.innerHTML === "") mylist.innerHTML = "<p style='color:#bbb;text-align:center;'>No businesses started.</p>";
}

// ---- خرید و اپگرید بیزنس (فقط خرید از خود بازی) -----
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

window.upgradeBusiness = function(id) {
  const b = businesses.find(x => x.id === id);
  if (b && b.owned && b.level < 10 && gold >= b.price) {
    gold -= b.price;
    b.level++;
    b.income = Math.round(b.income * 1.45);
    b.price = Math.round(b.price * 1.5);
    updateUI();
  } else {
    alert("Not enough gold or maxed out!");
  }
};

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

// ---- تغییر پس زمینه از ستینگ
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

// ---- تم تاریک/روشن و بک‌گراند کلاسیک/آبی/تیره
window.onload = function() {
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  updateUI();
};
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

// ----- رفع زوم و اسکرول اضافه موبایل -----
document.addEventListener('touchmove', function(event) {
  if(event.scale !== 1) event.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});
document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
});
document.addEventListener('gestureend', function (e) {
  e.preventDefault();
});

// ----- خرید بیزنس از مارکت (اگر صفحه‌ای برای خرید خواستی اضافه کنی، این کد رو بذار) -----
// در این نسخه فقط در تب بیزنس نمایش داده می‌شود.

