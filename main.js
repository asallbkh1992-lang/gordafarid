document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initActiveLink();
  initContactForm();
  initScrollAnimations();
  initPageTransitions();
});

/* ================================
   منوی موبایل
================================ */

function initNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const overlay = document.querySelector(".nav-overlay");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    nav.classList.toggle("open");

    if (overlay) {
      overlay.classList.toggle("active");
    }

    document.body.style.overflow = nav.classList.contains("open")
      ? "hidden"
      : "";
  });

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  function closeMenu() {
    toggle.classList.remove("active");
    nav.classList.remove("open");

    if (overlay) {
      overlay.classList.remove("active");
    }

    document.body.style.overflow = "";
  }
}

/* ================================
   فعال کردن لینک صفحه فعلی
================================ */

function initActiveLink() {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const linkPage = href.split("/").pop();

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

/* ================================
   فرم ارتباط با ما
================================ */

function initContactForm() {
  const form = document.getElementById("contactForm");

  const modal = document.getElementById("messageModal");

  const closeButton = document.getElementById("messageClose");

  const confirmButton = document.getElementById("messageCloseButton");

  if (!form || !modal) return;

  /*
    مهم:
    به جای submit از click روی دکمه استفاده می‌کنیم.
    بنابراین حتی اگر فیلدها خالی باشند،
    پنجره‌ی «ارسال پیام فعلاً غیرفعال است» باز می‌شود.
  */

  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();

      openMessageModal();
    });
  }

  /* جلوگیری از ارسال واقعی فرم */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    openMessageModal();
  });

  /* باز کردن پنجره */

  function openMessageModal() {
    modal.classList.add("active");

    document.body.style.overflow = "hidden";
  }

  /* بستن با × */

  if (closeButton) {
    closeButton.addEventListener("click", closeMessageModal);
  }

  /* بستن با دکمه «متوجه شدم» */

  if (confirmButton) {
    confirmButton.addEventListener("click", closeMessageModal);
  }

  /* بستن با کلیک بیرون کادر */

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeMessageModal();
    }
  });

  /* بستن با دکمه Escape */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeMessageModal();
    }
  });

  function closeMessageModal() {
    modal.classList.remove("active");

    document.body.style.overflow = "";
  }
}

/* ================================
   انیمیشن هنگام اسکرول
================================ */

function initScrollAnimations() {
  const elements = document.querySelectorAll(
    ".gallery-item, .why-card, .podcast-card, .description-box",
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition =
      "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);
  });
}

/* ================================
   انیمیشن عوض شدن صفحات
================================ */

function initPageTransitions() {
  const transition = document.querySelector(".page-transition");

  if (!transition) return;

  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = link.href;

      /*
        لینک‌های خاص را دستکاری نکن
      */

      if (
        !url ||
        url.includes("#") ||
        link.target === "_blank" ||
        url.startsWith("javascript:")
      ) {
        return;
      }

      /*
        اگر لینک به همین صفحه است،
        انیمیشن تغییر صفحه اجرا نشود.
      */

      if (url === window.location.href) {
        return;
      }

      event.preventDefault();

      transition.classList.add("active");

      setTimeout(() => {
        window.location.href = url;
      }, 700);
    });
  });

  /*
    وقتی صفحه لود شد،
    پرده‌ی انتقال کنار برود.
  */

  window.addEventListener("load", () => {
    setTimeout(() => {
      transition.classList.remove("active");
    }, 100);
  });
}
