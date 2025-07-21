let gold = Number(localStorage.getItem("gold")) || 0;
let passiveGold = Number(localStorage.getItem("passiveGold")) || 0;
let vaultLevel = Number(localStorage.getItem("vaultLevel")) || 1;
let vaultCapacity = vaultLevel * 20;

// بیزنس‌های نمونه
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

// پروفایل
let userName = localStorage.getItem("profileName") || "Player";
let userAvatar = localStorage.getItem("profileAvatar") || "avatar.png";

function saveAll() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("passiveGold", passiveGold);
  localStorage.setItem("vaultLevel", vaultLevel);
  localStorage.setItem("businesses", JSON.stringify(businesses));
  localStorage.setItem("profileName", userName);
  localStorage.setItem("profileAvatar", userAvatar);
}

function updateUI() {
  document.getElementById("gold-amount").textContent = Math.floor(gold);

  let vaultPercent = Math.min(Math.floor(passiveGold / vaultCapacity * 100), 100);
  document.getElementById("vault-progress-fill").style.width = vaultPercent + "%";
  document.getElementById("vault-amount").textContent = Math.floor(passiveGold);
  document.getElementById("vault-capacity").textContent = vaultCapacity;

  updateMarketList();
  updateMyBusinesses();

  document.getElementById("profile-name").textContent = userName;
  document.getElementById("profile-pic").src = userAvatar;

  saveAll();
}

function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// بازار خرید بیزنس
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

// لیست بیزنس‌های خریداری‌شده
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

// فقط تب وسط کلیک فعال است
document.getElementById("game-tab").addEventListener("click", function(e){
  if(!document.getElementById("game-tab").classList.contains("active")) return;
  gold += 1;
  updateUI();
});

// دکمه تم
document.getElementById("toggle-theme").addEventListener("click", function(){
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark")?"dark":"");
});
window.onload = function() {
  if(localStorage.getItem("theme")==="dark") document.body.classList.add("dark");
  updateUI();
}
document.getElementById("reset-btn").onclick = ()=>{localStorage.clear();location.reload();}

// آواتار و نام پروفایل
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
document.getElementById("profile-name").addEventListener("click", ()=>{
  let name = prompt("Enter your name:", userName);
  if(name && name.length<20){
    userName = name;
    updateUI();
  }
});
