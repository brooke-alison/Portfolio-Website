document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  const mainNavbar = document.getElementById("mainNavbar");

  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      mainNavbar.classList.add("navbar-scrolled");
    } else {
      mainNavbar.classList.remove("navbar-scrolled");
    }
  };

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  const navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link, .btn-neutral-solid, .navbar-brand",
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navbarCollapse = document.getElementById("navbarNav");
          if (navbarCollapse.classList.contains("show")) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }

          const headerOffset = 90;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  const sections = document.querySelectorAll("section, header");
  const scrollspyLinks = document.querySelectorAll(".navbar-nav .nav-link");

  const highlightNavSection = () => {
    let scrollPosition = window.scrollY + 120;

    sections.forEach((currentSection) => {
      const sectionTop = currentSection.offsetTop;
      const sectionHeight = currentSection.offsetHeight;
      const sectionId = currentSection.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        scrollspyLinks.forEach((item) => {
          item.classList.remove("active");
          if (item.getAttribute("href") === `#${sectionId}`) {
            item.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", highlightNavSection);
  highlightNavSection();

  const contactForm = document.getElementById("portfolioContactForm");
  const submitBtn = document.getElementById("submitFormBtn");
  const alertSuccess = document.getElementById("formSuccessAlert");
  const alertError = document.getElementById("formErrorAlert");

  const formInit = new Forminit();
  const FORM_ID = "cb1j8b3dz2t";

  const sendContactForm = async (form) => {
    if (typeof Forminit !== "function") {
      throw new Error("Forminit SDK is not loaded.");
    }

    const payload = new FormData(form);
    const { data, error } = await formInit.submit(FORM_ID, payload);

    if (error) {
      console.error("Forminit submit error:", error);
      throw error;
    }

    return data;
  };

  const hideContactAlerts = () => {
    if (alertSuccess) alertSuccess.classList.add("d-none");
    if (alertError) alertError.classList.add("d-none");
  };

  const showContactError = () => {
    if (alertError) {
      alertError.classList.remove("d-none");
      alertError.classList.add("animate-fade-in");
    }
  };

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideContactAlerts();

      submitBtn.disabled = true;
      submitBtn.innerHTML =
        'Sending Message <i class="fas fa-spinner fa-spin ms-2"></i>';

      try {
        await sendContactForm(contactForm);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Message Sent <i class="fas fa-check ms-2"></i>';

        if (alertSuccess) {
          alertSuccess.classList.remove("d-none");
          alertSuccess.classList.add("animate-fade-in");
        }

        contactForm.reset();

        setTimeout(() => {
          if (alertSuccess) {
            alertSuccess.classList.add("d-none");
          }
          submitBtn.innerHTML =
            'Send Message <i class="far fa-paper-plane ms-2"></i>';
        }, 5000);
      } catch (error) {
        console.error("Contact form sending error:", error);
        showContactError();
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          'Send Message <i class="far fa-paper-plane ms-2"></i>';
      }
    });
  }
});
