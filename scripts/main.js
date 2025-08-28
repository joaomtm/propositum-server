// Controle de fonte
let currentFontSize = 16;

document.getElementById("increase-font").addEventListener("click", () => {
  currentFontSize += 2;
  document.body.style.fontSize = currentFontSize + "px";
});

document.getElementById("decrease-font").addEventListener("click", () => {
  if (currentFontSize > 10) {
    currentFontSize -= 2;
    document.body.style.fontSize = currentFontSize + "px";
  }
});

// Toggle contraste
document.getElementById("toggle-contrast").addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
});
