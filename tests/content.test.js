import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { laws } from "../src/data/laws.js";
import { articles } from "../src/data/articles.js";
import { officialStatements } from "../src/data/officialStatements.js";
import { officialPositionTopics } from "../src/data/officialPositionTopics.js";
import { internationalMaterials } from "../src/data/internationalMaterials.js";
import { internationalDecisions } from "../src/data/internationalDecisions.js";
import { internationalDecisionTopics } from "../src/data/internationalDecisionTopics.js";
import { internationalIssueTopics } from "../src/data/internationalIssueTopics.js";
import { internationalLawTopics } from "../src/data/internationalLawTopics.js";
import { internationalResearchReports } from "../src/data/internationalResearchReports.js";
import { topics } from "../src/data/topics.js";

test("seed content includes China and at least three non-China jurisdictions", () => {
  const jurisdictions = new Set(laws.map((record) => record.jurisdiction));
  assert.equal(jurisdictions.has("China"), true);
  assert.equal([...jurisdictions].filter((name) => name !== "China").length >= 3, true);
});

test("every law record has at least one source and one related article or topic", () => {
  laws.forEach((record) => {
    assert.equal(record.sources.length > 0, true);
    assert.equal((record.relatedArticleIds?.length ?? 0) > 0 || (record.topics?.length ?? 0) > 0, true);
  });
});

test("article index includes both scholar and practitioner materials", () => {
  const tags = new Set(articles.flatMap((record) => record.sourceKinds));
  assert.equal(tags.has("scholar"), true);
  assert.equal(tags.has("law-firm"), true);
});

test("article index includes recent law journal and law review sanctions scholarship", () => {
  const articleIds = new Set(articles.map((record) => record.id));
  [
    "chachko-heath-2022-watershed-sanctions",
    "barber-2021-ga-unilateral-sanctions",
    "schmidt-2022-extraterritorial-sanctions",
    "yee-2021-unilateral-sanctions-long-arm",
    "abely-anderson-2026-currency-jurisdiction",
    "chen-2022-economic-sanctions-counter-sanctions",
    "huo-chen-2023-court-civil-disputes-counter-sanctions",
    "zhang-hui-2022-legality-unilateral-sanctions",
    "liu-guiqiang-2022-blocking-statutes-value",
    "huo-2026-three-anti-system",
    "yalejil-2024-twail-economic-sanctions",
    "hemler-2025-deconstructing-blocking-statutes",
    "hofer-2025-third-party-countermeasures",
    "franchini-2025-central-bank-sanctions",
    "bakos-2025-eu-blocking-statute-investment-arbitration",
    "du-hu-2025-central-bank-property-immunity",
  ].forEach((id) => assert.equal(articleIds.has(id), true, `${id} should be present`));

  const recentJournalItems = articles.filter(
    (record) =>
      record.year >= 2021 &&
      (record.sourceKinds ?? []).some((kind) => ["law-journal", "law-review"].includes(kind)),
  );
  assert.equal(recentJournalItems.length >= 28, true);
});

test("article index includes newly requested Chinese scholars on sanctions and counter-sanctions", () => {
  const requestedAuthors = ["廖诗评", "霍政欣", "杜涛", "杜焕芳", "蔡从燕"];
  requestedAuthors.forEach((author) => {
    assert.equal(
      articles.some((record) => (record.authors ?? []).includes(author)),
      true,
      `${author} should be represented in the analysis index`,
    );
  });
});

test("article index includes sanctions theory and economic statecraft foundations", () => {
  const articleIds = new Set(articles.map((record) => record.id));
  [
    "baldwin-1971-positive-sanctions",
    "galtung-1967-effects-economic-sanctions",
    "barber-1979-sanctions-policy-instrument",
    "lindsay-1986-trade-sanctions-policy-instruments",
    "pape-1997-why-sanctions-do-not-work",
    "kirshner-1997-microfoundations-economic-sanctions",
    "drezner-1998-conflict-expectations-economic-coercion",
    "drezner-2003-hidden-hand-economic-coercion",
    "farrell-newman-2019-weaponized-interdependence",
    "hofer-2017-ucm-developed-developing-divide",
    "tzanakopoulos-2019-targeted-sanctions-state-responsibility",
    "douhan-2021-ucm-notion-qualification",
  ].forEach((id) => assert.equal(articleIds.has(id), true, `${id} should be present`));

  const theoryItems = articles.filter((record) => (record.sourceKinds ?? []).includes("theory"));
  assert.equal(theoryItems.length >= 15, true);
});

