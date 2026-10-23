# Nuskha AI — Stage 2: Prescription Scanner Module

Welcome to the **Stage 2 Prescription Scanner** module for the **Nuskha AI** hackathon project.

This module is designed and implemented as a self-contained, modular package inside `Stage 2`, ready to be integrated into the main `Nuskha` application developed by teammates.

---

## 1. Module Overview & Architecture

The Prescription Scanner allows patients and clinicians to upload images of typed prescriptions, hospital discharge slips, or medicine packaging, run real client-side Optical Character Recognition (OCR), review and edit extracted text, automatically match medicine names against a documented reference dataset, and screen identified drugs for documented interactions.

### Directory Structure
```
Stage 2/
├── README.md                            # This comprehensive documentation & integration guide
├── package.json                         # Module configuration & scripts
├── sample_images/                       # Pre-packaged readable test samples for instant demo
│   ├── sample_prescription_printed.svg  # Sample printed prescription (Amoxil, Disprin, Panadol)
│   ├── sample_medicine_box.svg          # Sample packaging box (Augmentin 625mg)
│   └── sample_interaction_pair.svg      # Sample high-risk co-prescription (Disprin + Coumadin)
├── src/
│   ├── index.js                         # Unified module entry point & pipeline controller
│   ├── data/
│   │   ├── medicines.json               # Documented reference medicine catalog (FDA/WHO/BNF)
│   │   ├── medicines.js                 # Helper lookup & query utilities
│   │   ├── interactions.json            # Documented drug interaction reference dataset
│   │   └── interactions.js              # Screening engine & mandatory disclaimer strings
│   ├── matcher/
│   │   ├── textNormalizer.js            # Unicode, noise tokenization, & Levenshtein metric
│   │   └── medicineMatcher.js           # Exact, fuzzy, and ambiguous matching algorithms
│   ├── interactions/
│   │   └── interactionScreen.js         # Pairwise interaction screening with uncertainty flags
│   ├── ocr/
│   │   ├── ocrEngine.js                 # Tesseract.js worker controller & progress callbacks
│   │   └── imageValidator.js            # File format, size, and mime validation
│   └── components/
│       └── PrescriptionScannerUI.js     # Framework-agnostic, mountable UI component
├── styles/
│   └── scanner.css                      # Scoped, responsive medical UI stylesheet
├── preview/
│   └── index.html                       # Standalone development preview container
└── tests/
    ├── run-tests.js                     # Master automated test runner
    ├── validator.test.js                # File validation test suite
    ├── matcher.test.js                  # Normalization & medicine matcher test suite
    └── interactions.test.js             # Interaction screening test suite
```

---

## 2. Key Features

1. **Image Upload & Drag-and-Drop:**
   - Supports JPG, JPEG, PNG, and WEBP formats.
   - Enforces strict validation: rejects empty/corrupt files (<100 bytes) and files over 10 MB.
   - Shows live image preview with metadata and clear/reset actions.

2. **Genuine OCR Processing (Tesseract.js v5):**
   - Real, client-side character recognition with live progress percentage ("Initializing worker...", "Loading language data...", "Recognizing text: X%").
   - Zero server uploads: 100% private, client-side processing in memory.
   - Explicit handwriting limitation disclosure: informs users that cursive scripts require manual review.

3. **Editable Extracted Text:**
   - Provides an interactive text editor allowing users to review, correct OCR misspellings, or paste text before triggering matching.

4. **Structured Medicine Name Matching:**
   - Normalized matching handles spacing, dosage units (e.g. `500mg` -> `500 mg`), and strips prescription noise (`Rx`, `Sig`, `BID`, `Tab`).
   - Dual-mode matching:
     - **Exact Matches:** 100% confidence against brand name, generic name, or registered aliases.
     - **Fuzzy / Likely Matches:** Levenshtein similarity metric catches common OCR character substitutions.
     - **Ambiguous Matches:** Alerts user when a token closely resembles multiple medicines.
     - **Unmatched Tokens:** Highlights candidate words not found in the reference catalog.

5. **Documented Interaction Screening:**
   - Evaluates pairwise combinations of identified medicines against documented regulatory interaction data (US FDA Boxed Warnings, British National Formulary, ACCP Guidelines).
   - Flags uncertainty when interacting medicines originated from fuzzy OCR matches.
   - Mandates the exact standard safety notice when no record is found:
     > *"No interaction record was found in the available dataset. This does not mean the combination is safe."*

