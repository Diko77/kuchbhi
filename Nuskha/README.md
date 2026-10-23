# Nuskha AI — Integrated Healthcare Application

**Nuskha AI** is an intelligent healthcare platform designed for hackathon demonstration. It integrates **Prescription & Packaging OCR Recognition (Stage 2)**, **Evidence-Based Generic Medicine Comparison (Stage 4)**, and modular interfaces for **Visual Dosage Assistance (Stage 3)** and **Clinical Decision Support**.

---

## 1. Project Structure

```
Nuskha/
├── package.json                         # Project metadata, dependencies & start scripts
├── server.js                            # Zero-dependency Node.js HTTP server & REST APIs
├── README.md                            # Complete application architecture & operational guide
├── public/                              # Front-end dashboard application
│   ├── index.html                       # Unified Nuskha AI Dashboard shell
│   ├── css/
│   │   ├── dashboard.css                # Global dashboard layout & navigation styles
│   │   ├── generic-matcher.css          # Stage 4 Generic Matcher & comparison styles
│   │   └── scanner.css                  # Stage 2 Prescription Scanner styles
│   ├── js/
│   │   ├── app.js                       # Dashboard router, view switcher, & lazy component mounter
│   │   ├── genericMatcherUI.js          # Stage 4 Generic Medicine Matcher UI component
│   │   ├── prescriptionScannerUI.js     # Stage 2 Prescription Scanner UI component
│   │   ├── core/
│   │   │   └── genericMatcher.js        # Core comparison engine (Active molecule, Strength, Form, TE rating)
│   │   └── data/
│   │       ├── medicines.js             # Reused & extended reference medicine catalog
│   │       └── interactions.js          # Drug-drug clinical interaction dataset
│   └── sample_images/                   # Fictional prescription images for rapid demo
│       ├── sample_prescription_printed.svg
│       ├── sample_medicine_box.svg
│       └── sample_interaction_pair.svg
└── tests/
    ├── genericMatcher.test.js           # Unit tests for comparison & equivalence logic
    └── run-tests.js                     # Master automated test suite runner
```

---

## 2. Stage 4: Generic Medicine Matcher Overview

The **Generic Medicine Matcher** allows patients, caregivers, and medical practitioners to search for a prescribed brand-name drug or active ingredient and compare it side-by-side with verified generic equivalents and alternative formulations.

### Key Capabilities

1. **Dual Search Modes:**
   - Search by **Brand Name** (e.g., `Amoxil`, `Augmentin`, `Disprin`, `Panadol`, `Glucophage`, `Lipitor`, `Coumadin`, `Plavix`, `Prilosec`, `Brufen`, `Cipro`).
   - Search by **Active Ingredient / Generic Molecule** (e.g., `Amoxicillin`, `Metformin`, `Atorvastatin`, `Paracetamol`, `Lisinopril`, `Warfarin`, `Clopidogrel`).

2. **Multi-Factor Clinical Equivalence Checklist:**
   - **Active Ingredient Check:** Verifies exact chemical moiety and base/salt equivalents (e.g. Amoxicillin Trihydrate vs Amoxicillin; Paracetamol vs Acetaminophen; Aspirin vs Acetylsalicylic Acid).
   - **Strength Check:** Verifies strict dose parity (e.g. 500 mg == 500 mg). Flags dosage mismatches (e.g. Panadol 500 mg vs Tylenol 650 mg) with explicit non-equivalence alerts.
   - **Dosage Form & Release Kinetics:** Distinguishes immediate-release tablets, extended-release matrices (e.g. Glucophage XR), and enteric-coated formulations (e.g. Ecosprin). Prevents dangerous non-bioequivalent swaps.
   - **Therapeutic Equivalence (TE) Ratings:** Incorporates US FDA Orange Book standard codes (`AB` = bioequivalent; `BX` / Form Mismatch = non-interchangeable; `NTI` = Narrow Therapeutic Index warning).

