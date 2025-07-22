window.addEventListener('DOMContentLoaded', function() {

  // ---- VARIABLES ----
  let gold = 0, level = 1, xp = 0, xpToNextLevel = 20, vault = 0, vaultCapacity = 100, vaultLevel = 1, clickCount = 0, totalEarnings = 0;
  let robotOwned = false, robotLevel = 1, robotCollect = 2, robotBuyCost = 500, robotUpgradeCost = 400, robotTimeLeft = 10, robotInterval = null, darkMode = false;
  const businessDefs = [
    {id:1, name:"Bakery", baseCost:100},
    {id:2, name:"Cafe", baseCost:250},
    {id:3, name:"Shop", baseCost:500},
    {id:4, name:"Restaurant", baseCost:1200},
    {id:5, name:"Bookstore", baseCost:2600},
    {id:6, name:"Pharmacy", baseCost:5400},
    {id:7, name:"Gym", baseCost:9000},
    {id:8, name:"Hotel", baseCost:16000},
    {id:9, name:"Factory", baseCost:25000},
    {id:10, name:"Bank", baseCost:44000}
  ];
  let businesses = [];
  let bizIncomeInterval = null;
  let telegramUserId = null; // کد رفرال اینجا ذخیره میشه
  let referralCount = 0;       // تعداد زیرمجموعه‌ها
  let referralIncome = 0;      // درآمد از زیرمجموعه

  // ---- LOCAL SAVE/LOAD ----
  function loadGame() {
    try {
      const data = JSON.parse(localStorage.getItem('zardoSave'));
      if (!data) return;
      gold = data.gold || 0;
      level = data.level || 1;
      xp = data.xp || 0;
      xpToNextLevel = data.xpToNextLevel || 20;
      vault = data.vault || 0;
      vaultCapacity = data.vaultCapacity || 100;
      vaultLevel = data.vaultLevel || 1;
      clickCount = data.clickCount || 0;
      totalEarnings = data.totalEarnings || 0;
      robotOwned = data.robotOwned || false;
      robotLevel = data.robotLevel || 1;
      robotCollect = data.robotCollect || 2;
      robotBuyCost = data.robotBuyCost || 500;
      robotUpgradeCost = data.robotUpgradeCost || 400;
      darkMode = data.darkMode || false;
      businesses = data.businesses || [];
      if (darkMode) document.body.classList.add('dark');
    } catch {}
  }
  function saveGame() {
    const data = {
      gold, level, xp, xpToNextLevel, vault, vaultCapacity, vaultLevel,
      clickCount, totalEarnings,
      robotOwned, robotLevel, robotCollect, robotBuyCost, robotUpgradeCost,
      darkMode, businesses
    };
    localStorage.setItem('zardoSave', JSON.stringify(data));
  }

  // ---- GAME LOGIC ----
  function getBusiness(id) { return businesses.find(b=>b.id===id); }
  function businessUpgradeCost(biz) { return Math.floor(businessDefs[biz.id-1].baseCost * Math.pow(1.7, biz.level)); }

  function updateUI() {
    let mainPanel = !document.getElementById("panel-main").classList.contains("hidden");
    document.getElementById("score-display").style.display = mainPanel ? "" : "none";
    document.getElementById("click-button").style.display = mainPanel ? "" : "none";
    document.querySelector(".vault").style.display = mainPanel ? "" : "none";
    let bizGoldBar = document.getElementById("biz-gold-amount");
    if (bizGoldBar) bizGoldBar.textContent = gold;
    document.getElementById("gold-count").textContent = gold;
    document.getElementById("vault-amount").textContent = vault;
    document.getElementById("vault-fill").style.width = `${(vault/vaultCapacity)*100}%`;
    document.getElementById("vault-upgrade-cost").textContent = vaultLevel * 50;
    document.getElementById("level").textContent = `Lvl ${level}`;
    document.getElementById("xp-fill").style.width = `${(xp/xpToNextLevel)*100}%`;
    saveGame();
  }
  function showProfileInfo() {
    document.getElementById("profile-info-settings").innerHTML =
      `<div style="border-radius:12px;background:#e9e9e9;padding:10px 14px;">
        <p><b>Level:</b> ${level}</p>
        <p><b>Income/sec:</b> ${businesses.reduce((sum,b)=>sum+b.income,0)}</p>
        <p><b>Clicks:</b> ${clickCount}</p>
        <p><b>Total Earnings:</b> ${totalEarnings}</p>
      </div>`;
  }
  function gainXP(amount) {
    xp += amount;
    if (xp >= xpToNextLevel) {
      xp -= xpToNextLevel;
      level++;
      xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
    }
  }

  // ---- CLICK EVENTS ----
  document.getElementById("click-button").onclick = () => {
    const earned = level;
    gold += earned;
    gainXP(1);
    clickCount++;
    totalEarnings += earned;
    document.getElementById("click-button").classList.add("clicked");
    setTimeout(()=>document.getElementById("click-button").classList.remove("clicked"), 120);
    updateUI();
  };
  document.getElementById("collect-button").onclick = () => {
    gold += vault; vault = 0; updateUI();
  };
  document.getElementById("upgrade-vault-button").onclick = () => {
    let cost = vaultLevel*50;
    if (gold >= cost) { gold -= cost; vaultLevel++; vaultCapacity = vaultLevel*100; updateUI(); }
  };
  document.getElementById("toggle-theme").onclick = () => {
    document.body.classList.toggle('dark');
    darkMode = document.body.classList.contains('dark');
    saveGame();
  };
  document.getElementById("reset-game-btn").onclick = () => {
    if(confirm("Are you sure? All your progress will be lost!")){
      localStorage.removeItem('zardoSave');
      location.reload();
    }
  };

  // ---- BUSINESSES PANEL ----
  function renderBusinesses() {
    const bizList = document.getElementById("business-list");
    bizList.innerHTML = "";
    if (businesses.length === 0) {
      let startBox = document.createElement("div");
      startBox.className = "business-item business-locked";
      startBox.style.margin = "40px auto 0 auto"; startBox.style.textAlign="center";
      startBox.innerHTML = `<button class="biz-buy-btn" id="open-business-modal" style="font-size:19px;min-width:180px;min-height:54px;">Start Business</button>`;
      bizList.appendChild(startBox);
    } else {
      bizList.innerHTML += "<h3 style='margin:8px 0;'>Your Businesses</h3>";
      businesses.forEach((biz,i) => {
        const def = businessDefs[biz.id-1];
        let box = document.createElement("div");
        box.className = "business-item business-owned";
        box.innerHTML = `<div class="biz-title">${def.name} <span class="biz-lvl">Lvl ${biz.level}</span></div>
          <div class="biz-income">Income: <b>${biz.income}</b>/sec</div>
          <button class="biz-upgrade-btn" ${biz.level>=10?"disabled":""}>
            Upgrade (${businessUpgradeCost(biz)} Gold)
          </button>
        `;
        box.querySelector(".biz-upgrade-btn").onclick = ()=>{
          let upCost = businessUpgradeCost(biz);
          if(gold>=upCost && biz.level<10) {
            gold-=upCost;
            biz.level+=1;
            biz.income+=2;
            updateUI();
            renderBusinesses();
          }
        };
        bizList.appendChild(box);
      });
      if (businessDefs.some(def=>!getBusiness(def.id))) {
        let startBox = document.createElement("div");
        startBox.className = "business-item business-locked";
        startBox.style.margin = "22px auto 0 auto"; startBox.style.textAlign="center";
        startBox.innerHTML = `<button class="biz-buy-btn" id="open-business-modal" style="font-size:17px;min-width:140px;min-height:45px;">Start New Business</button>`;
        bizList.appendChild(startBox);
      }
    }
    let btn = document.getElementById("open-business-modal");
    if (btn) btn.onclick = showBusinessModal;
  }
  function showBusinessModal() {
    const modal = document.getElementById("business-select-modal");
    const list = document.getElementById("business-select-list");
    list.innerHTML = '';
    businessDefs.filter(def=>!getBusiness(def.id)).forEach(def=>{
      let card = document.createElement("div");
      card.className = "business-buy-card";
      card.innerHTML = `
        <span class="biz-name">${def.name}</span>
        <span class="biz-cost">${def.baseCost} Gold</span>
        <button class="buy-btn" ${gold<def.baseCost?"disabled":""}>Buy</button>
      `;
      card.querySelector(".buy-btn").onclick = function() {
        if (gold >= def.baseCost) {
          gold -= def.baseCost;
          businesses.push({id:def.id,level:1,income:5});
          modal.classList.add('hidden');
          renderBusinesses();
          updateUI();
        }
      };
      list.appendChild(card);
    });
    modal.classList.remove('hidden');
  }
  document.getElementById("close-business-modal").onclick = function(){
    document.getElementById("business-select-modal").classList.add('hidden');
  };

  // درآمد بیزنس‌ها هر ثانیه به Vault اضافه شود
  if (bizIncomeInterval) clearInterval(bizIncomeInterval);
  bizIncomeInterval = setInterval(()=>{
    let total = businesses.reduce((sum,b)=>sum+b.income,0);
    if(total>0){
      vault = Math.min(vault+total, vaultCapacity);
      updateUI();
    }
  }, 1000);

  // ---- ROBOT PANEL ----
  function renderRobotPanel() {
    let panel = document.getElementById("panel-robot");
    panel.innerHTML = "";
    let card = document.createElement("div");
    card.className = "robot-card";
    card.innerHTML = `
      <div class="robot-title">
        🤖 Robot Collector
        <span style="font-size:16px;font-weight:normal;color:#666;margin-left:8px;">${robotOwned ? "Level " + robotLevel : "Not owned"}</span>
      </div>
      <div class="robot-stat-list">
        <span><b>Vault:</b> ${vault} / ${vaultCapacity}</span>
        <span><b>Gold:</b> ${gold}</span>
        <span><b>Collect Power:</b> ${robotCollect} Gold / collect</span>
        <span><b>Every:</b> 10 seconds</span>
      </div>
      <div class="robot-timer">${robotOwned ? ("Next collect in: <span id='robot-timer-txt'>" + robotTimeLeft + "</span>s") : ""}</div>
    `;
    if (!robotOwned) {
      let btn = document.createElement("button");
      btn.className = "robot-buy-btn";
      btn.innerText = `Buy Robot (${robotBuyCost} Gold)`;
      btn.disabled = gold < robotBuyCost;
      btn.onclick = function() {
        if (gold >= robotBuyCost) {
          gold -= robotBuyCost;
          robotOwned = true;
          robotLevel = 1;
          robotCollect = 2;
          robotUpgradeCost = 400;
          robotTimeLeft = 10;
          startRobotInterval();
          updateUI();
          renderRobotPanel();
        }
      };
      card.appendChild(btn);
    } else {
      let btn = document.createElement("button");
      btn.className = "robot-upgrade-btn";
      btn.innerText = `Upgrade Robot (${robotUpgradeCost} Gold)`;
      btn.disabled = gold < robotUpgradeCost;
      btn.onclick = function() {
        if (gold >= robotUpgradeCost) {
          gold -= robotUpgradeCost;
          robotLevel += 1;
          robotCollect += 2;
          robotUpgradeCost = Math.floor(robotUpgradeCost * 1.8);
          updateUI();
          renderRobotPanel();
        }
      };
      card.appendChild(btn);
    }
    panel.appendChild(card);
  }
  function startRobotInterval() {
    if (robotInterval) clearInterval(robotInterval);
    robotTimeLeft = 10;
    robotInterval = setInterval(() => {
      if (!robotOwned) return;
      robotTimeLeft -= 1;
      let txt = document.getElementById("robot-timer-txt");
      if (txt) txt.innerText = robotTimeLeft;
      if (robotTimeLeft <= 0) {
        let canCollect = Math.min(robotCollect, vault);
        gold += canCollect;
        vault -= canCollect;
        robotTimeLeft = 10;
        updateUI();
        renderRobotPanel();
      }
    }, 1000);
  }
  if (robotOwned) startRobotInterval();

  // ---- TABS SWITCH ----
  document.querySelector(".bottom-tabs").onclick = function(e) {
    if(e.target.classList.contains("tab")) {
      let tab = e.target;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
      document.getElementById(tab.dataset.panel).classList.remove('hidden');
      if(tab.dataset.panel==="panel-business") renderBusinesses();
      if(tab.dataset.panel==="panel-robot") renderRobotPanel();
      if(tab.dataset.panel==="settings-panel") showProfileInfo();
      if(tab.dataset.panel==="panel-referral") showReferralPanel(); // این خط برای رفرال
      updateUI();
    }
  };
  document.getElementById("settings-open").onclick = () => {
    document.querySelectorAll('.panel').forEach(p => p.classList.add("hidden"));
    document.getElementById("settings-panel").classList.remove("hidden");
    showTelegramUserProfile();
    updateUI();
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.tab[data-panel="settings-panel"]').classList.add('active');
  };

  // ---- INIT ----
  loadGame();
  updateUI();
  renderBusinesses();
  renderRobotPanel();
});
function showTelegramConnectionStatus() {
  const infoDiv = document.getElementById('tg-user-info');
  if (!infoDiv) return;
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user) {
      infoDiv.innerHTML = `🟢 Connected as <b>${user.first_name}</b> <span style="color:#888;">(${user.id})</span>`;
    } else {
      infoDiv.innerHTML = `🔴 Not connected to Telegram WebApp.`;
    }
  } else {
    infoDiv.innerHTML = `🔴 Not connected to Telegram WebApp.`;
  }
}

