import test from "node:test";
import assert from "node:assert/strict";
import {
  summarizeCatalog,
  getViewModel,
  getTextPresentation,
  collectTopicArticles,
  collectLawArticles,
  groupLawResources,
  groupPracticeResources,
  groupOfficialStatementsByYear,
  groupOfficialStatementsByTopic,
  groupInternationalMaterialsByYear,
} from "../src/lib/render.js";

const laws = [
  { id: "cn-afsl-2021", jurisdiction: "China", languages: ["zh", "en"], type: "law" },
  { id: "eu-blocking-statute", jurisdiction: "European Union", languages: ["en"], type: "law" },
];
const topics = [{ id: "counter-sanctions", relatedLawIds: ["cn-afsl-2021"] }];
const officialPositionTopics = [{ id: "unilateral-sanctions-and-long-arm" }];
const internationalLawTopics = [{ id: "un-system-and-ucm" }];
const internationalDecisionTopics = [{ id: "sanctions-legality-and-proportionality" }];
const internationalIssueTopics = [{ id: "blocking-statutes-secondary-sanctions-and-extraterritoriality" }];
const internationalMaterials = [{ id: "un-charter-1945" }];
const internationalResearchReports = [{ id: "us-crs-if12390-2025" }];
const internationalDecisions = [{ id: "icj-alleged-violations-order-2018" }];
const officialStatements = [
  {
    id: "stmt-1",
    institution: "Ministry of Foreign Affairs",
    speaker: "Mao Ning",
    languages: ["zh", "en"],
    date: "2026-03-30",
    topics: ["反制裁", "日本"],
  },
  {
    id: "stmt-2",
    institution: "Ministry of Commerce",
    speaker: "MOFCOM Spokesperson",
    languages: ["zh", "en"],
    date: "2026-05-07",
    topics: ["经贸限制措施", "欧盟"],
  },
  {
    id: "stmt-3",
    institution: "Permanent Mission of China to the United Nations",
    speaker: "Fu Cong",
    languages: ["zh", "en"],
    date: "2025-06-16",
    topics: ["单边强制措施", "联合国"],
  },
];
const articles = [
  { id: "a1", relatedLawIds: ["cn-afsl-2021"], sourceKinds: ["scholar"] },
  { id: "a2", relatedLawIds: ["eu-blocking-statute"], sourceKinds: ["law-firm"] },
  {
    id: "a3",
    relatedLawIds: ["cn-afsl-2021", "eu-blocking-statute"],
    sourceKinds: ["case"],
    practiceTrack: "blocking-conflicts",
  },
  {
    id: "a4",
    relatedLawIds: ["cn-afsl-2021"],
    sourceKinds: ["arbitration"],
    practiceTrack: "arbitration-enforcement",
  },
  {
    id: "a5",
    relatedLawIds: ["cn-afsl-2021"],
    sourceKinds: ["case"],
    practiceTrack: "contract-disputes",
  },
];

test("summarizeCatalog counts jurisdictions and bilingual records", () => {
  const summary = summarizeCatalog(laws);
  assert.equal(summary.totalRecords, 2);
  assert.equal(summary.bilingualRecords, 1);
  assert.equal(summary.jurisdictionCount, 2);
});

test("getViewModel resolves a law detail route", () => {
  const view = getViewModel("#/laws/cn-afsl-2021", { laws });
  assert.equal(view.type, "law-detail");
  assert.equal(view.record.id, "cn-afsl-2021");
});

test("getViewModel resolves a topic detail route", () => {
  const view = getViewModel("#/topics/counter-sanctions", { laws, topics });
  assert.equal(view.type, "topic-detail");
  assert.equal(view.topic.id, "counter-sanctions");
});

test("getViewModel resolves an official statements list route", () => {
  const view = getViewModel("#/official-positions", { laws, topics, officialStatements });
  assert.equal(view.type, "official-list");
});

test("getViewModel resolves main section list routes", () => {
  assert.equal(getViewModel("#/china-laws", { laws, topics }).type, "china-law-list");
  assert.equal(getViewModel("#/foreign-laws", { laws, topics }).type, "foreign-law-list");
  assert.equal(getViewModel("#/cases", { laws, topics }).type, "case-list");
  assert.equal(getViewModel("#/analysis", { laws, topics }).type, "analysis-list");
  assert.equal(getViewModel("#/topics", { laws, topics }).type, "topic-list");
  assert.equal(getViewModel("#/timeline", { laws, topics }).type, "timeline-list");
});

test("getViewModel resolves an official statement detail route", () => {
  const view = getViewModel("#/official-positions/stmt-1", { laws, topics, officialStatements });
  assert.equal(view.type, "official-detail");
  assert.equal(view.record.id, "stmt-1");
});

test("getViewModel resolves an official fixed-topic detail route", () => {
  const view = getViewModel("#/official-positions/themes/unilateral-sanctions-and-long-arm", {
    laws,
    topics,
    officialStatements,
    officialPositionTopics,
  });
  assert.equal(view.type, "official-theme-detail");
  assert.equal(view.theme.id, "unilateral-sanctions-and-long-arm");
});

test("getViewModel resolves an international law archive list route", () => {
  const view = getViewModel("#/international-law", { laws, topics, officialStatements, internationalMaterials });
  assert.equal(view.type, "international-list");
});

test("getViewModel resolves an international law material detail route", () => {
  const view = getViewModel("#/international-law/un-charter-1945", {
    laws,
    topics,
    officialStatements,
    internationalMaterials,
  });
  assert.equal(view.type, "international-detail");
  assert.equal(view.record.id, "un-charter-1945");
});

