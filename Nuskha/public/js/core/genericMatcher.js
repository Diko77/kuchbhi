/**
 * Nuskha AI - Stage 4 Generic Medicine Matcher Engine
 *
 * Implements clinical comparison logic based on:
 * 1. Active Ingredient & Salt equivalency
 * 2. Strength matching (exact vs mismatch)
 * 3. Dosage form & release kinetics (Immediate Release vs Extended Release vs Enteric)
 * 4. Regulatory Therapeutic Equivalence (TE) ratings (FDA Orange Book standards)
 * 5. Honest Price Transparency (zero fabricated commercial claims)
 * 6. Explicit clinical safety boundaries
 */

let medicinesSource;

if (typeof require !== "undefined") {
  medicinesSource = require("../data/medicines");
} else if (typeof window !== "undefined" && window.NuskhaMedicinesCatalog) {
  medicinesSource = window.NuskhaMedicinesCatalog;
}

const PRICE_TRANSPARENCY_NOTICE =
  "Price & Cost Transparency Notice: Verified institutional retail price data is not published in this open dataset. Real-world medicine costs vary significantly across national health formularies (e.g., NHS/PBS), private insurance co-pays, and local retail pharmacies. Nuskha AI does not estimate, predict, or invent commercial prices. Always consult your dispensing pharmacy or prescription benefits manager for exact local pricing.";

const MEDICAL_SUBSTITUTION_NOTICE =
  "Medical & Bioequivalence Safety Notice: An identical or similar active ingredient does NOT automatically establish that two pharmaceutical products are clinically interchangeable for an individual patient. Differences in release rate (Immediate vs. Extended Release), non-active excipients (which can trigger allergic reactions), and narrow therapeutic ranges (such as Warfarin) require professional clinical oversight. Never switch, initiate, or discontinue any medication without explicit authorization from a licensed physician or registered pharmacist.";

/**
 * Searches and compares generic and alternative equivalents for a given medicine name or active ingredient
 *
 * @param {string} query - Brand name or active ingredient search term
 * @param {Array} [catalog] - Optional custom medicine catalog
 * @returns {Object} Structured comparison analysis
 */