// هر وقت وارد تنظیمات شدی اینو صدا بزن (مثلاً تو event تب تنظیمات):
function showTelegramUserProfile() {
  const div = document.getElementById('tg-user-profile');
  if (!div) return;
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user) {
      let photoUrl = user.photo_url
        ? user.photo_url
        : "https://telegra.ph/file/9be421f926c5b0b7e59b5.png";
      div.innerHTML = `
        <img src="${photoUrl}" style="width:76px;height:76px;border-radius:50%;border:3px solid #61a5ff;box-shadow:0 2px 8px #bde0fd;margin-bottom:7px;">
        <div style="font-size:17px;font-weight:bold;margin-top:8px;">${user.first_name || "User"}</div>
        <div style="font-size:14px;color:#444;">@${user.username || "unknown"}</div>
      `;
    } else {
      div.innerHTML = `<div style="color:#d44;font-size:16px;">Not connected to Telegram</div>`;
    }
  } else {
    div.innerHTML = `<div style="color:#d44;font-size:16px;">Not connected to Telegram</div>`;
  }
}
document.getElementById("settings-open").onclick = () => {
  document.querySelectorAll('.panel').forEach(p => p.classList.add("hidden"));
  document.getElementById("settings-panel").classList.remove("hidden");
  showTelegramUserProfile(); // این تابع باید دقیقاً اینجا فراخوانی شه
};
let telegramUserId = null;

