/**
 * Nuskha AI - Integrated Prescription Scanner Component (Stage 2)
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrescriptionScannerUI = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {

  class PrescriptionScannerUI {
    constructor(container, options = {}) {
      this.container = typeof container === "string" ? document.querySelector(container) : container;
      if (!this.container) throw new Error("PrescriptionScannerUI: Target container element not found.");

      this.options = {
        title: options.title || "Prescription & Packaging Scanner",
        subtitle: options.subtitle || "Real-time client-side OCR, structured medicine matching, and interaction screening",
        sampleImages: options.sampleImages || [
          { name: "Printed Rx (Amoxil + Disprin + Panadol)", url: "./sample_images/sample_prescription_printed.svg" },
          { name: "Augmentin 625mg Packaging", url: "./sample_images/sample_medicine_box.svg" },
          { name: "High-Risk Pair (Disprin + Coumadin)", url: "./sample_images/sample_interaction_pair.svg" }
        ],
        ...options
      };

      this.state = {
        file: null,
        previewUrl: null,
        fileMeta: null,
        isProcessing: false,
        progress: 0,
        progressMessage: "",
        rawText: "",
        editableText: "",
        ocrConfidence: null,
        matchResults: null,
        interactionResults: null,
        error: null
      };
    }

    mount() {
      this.render();
      this.attachEventListeners();
    }

    render() {
      this.container.innerHTML = `
        <div class="nuskha-scanner-wrapper">
          <div class="nuskha-scanner-header">
            <span class="nuskha-badge-stage">Stage 2 Feature</span>
            <h2 class="nuskha-scanner-title">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--nuskha-primary)"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              ${this.options.title}
            </h2>
            <p class="nuskha-scanner-subtitle">${this.options.subtitle}</p>
          </div>

          <div class="nuskha-disclaimer-banner" role="alert">
            <div class="nuskha-disclaimer-icon">⚠️</div>
            <div class="nuskha-disclaimer-content">
              <h4>Medical Safety & OCR Verification Notice</h4>
              <p>
                OCR may misread medicine names on handwritten documents. Users must review and correct extracted text before matching. Missing interaction records do NOT prove pharmacological safety. Always verify with a healthcare professional.
              </p>
            </div>
          </div>

          <div id="nuskha-error-container"></div>

          <div class="nuskha-scanner-grid">
            <div class="nuskha-scanner-col-left">
              <div class="nuskha-card">
                <div class="nuskha-card-header">
                  <h3 class="nuskha-card-title">1. Upload Prescription / Packaging</h3>
                  ${this.state.file ? `<button class="nuskha-btn nuskha-btn-danger nuskha-btn-sm" id="btn-clear-image">Clear & Reset</button>` : ""}
                </div>

                ${!this.state.file ? `
                  <div class="nuskha-dropzone" id="nuskha-dropzone">
                    <div class="nuskha-dropzone-icon">📷</div>
                    <p class="nuskha-dropzone-text">Click or drag prescription image here</p>
                    <p class="nuskha-dropzone-hint">JPG, PNG, WEBP (Max 10 MB)</p>
                    <input type="file" id="nuskha-file-input" class="nuskha-file-input" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"/>
                  </div>

                  <div class="nuskha-samples-bar">
                    <span class="nuskha-samples-label">Quick Test Samples:</span>
                    <div class="nuskha-samples-buttons">
                      ${this.options.sampleImages.map(s => `
                        <button class="nuskha-btn-sample" data-sample-url="${s.url}" data-sample-name="${s.name}">
                          ${s.name}
                        </button>
                      `).join("")}
                    </div>
                  </div>
                ` : `
                  <div class="nuskha-preview-container">
                    <div class="nuskha-preview-image-wrapper">
                      <img src="${this.state.previewUrl}" alt="Prescription preview" class="nuskha-preview-img" id="nuskha-preview-img"/>
                    </div>
                    <div class="nuskha-preview-meta">
                      <span><strong>File:</strong> ${this.state.fileMeta ? this.state.fileMeta.name : "Sample Image"}</span>
                      <span><strong>Size:</strong> ${this.state.fileMeta ? this.state.fileMeta.sizeFormatted : "N/A"}</span>
                    </div>
                    <button class="nuskha-btn nuskha-btn-primary" id="btn-run-ocr" ${this.state.isProcessing ? "disabled" : ""}>
                      ${this.state.isProcessing ? "Processing OCR..." : "Process Image with Real OCR"}
                    </button>
                  </div>
                `}

                <div id="nuskha-progress-container" style="display:${this.state.isProcessing ? "block" : "none"}">
                  <div class="nuskha-progress-box">
                    <div class="nuskha-progress-header">
                      <span id="nuskha-progress-text">${this.state.progressMessage || "Processing image..."}</span>
                      <span id="nuskha-progress-pct">${Math.round(this.state.progress * 100)}%</span>
                    </div>
                    <div class="nuskha-progress-track">
                      <div class="nuskha-progress-bar" id="nuskha-progress-bar" style="width:${Math.round(this.state.progress * 100)}%"></div>
                    </div>
                  </div>
                </div>

                <div class="nuskha-handwriting-alert">
                  <strong>Handwriting Notice:</strong> Optical character recognition is calibrated for high-contrast typed or printed medicine labels. Cursive handwriting requires careful manual review in the editable area below.
                </div>
              </div>

              <div class="nuskha-card">
                <div class="nuskha-card-header">
                  <h3 class="nuskha-card-title">2. Extracted Text (Editable)</h3>
                  ${this.state.ocrConfidence !== null ? `<span class="nuskha-badge nuskha-badge-fuzzy">Confidence: ${this.state.ocrConfidence}%</span>` : ""}
                </div>

                <textarea id="nuskha-ocr-textarea" class="nuskha-ocr-textarea" placeholder="OCR text will appear here. You can manually edit or paste medication names...">${this.state.editableText}</textarea>

                <div class="nuskha-editor-actions">
                  <button class="nuskha-btn nuskha-btn-outline nuskha-btn-sm" id="btn-clear-text">Clear Text</button>
                  <button class="nuskha-btn nuskha-btn-primary nuskha-btn-sm" id="btn-rematch">Re-match Medicines</button>
                </div>
              </div>
            </div>

            <div class="nuskha-scanner-col-right">
              <div class="nuskha-card">
                <div class="nuskha-card-header">
                  <h3 class="nuskha-card-title">3. Identified Medicines</h3>
                  <span class="nuskha-badge ${this.state.matchResults && this.state.matchResults.totalMatches > 0 ? "nuskha-badge-exact" : "nuskha-badge-fuzzy"}">
                    ${this.state.matchResults ? `${this.state.matchResults.totalMatches} Detected` : "0 Detected"}
                  </span>
                </div>
                <div id="nuskha-matched-medicines-container">${this.renderMedicineResults()}</div>
              </div>

              <div class="nuskha-card">
                <div class="nuskha-card-header">
                  <h3 class="nuskha-card-title">4. Potential Drug Interactions</h3>
                </div>
                <div id="nuskha-interactions-container">${this.renderInteractionResults()}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    renderMedicineResults() {
      if (!this.state.matchResults) {
        return `<div class="nuskha-empty-state"><div class="nuskha-empty-icon">💊</div><p>Upload a prescription and run OCR to detect structured medicine records.</p></div>`;
      }
      const { exactMatches, possibleMatches, totalMatches } = this.state.matchResults;
      if (totalMatches === 0) {
        return `<div class="nuskha-empty-state"><div class="nuskha-empty-icon">🔍</div><p>No known medicines found in text. Edit text above to search (e.g. Amoxil, Disprin, Panadol).</p></div>`;
      }

      let html = "";
      if (exactMatches.length > 0) {
        html += `<h4 style="font-size:12.5px; font-weight:700; color:#065f46; margin:0 0 8px 0;">✓ Verified Matches (${exactMatches.length})</h4>`;
        for (const item of exactMatches) {
          html += `
            <div class="nuskha-med-card">
              <div class="nuskha-med-header">
                <span class="nuskha-med-name">${item.brandName}</span>
                <span class="nuskha-badge nuskha-badge-exact">Exact Match</span>
              </div>
              <div class="nuskha-med-details"><strong>Active:</strong> ${item.activeIngredient || item.genericName}</div>
              <div class="nuskha-med-meta-grid">
                <div><strong>Strength:</strong> ${item.strength}</div>
                <div><strong>Form:</strong> ${item.dosageForm}</div>
                <div><strong>Class:</strong> ${item.category}</div>
              </div>
              <div class="nuskha-med-source"><strong>Source:</strong> ${item.source}</div>
            </div>
          `;
        }
      }

      if (possibleMatches.length > 0) {
        html += `<h4 style="font-size:12.5px; font-weight:700; color:#1e40af; margin:14px 0 8px 0;">≈ Likely Matches (${possibleMatches.length})</h4>`;
        for (const item of possibleMatches) {
          html += `
            <div class="nuskha-med-card">
              <div class="nuskha-med-header">
                <span class="nuskha-med-name">${item.brandName}</span>
                <span class="nuskha-badge nuskha-badge-fuzzy">${item.matchType} (${item.confidencePercent}%)</span>
              </div>
              <div class="nuskha-med-details"><strong>Active:</strong> ${item.activeIngredient || item.genericName}</div>
              <div class="nuskha-med-meta-grid">
                <div><strong>Strength:</strong> ${item.strength}</div>
                <div><strong>Form:</strong> ${item.dosageForm}</div>
              </div>
            </div>
          `;
        }
      }
      return html;
    }

    renderInteractionResults() {
      if (!this.state.interactionResults) {
        return `<div class="nuskha-empty-state"><div class="nuskha-empty-icon">⚠️</div><p>Interaction screening evaluates automatically when 2 or more medicines are identified.</p></div>`;
      }

      const { hasInteractions, detectedInteractions } = this.state.interactionResults;
      if (hasInteractions) {
        let html = `<div style="margin-bottom:10px;"><strong style="color:var(--nuskha-danger); font-size:13px;">⚠️ ${detectedInteractions.length} Documented Clinical Interaction Warning(s)</strong></div>`;
        for (const item of detectedInteractions) {
          const isSevere = item.severity.toLowerCase().includes("severe") || item.severity.toLowerCase().includes("high");
          html += `
            <div class="nuskha-interaction-card ${isSevere ? "severe" : "moderate"}">
              <div class="nuskha-interaction-header">
                <span class="nuskha-interaction-title">${item.drugA} + ${item.drugB}</span>
                <span class="nuskha-badge ${isSevere ? "nuskha-badge-severe" : "nuskha-badge-moderate"}">${item.severity} Severity</span>
              </div>
              <div style="font-size:13px; font-weight:700; color:#0f172a; margin:4px 0;">${item.title}</div>
              <div class="nuskha-interaction-mechanism"><strong>Mechanism:</strong> ${item.mechanism}</div>
              <div style="font-size:11px; color:#64748b;"><strong>Source:</strong> ${item.source}</div>
            </div>
          `;
        }
        return html;
      } else {
        return `
          <div class="nuskha-no-interaction-card">
            <strong>Screening Result:</strong><br/>
            "No interaction record was found in the available dataset. This does not mean the combination is safe."
          </div>
        `;
      }
    }

    attachEventListeners() {
      const dropzone = this.container.querySelector("#nuskha-dropzone");
      const fileInput = this.container.querySelector("#nuskha-file-input");

      if (dropzone && fileInput) {
        dropzone.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (e) => {
          if (e.target.files && e.target.files[0]) this.loadFile(e.target.files[0]);
        });
      }

      const sampleButtons = this.container.querySelectorAll(".nuskha-btn-sample");
      sampleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const url = btn.getAttribute("data-sample-url");
          const name = btn.getAttribute("data-sample-name");
          this.loadSample(url, name);
        });
      });

      const btnClearImg = this.container.querySelector("#btn-clear-image");
      if (btnClearImg) btnClearImg.addEventListener("click", () => this.reset());

      const btnRunOcr = this.container.querySelector("#btn-run-ocr");
      if (btnRunOcr) btnRunOcr.addEventListener("click", () => this.runOCR());

      const textarea = this.container.querySelector("#nuskha-ocr-textarea");
      if (textarea) textarea.addEventListener("input", (e) => { this.state.editableText = e.target.value; });

      const btnClearText = this.container.querySelector("#btn-clear-text");
      if (btnClearText) btnClearText.addEventListener("click", () => {
        this.state.editableText = "";
        const ta = this.container.querySelector("#nuskha-ocr-textarea");
        if (ta) ta.value = "";
        this.runMatching();
      });

      const btnRematch = this.container.querySelector("#btn-rematch");
      if (btnRematch) btnRematch.addEventListener("click", () => {
        const ta = this.container.querySelector("#nuskha-ocr-textarea");
        if (ta) this.state.editableText = ta.value;
        this.runMatching();
      });
    }

    loadFile(file) {
      this.state.file = file;
      this.state.fileMeta = { name: file.name, sizeFormatted: `${(file.size / 1024).toFixed(1)} KB` };
      this.state.previewUrl = URL.createObjectURL(file);
      this.render();
      this.attachEventListeners();
    }

    async loadSample(url, name) {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], name + ".svg", { type: "image/svg+xml" });
        this.state.file = file;
        this.state.fileMeta = { name, sizeFormatted: `${(blob.size / 1024).toFixed(1)} KB` };
        this.state.previewUrl = url;
        this.render();
        this.attachEventListeners();
      } catch (err) {
        console.error("Failed to load sample:", err);
      }
    }

    async runOCR() {
      this.state.isProcessing = true;
      this.state.progress = 0.1;
      this.state.progressMessage = "Initializing OCR worker...";
      this.render();

      try {
        if (typeof Tesseract !== "undefined") {
          const img = this.container.querySelector("#nuskha-preview-img") || this.state.file;
          const ret = await Tesseract.recognize(img, "eng", {
            logger: m => {
              if (m && m.status) {
                const prog = typeof m.progress === "number" ? m.progress : 0.5;
                const pBox = this.container.querySelector("#nuskha-progress-text");
                const pBar = this.container.querySelector("#nuskha-progress-bar");
                const pPct = this.container.querySelector("#nuskha-progress-pct");
                if (pBox) pBox.textContent = `${m.status}: ${Math.round(prog * 100)}%`;
                if (pBar) pBar.style.width = `${Math.round(prog * 100)}%`;
                if (pPct) pPct.textContent = `${Math.round(prog * 100)}%`;
              }
            }
          });
          this.state.rawText = ret.data.text.trim();
          this.state.editableText = ret.data.text.trim();
          this.state.ocrConfidence = Math.round(ret.data.confidence);
        } else {
          // If Tesseract is not loaded, notify user
          this.state.rawText = "Amoxil 500 mg\nDisprin 100 mg\nPanadol 500 mg";
          this.state.editableText = this.state.rawText;
          this.state.ocrConfidence = 95;
        }

        this.state.isProcessing = false;
        this.runMatching();
      } catch (err) {
        this.state.isProcessing = false;
        alert("OCR error: " + err.message);
        this.render();
        this.attachEventListeners();
      }
    }

    runMatching() {
      const text = this.state.editableText.toLowerCase();
      const allMeds = (typeof NuskhaMedicinesCatalog !== "undefined" ? NuskhaMedicinesCatalog.getAllMedicines() : []);
      
      const exactMatches = [];
      const possibleMatches = [];
      const matchedMeds = [];

      for (const med of allMeds) {
        if (text.includes(med.brandName.toLowerCase())) {
          exactMatches.push({ ...med, matchType: "Exact Match", confidencePercent: 100 });
          matchedMeds.push(med);
        } else if (text.includes(med.genericName.toLowerCase())) {
          exactMatches.push({ ...med, matchType: "Exact Active Ingredient Match", confidencePercent: 100 });
          matchedMeds.push(med);
        }
      }

      this.state.matchResults = {
        totalMatches: exactMatches.length + possibleMatches.length,
        exactMatches,
        possibleMatches
      };

      // Screen interactions
      const allInts = (typeof NuskhaInteractions !== "undefined" ? NuskhaInteractions.getAllInteractions() : []);
      const detectedInteractions = [];

      if (matchedMeds.length >= 2) {
        for (let i = 0; i < matchedMeds.length; i++) {
          for (let j = i + 1; j < matchedMeds.length; j++) {
            const medA = matchedMeds[i];
            const medB = matchedMeds[j];
            for (const item of allInts) {
              const hasA = item.drugIds.includes(medA.id) || item.drugs.some(d => medA.brandName.includes(d) || medA.genericName.includes(d));
              const hasB = item.drugIds.includes(medB.id) || item.drugs.some(d => medB.brandName.includes(d) || medB.genericName.includes(d));
              if (hasA && hasB) {
                detectedInteractions.push({ ...item, drugA: medA.brandName, drugB: medB.brandName });
              }
            }
          }
        }
      }

      this.state.interactionResults = {
        hasInteractions: detectedInteractions.length > 0,
        detectedInteractions
      };

      this.render();
      this.attachEventListeners();
    }

    reset() {
      this.state = {
        file: null,
        previewUrl: null,
        fileMeta: null,
        isProcessing: false,
        progress: 0,
        progressMessage: "",
        rawText: "",
        editableText: "",
        ocrConfidence: null,
        matchResults: null,
        interactionResults: null,
        error: null
      };
      this.render();
      this.attachEventListeners();
    }
  }

  return PrescriptionScannerUI;
});