test("article index includes expanded sanctions datasets, UN practice, and China economic coercion literature", () => {
  const articleIds = new Set(articles.map((record) => record.id));
  [
    "early-2009-sanctions-busting-trade",
    "felbermayr-2020-global-sanctions-data-base",
    "biersteker-eckert-tourinho-2016-targeted-sanctions",
    "biersteker-eckert-tourinho-hudakova-2018-un-targeted-sanctions-datasets",
    "van-den-herik-2017-research-handbook-un-sanctions",
    "gowlland-debbas-2001-un-sanctions-international-law",
    "haass-1998-economic-sanctions-american-diplomacy",
    "gordon-2010-invisible-war-iraq-sanctions",
    "norris-2016-chinese-economic-statecraft",
    "norris-2021-china-post-cold-war-economic-statecraft",
    "lim-ferguson-2022-informal-economic-sanctions-thaad",
    "xiong-2025-china-dilemma-sanctions-economic-coercion",
    "ferguson-2025-china-russia-implementation-economic-sanctions",
    "farrell-newman-2023-underground-empire",
    "fishman-2025-chokepoints-economic-warfare",
  ].forEach((id) => assert.equal(articleIds.has(id), true, `${id} should be present`));

  const chinaCoercionItems = articles.filter((record) =>
    (record.sourceKinds ?? []).includes("china-economic-coercion"),
  );
  assert.equal(chinaCoercionItems.length >= 5, true);
});

test("fourth-round resources include both court cases and arbitration materials", () => {
  const tags = new Set(articles.flatMap((record) => record.sourceKinds));
  assert.equal(tags.has("case"), true);
  assert.equal(tags.has("arbitration"), true);
});

test("fifth-round practice materials cover all three dispute tracks", () => {
  const tracks = new Set(
    articles
      .filter((record) => (record.sourceKinds ?? []).some((kind) => ["case", "arbitration"].includes(kind)))
      .map((record) => record.practiceTrack),
  );
  ["contract-disputes", "blocking-conflicts", "arbitration-enforcement"].forEach((track) => {
    assert.equal(tracks.has(track), true, `${track} should be present`);
  });
});

test("china coverage includes the core counter-sanctions and anti-extraterritoriality instruments", () => {
  const chinaIds = new Set(laws.filter((record) => record.jurisdiction === "China").map((record) => record.id));
  const requiredIds = [
    "cn-foreign-relations-law-2023",
    "cn-afsl-2021",
    "cn-blocking-rules-2021",
    "cn-afsl-implementation-2025",
    "cn-extraterritorial-jurisdiction-2026",
    "cn-unreliable-entity-list-2020",
    "cn-export-control-law-2020",
    "cn-data-security-law-2021",
    "cn-national-security-law-2015",
    "cn-cybersecurity-law-2016",
    "cn-foreign-trade-law-2025",
    "cn-foreign-investment-law-2019",
    "cn-dual-use-export-control-regulation-2024",
    "cn-foreign-state-immunity-law-2023",
    "cn-supply-chain-security-regulation-2026",
    "cn-mofcom-blocking-order-2026-21",
    "cn-pipl-2021",
    "cn-international-criminal-judicial-assistance-law-2018",
    "cn-spc-foreign-related-civil-commercial-jurisdiction-2022",
    "cn-outbound-investment-regulation-2026",
  ];

  requiredIds.forEach((id) => assert.equal(chinaIds.has(id), true, `${id} should be present`));
  assert.equal(chinaIds.size >= 12, true);
});

test("every China law record ships with both Chinese and English text panels", () => {
  const chinaLaws = laws.filter((record) => record.jurisdiction === "China");
  chinaLaws.forEach((record) => {
    assert.equal(record.languages.includes("zh"), true, `${record.id} should include zh`);
    assert.equal(record.languages.includes("en"), true, `${record.id} should include en`);
    assert.equal((record.texts.zh?.sections?.length ?? 0) > 0, true, `${record.id} should include zh text`);
    assert.equal((record.texts.en?.sections?.length ?? 0) > 0, true, `${record.id} should include en text`);
  });
});

test("every China law record keeps at least one official Chinese government source", () => {
  const officialChineseLabels = new Set(["官方中文", "å®˜æ–¹ä¸­æ–‡"]);
  const officialZhDomains = [
    "gov.cn",
    "npc.gov.cn",
    "mofcom.gov.cn",
    "chinawto.mofcom.gov.cn",
    "moj.gov.cn",
    "xzfg.moj.gov.cn",
    "cac.gov.cn",
    "court.gov.cn",
  ];

  laws
    .filter((record) => record.jurisdiction === "China")
    .forEach((record) => {
      const hasOfficialZhSource = record.sources.some(
        (source) =>
          officialChineseLabels.has(source.label) &&
          officialZhDomains.some((domain) => source.url.includes(domain)),
      );
      assert.equal(hasOfficialZhSource, true, `${record.id} should keep an official zh source`);
    });
});

