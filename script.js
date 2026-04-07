console.log("supabase:", typeof supabase);

const SUPABASE_URL = "https://dxpzfxumtsdmrbiwxoqg.supabase.co";
const SUPABASE_KEY = "sb_publishable_fJ2qpowLou20v_SwZITHfg_dP5vA-zR";

const ROUTES = {
   FREE: "https://cdpn.io/pen/debug/KwMmwOo?authentication_hash=NjMYzVVKdDXr",
   PREMIUM:
      "https://codepen.io/mjoraste/debug/azmYoxP?authentication_hash=nqMwvdJbYxBk"
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
      if (isNavigating) return;
      isNavigating = true;
      window.location.replace(url);
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
      if (isLoginRedirecting || isNavigating) return;

      const { data, error } = await client.auth.getUser();

      if (error) {
         console.error("Kullanıcı bilgisi alınamadı:", error.message);
         return;
      }

      const user = data?.user;

      if (user) {
         if (menuLoginHero) menuLoginHero.style.display = "none";
         if (menuLoginForm) menuLoginForm.style.display = "none";
         if (menuUserState) menuUserState.style.display = "grid";
         if (menuUserEmail) menuUserEmail.textContent = user.email || "";
         setAuthMessage("");
      } else {
         if (menuLoginHero) menuLoginHero.style.display = "grid";
         if (menuLoginForm) menuLoginForm.style.display = "grid";
         if (menuUserState) menuUserState.style.display = "none";
         if (menuUserEmail) menuUserEmail.textContent = "";
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
      }, 320);

      setTimeout(() => {
         if (fadeLayer) fadeLayer.classList.remove("active");
      }, 620);
   }

   async function handleLogin(e) {
      e.preventDefault();
      if (isLoginRedirecting || isNavigating) return;

      const email = menuEmail ? menuEmail.value.trim() : "";
      const password = menuPassword ? menuPassword.value : "";

      if (!email || !password) {
         setAuthMessage("E-posta ve şifre girin.", true);
         return;
      }

      isLoginRedirecting = true;
      setAuthMessage("Giriş yapılıyor...");

      const submitButton = menuLoginForm
         ? menuLoginForm.querySelector(
              'button[type="submit"], .menu-login-button, input[type="submit"]'
           )
         : null;

      if (submitButton) submitButton.disabled = true;
      if (menuSignupButton) menuSignupButton.disabled = true;
      if (menuEmail) menuEmail.disabled = true;
      if (menuPassword) menuPassword.disabled = true;

      const { error } = await client.auth.signInWithPassword({
         email,
         password
      });

      if (error) {
         isLoginRedirecting = false;
         if (submitButton) submitButton.disabled = false;
         if (menuSignupButton) menuSignupButton.disabled = false;
         if (menuEmail) menuEmail.disabled = false;
         if (menuPassword) menuPassword.disabled = false;
         setAuthMessage("Giriş başarısız: " + error.message, true);
         return;
      }

      closeMenu();
      setAuthMessage("");

      if (menuEmail) menuEmail.value = "";
      if (menuPassword) menuPassword.value = "";

      goTo(ROUTES.PREMIUM);
   }

   async function handleSignup() {
      if (isLoginRedirecting || isNavigating) return;

      const email = menuEmail ? menuEmail.value.trim() : "";
      const password = menuPassword ? menuPassword.value : "";

      if (!email || !password) {
         setAuthMessage("Üyelik için e-posta ve şifre girin.", true);
         return;
      }

      setAuthMessage("Üyelik oluşturuluyor...");

      const { error } = await client.auth.signUp({
         email,
         password
      });

      if (error) {
         setAuthMessage("Üyelik başarısız: " + error.message, true);
         return;
      }

      setAuthMessage("Üyelik oluşturuldu. Şimdi giriş yapabilirsin.");
   }

   async function handleLogout() {
      if (isNavigating) return;

      const { error } = await client.auth.signOut();

      if (error) {
         console.error("Çıkış yapılırken hata:", error.message);
         setAuthMessage("Çıkış yapılırken hata oluştu.", true);
         return;
      }

      localStorage.removeItem("rsrPremiumAccess");
      sessionStorage.removeItem("rsrSelectedRoute");

      if (menuLoginHero) menuLoginHero.style.display = "grid";
      if (menuLoginForm) menuLoginForm.style.display = "grid";
      if (menuUserState) menuUserState.style.display = "none";
      if (menuUserEmail) menuUserEmail.textContent = "";
      if (menuEmail) menuEmail.value = "";
      if (menuPassword) menuPassword.value = "";

      goTo(ROUTES.FREE);
   }

   if (menuToggle) {
      menuToggle.addEventListener("click", toggleMenu);
   }

   menuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", function () {
         if (isNavigating) return;

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
         if (isNavigating) return;
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
         if (isNavigating) return;
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
   updateMenuUserState();
});
