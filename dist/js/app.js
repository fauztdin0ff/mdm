/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/*==========================================================================
Menu
============================================================================*/
function burgerMenu() {
   const body = document.body;

   document.addEventListener("click", (e) => {
      const menuIcon = e.target.closest(".menu__icon");
      const menuClose = e.target.closest(".menu__close");
      const menuBody = document.querySelector(".menu__body");

      if (!menuBody) return;

      if (menuIcon) {
         menuIcon.classList.toggle("active");
         menuBody.classList.toggle("active");
         body.classList.toggle("no-scroll");

         return;
      }

      if (menuClose) {
         closeMenu();
         return;
      }

      if (
         !menuBody.contains(e.target) &&
         !e.target.closest(".menu__icon")
      ) {
         closeMenu();
      }
   });

   function closeMenu() {
      const menuIcon = document.querySelector(".menu__icon");
      const menuBody = document.querySelector(".menu__body");

      menuIcon?.classList.remove("active");
      menuBody?.classList.remove("active");
      body.classList.remove("no-scroll");
   }

   window.closeMenu = closeMenu;
}

/*==========================================================================
Animations
============================================================================*/
function initFadeAnimations() {
   const elements = document.querySelectorAll(
      ".fade-up, .fade-down, .fade-left, .fade-right"
   );

   if (!elements.length) return;

   const observer = new IntersectionObserver(
      (entries, observer) => {
         entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("fade-show");
            observer.unobserve(entry.target);
         });
      },
      {
         threshold: 0.15,
         rootMargin: "0px 0px -10% 0px",
      }
   );

   elements.forEach((el) => observer.observe(el));
}

/*==========================================================================
Hero parallax
============================================================================*/
function initHeroParallax() {
   const hero = document.querySelector(".hero");
   const image = hero?.querySelector(".hero__image");

   if (!hero || !image) return;

   const strength = 10;
   const smoothness = 0.06;

   let targetX = 0;
   let targetY = 0;
   let currentX = 0;
   let currentY = 0;

   hero.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;

      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetX = (x - 0.5) * strength * 2;
      targetY = (y - 0.5) * strength * 2;
   });

   hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
   });

   function animate() {
      currentX += (targetX - currentX) * smoothness;
      currentY += (targetY - currentY) * smoothness;
      image.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(animate);
   }

   animate();
}

/*==========================================================================
Barba
============================================================================*/
function initBarba() {
   barba.hooks.before(() => {
      document.body.classList.add("is-animating");
   });

   barba.hooks.after(() => {
      document.body.classList.remove("is-animating");
   });

   barba.init({
      debug: true,

      transitions: [
         {
            name: "fade",

            sync: true,

            once({ next }) {
               next.container.classList.add("barba-enter-active");
            },

            leave({ current }) {
               return new Promise((resolve) => {
                  current.container.classList.add("barba-leave");

                  setTimeout(resolve, 400);
               });
            },

            beforeEnter({ next }) {
               /*
                * Фиксируем viewport.
                * Пользователь больше не может увидеть изменение scroll.
                */
               document.body.classList.add("barba-lock");

               next.container.classList.add("barba-enter");
            },

            enter({ next }) {
               requestAnimationFrame(() => {
                  next.container.classList.add("barba-enter-active");
               });
            },

            afterEnter({ next }) {
               /*
                * Теперь новая страница уже готова.
                * Мгновенно ставим scroll наверх.
                */
               window.scrollTo(0, 0);

               document.body.classList.remove("barba-lock");

               next.container.classList.remove(
                  "barba-enter",
                  "barba-enter-active"
               );

               initPage();
            },
         },
      ],
   });
}

/*==========================================================================
Initialization
============================================================================*/
function initPage() {
   initHeroParallax();
   initFadeAnimations();
}

document.addEventListener("DOMContentLoaded", () => {
   burgerMenu();
   initPage();
   initBarba();
});
/******/ })()
;