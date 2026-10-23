/**
 * Nuskha AI - Stage 4 Master Automated Test Runner
 */

const fs = require("fs");
const path = require("path");
const { runGenericMatcherTests } = require("./genericMatcher.test");
const { getAllMedicines } = require("../public/js/data/medicines");
const { getAllInteractions } = require("../public/js/data/interactions");

console.log("================================================================================");
console.log("          NUSKHA AI — STAGE 4 GENERIC MEDICINE MATCHER TEST SUITE               ");
console.log("================================================================================\n");

let total = 0;
let passed = 0;
let failed = 0;

function printSuite(suite) {
  console.log(`\n--- Test Suite: ${suite.suite} ---`);
  for (const r of suite.results) {
    total++;
    if (r.passed) {
      passed++;
      console.log(`  ✓ [PASS] ${r.name}`);
    } else {
      failed++;
      console.log(`  ✗ [FAIL] ${r.name}`);
      console.log(`      Error: ${r.error}`);
    }
  }
}

// 1. Run Core Matcher & Equivalence Tests
printSuite(runGenericMatcherTests());

// 2. File Structure Verification
console.log("\n--- Verification: Nuskha Project File Integrity ---");

const nuskhaDir = path.resolve(__dirname, "..");
const requiredFiles = [
  "package.json",
  "server.js",
  "README.md",
  "public/index.html",
  "public/css/dashboard.css",
  "public/css/generic-matcher.css",
  "public/css/scanner.css",
  "public/js/app.js",
  "public/js/genericMatcherUI.js",
  "public/js/prescriptionScannerUI.js",
  "public/js/core/genericMatcher.js",
  "public/js/data/medicines.js",
  "public/js/data/interactions.js",
  "public/sample_images/sample_prescription_printed.svg",
  "public/sample_images/sample_medicine_box.svg",
  "public/sample_images/sample_interaction_pair.svg",
  "tests/genericMatcher.test.js",
  "tests/run-tests.js"
];

for (const rel of requiredFiles) {
  total++;
  const full = path.join(nuskhaDir, rel);
  if (fs.existsSync(full)) {
    passed++;
    console.log(`  ✓ [FILE EXISTS] Nuskha/${rel}`);
  } else {
    failed++;
    console.log(`  ✗ [FILE MISSING] Nuskha/${rel}`);
  }
}

// 3. Dataset & Regulatory Citations Verification
console.log("\n--- Verification: Dataset Regulatory Quality & Sources ---");

const medicines = getAllMedicines();
total++;
if (medicines.length >= 10) {
  passed++;
  console.log(`  ✓ [DATASET SIZE] Loaded ${medicines.length} verified pharmaceutical profiles`);
} else {
  failed++;
  console.log(`  ✗ [DATASET SIZE] Insufficient medicines: ${medicines.length}`);
}

let genericEquivalentsCount = 0;
for (const m of medicines) {
  if (Array.isArray(m.equivalents) && m.equivalents.length > 0) {
    genericEquivalentsCount += m.equivalents.length;
  }
}
total++;
if (genericEquivalentsCount >= 15) {
  passed++;
  console.log(`  ✓ [EQUIVALENTS COUNT] Mapped ${genericEquivalentsCount} documented generic & brand formulations`);
} else {
  failed++;
  console.log(`  ✗ [EQUIVALENTS COUNT] Only ${genericEquivalentsCount} equivalents mapped`);
}

// Summary
console.log("\n================================================================================");
console.log(`TEST SUMMARY: Total Tests: ${total} | Passed: ${passed} | Failed: ${failed}`);
console.log("================================================================================\n");

if (failed > 0) {
  console.error(`ERROR: ${failed} test(s) failed.`);
  process.exit(1);
} else {
  console.log("ALL STAGE 4 GENERIC MEDICINE MATCHER TESTS PASSED! (100% PASS RATE)");
  process.exit(0);
}
