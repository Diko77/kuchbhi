/**
 * Nuskha AI - Integrated Interaction Dataset
 */

const interactionsData = [
  {
    id: "int-aspirin-warfarin",
    drugs: ["Aspirin", "Warfarin"],
    drugIds: ["disprin-100", "coumadin-5"],
    severity: "Severe",
    title: "Severe Hemorrhage / Bleeding Risk",
    mechanism: "Concurrent administration of Aspirin (platelet COX-1 inhibitor) and Warfarin (vitamin K antagonist) produces synergistic antihemostatic effects, dramatically escalating major gastrointestinal and systemic hemorrhage.",
    clinicalSummary: "Increased risk of major hemorrhage due to combined antiplatelet and anticoagulant effects. Strict clinical monitoring of INR required.",
    source: "US FDA Boxed Warning (Warfarin/Aspirin) / BNF 86 Section 2.8.2 / ACCP Guidelines"
  },
  {
    id: "int-aspirin-ibuprofen",
    drugs: ["Aspirin", "Ibuprofen"],
    drugIds: ["disprin-100", "brufen-400"],
    severity: "Moderate",
    title: "Attenuation of Antiplatelet Protection & Gastric Mucosal Injury",
    mechanism: "Ibuprofen competitively and reversibly blocks access of Aspirin to platelet COX-1 Ser529 active site, blunting irreversible cardioprotection, while additive NSAID exposure increases gastroduodenal ulceration.",
    clinicalSummary: "Ibuprofen may interfere with low-dose aspirin cardioprotection and increases gastrointestinal toxicity.",
    source: "FDA Drug Safety Communication (2006) / DailyMed Aspirin & Ibuprofen Prescribing Info"
  },
  {
    id: "int-paracetamol-warfarin",
    drugs: ["Paracetamol", "Warfarin"],
    drugIds: ["panadol-500", "coumadin-5"],
    severity: "Moderate",
    title: "Potentiation of Anticoagulant Effect (INR Elevation)",
    mechanism: "Sustained high-dose Paracetamol inhibits vitamin K-dependent carboxylase and can alter warfarin metabolism, prolonging prothrombin time.",
    clinicalSummary: "Regular, high-dose paracetamol use over multiple consecutive days may elevate INR and increase bleeding vulnerability.",
    source: "BNF 86 Appendix 1 / Chest 2008 Guidelines"
  },
  {
    id: "int-atorvastatin-clarithromycin",
    drugs: ["Atorvastatin", "Clarithromycin"],
    drugIds: ["lipitor-20", "biaxin-500"],
    severity: "Severe",
    title: "Severe Myopathy / Rhabdomyolysis Risk (CYP3A4 Inhibition)",
    mechanism: "Clarithromycin is a potent CYP3A4 inhibitor. Co-administration produces multi-fold elevations in atorvastatin systemic exposure, significantly predisposing to rhabdomyolysis and acute renal failure.",
    clinicalSummary: "Potent CYP3A4 inhibition drastically increases atorvastatin exposure, posing a high risk of myopathy and rhabdomyolysis.",
    source: "FDA Drug Safety Communication (2012) / DailyMed Lipitor & Biaxin Labeling"
  },
  {
    id: "int-lisinopril-potassium",
    drugs: ["Lisinopril", "Potassium Chloride"],
    drugIds: ["zestril-10", "k-lyte-600"],
    severity: "Severe",
    title: "Severe Hyperkalemia Risk",
    mechanism: "Lisinopril inhibits ACE, reducing aldosterone synthesis and renal potassium excretion. Concurrent potassium supplementation frequently triggers life-threatening cardiac conduction abnormalities.",
    clinicalSummary: "Concomitant potassium supplementation with an ACE inhibitor significantly increases serum potassium.",
    source: "FDA Lisinopril Package Insert / BNF 86 Section 2.5.5.1 / KDIGO"
  },
  {
    id: "int-clopidogrel-omeprazole",
    drugs: ["Clopidogrel", "Omeprazole"],
    drugIds: ["plavix-75", "prilosec-20"],
    severity: "Moderate",
    title: "Reduced Antiplatelet Efficacy (CYP2C19 Inhibition)",
    mechanism: "Clopidogrel requires bioactivation via hepatic CYP2C19. Omeprazole competitively inhibits CYP2C19, reducing circulating active clopidogrel thiol metabolite.",
    clinicalSummary: "Omeprazole reduces antiplatelet effectiveness of clopidogrel, which may increase thrombotic cardiovascular event risk.",
    source: "US FDA Drug Safety Communication (2009 & 2011) / EMA"
  },
  {
    id: "int-ciprofloxacin-antacid",
    drugs: ["Ciprofloxacin", "Aluminum Hydroxide and Magnesium Hydroxide"],
    drugIds: ["cipro-500", "maalox-200"],
    severity: "Moderate",
    title: "Chelation and Impaired Fluoroquinolone Bioavailability",
    mechanism: "Divalent/trivalent cations chelate ciprofloxacin in the gastrointestinal lumen, reducing absorption by up to 90%, precipitating antimicrobial failure.",
    clinicalSummary: "Antacids containing magnesium or aluminum severely hinder ciprofloxacin absorption.",
    source: "FDA Cipro Prescribing Information / BNF 86 Section 5.1.12"
  }
];

const MANDATORY_NO_INTERACTION_MESSAGE =
  "No interaction record was found in the available dataset. This does not mean the combination is safe.";

function getAllInteractions() {
  return interactionsData;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    interactionsData,
    getAllInteractions,
    MANDATORY_NO_INTERACTION_MESSAGE
  };
}

if (typeof window !== "undefined") {
  window.NuskhaInteractions = {
    interactionsData,
    getAllInteractions,
    MANDATORY_NO_INTERACTION_MESSAGE
  };
}
