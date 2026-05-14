function requireField(record, fieldName) {
  if (
    record[fieldName] === undefined ||
    record[fieldName] === null ||
    record[fieldName] === "" ||
    (Array.isArray(record[fieldName]) && record[fieldName].length === 0)
  ) {
    throw new Error(`Missing required field: ${fieldName}`);
  }
}

export function validateLawRecord(record) {
  [
    "id",
    "titleZh",
    "jurisdiction",
    "documentType",
    "status",
    "languages",
    "sources",
    "summary",
  ].forEach((fieldName) => requireField(record, fieldName));
}

export function validateArticleRecord(record) {
  ["id", "title", "authors", "publisher", "year", "accessMode", "sourceUrl", "sourceKinds"].forEach(
    (fieldName) => requireField(record, fieldName),
  );
}

export function validateOfficialStatementRecord(record) {
  [
    "id",
    "titleZh",
    "titleEn",
    "jurisdiction",
    "institutionEn",
    "speakerEn",
    "venueEn",
    "date",
    "languages",
    "sources",
    "summary",
    "relatedLawIds",
  ].forEach((fieldName) => requireField(record, fieldName));
}

export function validateInternationalMaterialRecord(record) {
  [
    "id",
    "titleZh",
    "titleEn",
    "jurisdiction",
    "documentType",
    "bodyEn",
    "date",
    "languages",
    "sources",
    "summary",
    "texts",
  ].forEach((fieldName) => requireField(record, fieldName));
}

export function validateInternationalResearchReportRecord(record) {
  [
    "id",
    "titleZh",
    "titleEn",
    "jurisdiction",
    "institutionEn",
    "institutionType",
    "documentType",
    "date",
    "languages",
    "sources",
    "summary",
    "texts",
  ].forEach((fieldName) => requireField(record, fieldName));
}

export function validateInternationalDecisionRecord(record) {
  [
    "id",
    "titleZh",
    "titleEn",
    "jurisdiction",
    "forumEn",
    "decisionType",
    "date",
    "languages",
    "sources",
    "summary",
    "texts",
  ].forEach((fieldName) => requireField(record, fieldName));
}
