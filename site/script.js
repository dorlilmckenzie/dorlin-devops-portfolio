document.addEventListener("DOMContentLoaded", () => {
  // Automatic copyright year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
      );

      navigation.classList.toggle("open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  // Reveal sections as they enter the viewport
  const revealTargets = document.querySelectorAll(
    ".section-heading, .about-layout, .principle, .skill-card, " +
    ".project-card, .journey-layout, .contact-card"
  );

  revealTargets.forEach(element => element.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add("visible"));
  }

  // Highlight the navigation link for the current section
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", active);
          });
        }
      });
    }, {
      rootMargin: "-30% 0px -60% 0px"
    });

    sections.forEach(section => sectionObserver.observe(section));
  }
});

// Final responsive polish: identify the deployment project by its visible heading.
document.addEventListener("DOMContentLoaded", () => {
  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4"));
  const deploymentHeading = headings.find((el) =>
    (el.textContent || "").toLowerCase().includes("portfolio website deployment")
  );
  if (deploymentHeading) {
    let section = deploymentHeading;
    for (let i = 0; i < 5 && section.parentElement; i++) {
      section = section.parentElement;
      const style = getComputedStyle(section);
      if (section.tagName === "SECTION" || style.display.includes("grid") ||
          section.className.toString().toLowerCase().includes("card")) break;
    }
    section.style.boxSizing = "border-box";
    section.style.paddingLeft = "clamp(18px, 5vw, 32px)";
    section.style.paddingRight = "clamp(18px, 5vw, 32px)";
    section.style.maxWidth = "100%";
  }

  const portrait = document.querySelector('img[src*="profile.jpg"]');
  if (portrait) {
    portrait.style.objectFit = "cover";
    portrait.style.objectPosition = "center 35%";
    portrait.style.maxWidth = "100%";
  }
});
