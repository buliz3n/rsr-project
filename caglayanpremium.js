document.addEventListener("DOMContentLoaded", function () {
  const stage = document.getElementById("stackStage");
  const cards = Array.from(document.querySelectorAll(".stack-card"));
  const dots = Array.from(document.querySelectorAll("#stackDots .dot"));
  const fadeLayer = document.getElementById("fadeLayer");

  if (!stage || cards.length === 0) return;

  let activeIndex = 0;
  let isAnimating = false;

  function renderGallery(index) {
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;

    if (fadeLayer) fadeLayer.classList.add("show");

    setTimeout(() => {
      activeIndex = (activeIndex + 1) % cards.length;
      renderGallery(activeIndex);
    }, 120);

    setTimeout(() => {
      if (fadeLayer) fadeLayer.classList.remove("show");
      isAnimating = false;
    }, 240);
  }

  stage.addEventListener("click", nextSlide);
  stage.addEventListener("touchend", function (e) {
    e.preventDefault();
    nextSlide();
  }, { passive: false });

  renderGallery(activeIndex);
});