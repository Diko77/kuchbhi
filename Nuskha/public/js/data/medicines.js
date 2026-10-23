/**
 * Nuskha AI - Integrated Application Medicine Dataset
 * 
 * Reused and enriched from Stage 2 with FDA Orange Book Reference Listed Drug (RLD)
 * classifications, active ingredients, strengths, and dosage forms.
 *
 * Sources:
 * - US FDA Approved Drug Products with Therapeutic Equivalence Evaluations (Orange Book, 44th Edition)
 * - US National Library of Medicine (DailyMed)
 * - WHO Model List of Essential Medicines (23rd List, 2023)
 * - British National Formulary (BNF 86, 2023-2024)
 */

const medicinesCatalog = [
  {
    id: "amoxil-500",
    brandName: "Amoxil",
    genericName: "Amoxicillin",
    activeIngredient: "Amoxicillin Trihydrate",
    strength: "500 mg",
    dosageForm: "Capsule",
    releaseType: "Immediate Release",
    category: "Broad-spectrum Penicillin Antibiotic",
    isReferenceBrand: true,
    ndaNumber: "NDA 050383",
    source: "US FDA Orange Book / WHO Model List of Essential Medicines",
    rldStatus: "Reference Listed Drug (RLD)",
    equivalents: [
      {
        productName: "Amoxicillin Capsules USP",
        manufacturer: "Teva Pharmaceuticals / Sandoz / Aurobindo",
        activeIngredient: "Amoxicillin Trihydrate",
        strength: "500 mg",
        dosageForm: "Capsule",
        releaseType: "Immediate Release",
        teCode: "AB", // Therapeutically Equivalent
        source: "FDA ANDA 065224 / ANDA 065113",
        verifiedInterchangeable: true,
        notes: "Therapeutically equivalent AB-rated generic. Same active chemical moiety, strength, and bioavailable route."
      },
      {
        productName: "Trimox 500 mg",
        manufacturer: "Apothecon / Bristol-Myers Squibb",
        activeIngredient: "Amoxicillin Trihydrate",
        strength: "500 mg",
        dosageForm: "Capsule",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 062635",
        verifiedInterchangeable: true,
        notes: "Branded generic capsule, identical strength and release profile."
      },
      {
        productName: "Amoxicillin Oral Suspension (Diff Form)",
        manufacturer: "Various",
        activeIngredient: "Amoxicillin Trihydrate",
        strength: "250 mg / 5 mL",
        dosageForm: "Oral Suspension",
        releaseType: "Liquid",
        teCode: "Not Equivalent (Form Mismatch)",
        source: "FDA ANDA 065225",
        verifiedInterchangeable: false,
        notes: "DIFFERENT DOSAGE FORM & STRENGTH. Liquid suspension is not directly interchangeable with 500 mg capsule without physician recalculation."
      }
    ]
  },
  {
    id: "augmentin-625",
    brandName: "Augmentin",
    genericName: "Amoxicillin / Clavulanate Potassium",
    activeIngredient: "Amoxicillin Trihydrate and Potassium Clavulanate",
    strength: "500 mg / 125 mg (625 mg)",
    dosageForm: "Film-coated Tablet",
    releaseType: "Immediate Release",
    category: "Beta-lactamase Inhibitor Combination Antibiotic",
    isReferenceBrand: true,
    ndaNumber: "NDA 050564",
    source: "US FDA Orange Book / BNF 86",
    rldStatus: "Reference Listed Drug (RLD)",
    equivalents: [
      {
        productName: "Amoxicillin and Clavulanate Potassium Tablets USP",
        manufacturer: "Sandoz / Teva / Aurobindo",
        activeIngredient: "Amoxicillin Trihydrate and Potassium Clavulanate",
        strength: "500 mg / 125 mg (625 mg)",
        dosageForm: "Film-coated Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 065115",
        verifiedInterchangeable: true,
        notes: "AB-rated generic equivalent. Clavulanate component ratio strictly matches reference drug."
      },
      {
        productName: "Clavam 625",
        manufacturer: "Alkem Laboratories",
        activeIngredient: "Amoxicillin Trihydrate and Potassium Clavulanate",
        strength: "500 mg / 125 mg (625 mg)",
        dosageForm: "Film-coated Tablet",
        releaseType: "Immediate Release",
        teCode: "AB-equivalent",
        source: "Indian Pharmacopoeia (IP) / WHO GMP",
        verifiedInterchangeable: true,
        notes: "Branded generic meeting international pharmacopeial dissolution and strength specifications."
      }
    ]
  },
  {
    id: "disprin-100",
    brandName: "Disprin",
    genericName: "Aspirin",
    activeIngredient: "Acetylsalicylic Acid",
    strength: "100 mg",
    dosageForm: "Soluble / Dispersible Tablet",
    releaseType: "Rapid Dissolution",
    category: "Antiplatelet / Salicylate NSAID",
    isReferenceBrand: true,
    source: "FDA OTC Monograph M018 / WHO Essential Medicines / BNF 86",
    rldStatus: "Monograph Standard Drug",
    equivalents: [
      {
        productName: "Aspirin Dispersible Tablets BP",
        manufacturer: "Generic Pharmacopeia (BP/USP)",
        activeIngredient: "Acetylsalicylic Acid",
        strength: "100 mg",
        dosageForm: "Dispersible Tablet",
        releaseType: "Rapid Dissolution",
        teCode: "AB",
        source: "British Pharmacopoeia (BP 2023) / WHO Prequalification",
        verifiedInterchangeable: true,
        notes: "Unbranded generic soluble aspirin with matching 100 mg strength."
      },
      {
        productName: "Ecosprin 100 (Enteric-coated)",
        manufacturer: "USV Private Limited",
        activeIngredient: "Acetylsalicylic Acid",
        strength: "100 mg",
        dosageForm: "Gastro-resistant / Enteric-coated Tablet",
        releaseType: "Delayed Release (Enteric)",
        teCode: "Special Formulation (Delayed Release)",
        source: "DailyMed / IP",
        verifiedInterchangeable: false,
        notes: "FORMULATION DIFFERENCE: Ecosprin has an enteric coating designed to resist gastric acid and dissolve in the duodenum. Delayed onset of antiplatelet action makes it unsuitable when immediate antiplatelet effect is required."
      }
    ]
  },
  {
    id: "panadol-500",
    brandName: "Panadol",
    genericName: "Paracetamol",
    activeIngredient: "Paracetamol (Acetaminophen)",
    strength: "500 mg",
    dosageForm: "Tablet",
    releaseType: "Immediate Release",
    category: "Analgesic and Antipyretic",
    isReferenceBrand: true,
    source: "FDA OTC Monograph M012 / WHO Essential Medicines / BNF 86",
    rldStatus: "Monograph Reference Product",
    equivalents: [
      {
        productName: "Paracetamol Tablets BP / Acetaminophen Tablets USP",
        manufacturer: "Multiple USP/BP certified laboratories",
        activeIngredient: "Paracetamol (Acetaminophen)",
        strength: "500 mg",
        dosageForm: "Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "USP-NF Monograph / WHO Model Formulary",
        verifiedInterchangeable: true,
        notes: "Direct generic bioequivalent meeting official compendial dissolution standards."
      },
      {
        productName: "Tylenol Extra Strength (Warning: 650 mg)",
        manufacturer: "McNeil Consumer Healthcare",
        activeIngredient: "Acetaminophen",
        strength: "650 mg",
        dosageForm: "Caplet",
        releaseType: "Immediate Release",
        teCode: "Different Strength (650 mg vs 500 mg)",
        source: "FDA NDA 019872",
        verifiedInterchangeable: false,
        notes: "STRENGTH MISMATCH: Tylenol Extra Strength contains 650 mg per unit dose compared to 500 mg in Panadol. Cannot be substituted 1:1 without risking inadvertent hepatotoxicity from exceeding maximum daily acetaminophen limits (4,000 mg/day)."
      },
      {
        productName: "Calpol 500",
        manufacturer: "GlaxoSmithKline Pharmaceuticals",
        activeIngredient: "Paracetamol",
        strength: "500 mg",
        dosageForm: "Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "MHRA / BNF 86",
        verifiedInterchangeable: true,
        notes: "Identical active ingredient, strength, and immediate-release profile."
      }
    ]
  },
  {
    id: "glucophage-500",
    brandName: "Glucophage",
    genericName: "Metformin Hydrochloride",
    activeIngredient: "Metformin Hydrochloride",
    strength: "500 mg",
    dosageForm: "Tablet",
    releaseType: "Immediate Release (IR)",
    category: "Biguanide Oral Antidiabetic",
    isReferenceBrand: true,
    ndaNumber: "NDA 020357",
    source: "US FDA Orange Book / WHO Essential Medicines",
    rldStatus: "Reference Listed Drug (RLD)",
    equivalents: [
      {
        productName: "Metformin Hydrochloride Tablets USP",
        manufacturer: "Teva / Mylan / Zydus Pharmaceuticals",
        activeIngredient: "Metformin Hydrochloride",
        strength: "500 mg",
        dosageForm: "Tablet",
        releaseType: "Immediate Release (IR)",
        teCode: "AB",
        source: "FDA ANDA 075973",
        verifiedInterchangeable: true,
        notes: "AB-rated generic equivalent with bioequivalent Cmax and AUC pharmacokinetic parameters."
      },
      {
        productName: "Glucophage XR 500 mg (Extended-Release)",
        manufacturer: "Bristol-Myers Squibb / Merck",
        activeIngredient: "Metformin Hydrochloride",
        strength: "500 mg",
        dosageForm: "Extended-release Tablet",
        releaseType: "Extended Release (XR)",
        teCode: "Different Release Mechanism (XR vs IR)",
        source: "FDA NDA 021202",
        verifiedInterchangeable: false,
        notes: "PHARMACOKINETIC PROFILE DIFFERENCE: Glucophage XR employs a dual-hydrophilic polymer matrix releasing drug slowly over 10 hours. IR Metformin is absorbed rapidly. Do NOT substitute IR for XR without physician dosing adjustment to prevent gastrointestinal intolerance."
      }
    ]
  },
  {
    id: "lipitor-20",
    brandName: "Lipitor",
    genericName: "Atorvastatin Calcium",
    activeIngredient: "Atorvastatin Calcium Trihydrate",
    strength: "20 mg",
    dosageForm: "Film-coated Tablet",
    releaseType: "Immediate Release",
    category: "HMG-CoA Reductase Inhibitor (Statin)",
    isReferenceBrand: true,
    ndaNumber: "NDA 020702",
    source: "US FDA Orange Book / BNF 86",
    rldStatus: "Reference Listed Drug (RLD)",
    equivalents: [
      {
        productName: "Atorvastatin Calcium Tablets USP",
        manufacturer: "Ranbaxy / Sun Pharma / Mylan / Apotex",
        activeIngredient: "Atorvastatin Calcium",
        strength: "20 mg",
        dosageForm: "Film-coated Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 090548 / ANDA 076477",
        verifiedInterchangeable: true,
        notes: "Therapeutically equivalent AB-rated generic statin. Same chemical efficacy in LDL-C reduction."
      },
      {
        productName: "Storvas 20",
        manufacturer: "Sun Pharmaceutical Industries",
        activeIngredient: "Atorvastatin Calcium",
        strength: "20 mg",
        dosageForm: "Tablet",
        releaseType: "Immediate Release",
        teCode: "AB-equivalent",
        source: "IP / WHO GMP Certification",
        verifiedInterchangeable: true,
        notes: "Branded generic atorvastatin adhering strictly to 20 mg active statin equivalent."
      }
    ]
  },
  {
    id: "zestril-10",
    brandName: "Zestril",
    genericName: "Lisinopril",
    activeIngredient: "Lisinopril Anhydrous",
    strength: "10 mg",
    dosageForm: "Tablet",
    releaseType: "Immediate Release",
    category: "Angiotensin-Converting Enzyme (ACE) Inhibitor",
    isReferenceBrand: true,
    ndaNumber: "NDA 019777",
    source: "US FDA Orange Book / WHO Essential Medicines",
    rldStatus: "Reference Listed Drug (RLD)",
    equivalents: [
      {
        productName: "Lisinopril Tablets USP",
        manufacturer: "Lupin Pharmaceuticals / Accord Healthcare",
        activeIngredient: "Lisinopril Anhydrous",
        strength: "10 mg",
        dosageForm: "Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 075999",
        verifiedInterchangeable: true,
        notes: "AB-rated therapeutic equivalent. Produces identical hemodynamic ACE inhibition."
      },
      {
        productName: "Prinivil 10 mg",
        manufacturer: "Merck Sharp & Dohme",
        activeIngredient: "Lisinopril",
        strength: "10 mg",
        dosageForm: "Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA NDA 019558",
        verifiedInterchangeable: true,
        notes: "Co-marketed innovator brand of lisinopril with identical bioequivalence."
      }
    ]
  },
  {
    id: "coumadin-5",
    brandName: "Coumadin",
    genericName: "Warfarin Sodium",
    activeIngredient: "Warfarin Sodium Crystalline",
    strength: "5 mg",
    dosageForm: "Scored Tablet",
    releaseType: "Immediate Release",
    category: "Vitamin K Antagonist Anticoagulant",
    isReferenceBrand: true,
    ndaNumber: "NDA 009218",
    source: "US FDA Orange Book / BNF 86",
    rldStatus: "Reference Listed Drug (RLD) - NARROW THERAPEUTIC INDEX (NTI)",
    equivalents: [
      {
        productName: "Jantoven 5 mg",
        manufacturer: "Upsher-Smith Laboratories",
        activeIngredient: "Warfarin Sodium",
        strength: "5 mg",
        dosageForm: "Scored Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 040409",
        verifiedInterchangeable: true,
        notes: "CLINICAL CAUTION (NTI DRUG): Although Jantoven is rated AB to Coumadin, Warfarin is a Narrow Therapeutic Index (NTI) agent. Any brand or generic substitution must be accompanied by baseline and follow-up INR testing within 3-7 days."
      },
      {
        productName: "Warfarin Sodium Tablets USP",
        manufacturer: "Teva / Taro Pharmaceuticals",
        activeIngredient: "Warfarin Sodium",
        strength: "5 mg",
        dosageForm: "Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 040196",
        verifiedInterchangeable: true,
        notes: "Generic warfarin sodium with identical 5 mg active content. NTI precautions apply."
      }
    ]
  },
  {
    id: "plavix-75",
    brandName: "Plavix",
    genericName: "Clopidogrel Bisulfate",
    activeIngredient: "Clopidogrel Bisulfate",
    strength: "75 mg",
    dosageForm: "Film-coated Tablet",
    releaseType: "Immediate Release",
    category: "Thienopyridine P2Y12 Antiplatelet",
    isReferenceBrand: true,
    ndaNumber: "NDA 020839",
    source: "US FDA Orange Book / BNF 86",
    rldStatus: "Reference Listed Drug (RLD)",
    equivalents: [
      {
        productName: "Clopidogrel Tablets USP",
        manufacturer: "Dr. Reddy's Laboratories / Teva / Mylan",
        activeIngredient: "Clopidogrel Bisulfate",
        strength: "75 mg",
        dosageForm: "Film-coated Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 078004",
        verifiedInterchangeable: true,
        notes: "AB-rated therapeutic equivalent. Proven equivalent antiplatelet inhibition in clinical bioequivalence trials."
      },
      {
        productName: "Clopilet 75",
        manufacturer: "Sun Pharmaceutical Industries",
        activeIngredient: "Clopidogrel Bisulfate",
        strength: "75 mg",
        dosageForm: "Film-coated Tablet",
        releaseType: "Immediate Release",
        teCode: "AB-equivalent",
        source: "IP / WHO GMP",
        verifiedInterchangeable: true,
        notes: "Branded generic clopidogrel with matching 75 mg strength."
      }
    ]
  },
  {
    id: "prilosec-20",
    brandName: "Prilosec",
    genericName: "Omeprazole",
    activeIngredient: "Omeprazole Magnesium",
    strength: "20 mg",
    dosageForm: "Delayed-release Capsule",
    releaseType: "Delayed Release (Enteric)",
    category: "Proton Pump Inhibitor (PPI)",
    isReferenceBrand: true,
    ndaNumber: "NDA 019810",
    source: "US FDA Orange Book / WHO Essential Medicines",
    rldStatus: "Reference Listed Drug (RLD)",
    equivalents: [
      {
        productName: "Omeprazole Delayed-Release Capsules USP",
        manufacturer: "Sandoz / Dr. Reddy's / Mylan",
        activeIngredient: "Omeprazole Magnesium",
        strength: "20 mg",
        dosageForm: "Delayed-release Capsule",
        releaseType: "Delayed Release (Enteric)",
        teCode: "AB",
        source: "FDA ANDA 075723",
        verifiedInterchangeable: true,
        notes: "AB-rated generic. Formulated with enteric-coated granules to bypass acid degradation in the stomach."
      },
      {
        productName: "Losec 20 mg",
        manufacturer: "AstraZeneca",
        activeIngredient: "Omeprazole",
        strength: "20 mg",
        dosageForm: "Delayed-release Capsule",
        releaseType: "Delayed Release",
        teCode: "AB",
        source: "BNF 86 / MHRA",
        verifiedInterchangeable: true,
        notes: "International innovator brand equivalent."
      }
    ]
  },
  {
    id: "brufen-400",
    brandName: "Brufen",
    genericName: "Ibuprofen",
    activeIngredient: "Ibuprofen",
    strength: "400 mg",
    dosageForm: "Film-coated Tablet",
    releaseType: "Immediate Release",
    category: "Nonsteroidal Anti-inflammatory Drug (NSAID)",
    isReferenceBrand: true,
    source: "FDA NDA 017463 / British National Formulary (BNF 86)",
    rldStatus: "Reference Product",
    equivalents: [
      {
        productName: "Ibuprofen Tablets USP",
        manufacturer: "Major Pharmaceuticals / Teva",
        activeIngredient: "Ibuprofen",
        strength: "400 mg",
        dosageForm: "Film-coated Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 070044",
        verifiedInterchangeable: true,
        notes: "Standard generic ibuprofen tablet."
      },
      {
        productName: "Advil Liqui-Gels (Warning: 200 mg / Capsule)",
        manufacturer: "Pfizer / Haleon",
        activeIngredient: "Solubilized Ibuprofen",
        strength: "200 mg",
        dosageForm: "Liquid-filled Capsule",
        releaseType: "Rapid Absorption",
        teCode: "Different Strength & Form (200 mg vs 400 mg)",
        source: "FDA NDA 020402",
        verifiedInterchangeable: false,
        notes: "STRENGTH & FORMULATION MISMATCH: Advil Liqui-Gels contain 200 mg solubilized ibuprofen per capsule. Half the strength of 400 mg Brufen, requiring 2 units to equal 400 mg dose."
      }
    ]
  },
  {
    id: "cipro-500",
    brandName: "Cipro",
    genericName: "Ciprofloxacin",
    activeIngredient: "Ciprofloxacin Hydrochloride",
    strength: "500 mg",
    dosageForm: "Film-coated Tablet",
    releaseType: "Immediate Release",
    category: "Fluoroquinolone Antibacterial",
    isReferenceBrand: true,
    ndaNumber: "NDA 019537",
    source: "US FDA Orange Book / WHO Essential Medicines",
    rldStatus: "Reference Listed Drug (RLD)",
    equivalents: [
      {
        productName: "Ciprofloxacin Tablets USP",
        manufacturer: "Dr. Reddy's / Aurobindo / Watson",
        activeIngredient: "Ciprofloxacin Hydrochloride",
        strength: "500 mg",
        dosageForm: "Film-coated Tablet",
        releaseType: "Immediate Release",
        teCode: "AB",
        source: "FDA ANDA 076412",
        verifiedInterchangeable: true,
        notes: "AB-rated generic equivalent."
      },
      {
        productName: "Ciplox 500",
        manufacturer: "Cipla Ltd",
        activeIngredient: "Ciprofloxacin Hydrochloride",
        strength: "500 mg",
        dosageForm: "Film-coated Tablet",
        releaseType: "Immediate Release",
        teCode: "AB-equivalent",
        source: "IP / WHO Prequalification",
        verifiedInterchangeable: true,
        notes: "Branded generic ciprofloxacin."
      }
    ]
  }
];

function getAllMedicines() {
  return medicinesCatalog;
}

function findMedicine(query) {
  if (!query || typeof query !== "string") return null;
  const q = query.trim().toLowerCase();

  // 1. Direct brand match
  let found = medicinesCatalog.find(m => m.brandName.toLowerCase() === q);
  if (found) return found;

  // 2. Generic name match
  found = medicinesCatalog.find(m => m.genericName.toLowerCase() === q);
  if (found) return found;

  // 3. Active ingredient match
  found = medicinesCatalog.find(m => m.activeIngredient.toLowerCase().includes(q));
  if (found) return found;

  // 4. Partial / alias match
  found = medicinesCatalog.find(m => {
    if (m.brandName.toLowerCase().includes(q)) return true;
    if (m.genericName.toLowerCase().includes(q)) return true;
    return false;
  });

  return found || null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    medicinesCatalog,
    getAllMedicines,
    findMedicine
  };
}

if (typeof window !== "undefined") {
  window.NuskhaMedicinesCatalog = {
    medicinesCatalog,
    getAllMedicines,
    findMedicine
  };
}
