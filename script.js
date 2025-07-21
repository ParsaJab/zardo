// Core vars
let gold = Number(localStorage.getItem("gold")) || 0;
let passiveGold = Number(localStorage.getItem("passiveGold")) || 0;
let clicks = Number(localStorage.getItem("clicks")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let xpToNext = Number(localStorage.getItem("xpToNext")) || 10;
let vaultLevel = Number(localStorage.getItem("vaultLevel")) || 1;
let vaultCapacity = vaultLevel * 20;
let userName = localStorage.getItem("profileName") || "Parsa";
let userAvatar = localStorage.getItem("profileAvatar") || "avatar.png";
let bgTheme = localStorage.getItem("bgTheme") || "1";

const defaultBusinesses = [
  { id: 'kiosk', name: 'Kiosk', level: 0, max: 10, income: 1, price: 20 },
  { id: 'taxi', name: 'Taxi Co.', level: 0, max: 10, income: 5, price: 100 },
  { id: 'office', name: 'Office', level: 0, max: 10, income: 14, price: 250 },
  { id: 'mall', name: 'Mall', level: 0, max: 10, income: 32, price: 500 },
  { id: 'bank', name: 'Bank', level: 0, max: 10, income: 70, price: 1000 },
  { id: 'airline', name: 'Airline', level: 0, max: 10, income: 170, price: 2000 },
  { id: 'hotel', name: 'Hotel', level: 0, max: 10, income: 340, price: 4000 },
  { id: 'construct', name: 'Construct', level: 0, max: 10, income: 610, price: 8000 },
  { id: 'startup', name: 'Startup', level: 0, max: 10, income: 1200, price: 12000 },
  { id: 'crypto', name: 'Crypto', level: 0, max: 10, income: 2300, price: 20000 }
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
  localStorage.setItem("profileName", userName);
  localStorage.setItem("profileAvatar", userAvatar);
  localStorage.setItem("bgTheme", bgTheme);
}

function updateUI() {
  document.getElementById("gold").textContent = Math.floor(gold);
  document.getElementById("clicks").textContent = clicks;
  document.getElementById("level").textContent = level;
  document.getElementById("xp").textContent = xp;
  document.getElementById("xp-next").textContent = xpToNext;
  document.getElementById("passiveGold").textContent = Math.floor(passiveGold);
  document.getElementById("vault-capacity").textContent = vaultCapacity;
  document.getElementById("vault-up-cost").textContent = `(💰${vaultLevel*200})`;
  document.getElementById("profile-name").textContent = userName;
  document.getElementById("profile-pic").src = userAvatar;
  // XP Bar
  let percent = Math.min(Math.floor((xp / xpToNext) * 100), 100);
  document.getElementById("xp-fill").style.width = percent + "%";
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

// دکمه کلیک اصلی
document.getElementById("click-btn").addEventListener("click", (e) => {
  gold += level;
  xp++;
  clicks++;
  if (xp >= xpToNext) {
    xp -= xpToNext;
    level++;
    xpToNext = Math.floor(xpToNext * 1.45);
  }
  // افکت Drop طلا روی دکمه
  let drop = document.createElement("div");
  drop.className = "gold-drop";
  drop.textContent = "+ZDC";
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
  // انیمیشن دکمه
  e.target.style.transform = "scale(0.94)";
  setTimeout(() => e.target.style.transform = "", 120);
  updateUI();
});

// برداشت Vault
document.getElementById("collect-btn").addEventListener("click", () => {
  gold += Math.floor(passiveGold);
  passiveGold = 0;
  updateUI();
});

// اپگرید Vault
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

// تغییر تم روشن/تیره
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("theme-2");
  if(document.body.classList.contains("theme-2")){
    bgTheme = "2";
  }else{
    bgTheme = "1";
  }
  saveAll();
});

// تغییر پس زمینه از پروفایل
document.getElementById("change-bg-btn").addEventListener("click", () => {
  document.getElementById("bg-select").style.display =
    document.getElementById("bg-select").style.display === "none" ? "flex" : "none";
});
document.querySelectorAll(".bg-thumb").forEach(el=>{
  el.onclick = function(){
    document.querySelectorAll(".bg-thumb").forEach(e=>e.classList.remove("selected"));
    this.classList.add("selected");
    let theme = this.getAttribute("data-bg").replace("bg","").replace(".jpg","");
    bgTheme = theme;
    document.body.className = `theme-${theme}`;
    saveAll();
  }
});

// تغییر عکس پروفایل
document.getElementById("profile-pic").addEventListener("click", ()=>{
  document.getElementById("avatar-input").click();
});
document.getElementById("avatar-input").addEventListener("change", function(event){
  if(this.files && this.files[0]){
    let reader = new FileReader();
    reader.onload = function(e){
      userAvatar = e.target.result;
      updateUI();
    }
    reader.readAsDataURL(this.files[0]);
  }
});

// تغییر نام کاربر
document.getElementById("profile-name").addEventListener("click", ()=>{
  let name = prompt("Enter your name:", userName);
  if(name && name.length<20){
    userName = name;
    updateUI();
  }
});

// ریست بازی
document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
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
