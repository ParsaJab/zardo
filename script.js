let gold = parseInt(localStorage.getItem("gold")) || 0;
let clicks = parseInt(localStorage.getItem("clicks")) || 0;

const goldEl = document.getElementById("gold");
const clicksEl = document.getElementById("clicks");
const clickBtn = document.getElementById("click-btn");

goldEl.textContent = gold;
clicksEl.textContent = clicks;

clickBtn.addEventListener("click", () => {
  gold += 3;
  clicks += 1;
  goldEl.textContent = gold;
  clicksEl.textContent = clicks;

  localStorage.setItem("gold", gold);
  localStorage.setItem("clicks", clicks);
});
