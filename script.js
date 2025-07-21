
let gold = 0;
let level = 1;
let xp = 0;
let vault = 0;
let vaultCapacity = 20;
let clickCount = 0;

function xpToNext() {
  return level * 50;
}

function updateXPBar() {
  const percent = Math.min(100, Math.floor((xp / xpToNext()) * 100));
  document.getElementById("xp-fill").style.width = percent + "%";
  document.getElementById("level-display").textContent = level;
  document.getElementById("profile-level").textContent = level;
}

function addXP(amount) {
  xp += amount;
  while (xp >= xpToNext()) {
    xp -= xpToNext();
    level++;
  }
  updateXPBar();
}

function updateUI() {
  document.getElementById("gold-amount").textContent = gold;
  document.getElementById("gold-amount-big").textContent = gold;
  document.getElementById("vault-amount").textContent = vault;
  document.getElementById("vault-capacity").textContent = vaultCapacity;
  document.getElementById("vault-progress-fill").style.width = Math.min(100, (vault / vaultCapacity) * 100) + "%";
  document.getElementById("profile-clicks").textContent = clickCount;
  document.getElementById("profile-gpc").textContent = level;
  updateXPBar();
}

document.getElementById("click-area").addEventListener("click", () => {
  if (vault < vaultCapacity) {
    vault += level;
    clickCount++;
    addXP(1);
    updateUI();
  }
});

document.getElementById("collect-btn").addEventListener("click", () => {
  gold += vault;
  vault = 0;
  updateUI();
});

document.getElementById("upgrade-vault-btn").addEventListener("click", () => {
  const cost = vaultCapacity * 5;
  if (gold >= cost) {
    gold -= cost;
    vaultCapacity += 20;
    updateUI();
    document.getElementById("vault-upgrade-cost").textContent = vaultCapacity * 5;
  }
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  gold = 0;
  vault = 0;
  vaultCapacity = 20;
  level = 1;
  xp = 0;
  clickCount = 0;
  updateUI();
});

function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("tab", "active"));
  document.getElementById(id).classList.add("tab", "active");
}

// initial load
updateUI();
