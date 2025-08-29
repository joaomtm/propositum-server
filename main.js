// main.js — mantém a versão estável + adiciona modal e isolamento nas imagens

// Estado
let baseFontSize = 18; // px (min 12, max 28)
const MIN_FONT = 12;
const MAX_FONT = 28;

// Espera DOM pronto
document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const decreaseBtn = document.getElementById("decrease-font");
  const increaseBtn = document.getElementById("increase-font");
  const toggleContrastBtn = document.getElementById("toggle-contrast");
  const helpBtn = document.getElementById("help-btn");

  const chatContainer = document.getElementById("chat-container");
  const placeholder = document.querySelector(".placeholder");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  const body = document.body;
  const headerTitle = document.querySelector("header h1");

  // ISOLADO: apenas as imagens laterais
  const sideImages = document.querySelectorAll(".image-left, .image-right");

  // Modal (não abre sozinho)
  const helpModal = document.getElementById("help-modal");
  const closeHelp = document.getElementById("close-help");

  /* =============================
     Fonte (usa root <html> em rem)
     ============================= */
  function setRootFontSize(px) {
    const clamped = Math.max(MIN_FONT, Math.min(MAX_FONT, px));
    baseFontSize = clamped;
    document.documentElement.style.fontSize = baseFontSize + "px";
    document.documentElement.style.setProperty('--base-font-size', baseFontSize + "px");
    document.documentElement.setAttribute('data-font-size', baseFontSize);
  }

  /* =============================
     Visibilidade do chat
     ============================= */
  function toggleChatVisibility(showChat) {
    if (showChat) {
      if (placeholder) placeholder.classList.add("hidden");
      if (chatContainer) chatContainer.classList.remove("hidden");
    } else {
      if (placeholder) placeholder.classList.remove("hidden");
      if (chatContainer) chatContainer.classList.add("hidden");
    }
  }

  /* =============================
     Mensagens
     ============================= */
  function addMessage(text, sender) {
    if (!chatContainer) return;
    toggleChatVisibility(true);

    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerHTML = sender === "user"
      ? `<strong>Você:</strong><br>${escapeHtml(text)}`
      : `<strong>Propositum:</strong><br>Olá, me chamo Propositum! Infelizmente essa versão do MVP ainda não me dá capacidades de respondê-lo!`;

    wrapper.appendChild(msg);
    chatContainer.appendChild(wrapper);

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    showScrollbar();
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showScrollbar() {
    if (!chatContainer) return;
    chatContainer.classList.add("scrolling");
    setTimeout(() => chatContainer.classList.remove("scrolling"), 2000);
  }

  /* =============================
     Alto contraste (isolado)
     ============================= */
  function toggleHighContrast() {
    const isOn = body.classList.toggle("high-contrast");
    if (toggleContrastBtn) toggleContrastBtn.setAttribute("aria-pressed", isOn ? "true" : "false");

    // Só as imagens laterais (isolado)
    sideImages.forEach(img => {
      if (isOn) {
        img.style.filter = "contrast(180%) saturate(120%)";
      } else {
        img.style.filter = ""; // volta ao CSS padrão (com var)
      }
    });

    // Título e placeholder com cor branca apenas quando alto contraste
    if (headerTitle) headerTitle.style.color = isOn ? "#fff" : "";
    if (placeholder)  placeholder.style.color  = isOn ? "#fff" : "";
  }

  /* =============================
     Modal de ajuda (abrir/fechar)
     ============================= */
  function openHelp() {
    if (!helpModal) return;
    helpModal.classList.remove("hidden");
    helpModal.setAttribute("aria-hidden", "false");
    // foco no botão fechar
    if (closeHelp) closeHelp.focus();

    // listeners temporários enquanto aberto
    document.addEventListener("keydown", escToClose);
    helpModal.addEventListener("click", backdropToClose);
  }

  function closeHelpModal() {
    if (!helpModal) return;
    helpModal.classList.add("hidden");
    helpModal.setAttribute("aria-hidden", "true");
    if (helpBtn) helpBtn.focus();

    document.removeEventListener("keydown", escToClose);
    helpModal.removeEventListener("click", backdropToClose);
  }

  function escToClose(e) {
    if (e.key === "Escape") closeHelpModal();
  }

  function backdropToClose(e) {
    // Fecha apenas se clicar no fundo (não no conteúdo)
    if (e.target === helpModal) closeHelpModal();
  }

  /* =============================
     Listeners
     ============================= */
  if (decreaseBtn) decreaseBtn.addEventListener("click", () => setRootFontSize(baseFontSize - 2));
  if (increaseBtn) increaseBtn.addEventListener("click", () => setRootFontSize(baseFontSize + 2));
  if (toggleContrastBtn) toggleContrastBtn.addEventListener("click", toggleHighContrast);

  if (helpBtn) helpBtn.addEventListener("click", openHelp);
  if (closeHelp) closeHelp.addEventListener("click", closeHelpModal);

  if (sendBtn && userInput) {
    sendBtn.addEventListener("click", () => {
      const text = userInput.value.trim();
      if (!text) return;
      addMessage(text, "user");
      userInput.value = "";
      setTimeout(() => addMessage("", "bot"), 1000);
    });

    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendBtn.click();
      }
    });
  }

  // Inicializa valores
  setRootFontSize(baseFontSize);
  toggleChatVisibility(false);
});
