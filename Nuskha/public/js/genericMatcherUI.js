/**
 * Nuskha AI - Stage 4 Generic Medicine Matcher UI Component
 *
 * Provides a responsive search, side-by-side equivalence comparison,
 * clinical safety disclosures, and honest price transparency notices.
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GenericMatcherUI = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {

  class GenericMatcherUI {
    constructor(container, options = {}) {
      this.container = typeof container === "string" ? document.querySelector(container) : container;
      if (!this.container) {
        throw new Error("GenericMatcherUI: Container element not found.");
      }

      this.options = {
        title: options.title || "Generic Medicine Matcher",
        subtitle: options.subtitle || "Evidence-based generic comparison, bioequivalence screening, and alternative identification",
        quickSearches: options.quickSearches || [
          "Amoxil", "Augmentin", "Disprin", "Panadol", "Glucophage", "Lipitor", "Coumadin", "Plavix", "Prilosec"
        ],
        ...options
      };

      this.state = {
        searchQuery: "",
        isLoading: false,
        result: null,
        error: null
      };

      this.engine = typeof NuskhaGenericMatcher !== "undefined" ? NuskhaGenericMatcher : null;
    }

    mount() {
      this.render();
      this.attachEventListeners();
    }

    render() {
      this.container.innerHTML = `
        <div class="generic-matcher-wrapper">
          
          <!-- Module Header -->
          <div class="matcher-header">
            <span class="matcher-stage-badge">Stage 4 Feature</span>
            <h2 class="matcher-title">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--nuskha-primary)"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
              ${this.options.title}
            </h2>
            <p class="matcher-subtitle">${this.options.subtitle}</p>
          </div>

          <!-- Medical Safety Disclaimer Banner -->
          <div class="matcher-safety-banner" role="alert">
            <div class="matcher-safety-icon">⚠️</div>
            <div class="matcher-safety-content">
              <h4>Medical Safety & Professional Consultation Notice</h4>
              <p>
                This comparison tool is for informational and educational screening only. 
                <strong>An identical active ingredient does not guarantee clinical interchangeability.</strong> 
                Differences in release kinetics (Immediate Release vs. Extended Release), dosage forms, inactive excipient allergies, and narrow therapeutic index (NTI) dynamics require professional clinical judgment. 
                <strong>Nuskha AI does not recommend starting, stopping, or altering any medication without direct authorization from your doctor or pharmacist.</strong>
              </p>
            </div>
          </div>

          <!-- Search Card -->
          <div class="matcher-card matcher-search-card">
            <div class="matcher-search-input-group">
              <div class="matcher-input-prefix">🔍</div>
              <input 
                type="text" 
                id="matcher-search-input" 
                class="matcher-search-input" 
                placeholder="Search by brand name (e.g. Amoxil, Lipitor) or active ingredient (e.g. Metformin, Paracetamol)..." 
                value="${this.state.searchQuery}"
                autocomplete="off"
              />
              ${this.state.searchQuery ? `<button class="matcher-btn-clear" id="btn-clear-search" title="Clear search">✕</button>` : ""}
              <button class="matcher-btn-primary" id="btn-submit-search">Compare Generics</button>
            </div>

            <!-- Quick Search Preset Pills -->
            <div class="matcher-quick-search-bar">
              <span class="matcher-quick-label">Quick Suggestions:</span>
              <div class="matcher-quick-buttons">
                ${this.options.quickSearches.map(term => `
                  <button class="matcher-btn-preset ${this.state.searchQuery.toLowerCase() === term.toLowerCase() ? 'active' : ''}" data-term="${term}">
                    ${term}
                  </button>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Error Alert (Conditional) -->
          <div id="matcher-error-container">
            ${this.state.error ? `
              <div class="matcher-error-card">
                <strong>Error:</strong> ${this.state.error}
              </div>
            ` : ""}
          </div>

          <!-- Results Container -->
          <div id="matcher-results-container">
            ${this.renderResults()}
          </div>

        </div>
      `;
    }

    renderResults() {
      if (this.state.isLoading) {
        return `
          <div class="matcher-loading-state">
            <div class="matcher-spinner"></div>
            <p>Analyzing pharmaceutical records, therapeutic equivalence ratings, and active ingredients...</p>
          </div>
        `;
      }

      if (!this.state.result) {
        return `
          <div class="matcher-empty-state">
            <div class="matcher-empty-icon">💊</div>
            <h3>Search for a Prescribed Medicine</h3>
            <p>Enter a brand name or active ingredient above to inspect documented generic alternatives, FDA Orange Book equivalence ratings, and formulation attributes.</p>
          </div>
        `;
      }

      const res = this.state.result;

      // Handle zero matches
      if (res.totalResults === 0 || !res.targetMedicine) {
        return `
          <div class="matcher-card matcher-not-found-card">
            <div class="matcher-not-found-icon">🔍</div>
            <h3>No Documented Generic Match Found</h3>
            <p>${res.message}</p>
            <div class="matcher-catalog-note">
              <strong>Dataset Scope:</strong> The reference dataset currently covers 18 verified high-priority medications with FDA/WHO citations. Try searching for <em>Amoxil, Augmentin, Disprin, Panadol, Glucophage, Lipitor, Zestril, Coumadin, Plavix, Prilosec, Brufen,</em> or <em>Cipro</em>.
            </div>
          </div>
        `;
      }

      const original = res.targetMedicine;
      const comps = res.comparisons;

      return `
        <!-- Match Meta Bar -->
        <div class="matcher-results-header">
          <div>
            <span class="matcher-results-count">
              Found <strong>${res.totalResults}</strong> candidate formulation(s) for <strong>${original.brandName}</strong>
            </span>
            <span class="matcher-criteria-tag">${res.matchCriteriaUsed}</span>
          </div>
          <div class="matcher-stat-pills">
            <span class="matcher-stat-pill pill-verified">✓ ${res.verifiedCount} Bioequivalent Generic(s)</span>
            ${res.cautionedCount > 0 ? `<span class="matcher-stat-pill pill-caution">⚠️ ${res.cautionedCount} Formulation / Strength Difference(s)</span>` : ""}
          </div>
        </div>

        <!-- Comparison Layout Grid -->
        <div class="matcher-comparison-layout">
          
          <!-- Left Column: Reference Drug / Prescribed Brand -->
          <div class="matcher-brand-column">
            <div class="matcher-card matcher-brand-card">
              <div class="matcher-brand-header">
                <span class="matcher-column-tag">Reference Drug (Brand)</span>
                <span class="matcher-rld-badge">${original.rldStatus}</span>
              </div>
              <h3 class="matcher-brand-title">${original.brandName}</h3>
              <p class="matcher-brand-generic">${original.genericName}</p>

              <div class="matcher-spec-grid">
                <div class="matcher-spec-item">
                  <span class="spec-label">Active Ingredient:</span>
                  <span class="spec-value">${original.activeIngredient}</span>
                </div>
                <div class="matcher-spec-item">
                  <span class="spec-label">Strength:</span>
                  <span class="spec-value">${original.strength}</span>
                </div>
                <div class="matcher-spec-item">
                  <span class="spec-label">Dosage Form:</span>
                  <span class="spec-value">${original.dosageForm}</span>
                </div>
                <div class="matcher-spec-item">
                  <span class="spec-label">Release Kinetics:</span>
                  <span class="spec-value">${original.releaseType}</span>
                </div>
                <div class="matcher-spec-item">
                  <span class="spec-label">Category:</span>
                  <span class="spec-value">${original.category}</span>
                </div>
                <div class="matcher-spec-item">
                  <span class="spec-label">Regulatory Source:</span>
                  <span class="spec-value spec-source">${original.source}</span>
                </div>
              </div>
            </div>

            <!-- Price Transparency Card -->
            <div class="matcher-card matcher-price-card">
              <div class="matcher-price-header">
                <span class="matcher-price-icon">🏷️</span>
                <h4>Price & Cost Transparency</h4>
              </div>
              <p class="matcher-price-text">${res.priceNotice}</p>
            </div>
          </div>

          <!-- Right Column: Generic Alternatives -->
          <div class="matcher-equivalents-column">
            <h3 class="matcher-section-title">Documented Generic Alternatives & Counterparts</h3>
            
            <div class="matcher-equivalents-list">
              ${comps.map(eq => this.renderEquivalentCard(eq, original)).join("")}
            </div>
          </div>

        </div>
      `;
    }

    renderEquivalentCard(eq, original) {
      const isVerified = eq.verifiedInterchangeable;
      const crit = eq.criteria;

      return `
        <div class="matcher-card matcher-equivalent-card ${isVerified ? 'card-verified' : 'card-caution'}">
          
          <!-- Card Header -->
          <div class="matcher-eq-header">
            <div>
              <h4 class="matcher-eq-title">${eq.productName}</h4>
              <span class="matcher-eq-manufacturer">Mfr: ${eq.manufacturer}</span>
            </div>
            <span class="matcher-badge ${eq.badgeClass}">${eq.equivalenceBadge}</span>
          </div>

          <!-- 3-Way Criteria Evaluation Checklist -->
          <div class="matcher-criteria-box">
            <div class="criteria-row ${crit.ingredientMatch.matched ? 'crit-pass' : 'crit-fail'}">
              <span class="crit-icon">${crit.ingredientMatch.matched ? '✓' : '✗'}</span>
              <span class="crit-name">Active Molecule:</span>
              <span class="crit-status">${crit.ingredientMatch.label} (<code>${eq.activeIngredient}</code>)</span>
            </div>

            <div class="criteria-row ${crit.strengthMatch.matched ? 'crit-pass' : 'crit-fail'}">
              <span class="crit-icon">${crit.strengthMatch.matched ? '✓' : '⚠️'}</span>
              <span class="crit-name">Strength Match:</span>
              <span class="crit-status">${crit.strengthMatch.label}</span>
            </div>

            <div class="criteria-row ${crit.formMatch.matched ? 'crit-pass' : 'crit-fail'}">
              <span class="crit-icon">${crit.formMatch.matched ? '✓' : '⚠️'}</span>
              <span class="crit-name">Dosage Form:</span>
              <span class="crit-status">${crit.formMatch.label} (<code>${eq.dosageForm}</code>)</span>
            </div>
          </div>

          <!-- Bioequivalence & Regulatory Details -->
          <div class="matcher-eq-meta">
            <div><strong>Therapeutic Equivalence Code:</strong> <code>${eq.teCode}</code></div>
            <div><strong>Regulatory Citation:</strong> <em>${eq.source}</em></div>
          </div>

          <!-- Clinical Notes / Caveats -->
          <div class="matcher-eq-notes ${isVerified ? 'notes-verified' : 'notes-caution'}">
            <strong>Clinical Review:</strong> ${eq.notes}
          </div>

          <!-- Honest Price Section -->
          <div class="matcher-eq-price-bar">
            <span><strong>Retail Pricing:</strong> ${eq.priceData.priceString}</span>
            <span class="matcher-price-pill">Inquire at Local Pharmacy</span>
          </div>

        </div>
      `;
    }

    attachEventListeners() {
      const searchInput = this.container.querySelector("#matcher-search-input");
      const btnSubmit = this.container.querySelector("#btn-submit-search");
      const btnClear = this.container.querySelector("#btn-clear-search");
      const presetButtons = this.container.querySelectorAll(".matcher-btn-preset");

      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.state.searchQuery = e.target.value;
        });

        searchInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            this.executeSearch(this.state.searchQuery);
          }
        });
      }

      if (btnSubmit) {
        btnSubmit.addEventListener("click", () => {
          this.executeSearch(this.state.searchQuery);
        });
      }

      if (btnClear) {
        btnClear.addEventListener("click", () => {
          this.state.searchQuery = "";
          this.state.result = null;
          this.state.error = null;
          this.render();
          this.attachEventListeners();
        });
      }

      presetButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const term = btn.getAttribute("data-term");
          this.state.searchQuery = term;
          this.executeSearch(term);
        });
      });
    }

    executeSearch(query) {
      if (!query || !query.trim()) {
        this.state.error = "Please enter a medicine name or active ingredient.";
        this.render();
        this.attachEventListeners();
        return;
      }

      this.state.error = null;
      this.state.isLoading = true;
      this.render();

      setTimeout(() => {
        if (!this.engine && typeof NuskhaGenericMatcher !== "undefined") {
          this.engine = NuskhaGenericMatcher;
        }

        if (this.engine) {
          const outcome = this.engine.searchAndCompareGenerics(query);
          this.state.result = outcome;
          if (outcome.targetMedicine === undefined && outcome.originalBrand) {
            this.state.result.targetMedicine = outcome.originalBrand;
          }
        } else {
          this.state.error = "Generic Matcher engine is unavailable in the current runtime.";
        }

        this.state.isLoading = false;
        this.render();
        this.attachEventListeners();
      }, 150); // Small realistic delay for UI responsiveness
    }

    destroy() {
      this.container.innerHTML = "";
    }
  }

  return GenericMatcherUI;
});
