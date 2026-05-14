function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function buildCatalogIndex(records) {
  return records.map((record) => ({
    ...record,
    searchText: normalize(
      [
        record.titleZh,
        record.titleEn,
        record.shortTitle,
        record.jurisdiction,
        record.documentType,
        record.summary,
        ...(record.topics ?? []),
      ].join(" "),
    ),
  }));
}

export function filterCatalog(records, filters = {}) {
  const query = normalize(filters.query);

  return records.filter((record) => {
    if (filters.jurisdiction && record.jurisdiction !== filters.jurisdiction) return false;
    if (filters.language && !(record.languages ?? []).includes(filters.language)) return false;
    if (filters.type && record.type !== filters.type) return false;
    if (query && !record.searchText.includes(query)) return false;
    return true;
  });
}

export function uniqueValues(records, fieldName) {
  return [...new Set(records.map((record) => record[fieldName]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), "zh-Hans-CN"),
  );
}