test("foreign trade law sources point to the updated official Chinese and English texts", () => {
  const record = laws.find((law) => law.id === "cn-foreign-trade-law-2025");
  assert.ok(record, "cn-foreign-trade-law-2025 should exist");

  const sourceUrls = new Set(record.sources.map((source) => source.url));
  assert.equal(
    sourceUrls.has("https://www.mofcom.gov.cn/zfxxgk/gkml/art/2025/art_fdc193e921ce4a298fe46e85c242b54e.html"),
    true,
  );
  assert.equal(sourceUrls.has("http://en.moj.gov.cn/2023-12/15/c_948360.htm"), true);
});

test("China law records include PDF or database fallback links for fragile sources", () => {
  const requiredFallbacks = new Map([
    ["cn-foreign-relations-law-2023", ["2023-Foreign-Relations-Law_Gazette.pdf"]],
    ["cn-afsl-2021", ["2021-Anti%E2%80%93Foreign-Sanctions-Law_Gazette.pdf", "flk.npc.gov.cn"]],
    ["cn-afsl-implementation-2025", ["LawID=1763&type=pdf"]],
    ["cn-extraterritorial-jurisdiction-2026", ["LawID=1813&type=pdf"]],
    ["cn-export-control-law-2020", ["2020-Export-Control-Law_Gazette.pdf"]],
    ["cn-data-security-law-2021", ["2021-Data-Security-Law_Gazette.pdf"]],
    ["cn-national-security-law-2015", ["2015-National-Security-Law_Gazette.pdf"]],
    ["cn-cybersecurity-law-2016", ["cac.gov.cn/2025-12/29", "2025-Cybersecurity-Law-Amendment_Gazette.pdf"]],
    ["cn-foreign-trade-law-2025", ["npcobserver.com/legislation/foreign-trade-law", "2025-Foreign-Trade-Law-Revision_Gazette.pdf"]],
    ["cn-foreign-investment-law-2019", ["2019-Foreign-Investment-Law_Gazette.pdf"]],
    ["cn-dual-use-export-control-regulation-2024", ["LawID=1735&type=pdf"]],
    ["cn-foreign-state-immunity-law-2023", ["mfa.gov.cn", "2023-Foreign-State-Immunity-Law_Gazette.pdf"]],
    ["cn-supply-chain-security-regulation-2026", ["LawID=1812&type=pdf"]],
    ["cn-pipl-2021", ["2021-Personal-Information-Protection-Law_Gazette.pdf"]],
    ["cn-international-criminal-judicial-assistance-law-2018", ["upload.wikimedia.org", "flk.npc.gov.cn"]],
    ["cn-outbound-investment-regulation-2026", ["LawID=1818&type=pdf"]],
  ]);

  requiredFallbacks.forEach((urlFragments, id) => {
    const record = laws.find((law) => law.id === id);
    assert.ok(record, `${id} should exist`);

    urlFragments.forEach((fragment) => {
      assert.equal(
        record.sources.some((source) => source.url.includes(fragment)),
        true,
        `${id} should include ${fragment}`,
      );
    });
  });
});

test("core China counter-sanctions records include richer bilingual sectioning", () => {
  const coreIds = [
    "cn-afsl-2021",
    "cn-blocking-rules-2021",
    "cn-afsl-implementation-2025",
    "cn-extraterritorial-jurisdiction-2026",
    "cn-foreign-trade-law-2025",
    "cn-outbound-investment-regulation-2026",
  ];

  coreIds.forEach((id) => {
    const record = laws.find((law) => law.id === id);
    assert.ok(record, `${id} should exist`);
    assert.equal((record.texts.zh?.sections?.length ?? 0) >= 2, true, `${id} should have 2+ zh sections`);
    assert.equal((record.texts.en?.sections?.length ?? 0) >= 2, true, `${id} should have 2+ en sections`);
  });
});

test("second-round article index covers new China support laws", () => {
  const articleLawIds = new Set(articles.flatMap((record) => record.relatedLawIds ?? []));
  ["cn-national-security-law-2015", "cn-cybersecurity-law-2016"].forEach((id) => {
    assert.equal(articleLawIds.has(id), true, `${id} should be referenced by at least one article`);
  });
});

test("third-round topic catalog includes deep-dive China aggregation pages", () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  [
    "blocking-statutes",
    "counter-sanctions",
    "extraterritorial-jurisdiction",
    "data-and-cybersecurity",
    "export-control-and-foreign-trade",
    "outbound-investment-and-overseas-interests",
  ].forEach((id) => assert.equal(topicIds.has(id), true, `${id} should be present`));
  assert.equal(topics.length >= 5, true);
});

