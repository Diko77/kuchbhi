/**
 * Unit Tests: Stage 4 Generic Medicine Matcher & Comparison Engine
 */

const assert = require("assert");
const { searchAndCompareGenerics, isIngredientEquivalent, normalizeStrength, PRICE_TRANSPARENCY_NOTICE, MEDICAL_SUBSTITUTION_NOTICE } = require("../public/js/core/genericMatcher");
const { getAllMedicines } = require("../public/js/data/medicines");

function runGenericMatcherTests() {
  const suite = "Stage 4 Generic Medicine Matcher";
  const results = [];

  function test(name, fn) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err.message });
    }
  }

  // Test 1: Search by Brand Name ("Amoxil")
  test("searches by brand name 'Amoxil' and retrieves verified generic equivalent", () => {
    const res = searchAndCompareGenerics("Amoxil");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.originalBrand.brandName, "Amoxil");
    assert.strictEqual(res.originalBrand.genericName, "Amoxicillin");
    assert(res.totalResults >= 2);

    const verifiedGen = res.comparisons.find(c => c.verifiedInterchangeable);
    assert(verifiedGen, "Must have an AB-rated generic equivalent");
    assert.strictEqual(verifiedGen.teCode, "AB");
    assert.strictEqual(verifiedGen.criteria.ingredientMatch.matched, true);
    assert.strictEqual(verifiedGen.criteria.strengthMatch.matched, true);
    assert.strictEqual(verifiedGen.criteria.formMatch.matched, true);
  });

  // Test 2: Search by Active Ingredient ("Metformin")
  test("searches by active ingredient 'Metformin' and links to Glucophage", () => {
    const res = searchAndCompareGenerics("Metformin");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.originalBrand.brandName, "Glucophage");
    assert(res.originalBrand.activeIngredient.includes("Metformin"));
    assert(res.totalResults >= 1);
  });

  // Test 3: Strength Mismatch Detection (Panadol 500 mg vs Tylenol 650 mg)
  test("identifies strength difference between Panadol 500mg and 650mg alternatives", () => {
    const res = searchAndCompareGenerics("Panadol");
    assert.strictEqual(res.success, true);

    const strengthDiff = res.comparisons.find(c => c.strength.includes("650"));
    assert(strengthDiff, "Should find the 650 mg product for comparison");
    assert.strictEqual(strengthDiff.verifiedInterchangeable, false);
    assert.strictEqual(strengthDiff.criteria.strengthMatch.matched, false);
    assert(strengthDiff.criteria.strengthMatch.label.includes("Strength Mismatch"));
  });

  // Test 4: Dosage Form / Release Profile Mismatch (Glucophage IR vs Glucophage XR)
  test("distinguishes Immediate Release (IR) from Extended Release (XR) Metformin", () => {
    const res = searchAndCompareGenerics("Glucophage");
    const xrAlt = res.comparisons.find(c => c.releaseType.includes("XR") || c.releaseType.includes("Extended"));
    assert(xrAlt, "Should find XR alternative for Glucophage");
    assert.strictEqual(xrAlt.verifiedInterchangeable, false);
    assert.strictEqual(xrAlt.criteria.formMatch.matched, false);
    assert(xrAlt.notes.includes("PHARMACOKINETIC PROFILE DIFFERENCE") || xrAlt.notes.includes("XR"));
  });

  // Test 5: Formulation Difference in Aspirin (Disprin Soluble vs Ecosprin Enteric-coated)
  test("identifies formulation difference between soluble aspirin and enteric-coated aspirin", () => {
    const res = searchAndCompareGenerics("Disprin");
    const enteric = res.comparisons.find(c => c.productName.includes("Ecosprin") || c.dosageForm.includes("Enteric"));
    assert(enteric, "Should find enteric-coated aspirin");
    assert.strictEqual(enteric.verifiedInterchangeable, false);
    assert(enteric.notes.includes("FORMULATION DIFFERENCE") || enteric.notes.includes("enteric"));
  });

  // Test 6: Narrow Therapeutic Index (NTI) Warning for Warfarin
  test("includes clinical caution for Narrow Therapeutic Index (NTI) drug Coumadin", () => {
    const res = searchAndCompareGenerics("Coumadin");
    assert.strictEqual(res.success, true);
    assert(res.originalBrand.rldStatus.includes("NARROW THERAPEUTIC INDEX") || res.originalBrand.rldStatus.includes("NTI"));

    const jantoven = res.comparisons.find(c => c.productName.includes("Jantoven"));
    assert(jantoven);
    assert(jantoven.notes.includes("NTI") || jantoven.notes.includes("INR"));
  });

  // Test 7: Unknown / Missing Medicine Search Handling
  test("returns clear, honest message when medicine is not in dataset", () => {
    const res = searchAndCompareGenerics("NonExistentDrug999");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.totalResults, 0);
    assert(res.message.includes("No reliable medicine record or generic match was found"));
  });

  // Test 8: Empty Query Handling
  test("handles empty query safely", () => {
    const res = searchAndCompareGenerics("   ");
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, "EMPTY_QUERY");
  });

  // Test 9: Honest Price Transparency Policy
  test("never invents commercial prices and includes transparent pricing notice", () => {
    const res = searchAndCompareGenerics("Amoxil");
    assert(res.priceNotice.includes("Price & Cost Transparency Notice"));
    assert(res.priceNotice.includes("Nuskha AI does not estimate, predict, or invent commercial prices"));

    for (const comp of res.comparisons) {
      assert.strictEqual(comp.priceData.available, false);
      assert(!comp.priceData.priceString.includes("$"));
    }
  });

  // Test 10: Medical Safety & Substitution Disclaimer
  test("displays comprehensive clinical substitution safety disclaimer", () => {
    const res = searchAndCompareGenerics("Amoxil");
    assert(res.safetyNotice.includes("Medical & Bioequivalence Safety Notice"));
    assert(res.safetyNotice.includes("An identical or similar active ingredient does NOT automatically establish that two pharmaceutical products are clinically interchangeable"));
    assert(res.safetyNotice.includes("Never switch, initiate, or discontinue any medication without explicit authorization"));
  });

  return { suite, results };
}

module.exports = { runGenericMatcherTests };