---

## 3. Reference Datasets & Documented Sources

### Medicine Dataset (`src/data/medicines.json`)
Contains 18 verified pharmaceutical profiles with zero fabricated records:
- **Amoxil** (`Amoxicillin Trihydrate`) — FDA NDC 50383-797-50 / WHO Model List of Essential Medicines (23rd List, 2023)
- **Augmentin** (`Amoxicillin / Clavulanate Potassium`) — FDA NDA 050564 / British National Formulary (BNF 86)
- **Disprin** (`Aspirin / Acetylsalicylic Acid`) — FDA OTC Monograph M018 / WHO Essential Medicines
- **Brufen** (`Ibuprofen`) — FDA NDA 017463 / BNF 86
- **Panadol** (`Paracetamol / Acetaminophen`) — FDA OTC Monograph M012 / WHO Essential Medicines
- **Glucophage** (`Metformin Hydrochloride`) — FDA NDA 020357 / WHO Essential Medicines
- **Lipitor** (`Atorvastatin Calcium`) — FDA NDA 020702 / BNF 86
- **Zestril** (`Lisinopril`) — FDA NDA 019777 / WHO Essential Medicines
- **Coumadin** (`Warfarin Sodium`) — FDA NDA 009218 / BNF 86
- **Prilosec** (`Omeprazole`) — FDA NDA 019810 / WHO Essential Medicines
- **Plavix** (`Clopidogrel Bisulfate`) — FDA NDA 020839 / BNF 86
- **Cipro** (`Ciprofloxacin Hydrochloride`) — FDA NDA 019537 / WHO Essential Medicines
- **Biaxin** (`Clarithromycin`) — FDA NDA 050662 / BNF 86
- **Zoloft** (`Sertraline Hydrochloride`) — FDA NDA 019839 / WHO Essential Medicines
- **Ultram** (`Tramadol Hydrochloride`) — FDA NDA 020281 / BNF 86
- **K-Lyte** (`Potassium Chloride`) — FDA NDA 018270 / WHO Essential Medicines
- **Maalox** (`Aluminum & Magnesium Hydroxides`) — FDA OTC Monograph M001 / BNF 86
- **Trexall** (`Methotrexate Sodium`) — FDA NDA 011719 / WHO Essential Medicines

### Drug Interaction Dataset (`src/data/interactions.json`)
Screens documented, high-impact clinical interactions:
1. **Aspirin + Warfarin** (Severe: Synergistic hemorrhage / major bleeding risk — FDA Boxed Warning; BNF Section 2.8.2)
2. **Aspirin + Ibuprofen** (Moderate: Blunting of antiplatelet cardioprotection & additive ulceration — FDA Safety Communication 2006)
3. **Paracetamol + Warfarin** (Moderate: High-dose paracetamol potentiates hypoprothrombinemic effect / elevates INR — BNF 86 Appendix 1)
4. **Atorvastatin + Clarithromycin** (Severe: Potent CYP3A4 inhibition elevates statin AUC, risking rhabdomyolysis — FDA Drug Safety Communication 2012)
5. **Lisinopril + Potassium Chloride** (Severe: Aldosterone suppression triggers life-threatening hyperkalemia — FDA Lisinopril Insert; KDIGO)
6. **Clopidogrel + Omeprazole** (Moderate: CYP2C19 competitive inhibition reduces clopidogrel active metabolite — FDA Drug Safety Alert 2009)
7. **Ciprofloxacin + Antacids** (Moderate: Cation chelation slashes ciprofloxacin absorption by up to 90% — FDA Cipro Labeling)
8. **Sertraline + Tramadol** (Severe: Dual serotonergic elevation causes Serotonin Syndrome and lowers seizure threshold — FDA Safety Alert; BNF)
9. **Amoxicillin + Methotrexate** (Moderate: Penicillin competes for tubular secretion, increasing methotrexate toxicity — BNF Appendix 1)

---

## 4. How to Run the Module

### Option A: Run Automated Unit Tests (Node.js)
Execute the master automated test runner from the repository root:
```bash
node "Stage 2/tests/run-tests.js"
```
Or from inside the `Stage 2` directory:
```bash
cd "Stage 2"
npm test
```

