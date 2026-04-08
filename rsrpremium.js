console.log("supabase:", typeof supabase);

const SUPABASE_URL = "https://dxpzfxumtsdmrbiwxoqg.supabase.co";
const SUPABASE_KEY = "sb_publishable_fJ2qpowLou20v_SwZITHfg_dP5vA-zR";

const ROUTES = {
  FREE: "./index.html"
};

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function () {
  document.body.classList.add("premium-loading");

  const fadeLayer = document.getElementById("screenFade");
  const heroCard = document.getElementById("anasayfa");
  const regionTags = document.querySelectorAll("#cografi-konum .region-tag");
  const homeButton = document.getElementById("homeButton");

  const globalMenu = document.getElementById("globalMenu");
  const menuToggle = document.getElementById("menuToggle");
  const menuSections = document.querySelectorAll(".menu-section");
  const menuTriggers = document.querySelectorAll(".menu-section-trigger");

  const logoutButton = document.getElementById("logoutButton");
  const userEmailText = document.getElementById("menuUserEmail");

  let isTransitioning = false;
  let isRedirecting = false;

  function revealPremiumPage() {
    document.body.classList.remove("premium-loading");
    document.body.classList.add("premium-ready");
  }

  function redirectToFree() {
    if (isRedirecting) return;
    isRedirecting = true;
    window.location.replace(ROUTES.FREE);
  }

  function getActiveCard() {
    return document.querySelector(
      ".hero-card.active, .info-card.active, .place-card.active"
    );
  }

  function updateHomeButton(targetCard) {
    if (!homeButton) return;

    if (targetCard && targetCard.id !== "anasayfa") {
      homeButton.classList.add("show");
    } else {
      homeButton.classList.remove("show");
    }
  }

  function closeMenu() {
    if (globalMenu) globalMenu.classList.remove("open");
    if (menuToggle) menuToggle.classList.remove("active");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    if (globalMenu) globalMenu.setAttribute("aria-hidden", "true");
  }

  function openMenu() {
    if (globalMenu) globalMenu.classList.add("open");
    if (menuToggle) menuToggle.classList.add("active");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    if (globalMenu) globalMenu.setAttribute("aria-hidden", "false");
  }

  function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!globalMenu || !menuToggle || isRedirecting) return;

    if (globalMenu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function showCard(targetId) {
    const targetCard = document.querySelector(targetId);
    const currentCard = getActiveCard();

    if (!targetCard || currentCard === targetCard || isTransitioning || isRedirecting) {
      return;
    }

    isTransitioning = true;
    closeMenu();

    if (currentCard && currentCard.id === "anasayfa") {
      currentCard.classList.add("is-leaving");
    }

    if (fadeLayer) {
      fadeLayer.classList.add("active");
    }

    setTimeout(() => {
      if (currentCard) {
        currentCard.classList.remove("active", "is-leaving");
      }

      targetCard.classList.add("active");
      updateHomeButton(targetCard);
    }, 260);

    setTimeout(() => {
      if (fadeLayer) {
        fadeLayer.classList.remove("active");
      }
      isTransitioning = false;
    }, 560);
  }

  async function checkAccess() {
    const {
      data: { session },
      error: sessionError
    } = await client.auth.getSession();

    if (sessionError) {
      console.error("Session kontrol hatası:", sessionError.message);
      redirectToFree();
      return false;
    }

    if (!session) {
      redirectToFree();
      return false;
    }

    const user = session.user;

    if (userEmailText) {
      userEmailText.textContent = user.email || "";
    }

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profil kontrol hatası:", profileError.message);
      redirectToFree();
      return false;
    }

    if (!profile || profile.is_premium !== true) {
      redirectToFree();
      return false;
    }

    return true;
  }

  async function handleLogout() {
    if (isRedirecting) return;

    const { error } = await client.auth.signOut();

    if (error) {
      console.error("Çıkış hatası:", error.message);
      return;
    }

    localStorage.removeItem("rsrPremiumAccess");
    sessionStorage.removeItem("rsrSelectedRoute");

    redirectToFree();
  }

  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      localStorage.removeItem("rsrPremiumAccess");
      sessionStorage.removeItem("rsrSelectedRoute");
      redirectToFree();
      return;
    }

    if (!session) {
      redirectToFree();
    }
  });

  const hasAccess = await checkAccess();
  if (!hasAccess) return;

  revealPremiumPage();

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  menuTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      if (isRedirecting) return;

      const parent = this.closest(".menu-section");

      menuSections.forEach((section) => {
        if (section !== parent) section.classList.remove("active");
      });

      if (parent) parent.classList.toggle("active");
    });
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  if (heroCard) {
    heroCard.style.cursor = "pointer";

    heroCard.addEventListener("click", function (e) {
      if (globalMenu && globalMenu.classList.contains("open")) return;
      if (e.target.closest("#menuToggle")) return;
      if (isRedirecting) return;
      showCard("#cografi-konum");
    });
  }

  regionTags.forEach((tag) => {
    tag.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#")) {
        e.preventDefault();
        showCard(href);
      }
    });
  });

  if (homeButton) {
    homeButton.addEventListener("click", function () {
      if (isRedirecting) return;
      showCard("#cografi-konum");
    });
  }

  document.addEventListener("click", function (e) {
    if (!globalMenu || !globalMenu.classList.contains("open")) return;

    const clickedMenu = globalMenu.contains(e.target);
    const clickedToggle = menuToggle && menuToggle.contains(e.target);

    if (!clickedMenu && !clickedToggle) {
      closeMenu();
    }
  });

  updateHomeButton(getActiveCard());
});