3. **Honest Price Transparency Policy:**
   - **Zero Fabricated Pricing:** Pharmaceutical prices vary drastically by country, insurance formulary, and pharmacy dispensing fees. Nuskha AI never guesses or fabricates commercial prices.
   - Provides clear, transparent guidance to check real-time retail pricing with local pharmacies.

4. **Clinical Safety & Medical Governance:**
   - Prominently displays safety notices explaining that active ingredient similarity alone does not establish individual clinical interchangeability.
   - Adheres strictly to non-prescriptive informational decision support.

---

## 3. Dataset & Documented Sources

All medicines and generic counterparts are drawn from authoritative regulatory listings:
- **US FDA Approved Drug Products with Therapeutic Equivalence Evaluations (Orange Book, 44th Edition)**
- **US National Library of Medicine (DailyMed)**
- **WHO Model List of Essential Medicines (23rd List, 2023)**
- **British National Formulary (BNF 86, 2023-2024)**

Mapped medications include:
- `Amoxil 500 mg` → Generic Amoxicillin Capsules USP (AB-rated, ANDA 065224)
- `Augmentin 625 mg` → Generic Amoxicillin & Clavulanate Potassium Tablets (AB-rated, ANDA 065115)
- `Disprin 100 mg` → Aspirin Dispersible Tablets BP (Soluble) vs Ecosprin 100 (Enteric-coated difference)
- `Panadol 500 mg` → Paracetamol Tablets BP / USP vs Tylenol Extra Strength (650 mg strength difference)
- `Glucophage 500 mg` → Metformin HCl Tablets (AB-rated, ANDA 075973) vs Glucophage XR (Release profile difference)
- `Lipitor 20 mg` → Atorvastatin Calcium Tablets USP (AB-rated, ANDA 090548)
- `Zestril 10 mg` → Lisinopril Tablets USP (AB-rated, ANDA 075999) & Prinivil
- `Coumadin 5 mg` → Warfarin Sodium Tablets USP (AB-rated, ANDA 040409) with Narrow Therapeutic Index (NTI) warning
- `Plavix 75 mg` → Clopidogrel Tablets USP (AB-rated, ANDA 078004)
- `Prilosec 20 mg` → Omeprazole Delayed-Release Capsules USP (AB-rated, ANDA 075723)
- `Brufen 400 mg` → Ibuprofen Tablets USP (AB-rated, ANDA 070044) vs Advil 200mg Liqui-Gels
- `Cipro 500 mg` → Ciprofloxacin Tablets USP (AB-rated, ANDA 076412)

---

## 4. How to Run Nuskha AI

### Option A: Launch Application Server (Node.js)
From inside the `Nuskha` folder:
```bash
node server.js
```
Then open your browser to:
```
http://localhost:3000
```

### Option B: Run Automated Test Suite
From inside the `Nuskha` folder:
```bash
node tests/run-tests.js
```
Or from the workspace root:
```bash
node "Nuskha/tests/run-tests.js"
```

### Option C: Direct Browser Opening (Zero Server Required)
You can directly open `Nuskha/public/index.html` in Chrome, Edge, Firefox, or Safari. The front-end uses client-side routing, Web Workers for Tesseract OCR, and bundled data modules, requiring no build step or bundler.

---

## 5. Integration Summary

- **Stage 1 (Dashboard Shell):** Fully implemented with responsive header navigation, overview hero, and view switcher.
- **Stage 2 (Prescription Scanner):** Integrated into `#view-prescription-scanner` with client-side OCR, editable text, medicine name identification, and drug-drug interaction alerts.
- **Stage 3 (Visual Dosage Assistant):** Linked via `#view-dosage-assistant` with scheduled data contracts.
- **Stage 4 (Generic Medicine Matcher):** Fully active in `#view-generic-matcher` with live comparison cards, checklist criteria, and honest pricing notices.

---

## 6. Medical Disclaimer

*Nuskha AI is designed for informational and educational demonstration purposes only. It is not a certified medical device and does not provide clinical diagnosis, treatment recommendations, or individualized prescription instructions. Consult a licensed healthcare provider before making any medication changes.*