test("new outbound investment regulation is linked to official, lawyer, and scholar commentary", () => {
  const law = laws.find((record) => record.id === "cn-outbound-investment-regulation-2026");
  assert.ok(law, "cn-outbound-investment-regulation-2026 should exist");
  assert.equal(law.effectiveDate, "2026-07-01");
  assert.equal(law.sources.some((source) => source.url.includes("gov.cn")), true);
  assert.equal((law.topics ?? []).includes("\u6295\u8d44\u58c1\u5792\u8c03\u67e5"), true);
  assert.equal((law.topics ?? []).includes("\u53cd\u5236\u88c1"), true);

  const ids = new Set(articles.map((record) => record.id));
  [
    "moj-ndrc-mofcom-2026-outbound-investment-qa",
    "kingwood-2026-outbound-investment-regulation",
    "junhe-2026-outbound-investment-security-framework",
    "gaopeng-2026-outbound-investment-policy-environment",
    "xinhua-2026-outbound-investment-expert-views",
  ].forEach((id) => assert.equal(ids.has(id), true, `${id} should be included`));

  const related = articles.filter((record) =>
    (record.relatedLawIds ?? []).includes("cn-outbound-investment-regulation-2026"),
  );
  const sourceKinds = new Set(related.flatMap((record) => record.sourceKinds ?? []));
  ["official-explainer", "law-firm", "scholar"].forEach((kind) => {
    assert.equal(sourceKinds.has(kind), true, `${kind} should be represented`);
  });
});

test("comparative law shelf includes economic coercion and outbound-investment controls", () => {
  const lawIds = new Set(laws.map((record) => record.id));
  [
    "eu-anti-coercion-instrument-2023",
    "us-outbound-investment-security-program-2025",
    "us-fend-off-fentanyl-act-2024",
  ].forEach((id) => assert.equal(lawIds.has(id), true, `${id} should be present`));

  const euAci = laws.find((record) => record.id === "eu-anti-coercion-instrument-2023");
  assert.equal((euAci?.topics ?? []).includes("economic coercion"), true);
  assert.equal((euAci?.topics ?? []).includes("response measures"), true);

  const usOutbound = laws.find((record) => record.id === "us-outbound-investment-security-program-2025");
  assert.equal((usOutbound?.topics ?? []).includes("outbound investment"), true);
  assert.equal((usOutbound?.topics ?? []).includes("China technology restrictions"), true);
});

test("every topic has enough related laws for an actual aggregation page", () => {
  topics.forEach((topic) => {
    assert.equal((topic.relatedLawIds?.length ?? 0) >= 3, true, `${topic.id} should aggregate 3+ laws`);
  });
});

test("core China counter-sanctions laws have practice-tip case coverage", () => {
  const practiceLinkedLawIds = new Set(
    articles
      .filter((record) => (record.sourceKinds ?? []).some((kind) => ["case", "arbitration"].includes(kind)))
      .flatMap((record) => record.relatedLawIds ?? []),
  );

  [
    "cn-blocking-rules-2021",
    "cn-afsl-implementation-2025",
    "cn-extraterritorial-jurisdiction-2026",
  ].forEach((id) => {
    assert.equal(practiceLinkedLawIds.has(id), true, `${id} should have practice coverage`);
  });
});

test("core China counter-sanctions laws span all three practice tracks", () => {
  const requiredLawIds = [
    "cn-blocking-rules-2021",
    "cn-afsl-implementation-2025",
    "cn-extraterritorial-jurisdiction-2026",
  ];
  const requiredTracks = ["contract-disputes", "blocking-conflicts", "arbitration-enforcement"];

  requiredLawIds.forEach((lawId) => {
    const tracks = new Set(
      articles
        .filter((record) => (record.relatedLawIds ?? []).includes(lawId))
        .map((record) => record.practiceTrack)
        .filter(Boolean),
    );

    requiredTracks.forEach((track) => {
      assert.equal(tracks.has(track), true, `${lawId} should include ${track}`);
    });
  });
});

test("site includes identified Chinese court practice on anti-foreign sanctions and blocking rules", () => {
  const articleIds = new Set(articles.map((record) => record.id));
  [
    "cn-nanjing-maritime-2024-su72-2157",
    "cn-guangzhou-2021-yue01-1365",
    "cn-shanghai-financial-2021-hu74-xiewairen1",
    "njmc-2026-first-afsl-top-ten-case",
    "legal-daily-2026-maritime-long-arm",
    "spc-ipc-2026-reform-afsl-case",
    "spc-2026-maritime-typical-afsl-bill-of-lading",
  ].forEach((id) => {
    assert.equal(articleIds.has(id), true, `${id} should be included`);
  });
});

