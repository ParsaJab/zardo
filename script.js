
let gold = 0;
let xp = 0;
let level = 1;
let clicks = 0;
let xpToNext = 10;
let lastClickTime = 0;
let comboCount = 0;
let passiveGold = 0;

function updateUI() {
  document.getElementById("gold").textContent = Math.floor(gold);
  document.getElementById("clicks").textContent = clicks;
  document.getElementById("level").textContent = level;
  document.getElementById("xp").textContent = xp;
  document.getElementById("xp-next").textContent = xpToNext;
  const percent = Math.floor((xp / xpToNext) * 100);
  document.getElementById("xp-fill").style.width = percent + "%";
}

document.getElementById("click-btn").addEventListener("click", (e) => {
  const now = Date.now();
  if (now - lastClickTime < 500) {
    comboCount++;
    if (comboCount >= 5) {
      document.getElementById("click-btn").classList.add("combo");
      gold += level * 2;
    } else {
      gold += level;
    }
  } else {
    comboCount = 0;
    gold += level;
  }
  lastClickTime = now;
  xp++;
  clicks++;

  if (xp >= xpToNext) {
    xp -= xpToNext;
    level++;
    xpToNext = Math.floor(xpToNext * 1.5);
  }

  // Drop animation
  const drop = document.createElement("div");
  drop.className = "gold-drop";
  drop.style.left = `${e.clientX}px`;
  drop.style.top = `${e.clientY}px`;
  drop.textContent = "+ZDC";
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 900);

  setTimeout(() => {
    document.getElementById("click-btn").classList.remove("combo");
  }, 300);

  updateUI();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

updateUI();
