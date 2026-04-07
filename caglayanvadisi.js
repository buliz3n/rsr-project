const freeTeaserButton = document.getElementById("freeTeaserButton");
const freeTeaserNote = document.getElementById("freeTeaserNote");

if (freeTeaserButton && freeTeaserNote) {
  freeTeaserButton.addEventListener("click", () => {
    freeTeaserNote.textContent =
      "Premium erişimde tam rota sırası, daha seçili durak akışı ve gelişmiş keşif yapısı açılır.";
  });
}

const teaserStackStage = document.getElementById("teaserStackStage");
const teaserFadeLayer = document.getElementById("teaserFadeLayer");
const teaserStackCards = Array.from(
  document.querySelectorAll(".teaser-stack-card")
);
const teaserStackDots = Array.from(
  document.querySelectorAll("#teaserStackDots .dot")
);

let teaserCurrentIndex = 0;
let teaserTransitioning = false;

function updateTeaserStack(index) {
  teaserStackCards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });

  teaserStackDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function nextTeaserStackCard() {
  if (teaserTransitioning || teaserStackCards.length === 0) return;

  teaserTransitioning = true;

  if (teaserFadeLayer) {
    teaserFadeLayer.classList.add("show");
  }

  setTimeout(() => {
    teaserCurrentIndex = (teaserCurrentIndex + 1) % teaserStackCards.length;
    updateTeaserStack(teaserCurrentIndex);

    if (teaserFadeLayer) {
      teaserFadeLayer.classList.remove("show");
    }

    setTimeout(() => {
      teaserTransitioning = false;
    }, 180);
  }, 140);
}

if (teaserStackStage) {
  teaserStackStage.addEventListener("click", nextTeaserStackCard);

  let teaserTouchStartX = 0;
  let teaserTouchEndX = 0;

  teaserStackStage.addEventListener(
    "touchstart",
    (e) => {
      teaserTouchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  teaserStackStage.addEventListener(
    "touchend",
    (e) => {
      teaserTouchEndX = e.changedTouches[0].clientX;
      const teaserSwipeDistance = teaserTouchStartX - teaserTouchEndX;

      if (Math.abs(teaserSwipeDistance) > 35) {
        nextTeaserStackCard();
      }
    },
    { passive: true }
  );
}

updateTeaserStack(teaserCurrentIndex);