test("latest Chinese court practice includes the SPC maritime sanctions judgment", () => {
  const record = articles.find((article) => article.id === "spc-2026-maritime-typical-afsl-bill-of-lading");

  assert.ok(record, "SPC maritime sanctions judgment should be included");
  assert.equal(record.publisher, "最高人民法院");
  assert.equal(record.forum, "上海海事法院 / 最高人民法院典型案例");
  assert.equal(record.citation.includes("（2023）沪72民初1936号"), true);
  assert.equal(record.abstract.includes("首个以生效判决方式明确《反外国制裁法》强制适用效力"), true);
  assert.equal((record.sourceKinds ?? []).includes("official-court"), true);
});

test("site includes a substantial set of Chinese scholar and lawyer commentary on the litigation path", () => {
  const articleIds = new Set(articles.map((record) => record.id));
  [
    "yang-2023-afsl-article12-tort",
    "liu-2023-recovery-litigation-challenges",
    "suibe-2025-extraterritorial-effect",
    "acla-2026-first-afsl-case-commentary",
    "kwm-2026-asd-litigation-measures",
    "deheheng-2026-first-afsl-case-media",
    "jinmao-2026-afsl-arbitration",
    "xinde-2026-foreign-sanctions-tort-remedy",
    "debevoise-2026-china-blocking-supply-chain",
    "mondaq-2023-cross-border-ediscovery",
    "ropesgray-2019-icjal-blocking",
  ].forEach((id) => {
    assert.equal(articleIds.has(id), true, `${id} should be included`);
  });
});

test("home page includes author and copyright notice in the hero area", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes('hero-credit'), true);
  assert.equal(appSource.includes('\\u738b\\u6c5f\\u96e8\\u6559\\u6388'), true);
  assert.equal(appSource.includes('Codex\\u5236\\u4f5c'), true);
  assert.equal(appSource.includes('\\u6240\\u6709\\u6587\\u7ae0\\u7248\\u6743\\u5f52\\u539f\\u4f5c\\u8005'), true);
  assert.equal(appSource.includes("China Counter-Sanctions Legal System"), true);
  assert.equal(appSource.includes("A bilingual legal text archive for lawyers, compliance teams, and in-house counsel"), true);
  assert.equal(appSource.includes("Created with Codex by Professor Jiangyu Wang"), true);
  assert.equal(appSource.includes("Copyright in all articles belongs to their original authors."), true);
});

test("home page and shared footer include the teaching-use notice", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const styleSource = fs.readFileSync(new URL("../assets/styles.css", import.meta.url), "utf8");

  assert.equal(appSource.includes("siteUsageNotice"), true);
  assert.equal(appSource.includes("\\u9999\\u6e2f\\u57ce\\u5e02\\u5927\\u5b66\\u6cd5\\u5f8b\\u5b66\\u9662"), true);
  assert.equal(appSource.includes("\\u6559\\u5b66\\u7814\\u7a76\\u4f7f\\u7528"), true);
  assert.equal(appSource.includes("site-usage-note-home"), true);
  assert.equal(appSource.includes("site-footer"), true);
  assert.equal(styleSource.includes("--notice: #5b3fd7"), true);
  assert.equal(styleSource.includes("site-usage-note-home"), true);
  assert.equal(styleSource.includes("site-footer"), true);
});

test("index metadata and app shell do not contain visible encoding corruption", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const indexSource = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.equal(indexSource.includes("\u4e2d\u56fd\u53cd\u5236\u88c1\u6cd5\u5f8b\u4f53\u7cfb"), true);
  assert.equal(indexSource.includes("\u9762\u5411\u5f8b\u5e08\u3001\u5408\u89c4\u548c\u6cd5\u52a1\u7684\u4e2d\u56fd\u53cd\u5236\u88c1\u6cd5\u5f8b\u4f53\u7cfb\u7814\u7a76\u7ad9"), true);
  assert.equal(/\?{4,}/.test(appSource), false);
  assert.equal(appSource.includes("\uFFFD"), false);
  assert.equal(appSource.includes("\u00C2\u00B7"), false);
  assert.equal(appSource.includes("\u00E2\u2020\u0090"), false);
});

test("app shell bumps cache-busting version for the latest data update", () => {
  const indexSource = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const mainSource = fs.readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
  const articlesSource = fs.readFileSync(new URL("../src/data/articles.js", import.meta.url), "utf8");
  const lawsSource = fs.readFileSync(new URL("../src/data/laws.js", import.meta.url), "utf8");

  assert.equal(indexSource.includes("./assets/styles.css?v=20260710c"), true);
  assert.equal(indexSource.includes("./src/main.js?v=20260710c"), true);
  assert.equal(mainSource.includes("./app.js?v=20260710c"), true);
  assert.equal(mainSource.includes('source.replaceAll("20260710b", "20260710c")'), true);
  assert.equal(articlesSource.includes("./articles.part12.js?v=20260710c"), true);
  assert.equal(lawsSource.includes("./lawSourceSupplements.js?v=20260710c"), true);
});

