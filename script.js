let gold = Number(localStorage.getItem("gold")) || 0;
let passiveGold = Number(localStorage.getItem("passiveGold")) || 0;
let vaultLevel = Number(localStorage.getItem("vaultLevel")) || 1;
let vaultCapacity = vaultLevel * 20;

function updateUI() {
  document.getElementById("gold-amount").textContent = Math.floor(gold);
  // Vault progress
  let vaultPercent = Math.min(Math.floor(passiveGold / vaultCapacity * 100), 100);
  document.getElementById("vault-progress-fill").style.width = vaultPercent + "%";
  document.getElementById("vault-amount").textContent = Math.floor(passiveGold);
  document.getElementById("vault-capacity").textContent = vaultCapacity;
  localStorage.setItem("gold", gold);
  localStorage.setItem("passiveGold", passiveGold);
  localStorage.setItem("vaultLevel", vaultLevel);
}

function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
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
