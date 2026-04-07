const overlay = document.getElementById("premiumOverlay");
const toast = document.getElementById("toast");

const openPremiumFlow = document.getElementById("openPremiumFlow");
const closePremiumFlow = document.getElementById("closePremiumFlow");

const continueLogin = document.getElementById("continueLogin");
const continueSignup = document.getElementById("continueSignup");
const backToStep1 = document.getElementById("backToStep1");
const goToStep3 = document.getElementById("goToStep3");
const backToStep2 = document.getElementById("backToStep2");
const completePayment = document.getElementById("completePayment");
const closeSuccess = document.getElementById("closeSuccess");

const authTabs = Array.from(document.querySelectorAll("[data-auth-tab]"));
const authPanels = Array.from(document.querySelectorAll("[data-auth-panel]"));
const stepDots = Array.from(document.querySelectorAll("[data-step-dot]"));
const modalViews = Array.from(document.querySelectorAll(".modal-view"));
const modalKicker = document.getElementById("modalKicker");
const modalTitle = document.getElementById("premiumModalTitle");

let currentStep = 1;
let selectedRoute = "rsr-premium";
let isProcessingPayment = false;

const PREMIUM_TARGETS = {
  "rsr-premium": "https://codepen.io/mjoraste/debug/azmYoxP?authentication_hash=nqMwvdJbYxBk",
  "caglayan": "https://codepen.io/mjoraste/debug/OPRQROq?authentication_hash=yPkJjNWqmROk",
  "arili": "https://codepen.io/mjoraste/debug/EagRjwX?authentication_hash=yYMyLbenOWKk"
};

const ROUTE_TITLES = {
  "rsr-premium": "Önce hesabınla devam et",
  "caglayan": "Çağlayan Premium için devam et",
  "arili": "Arılı Premium için devam et"
};

const params = new URLSearchParams(window.location.search);
const routeFromUrl = params.get("route");

if (routeFromUrl && PREMIUM_TARGETS[routeFromUrl]) {
  selectedRoute = routeFromUrl;
  sessionStorage.setItem("rsrSelectedRoute", routeFromUrl);
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function setPremiumAccess(value) {
  localStorage.setItem("rsrPremiumAccess", value ? "true" : "false");
}

function updateRouteText() {
  if (!modalTitle) return;
  modalTitle.textContent =
    ROUTE_TITLES[selectedRoute] || ROUTE_TITLES["rsr-premium"];
}

function openModal(step = 1) {
  currentStep = step;
  updateRouteText();

  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  updateStep(step);
}

function closeModal() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function updateStep(step) {
  currentStep = step;

  modalViews.forEach((view) => {
    view.classList.toggle("active", Number(view.dataset.step) === step);
  });

  stepDots.forEach((dot) => {
    dot.classList.toggle(
      "active",
      Number(dot.dataset.stepDot) === Math.min(step, 3)
    );
  });

  if (!modalKicker) return;

  if (step === 1) modalKicker.textContent = "Adım 1 · Giriş";
  if (step === 2) modalKicker.textContent = "Adım 2 · Plan";
  if (step === 3) modalKicker.textContent = "Adım 3 · Ödeme";
  if (step === 4) modalKicker.textContent = "Tamamlandı";
}

function switchAuthTab(tabName) {
  authTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authTab === tabName);
  });

  authPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.authPanel === tabName);
  });
}

function validateStep1(tabName) {
  const activePanel = document.querySelector(`[data-auth-panel="${tabName}"]`);
  if (!activePanel) return false;

  const inputs = Array.from(activePanel.querySelectorAll("input"));
  const emptyField = inputs.find((input) => !input.value.trim());

  if (emptyField) {
    showToast("Lütfen gerekli alanları doldur.");
    emptyField.focus();
    return false;
  }

  return true;
}

function validatePaymentFields() {
  const cardNumber = document.getElementById("cardNumber")?.value || "";
  const cardExpiry = document.getElementById("cardExpiry")?.value || "";
  const cardCvv = document.getElementById("cardCvv")?.value || "";

  if (cardNumber.replace(/\s/g, "").length !== 16) {
    showToast("Kart numarası 16 haneli olmalı.");
    return false;
  }

  if (cardExpiry.length !== 5) {
    showToast("Son kullanma formatı AA/YY olmalı.");
    return false;
  }

  if (cardCvv.length !== 3) {
    showToast("CVV 3 haneli olmalı.");
    return false;
  }

  return true;
}

function redirectToSelectedPremium() {
  window.location.href =
    "https://codepen.io/mjoraste/debug/azmYoxP?authentication_hash=nqMwvdJbYxBk";
}

function proceedAfterAuth() {
  showToast("Giriş doğrulandı.");
  updateStep(2);
}

function completeFakePaymentAndUnlock() {
  if (isProcessingPayment) return;
  if (!validatePaymentFields()) return;

  isProcessingPayment = true;
  showToast("Ödeme işleniyor...");

  setTimeout(() => {
    setPremiumAccess(true);
    updateStep(4);
    showToast("Premium erişim açıldı.");

    setTimeout(() => {
      redirectToSelectedPremium();
    }, 900);
  }, 700);
}

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchAuthTab(tab.dataset.authTab);
  });
});

if (openPremiumFlow) {
  openPremiumFlow.addEventListener("click", () => {
    openModal(1);
  });
}

if (closePremiumFlow) {
  closePremiumFlow.addEventListener("click", closeModal);
}

if (overlay) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

if (continueLogin) {
  continueLogin.addEventListener("click", () => {
    if (!validateStep1("login")) return;
    proceedAfterAuth();
  });
}

if (continueSignup) {
  continueSignup.addEventListener("click", () => {
    if (!validateStep1("signup")) return;
    showToast("Kayıt tamamlandı.");
    proceedAfterAuth();
  });
}

if (backToStep1) {
  backToStep1.addEventListener("click", () => updateStep(1));
}

if (goToStep3) {
  goToStep3.addEventListener("click", () => updateStep(3));
}

if (backToStep2) {
  backToStep2.addEventListener("click", () => updateStep(2));
}

if (completePayment) {
  completePayment.addEventListener("click", completeFakePaymentAndUnlock);
}

if (closeSuccess) {
  closeSuccess.addEventListener("click", () => {
    redirectToSelectedPremium();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay && overlay.classList.contains("show")) {
    closeModal();
  }
});
const cardNumberInput = document.getElementById("cardNumber");
const cardExpiryInput = document.getElementById("cardExpiry");
const cardCvvInput = document.getElementById("cardCvv");

if (cardNumberInput) {
  cardNumberInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    e.target.value = value;
  });
}

if (cardExpiryInput) {
  cardExpiryInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);

    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    e.target.value = value;
  });
}

if (cardCvvInput) {
  cardCvvInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
  });
}