test("getViewModel resolves an international law fixed-topic detail route", () => {
  const view = getViewModel("#/international-law/themes/un-system-and-ucm", {
    laws,
    topics,
    internationalMaterials,
    internationalLawTopics,
  });
  assert.equal(view.type, "international-theme-detail");
  assert.equal(view.theme.id, "un-system-and-ucm");
});

test("getViewModel resolves an international issue navigation list route", () => {
  const view = getViewModel("#/international-law/issues", {
    laws,
    topics,
    internationalMaterials,
  });
  assert.equal(view.type, "international-issue-list");
});

test("getViewModel resolves an international issue navigation detail route", () => {
  const view = getViewModel("#/international-law/issues/blocking-statutes-secondary-sanctions-and-extraterritoriality", {
    laws,
    topics,
    internationalMaterials,
    internationalIssueTopics,
  });
  assert.equal(view.type, "international-issue-detail");
  assert.equal(view.theme.id, "blocking-statutes-secondary-sanctions-and-extraterritoriality");
});

test("getViewModel resolves an international research reports list route", () => {
  const view = getViewModel("#/international-law/research", {
    laws,
    topics,
    internationalMaterials,
    internationalResearchReports,
  });
  assert.equal(view.type, "international-research-list");
});

test("getViewModel resolves an international research report detail route", () => {
  const view = getViewModel("#/international-law/research/us-crs-if12390-2025", {
    laws,
    topics,
    internationalMaterials,
    internationalResearchReports,
  });
  assert.equal(view.type, "international-research-detail");
  assert.equal(view.record.id, "us-crs-if12390-2025");
});

test("getViewModel resolves an international decisions list route", () => {
  const view = getViewModel("#/international-law/cases", {
    laws,
    topics,
    internationalMaterials,
    internationalDecisions,
  });
  assert.equal(view.type, "international-decision-list");
});

test("getViewModel resolves an international decision detail route", () => {
  const view = getViewModel("#/international-law/cases/icj-alleged-violations-order-2018", {
    laws,
    topics,
    internationalMaterials,
    internationalDecisions,
  });
  assert.equal(view.type, "international-decision-detail");
  assert.equal(view.record.id, "icj-alleged-violations-order-2018");
});

test("getViewModel resolves an international decision fixed-topic detail route", () => {
  const view = getViewModel("#/international-law/cases/themes/sanctions-legality-and-proportionality", {
    laws,
    topics,
    internationalDecisions,
    internationalDecisionTopics,
  });
  assert.equal(view.type, "international-decision-theme-detail");
  assert.equal(view.theme.id, "sanctions-legality-and-proportionality");
});

test("groupInternationalMaterialsByYear sorts years descending and keeps materials grouped", () => {
  const grouped = groupInternationalMaterialsByYear([
    { id: "m1", date: "2025-07-16" },
    { id: "m2", date: "2024-12-17" },
    { id: "m3", date: "2025-04-02" },
  ]);
  assert.deepEqual(grouped.map((entry) => entry.year), ["2025", "2024"]);
  assert.deepEqual(grouped[0].records.map((entry) => entry.id), ["m1", "m3"]);
});

test("getTextPresentation renders China laws in bilingual mode", () => {
  assert.equal(getTextPresentation({ jurisdiction: "China", languages: ["zh", "en"] }), "bilingual");
  assert.equal(getTextPresentation({ jurisdiction: "Canada", languages: ["en"] }), "single");
});

test("collectTopicArticles deduplicates and filters by related laws", () => {
  const related = collectTopicArticles(topics[0], articles);
  assert.deepEqual(
    related.map((article) => article.id),
    ["a1", "a3", "a4", "a5"],
  );
});

test("collectLawArticles resolves reverse-linked resources for a law detail page", () => {
  const related = collectLawArticles(laws[0], articles);
  assert.deepEqual(
    related.map((article) => article.id),
    ["a1", "a3", "a4", "a5"],
  );
});

test("groupLawResources separates scholar, practitioner, and practice materials", () => {
  const grouped = groupLawResources(articles);
  assert.deepEqual(grouped.scholar.map((item) => item.id), ["a1"]);
  assert.deepEqual(grouped.practitioner.map((item) => item.id), ["a2"]);
  assert.deepEqual(grouped.practice.map((item) => item.id), ["a3", "a4", "a5"]);
});

test("groupPracticeResources separates practice materials by dispute track", () => {
  const grouped = groupPracticeResources(articles.filter((item) => item.sourceKinds.some((kind) => kind !== "scholar" && kind !== "law-firm")));
  assert.deepEqual(grouped.contractDisputes.map((item) => item.id), ["a5"]);
  assert.deepEqual(grouped.blockingConflicts.map((item) => item.id), ["a3"]);
  assert.deepEqual(grouped.arbitrationEnforcement.map((item) => item.id), ["a4"]);
});

test("groupOfficialStatementsByYear sorts years descending and keeps statements grouped", () => {
  const grouped = groupOfficialStatementsByYear(officialStatements);
  assert.deepEqual(grouped.map((entry) => entry.year), ["2026", "2025"]);
  assert.deepEqual(grouped[0].records.map((entry) => entry.id), ["stmt-2", "stmt-1"]);
});

test("groupOfficialStatementsByTopic aggregates topics by count", () => {
  const grouped = groupOfficialStatementsByTopic(officialStatements);
  const counterSanctions = grouped.find((entry) => entry.topic === "反制裁");
  assert.equal(counterSanctions?.count, 1);
  assert.equal(grouped.some((entry) => entry.topic === "联合国"), true);
});