### Option B: Launch Standalone Development Preview
To test the interactive scanner in your browser:
1. Simply double-click or open `Stage 2/preview/index.html` in any web browser (Chrome, Edge, Firefox, Safari).
2. Or serve it via any static local server:
   ```bash
   npx serve "Stage 2/preview" -l 3000
   ```
   Or with Python:
   ```bash
   python -m http.server 3000 --directory "Stage 2"
   ```
3. Click any of the pre-loaded sample images or upload your own prescription image.

---

## 5. Integration Guide: Merging into Main "Nuskha" Project

When the team leader is ready to integrate Stage 2 into the main `Nuskha` application folder:

### Step 1: Copy Module Files
Copy the `Stage 2/src/` and `Stage 2/styles/` directories into `Nuskha`:
```
Nuskha/
├── src/
│   └── modules/
│       └── prescriptionScanner/
│           ├── index.js
│           ├── data/
│           ├── matcher/
│           ├── interactions/
│           ├── ocr/
│           └── components/
└── public/ (or src/styles/)
    └── styles/
        └── scanner.css
```

### Step 2: Install Required Dependencies
In the main `Nuskha` project root, ensure `tesseract.js` is installed:
```bash
npm install tesseract.js
```
*(If using vanilla HTML/JS without a bundler, simply include `<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>` in `index.html`).*

### Step 3: Module Integration Examples

#### In React / Next.js / Vue:
```javascript
import {
  matchMedicinesFromText,
  screenInteractions,
  validateImageFile,
  OCREngine
} from './modules/prescriptionScanner';

// 1. Process uploaded file
const ocr = new OCREngine();
const { rawText, confidence } = await ocr.processImage(file, ({ progress, message }) => {
  console.log(`OCR Progress: ${Math.round(progress * 100)}% - ${message}`);
});

// 2. Match medicines
const matchOutcome = matchMedicinesFromText(rawText);
console.log("Matched Medicines:", matchOutcome.allMatchedMedicines);

// 3. Screen interactions
const interactionOutcome = screenInteractions(matchOutcome.allMatchedMedicines);
if (interactionOutcome.hasInteractions) {
  console.warn("Detected Interactions:", interactionOutcome.detectedInteractions);
} else {
  console.info(interactionOutcome.safetyNotice);
  // "No interaction record was found in the available dataset. This does not mean the combination is safe."
}
```

#### In Vanilla JavaScript / Existing Dashboard:
```html
<!-- Include stylesheet -->
<link rel="stylesheet" href="./styles/scanner.css" />

<!-- Root container -->
<div id="prescription-scanner-root"></div>

<!-- Include scripts -->
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
<script src="./modules/prescriptionScanner/data/medicines.js"></script>
<script src="./modules/prescriptionScanner/data/interactions.js"></script>
<script src="./modules/prescriptionScanner/matcher/textNormalizer.js"></script>
<script src="./modules/prescriptionScanner/matcher/medicineMatcher.js"></script>
<script src="./modules/prescriptionScanner/interactions/interactionScreen.js"></script>
<script src="./modules/prescriptionScanner/ocr/imageValidator.js"></script>
<script src="./modules/prescriptionScanner/ocr/ocrEngine.js"></script>
<script src="./modules/prescriptionScanner/components/PrescriptionScannerUI.js"></script>

<script>
  const scanner = new PrescriptionScannerUI(
    document.getElementById("prescription-scanner-root"),
    {
      onScanComplete: (results) => {
        console.log("Scan complete:", results);
      }
    }
  );
  scanner.mount();
</script>
```

---

## 6. Medical Safety & Privacy Notice

- **Informational Screening Only:** This software is an informational decision-support and screening demonstration designed for a hackathon. It has NOT been reviewed, verified, or cleared by the US FDA, EMA, or any clinical regulatory authority.
- **No Medical Advice:** Do NOT make any clinical decisions, start, stop, or adjust prescription medication dosages based solely on this tool.
- **Handwriting Limitations:** Cursive handwriting often lacks discrete character boundaries; OCR results MUST be verified by a licensed human doctor or pharmacist.
- **Privacy Assurance:** Patient prescription images and extracted text remain entirely in client-side memory during active execution and are discarded upon browser tab refresh or container reset.
