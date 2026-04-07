const SUPABASE_URL = "https://dxpzfxumtsdmrbiwxoqg.supabase.co";
const SUPABASE_KEY = "sb_publishable_fJ2qpowLou20v_SwZITHfg_dP5vA-zR";

const ROUTES = {
   FREE: "./index.html",
   PREMIUM: "./rsrpremium.html",
   PURCHASE: "./satinalma.html",
   ARILI_PREMIUM: "./07-arilipremium.html"
};

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function () {

   const fadeLayer = document.getElementById("screenFade");
   const heroCard = document.getElementById("anasayfa");
   const regionTags = document.querySelectorAll("#cografi-konum .region-tag");
   const homeButton = document.getElementById("homeButton");

   const globalMenu = document.getElementById("globalMenu");
   const menuToggle = document.getElementById("menuToggle");
   const menuSections = document.querySelectorAll(".menu-section");
   const menuTriggers = document.querySelectorAll(".menu-section-trigger");

   const menuLoginHero = document.getElementById("menuLoginHero");
   const menuLoginForm = document.getElementById("menuLoginForm");
   const menuEmail = document.getElementById("menuEmail");
   const menuPassword = document.getElementById("menuPassword");
   const menuSignupButton = document.getElementById("menuSignupButton");
   const authMessage = document.getElementById("authMessage");

   const menuUserState = document.getElementById("menuUserState");
   const menuUserEmail = document.getElementById("menuUserEmail");
   const menuLogoutButton = document.getElementById("menuLogoutButton");

   let isLoginRedirecting = false;
   let isNavigating = false;

   function goTo(url) {
      if (isNavigating || !url) return;
      isNavigating = true;
      window.location.href = url;
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
   }

   function openMenu() {
      if (globalMenu) globalMenu.classList.add("open");
      if (menuToggle) menuToggle.classList.add("active");
   }

   function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!globalMenu || !menuToggle || isLoginRedirecting || isNavigating)
         return;

      if (globalMenu.classList.contains("open")) {
         closeMenu();
      } else {
         openMenu();
      }
   }

   function setAuthMessage(message, isError = false) {
      if (!authMessage) return;
      authMessage.textContent = message;
      authMessage.style.color = isError ? "#ff8a8a" : "#d8c3a5";
   }

   async function updateMenuUserState() {
      const { data } = await client.auth.getUser();
      const user = data?.user;

      if (user) {
         if (menuLoginHero) menuLoginHero.style.display = "none";
         if (menuLoginForm) menuLoginForm.style.display = "none";
         if (menuUserState) menuUserState.style.display = "grid";
         if (menuUserEmail) menuUserEmail.textContent = user.email || "";
      } else {
         if (menuLoginHero) menuLoginHero.style.display = "grid";
         if (menuLoginForm) menuLoginForm.style.display = "grid";
         if (menuUserState) menuUserState.style.display = "none";
      }
   }

   function showCard(targetId) {
      const targetCard = document.querySelector(targetId);
      const currentCard = getActiveCard();

      if (!targetCard || currentCard === targetCard || isNavigating) return;

      closeMenu();

      if (fadeLayer) fadeLayer.classList.add("active");

      setTimeout(() => {
         if (currentCard) currentCard.classList.remove("active");
         targetCard.classList.add("active");
         updateHomeButton(targetCard);

         window.scrollTo(0, 0); // FIX
      }, 320);

      setTimeout(() => {
         if (fadeLayer) fadeLayer.classList.remove("active");
      }, 620);
   }

   async function handleLogin(e) {
      e.preventDefault();

      const email = menuEmail.value.trim();
      const password = menuPassword.value;

      if (!email || !password) {
         setAuthMessage("E-posta ve şifre girin.", true);
         return;
      }

      const { error } = await client.auth.signInWithPassword({
         email,
         password
      });

      if (error) {
         setAuthMessage(error.message, true);
         return;
      }

      localStorage.setItem("rsrPremiumAccess", "true"); // FIX
      goTo(ROUTES.PREMIUM);
   }

   async function handleSignup() {
      const email = menuEmail.value.trim();
      const password = menuPassword.value;

      const { error } = await client.auth.signUp({
         email,
         password
      });

      if (error) {
         setAuthMessage(error.message, true);
         return;
      }

      setAuthMessage("Üyelik başarılı");
   }

   async function handleLogout() {
      await client.auth.signOut();

      localStorage.removeItem("rsrPremiumAccess");

      goTo(ROUTES.FREE);
   }

   if (menuToggle) {
      menuToggle.addEventListener("click", toggleMenu);
   }

   menuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", function () {
         const parent = this.closest(".menu-section");

         menuSections.forEach((section) => {
            if (section !== parent) section.classList.remove("active");
         });

         if (parent) parent.classList.toggle("active");
      });
   });

   if (menuLoginForm) {
      menuLoginForm.addEventListener("submit", handleLogin);
   }

   if (menuSignupButton) {
      menuSignupButton.addEventListener("click", handleSignup);
   }

   if (menuLogoutButton) {
      menuLogoutButton.addEventListener("click", handleLogout);
   }

   if (heroCard) {
      heroCard.addEventListener("click", function () {
         if (globalMenu && globalMenu.classList.contains("open")) return;
         showCard("#cografi-konum");
      });
   }

   regionTags.forEach((tag) => {
      tag.addEventListener("click", function (e) {
         const href = this.getAttribute("href");

         if (href && href.startsWith("#")) {
            e.preventDefault();
            showCard(href);
         }
      });
   });

   if (homeButton) {
      homeButton.addEventListener("click", function () {
         showCard("#cografi-konum");
      });
   }

   updateHomeButton(getActiveCard());
   updateMenuUserState();
});
