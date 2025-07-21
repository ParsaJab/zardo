// Core vars
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
  { id: 'mall', name: 'Mall', level: 0, max: 10, income: 32, price: 500 },
  { id: 'bank', name: 'Bank', level: 0, max: 10, income: 70, price: 1000 },
  { id: 'airline', name: 'Airline', level: 0, max: 10, income: 170, price: 2000 },
  { id: 'hotel', name: 'Hotel', level: 0, max: 10, income: 340, price: 4000 },
  { id: 'construct', name: 'Construct', level: 0, max: 10, income: 610, price: 8000 },
  { id: 'startup', name: 'Startup', level: 0, max: 10, income: 1200, price: 12000 },
  { id: 'crypto', name: 'Crypto', level: 0, max: 10, income: 2300, price: 20000 }
];

// Read/validate
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
  document.getElementById("vault-up-cost").textContent = `(💰${vaultLevel*200})`;
