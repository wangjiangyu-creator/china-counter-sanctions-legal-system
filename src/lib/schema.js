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