test("official positions archive includes core bilingual records from MFA, UN mission, and MOFCOM", () => {
  assert.equal(officialStatements.length >= 20, true);
  const institutions = new Set(officialStatements.map((record) => record.institutionEn));
  ["Ministry of Foreign Affairs", "Permanent Mission of China to the United Nations", "Ministry of Commerce"].forEach(
    (name) => assert.equal(institutions.has(name), true, `${name} should be present`),
  );

  officialStatements.forEach((record) => {
    assert.equal(record.languages.includes("zh"), true, `${record.id} should include zh`);
    assert.equal(record.languages.includes("en"), true, `${record.id} should include en`);
    assert.equal((record.texts.zh?.sections?.length ?? 0) > 0, true, `${record.id} should include zh text`);
    assert.equal((record.texts.en?.sections?.length ?? 0) > 0, true, `${record.id} should include en text`);
  });
});

test("official positions archive covers major sanctions-response tracks across diplomacy, UN, and commerce", () => {
  const statementIds = new Set(officialStatements.map((record) => record.id));
  [
    "mfa-2021-07-23-us-countermeasures-hong-kong",
    "mfa-lin-2025-04-08-tariff-war",
    "un-geng-2024-11-25-humanitarian-impact-ucm",
    "mofcom-2025-02-06-export-controls-uel-press-conference",
    "mofcom-2025-10-14-hanwha-countermeasures",
    "mofcom-2026-02-24-us-tariff-adjustment",
    "mfa-mao-2026-02-25-uk-sanctions",
    "mfa-mao-2026-03-30-furuya-countermeasures",
    "mfa-lin-2026-03-25-cuba-sanctions",
    "un-fu-2026-03-09-afghanistan-sanctions",
    "mofcom-2026-03-02-uk-sanctions",
    "mofcom-2026-01-06-japan-dual-use-controls",
    "mofcom-2026-05-07-eu-inverters",
  ].forEach((id) => assert.equal(statementIds.has(id), true, `${id} should be present`));
});

test("official positions archive uses official bilingual source links", () => {
  const officialDomains = ["mfa.gov.cn", "fmprc.gov.cn", "un.china-mission.gov.cn", "mofcom.gov.cn", "english.mofcom.gov.cn"];

  officialStatements.forEach((record) => {
    assert.equal(record.sources.length >= 2, true, `${record.id} should include bilingual sources`);
    record.sources.forEach((source) => {
      assert.equal(officialDomains.some((domain) => source.url.includes(domain)), true, `${record.id} should use official domains`);
    });
  });
});

test("home page and app shell include the official positions entry point", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u4e2d\u56fd\u7684\u5b98\u65b9\u7acb\u573a"), true);
  assert.equal(appSource.includes("#/official-positions"), true);
  assert.equal(appSource.includes("\u6309\u5e74\u4efd\u5f52\u6863"), true);
  assert.equal(appSource.includes("\u6309\u4e3b\u9898\u805a\u5408"), true);
  assert.equal(appSource.includes("\u56fa\u5b9a\u4e13\u9898"), true);
  assert.equal(appSource.includes("#/official-positions/themes/"), true);
});

test("app shell exposes redesigned top-level research sections", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  [
    "#/china-laws",
    "#/official-positions",
    "#/foreign-laws",
    "#/international-law",
    "#/cases",
    "#/analysis",
    "#/topics",
    "#/timeline",
    "section-nav",
    "\u4e2d\u56fd\u6cd5\u5f8b\u6cd5\u89c4",
    "\u6848\u4f8b\u4e13\u9875",
    "\u5b66\u672f\u4e0e\u653f\u7b56\u5206\u6790",
    "\u5236\u5ea6\u65f6\u95f4\u7ebf",
  ].forEach((fragment) => assert.equal(appSource.includes(fragment), true, `${fragment} should be present`));
});

test("case-specific China analysis is grouped under the cases page instead of the analysis index", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u5357\u4eac\u6d77\u4e8b\u6cd5\u9662\u9996\u8d77\u53cd\u5916\u56fd\u5236\u88c1\u4fb5\u6743\u8bc9\u8bbc\u6848"), true);
  assert.equal(appSource.includes("\u6240\u6709\u5173\u4e8e\u5355\u4e2a\u4e2d\u56fd\u6848\u4f8b\u7684\u5206\u6790\u6587\u7ae0\u96c6\u4e2d\u5230\u672c\u680f\u76ee"), true);
  assert.equal(appSource.includes("\u975e\u4e2a\u6848\u5206\u6790\u6587\u7ae0"), true);
});

test("official positions fixed topics cover the intended long-term research buckets", () => {
  const topicIds = new Set(officialPositionTopics.map((topic) => topic.id));
  [
    "unilateral-sanctions-and-long-arm",
    "counter-sanctions-and-countermeasure-lists",
    "export-controls-and-control-lists",
    "tariffs-and-trade-restrictive-measures",
    "un-platform-positions",
  ].forEach((id) => assert.equal(topicIds.has(id), true, `${id} should be present`));
});