// تابع گرفتن userId تلگرام بعد از لود
function fetchTelegramUserId(callback) {
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
    let user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user && user.id) {
      telegramUserId = user.id;
      if (typeof callback === "function") callback();
      return;
    }
  }
  // اگر نبود، بعداً هم می‌تونی صدا بزنی (مثلاً حالت مهمان)
  telegramUserId = "demo";
  if (typeof callback === "function") callback();
}

// تابع نمایش لینک رفرال
// -- Referral Panel (کد دعوت)
function showReferralPanel() {
  const refInput = document.getElementById("ref-link");
  let userId = "demo";
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
    let user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user && user.id) userId = user.id;
  }
  let baseLink = "https://ZARDOZDCBOT";
  refInput.value = `${baseLink}/?ref=${userId}`;
  // نمایش تعداد رفرال و درآمد
  let refCount = localStorage.getItem('my-ref-count') || 0;
  let refIncome = localStorage.getItem('my-ref-income') || 0;
  document.getElementById("ref-count").textContent = refCount;
  document.getElementById("ref-income").textContent = refIncome;
}

//تست

function getReferralFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}
window.addEventListener('DOMContentLoaded', function() {
  // ... سایر کدها
  let referralId = getReferralFromURL();
  if(referralId && !localStorage.getItem('ref-done')) {
    gold += 50; // جایزه به کاربر جدید
    localStorage.setItem('ref-done', '1');

    // ذخیره اینکه زیرمجموعه اضافه شد (فقط جهت تست لوکال)
    let rc = localStorage.getItem('my-ref-count') || 0;
    localStorage.setItem('my-ref-count', (+rc) + 1);
    // این بخش رو در عمل باید توی سرور ذخیره کنی نه لوکال!
  }
});
// فرض: هر بار Gold کاربر جدید زیاد میشه
function addGold(amount) {
  gold += amount;
  // شبیه‌سازی پرداخت 10% به معرف:
  let ref = getReferralFromURL();
  if(ref && ref !== "demo") {
    let income = Math.floor(amount * 0.10);
    let rIncome = localStorage.getItem('my-ref-income') || 0;
    localStorage.setItem('my-ref-income', (+rIncome) + income);
  }
  // ...
}

