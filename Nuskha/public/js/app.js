/**
 * Nuskha AI - Unified Dashboard Controller & Client Router
 */

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nuskha-nav-link");
  const views = document.querySelectorAll(".nuskha-view");

  let genericMatcherInstance = null;
  let prescriptionScannerInstance = null;

  function switchTab(viewId) {
    // 1. Update navigation active state
    navLinks.forEach(link => {
      const target = link.getAttribute("data-view");
      if (target === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // 2. Hide all views and show active one
    views.forEach(v => {
      if (v.id === `view-${viewId}`) {
        v.classList.add("active-view");
      } else {
        v.classList.remove("active-view");
      }
    });

    // 3. Lazy initialize components on first view
    if (viewId === "generic-matcher" && !genericMatcherInstance) {
      const container = document.getElementById("generic-matcher-mount");
      if (container && typeof GenericMatcherUI !== "undefined") {
        genericMatcherInstance = new GenericMatcherUI(container);
        genericMatcherInstance.mount();
      }
    }

    if (viewId === "prescription-scanner" && !prescriptionScannerInstance) {
      const container = document.getElementById("prescription-scanner-mount");
      if (container && typeof PrescriptionScannerUI !== "undefined") {
        prescriptionScannerInstance = new PrescriptionScannerUI(container);
        prescriptionScannerInstance.mount();
      }
    }

    // Scroll to top of main content
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Attach nav click handlers
  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetView = this.getAttribute("data-view");
      window.location.hash = targetView;
      switchTab(targetView);
    });
  });

  // Action buttons from Overview Hero
  const btnHeroMatcher = document.getElementById("hero-btn-matcher");
  if (btnHeroMatcher) {
    btnHeroMatcher.addEventListener("click", () => {
      window.location.hash = "generic-matcher";
      switchTab("generic-matcher");
    });
  }

  const btnHeroScanner = document.getElementById("hero-btn-scanner");
  if (btnHeroScanner) {
    btnHeroScanner.addEventListener("click", () => {
      window.location.hash = "prescription-scanner";
      switchTab("prescription-scanner");
    });
  }

  const featureButtons = document.querySelectorAll(".feature-card-btn");
  featureButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const target = this.getAttribute("data-goto");
      if (target) {
        window.location.hash = target;
        switchTab(target);
      }
    });
  });

  // Handle URL hash on initial load
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash && document.getElementById(`view-${initialHash}`)) {
    switchTab(initialHash);
  } else {
    switchTab("overview");
  }

  window.addEventListener("hashchange", function () {
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash && document.getElementById(`view-${currentHash}`)) {
      switchTab(currentHash);
    }
  });

  console.log("[Nuskha AI] Integrated Dashboard loaded successfully.");
});