test("international law archive includes core UN documents, special rapporteur reports, and state positions", () => {
  assert.equal(internationalMaterials.length >= 16, true);
  const materialIds = new Set(internationalMaterials.map((record) => record.id));
  [
    "un-charter-1945",
    "ga-human-rights-ucm-79-167",
    "ga-human-rights-ucm-80-209",
    "ga-international-day-ucm-79-293",
    "hrc-negative-impact-ucm-58-3",
    "sr-ucm-notion-types-48-59",
    "sr-ucm-social-rights-60-36",
    "sr-ucm-education-a80-208",
    "sr-ucm-china-visit-57-55-add1",
    "sc-sanctions-information",
    "state-eu-unga-2024-ucm",
    "state-uk-hrc61-2026-ucm",
    "state-china-unga-2025-ucm",
    "sg-human-rights-ucm-a69-97",
    "sg-economic-coercion-a60-226",
    "ohchr-thematic-study-ahrc-19-33",
    "sr-right-to-health-ahrc-54-23",
    "ohchr-visual-summary-ucm-2024",
    "eu-reply-jal-2024-ucm",
  ].forEach((id) => assert.equal(materialIds.has(id), true, `${id} should be present`));
});

test("international law archive keeps at least one official UN or government source per record", () => {
  const officialDomains = [
    "un.org",
    "documents.un.org",
    "digitallibrary.un.org",
    "ohchr.org",
    "spcommreports.ohchr.org",
    "eeas.europa.eu",
    "gov.uk",
    "mfa.gov.cn",
  ];
  internationalMaterials.forEach((record) => {
    assert.equal(record.sources.length > 0, true, `${record.id} should have sources`);
    assert.equal(
      record.sources.some((source) => officialDomains.some((domain) => source.url.includes(domain))),
      true,
      `${record.id} should use official domains`,
    );
    assert.equal((record.texts.en?.sections?.length ?? 0) > 0, true, `${record.id} should include English text`);
  });
});

test("home page and app shell include the international law archive entry point", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u56fd\u9645\u6cd5\u4e0a\u7684\u6001\u5ea6"), true);
  assert.equal(appSource.includes("#/international-law"), true);
});

test("international law archive fixed topics cover the intended long-term research buckets", () => {
  const topicIds = new Set(internationalLawTopics.map((topic) => topic.id));
  [
    "un-system-and-ucm",
    "security-council-vs-autonomous-sanctions",
    "hrc-and-special-rapporteur-track",
    "state-positions-at-the-un",
  ].forEach((id) => assert.equal(topicIds.has(id), true, `${id} should be present`));
});

test("international law archive includes fixed-topic entry points in the app shell", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u56fa\u5b9a\u4e13\u9898"), true);
  assert.equal(appSource.includes("#/international-law/themes/"), true);
});

test("international law fixed topics include key divergence points", () => {
  internationalLawTopics.forEach((topic) => {
    assert.equal((topic.keyDifferences?.length ?? 0) >= 3, true, `${topic.id} should define key divergence points`);
  });
});

test("international law archive includes year archive and key divergence labels in the app shell", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u6309\u5e74\u4efd\u5f52\u6863"), true);
  assert.equal(appSource.includes("\u5173\u952e\u5206\u6b67\u70b9"), true);
});

test("international law archive includes a reports-and-working-files view in the app shell", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u6587\u732e\u4e0e\u62a5\u544a"), true);
  assert.equal(appSource.includes("\u5de5\u4f5c\u6587\u4ef6"), true);
});

test("international law archive includes a research-reports branch with government, institutional, and think-tank coverage", () => {
  assert.equal(internationalResearchReports.length >= 10, true);

  const reportIds = new Set(internationalResearchReports.map((record) => record.id));
  [
    "us-crs-if12390-2025",
    "us-crs-r48052-2024",
    "uk-commons-cbp-10346-2025",
    "eu-eprs-760416-2024",
    "cnas-sanctions-by-the-numbers-2024",
    "brookings-sanctions-tracker-2023",
    "csis-russian-economy-western-sanctions-2025",
    "bruegel-export-controls-russia-2024",
    "piie-us-sanctions-on-china-2024",
    "siis-russia-ukraine-perspectives-2022",
  ].forEach((id) => assert.equal(reportIds.has(id), true, `${id} should be present`));

  const institutionTypes = new Set(internationalResearchReports.map((record) => record.institutionType));
  ["government-parliament", "international-organization", "think-tank"].forEach((type) => {
    assert.equal(institutionTypes.has(type), true, `${type} should be present`);
  });
});

