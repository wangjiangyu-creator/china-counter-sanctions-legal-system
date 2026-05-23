import test from "node:test";
import assert from "node:assert/strict";
import { buildCatalogIndex, filterCatalog, uniqueValues } from "../src/lib/catalog.js";

const records = [
  {
    id: "cn-afsl-2021",
    titleZh: "中华人民共和国反外国制裁法",
    titleEn: "Law of the PRC on Countering Foreign Sanctions",
    jurisdiction: "China",
    topics: ["反制裁", "中国"],
    languages: ["zh", "en"],
    type: "law",
  },
  {
    id: "stmt-1",
    titleZh: "毛宁就对加拿大有关机构及人员采取反制措施答问",
    titleEn: "Mao Ning on Countermeasures Against Certain Canadian Institutions and Personnel",
    jurisdiction: "China",
    topics: ["反制裁"],
    institutionZh: "外交部",
    institutionEn: "Ministry of Foreign Affairs",
    speakerZh: "毛宁",
    speakerEn: "Mao Ning",
    venueZh: "例行记者会",
    venueEn: "Regular Press Conference",
    languages: ["zh", "en"],
    type: "official-statement",
  },
];

test("buildCatalogIndex normalizes multilingual search fields", () => {
  const index = buildCatalogIndex(records);
  assert.equal(index[0].searchText.includes("countering foreign sanctions"), true);
  assert.equal(index[0].searchText.includes("反外国制裁法"), true);
  assert.equal(index[1].searchText.includes("mao ning"), true);
  assert.equal(index[1].searchText.includes("regular press conference"), true);
});

test("filterCatalog filters by query, jurisdiction and language", () => {
  const index = buildCatalogIndex(records);
  const filtered = filterCatalog(index, {
    query: "mao ning",
    jurisdiction: "China",
    language: "en",
    type: "official-statement",
  });

  assert.deepEqual(filtered.map((record) => record.id), ["stmt-1"]);
});

test("uniqueValues returns a sorted set of field values", () => {
  const values = uniqueValues(records, "jurisdiction");
  assert.deepEqual(values, ["China"]);
});
