const premiumAccess = localStorage.getItem("rsrPremiumAccess");

if (premiumAccess !== "true") {
  window.location.href = "https://codepen.io/mjoraste/debug/dPpeKoJ?authentication_hash=xnrabWJPxLYA";
}

const toast = document.getElementById("premiumToast");
const stackStage = document.getElementById("stackStage");
const fadeLayer = document.getElementById("fadeLayer");
const stackCards = Array.from(document.querySelectorAll(".stack-card"));
const stackDots = Array.from(document.querySelectorAll("#stackDots .dot"));

let currentIndex = 0;
let isTransitioning = false;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function updateStack(index) {
  stackCards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });

  stackDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function nextStackCard() {
  if (isTransitioning || stackCards.length === 0) return;

  isTransitioning = true;

  if (fadeLayer) {
    fadeLayer.classList.add("show");
  }

  setTimeout(() => {
    currentIndex = (currentIndex + 1) % stackCards.length;
    updateStack(currentIndex);

    if (fadeLayer) {
      fadeLayer.classList.remove("show");
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 180);
  }, 140);
}

if (stackStage) {
  stackStage.addEventListener("click", nextStackCard);

  let touchStartX = 0;
  let touchEndX = 0;

  stackStage.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  stackStage.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > 35) {
        nextStackCard();
      }
    },
    { passive: true }
  );
}

/* mini gallery */
const miniGalleryOverlay = document.getElementById("miniGalleryOverlay");
const openUpperGallery = document.getElementById("openUpperGallery");
const openUpperGallery2 = document.getElementById("openUpperGallery2");
const closeMiniGallery = document.getElementById("closeMiniGallery");

const miniStackStage = document.getElementById("miniStackStage");
const miniFadeLayer = document.getElementById("miniFadeLayer");
const miniStackCards = Array.from(document.querySelectorAll(".mini-stack-card"));
const miniStackDots = Array.from(document.querySelectorAll("#miniStackDots .dot"));

let miniCurrentIndex = 0;
let miniTransitioning = false;

function openMiniGallery() {
  if (!miniGalleryOverlay) return;
  miniGalleryOverlay.classList.add("show");
  miniGalleryOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeMiniGalleryModal() {
  if (!miniGalleryOverlay) return;
  miniGalleryOverlay.classList.remove("show");
  miniGalleryOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function updateMiniStack(index) {
  miniStackCards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });

  miniStackDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function nextMiniStackCard() {
  if (miniTransitioning || miniStackCards.length === 0) return;

  miniTransitioning = true;

  if (miniFadeLayer) {
    miniFadeLayer.classList.add("show");
  }

  setTimeout(() => {
    miniCurrentIndex = (miniCurrentIndex + 1) % miniStackCards.length;
    updateMiniStack(miniCurrentIndex);

    if (miniFadeLayer) {
      miniFadeLayer.classList.remove("show");
    }

    setTimeout(() => {
      miniTransitioning = false;
    }, 180);
  }, 140);
}

if (openUpperGallery) {
  openUpperGallery.addEventListener("click", openMiniGallery);
}

if (openUpperGallery2) {
  openUpperGallery2.addEventListener("click", openMiniGallery);
}

if (closeMiniGallery) {
  closeMiniGallery.addEventListener("click", closeMiniGalleryModal);
}

if (miniGalleryOverlay) {
  miniGalleryOverlay.addEventListener("click", (e) => {
    if (e.target === miniGalleryOverlay) {
      closeMiniGalleryModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && miniGalleryOverlay?.classList.contains("show")) {
    closeMiniGalleryModal();
  }
});

if (miniStackStage) {
  miniStackStage.addEventListener("click", nextMiniStackCard);

  let miniTouchStartX = 0;
  let miniTouchEndX = 0;

  miniStackStage.addEventListener(
    "touchstart",
    (e) => {
      miniTouchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  miniStackStage.addEventListener(
    "touchend",
    (e) => {
      miniTouchEndX = e.changedTouches[0].clientX;
      const swipeDistance = miniTouchStartX - miniTouchEndX;

      if (Math.abs(swipeDistance) > 35) {
        nextMiniStackCard();
      }
    },
    { passive: true }
  );
}