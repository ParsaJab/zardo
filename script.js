window.addEventListener('DOMContentLoaded', function() {

  // متغیرهای اصلی
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

  // ذخیره و لود
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

  // توابع اصلی
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

  // رویداد کلیک
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
        box.querySelector(".
