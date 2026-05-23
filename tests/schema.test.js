import test from "node:test";
import assert from "node:assert/strict";
import {
  validateLawRecord,
  validateArticleRecord,
  validateOfficialStatementRecord,
  validateInternationalMaterialRecord,
  validateInternationalDecisionRecord,
  validateInternationalResearchReportRecord,
} from "../src/lib/schema.js";
import { laws } from "../src/data/laws.js";
import { articles } from "../src/data/articles.js";
import { officialStatements } from "../src/data/officialStatements.js";
import { internationalMaterials } from "../src/data/internationalMaterials.js";
import { internationalDecisions } from "../src/data/internationalDecisions.js";
import { internationalResearchReports } from "../src/data/internationalResearchReports.js";

test("all seed law records satisfy the required schema", () => {
  laws.forEach((record) => assert.doesNotThrow(() => validateLawRecord(record)));
});

test("all article records declare copyright handling", () => {
  articles.forEach((record) => {
    assert.doesNotThrow(() => validateArticleRecord(record));
    assert.ok(["full", "summary", "index"].includes(record.accessMode));
  });
});

test("all official statement records satisfy the required schema", () => {
  officialStatements.forEach((record) => assert.doesNotThrow(() => validateOfficialStatementRecord(record)));
});

test("all international law material records satisfy the required schema", () => {
  internationalMaterials.forEach((record) => assert.doesNotThrow(() => validateInternationalMaterialRecord(record)));
});

test("all international research report records satisfy the required schema", () => {
  internationalResearchReports.forEach((record) =>
    assert.doesNotThrow(() => validateInternationalResearchReportRecord(record)),
  );
});

test("all international decision records satisfy the required schema", () => {
  internationalDecisions.forEach((record) => assert.doesNotThrow(() => validateInternationalDecisionRecord(record)));
});