test("international research reports use official or primary institutional sources and keep English text", () => {
  const primaryDomains = [
    "congress.gov",
    "commonslibrary.parliament.uk",
    "europarl.europa.eu",
    "cnas.org",
    "brookings.edu",
    "csis.org",
    "chathamhouse.org",
    "bruegel.org",
    "piie.com",
    "siis.org.cn",
  ];

  internationalResearchReports.forEach((record) => {
    assert.equal(record.sources.length > 0, true, `${record.id} should have sources`);
    assert.equal(
      record.sources.some((source) => primaryDomains.some((domain) => source.url.includes(domain))),
      true,
      `${record.id} should use a primary institutional domain`,
    );
    assert.equal((record.texts.en?.sections?.length ?? 0) > 0, true, `${record.id} should include English text`);
  });
});

test("app shell includes the international research reports branch", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u7814\u7a76\u62a5\u544a\u4e0e\u653f\u7b56\u6587\u4ef6"), true);
  assert.equal(appSource.includes("#/international-law/research"), true);
});

test("international law archive includes a decisions-and-awards branch covering ICJ, supreme courts, and arbitral awards", () => {
  assert.equal(internationalDecisions.length >= 22, true);

  const decisionIds = new Set(internationalDecisions.map((record) => record.id));
  [
    "icj-alleged-violations-order-2018",
    "icj-certain-iranian-assets-2023",
    "cjeu-kadi-ii-2013",
    "cjeu-rosneft-2017",
    "cjeu-bank-refah-kargaran-2020",
    "cjeu-venezuela-council-2021",
    "uksc-bank-mellat-no2-2013",
    "uksc-rti-mur-shipping-2024",
    "ussc-bank-markazi-peterson-2016",
    "ussc-rubin-v-iran-2018",
    "ussc-halkbank-v-united-states-2023",
    "iusct-a24-final-award-602-2014",
    "iusct-a15-partial-award-604-2020",
    "echr-bosphorus-ireland-2005",
    "echr-nada-switzerland-2012",
    "echr-al-dulimi-switzerland-2016",
    "cjeu-neves-77-solutions-2024",
    "gc-national-settlement-depository-2024",
    "gc-aven-fridman-council-2024",
    "gc-legal-services-russia-sanctions-2024",
  ].forEach((id) => assert.equal(decisionIds.has(id), true, `${id} should be present`));
});

test("international decisions use official judicial or tribunal sources and keep English text", () => {
  const primaryDomains = [
    "icj-cij.org",
    "supremecourt.uk",
    "supremecourt.gov",
    "iusct.com",
    "curia.europa.eu",
    "infocuria.europa.eu",
    "hudoc.echr.coe.int",
  ];

  internationalDecisions.forEach((record) => {
    assert.equal(record.sources.length > 0, true, `${record.id} should have sources`);
    assert.equal(
      record.sources.some((source) => primaryDomains.some((domain) => source.url.includes(domain))),
      true,
      `${record.id} should use a primary judicial or tribunal domain`,
    );
    assert.equal((record.texts.en?.sections?.length ?? 0) > 0, true, `${record.id} should include English text`);
  });
});

test("app shell includes the international decisions-and-awards branch", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u5224\u51b3\u4e0e\u88c1\u51b3"), true);
  assert.equal(appSource.includes("#/international-law/cases"), true);
});

test("international decisions branch includes fixed topics for recurring sanctions adjudication issues", () => {
  const topicIds = new Set(internationalDecisionTopics.map((topic) => topic.id));
  [
    "sanctions-legality-and-proportionality",
    "asset-freezes-and-execution",
    "blocking-statutes-and-secondary-sanctions",
    "sanctions-in-arbitration-and-commercial-disputes",
  ].forEach((id) => assert.equal(topicIds.has(id), true, `${id} should be present`));
});

test("app shell includes international decision fixed-topic entry points", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u56fa\u5b9a\u4e13\u9898"), true);
  assert.equal(appSource.includes("#/international-law/cases/themes/"), true);
});

test("international law archive includes cross-branch issue navigation topics", () => {
  const topicIds = new Set(internationalIssueTopics.map((topic) => topic.id));
  [
    "ucm-human-rights-and-un-system",
    "sanctions-legality-proportionality-and-review",
    "blocking-statutes-secondary-sanctions-and-extraterritoriality",
    "asset-freezes-execution-and-state-immunity",
    "export-controls-and-economic-statecraft",
    "economic-coercion-and-outbound-investment-security",
  ].forEach((id) => assert.equal(topicIds.has(id), true, `${id} should be present`));
});

test("app shell includes the international issue navigation entry point", () => {
  const appSource = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert.equal(appSource.includes("\u4e13\u9898\u5bfc\u822a\u9875"), true);
  assert.equal(appSource.includes("#/international-law/issues"), true);
});