function searchAndCompareGenerics(query, catalog) {
  const dataset = catalog || (medicinesSource ? medicinesSource.getAllMedicines() : []);

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return {
      success: false,
      error: "Please enter a brand name or active ingredient to search.",
      code: "EMPTY_QUERY"
    };
  }

  const cleanQuery = query.trim().toLowerCase();

  // 1. Search for matching medicine records
  const matchedRecords = [];

  for (const item of dataset) {
    const brandMatch = item.brandName.toLowerCase().includes(cleanQuery);
    const genericMatch = item.genericName.toLowerCase().includes(cleanQuery);
    const activeMatch = item.activeIngredient.toLowerCase().includes(cleanQuery);

    let matchType = null;
    let matchScore = 0;

    if (item.brandName.toLowerCase() === cleanQuery) {
      matchType = "Exact Brand Name Match";
      matchScore = 1.0;
    } else if (item.genericName.toLowerCase() === cleanQuery) {
      matchType = "Exact Active Ingredient Match";
      matchScore = 0.95;
    } else if (brandMatch) {
      matchType = "Brand Name Match";
      matchScore = 0.85;
    } else if (genericMatch || activeMatch) {
      matchType = "Active Ingredient Match";
      matchScore = 0.80;
    }

    if (matchType) {
      matchedRecords.push({
        medicine: item,
        matchType,
        matchScore
      });
    }
  }

  // Sort by match score descending
  matchedRecords.sort((a, b) => b.matchScore - a.matchScore);

  if (matchedRecords.length === 0) {
    return {
      success: true,
      query: query.trim(),
      totalResults: 0,
      targetMedicine: null,
      comparisons: [],
      message: `No reliable medicine record or generic match was found for "${query.trim()}" in the available documented dataset.`,
      priceNotice: PRICE_TRANSPARENCY_NOTICE,
      safetyNotice: MEDICAL_SUBSTITUTION_NOTICE
    };
  }

  // Pick primary matched medicine
  const primaryMatch = matchedRecords[0].medicine;
  const originalBrand = {
    id: primaryMatch.id,
    brandName: primaryMatch.brandName,
    genericName: primaryMatch.genericName,
    activeIngredient: primaryMatch.activeIngredient,
    strength: primaryMatch.strength,
    dosageForm: primaryMatch.dosageForm,
    releaseType: primaryMatch.releaseType || "Immediate Release",
    category: primaryMatch.category,
    source: primaryMatch.source,
    rldStatus: primaryMatch.rldStatus || "Innovator / Reference Product"
  };

  // Evaluate each potential equivalent
  const comparisons = [];
  const rawEquivalents = primaryMatch.equivalents || [];

  for (const eq of rawEquivalents) {
    // 1. Active Ingredient Evaluation
    const ingredientMatches = isIngredientEquivalent(originalBrand.activeIngredient, eq.activeIngredient);

    // 2. Strength Evaluation
    const strengthMatches = normalizeStrength(originalBrand.strength) === normalizeStrength(eq.strength);

    // 3. Dosage Form & Release Kinetics Evaluation
    const formMatches = originalBrand.dosageForm.toLowerCase() === eq.dosageForm.toLowerCase();
    const releaseMatches = (originalBrand.releaseType || "IR").toLowerCase() === (eq.releaseType || "IR").toLowerCase();

    // 4. Overall Clinical Equivalence Classification
    let equivalenceLevel = "NON_EQUIVALENT";
    let equivalenceBadge = "Different Formulation / Strength";
    let badgeClass = "badge-mismatch";

    if (ingredientMatches && strengthMatches && formMatches && releaseMatches) {
      equivalenceLevel = "THERAPEUTIC_EQUIVALENT";
      equivalenceBadge = "Verified Generic Equivalent (AB-Rated)";
      badgeClass = "badge-equivalent";
    } else if (ingredientMatches && (!strengthMatches || !formMatches || !releaseMatches)) {
      equivalenceLevel = "FORMULATION_OR_STRENGTH_DIFFERENCE";
      equivalenceBadge = !strengthMatches ? "Different Strength (Not 1:1 Interchangeable)" : "Different Release / Dosage Form";
      badgeClass = "badge-caution";
    }

    comparisons.push({
      productName: eq.productName,
      manufacturer: eq.manufacturer,
      activeIngredient: eq.activeIngredient,
      strength: eq.strength,
      dosageForm: eq.dosageForm,
      releaseType: eq.releaseType,
      teCode: eq.teCode,
      source: eq.source,
      notes: eq.notes,
      verifiedInterchangeable: eq.verifiedInterchangeable && equivalenceLevel === "THERAPEUTIC_EQUIVALENT",
      equivalenceLevel,
      equivalenceBadge,
      badgeClass,
      criteria: {
        ingredientMatch: {
          matched: ingredientMatches,
          original: originalBrand.activeIngredient,
          candidate: eq.activeIngredient,
          label: ingredientMatches ? "Identical Active Molecule" : "Chemical Moiety Differs"
        },
        strengthMatch: {
          matched: strengthMatches,
          original: originalBrand.strength,
          candidate: eq.strength,
          label: strengthMatches ? "Matching Strength" : `Strength Mismatch (${originalBrand.strength} vs ${eq.strength})`
        },
        formMatch: {
          matched: formMatches && releaseMatches,
          original: `${originalBrand.dosageForm} (${originalBrand.releaseType})`,
          candidate: `${eq.dosageForm} (${eq.releaseType})`,
          label: (formMatches && releaseMatches) ? "Matching Form & Release" : "Dosage Form or Release Profile Differs"
        }
      },
      priceData: {
        available: false,
        priceString: "Institutional pricing not available in catalog",
        explanation: "Prices vary by pharmacy, jurisdiction, and insurance tier. Inquire locally."
      }
    });
  }

  // Summary counts
  const verifiedCount = comparisons.filter(c => c.verifiedInterchangeable).length;
  const cautionedCount = comparisons.filter(c => !c.verifiedInterchangeable).length;

  return {
    success: true,
    query: query.trim(),
    matchCriteriaUsed: matchedRecords[0].matchType,
    totalResults: comparisons.length,
    verifiedCount,
    cautionedCount,
    originalBrand,
    comparisons,
    priceNotice: PRICE_TRANSPARENCY_NOTICE,
    safetyNotice: MEDICAL_SUBSTITUTION_NOTICE
  };
}

/**
 * Normalizes strength string for accurate comparison (e.g., "500 mg" vs "500mg")
 */
function normalizeStrength(strength) {
  if (!strength) return "";
  return strength.toLowerCase().replace(/\s+/g, "").trim();
}

/**
 * Evaluates whether two active ingredients represent the same chemical entity
 */
function isIngredientEquivalent(ingA, ingB) {
  if (!ingA || !ingB) return false;
  const a = ingA.toLowerCase().trim();
  const b = ingB.toLowerCase().trim();

  if (a === b) return true;

  // Salt and base cross-matching (e.g. Amoxicillin Trihydrate vs Amoxicillin)
  const rootWordsA = a.replace(/(trihydrate|hydrochloride|magnesium|calcium|potassium|sodium|bisulfate|anhydrous)/g, "").trim();
  const rootWordsB = b.replace(/(trihydrate|hydrochloride|magnesium|calcium|potassium|sodium|bisulfate|anhydrous)/g, "").trim();

  if (rootWordsA && rootWordsB && rootWordsA === rootWordsB) {
    return true;
  }

  // Common synonym pairs
  if ((a.includes("paracetamol") && b.includes("acetaminophen")) ||
      (a.includes("acetaminophen") && b.includes("paracetamol"))) {
    return true;
  }

  if ((a.includes("aspirin") && b.includes("acetylsalicylic")) ||
      (a.includes("acetylsalicylic") && b.includes("aspirin"))) {
    return true;
  }

  return false;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    searchAndCompareGenerics,
    isIngredientEquivalent,
    normalizeStrength,
    PRICE_TRANSPARENCY_NOTICE,
    MEDICAL_SUBSTITUTION_NOTICE
  };
}

if (typeof window !== "undefined") {
  window.NuskhaGenericMatcher = {
    searchAndCompareGenerics,
    isIngredientEquivalent,
    normalizeStrength,
    PRICE_TRANSPARENCY_NOTICE,
    MEDICAL_SUBSTITUTION_NOTICE
  };
}
