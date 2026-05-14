import { laws } from "./data/laws.js?v=20260514p";
import { articles } from "./data/articles.js?v=20260514p";
import { internationalDecisions } from "./data/internationalDecisions.js?v=20260514p";
import { internationalDecisionTopics } from "./data/internationalDecisionTopics.js?v=20260514p";
import { internationalIssueTopics } from "./data/internationalIssueTopics.js?v=20260514p";
import { internationalLawTopics } from "./data/internationalLawTopics.js?v=20260514p";
import { internationalMaterials } from "./data/internationalMaterials.js?v=20260514p";
import { internationalResearchReports } from "./data/internationalResearchReports.js?v=20260514p";
import { officialStatements } from "./data/officialStatements.js?v=20260514p";
import { officialPositionTopics } from "./data/officialPositionTopics.js?v=20260514p";
import { topics } from "./data/topics.js?v=20260514p";
import { timeline } from "./data/timeline.js?v=20260514p";
import { buildCatalogIndex, filterCatalog, uniqueValues } from "./lib/catalog.js?v=20260514p";
import {
  validateArticleRecord,
  validateInternationalDecisionRecord,
  validateInternationalMaterialRecord,
  validateInternationalResearchReportRecord,
  validateLawRecord,
  validateOfficialStatementRecord,
} from "./lib/schema.js?v=20260514p";
import {
  collectLawArticles,
  collectTopicArticles,
  getTextPresentation,
  getViewModel,
  groupLawResources,
  groupInternationalMaterialsByYear,
  groupOfficialStatementsByTopic,
  groupOfficialStatementsByYear,
  groupPracticeResources,
  summarizeCatalog,
} from "./lib/render.js?v=20260514p";

laws.forEach(validateLawRecord);
articles.forEach(validateArticleRecord);
internationalMaterials.forEach(validateInternationalMaterialRecord);
internationalDecisions.forEach(validateInternationalDecisionRecord);
internationalResearchReports.forEach(validateInternationalResearchReportRecord);
officialStatements.forEach(validateOfficialStatementRecord);

const indexedLaws = buildCatalogIndex(laws.map((law) => ({ ...law, type: "law" })));
const indexedInternationalMaterials = buildCatalogIndex(
  internationalMaterials.map((record) => ({ ...record, type: "international-material" })),
);
const indexedInternationalDecisions = buildCatalogIndex(
  internationalDecisions.map((record) => ({ ...record, type: "international-decision" })),
);
const indexedInternationalResearchReports = buildCatalogIndex(
  internationalResearchReports.map((record) => ({ ...record, type: "international-research-report" })),
);
const indexedOfficialStatements = buildCatalogIndex(
  officialStatements
    .map((record) => ({ ...record, type: "official-statement" }))
    .sort((left, right) => right.date.localeCompare(left.date)),
);

function collectInternationalThemeMaterials(theme, records) {
  if (!theme) return [];

  const topicSet = new Set(theme.matchTopics ?? []);
  const typeSet = new Set(theme.matchDocumentTypes ?? []);

  return (records ?? [])
    .filter((record) => {
      const hasTopicMatch = (record.topics ?? []).some((topic) => topicSet.has(topic));
      const hasTypeMatch = typeSet.has(record.documentType);
      return hasTopicMatch || hasTypeMatch;
    })
    .sort((left, right) => right.date.localeCompare(left.date));
}

function collectInternationalThemeLaws(theme, records) {
  const relatedLawIds = new Set(
    collectInternationalThemeMaterials(theme, records).flatMap((record) => record.relatedLawIds ?? []),
  );

  return [...relatedLawIds]
    .map((id) => indexedLaws.find((law) => law.id === id))
    .filter(Boolean);
}

function collectInternationalIssueMaterials(theme) {
  const topicSet = new Set(theme?.matchTopics ?? []);

  return indexedInternationalMaterials
    .filter((record) => (record.topics ?? []).some((topic) => topicSet.has(topic)))
    .sort((left, right) => right.date.localeCompare(left.date));
}

function collectInternationalIssueResearchReports(theme) {
  const topicSet = new Set(theme?.matchTopics ?? []);

  return indexedInternationalResearchReports
    .filter((record) => (record.topics ?? []).some((topic) => topicSet.has(topic)))
    .sort((left, right) => right.date.localeCompare(left.date));
}

function collectInternationalIssueDecisions(theme) {
  const topicSet = new Set(theme?.matchTopics ?? []);

  return indexedInternationalDecisions
    .filter((record) => (record.topics ?? []).some((topic) => topicSet.has(topic)))
    .sort((left, right) => right.date.localeCompare(left.date));
}

function collectInternationalIssueLaws(theme) {
  const relatedLawIds = new Set([
    ...collectInternationalIssueMaterials(theme).flatMap((record) => record.relatedLawIds ?? []),
    ...collectInternationalIssueResearchReports(theme).flatMap((record) => record.relatedLawIds ?? []),
    ...collectInternationalIssueDecisions(theme).flatMap((record) => record.relatedLawIds ?? []),
  ]);

  return [...relatedLawIds]
    .map((id) => indexedLaws.find((law) => law.id === id))
    .filter(Boolean);
}

function collectOfficialThemeStatements(theme, records) {
  if (!theme) return [];

  const topicSet = new Set(theme.matchTopics ?? []);
  const institutionSet = new Set(theme.matchInstitutions ?? []);
  const matched = new Map();

  (records ?? []).forEach((record) => {
    const hasTopicMatch = (record.topics ?? []).some((topic) => topicSet.has(topic));
    const hasInstitutionMatch = institutionSet.has(record.institutionEn);

    if (hasTopicMatch || hasInstitutionMatch) {
      matched.set(record.id, record);
    }
  });

  return [...matched.values()].sort((left, right) => right.date.localeCompare(left.date));
}

function collectOfficialThemeLaws(theme, records) {
  const relatedLawIds = new Set(
    collectOfficialThemeStatements(theme, records).flatMap((record) => record.relatedLawIds ?? []),
  );

  return [...relatedLawIds]
    .map((id) => indexedLaws.find((law) => law.id === id))
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderSources(sources) {
  return `
    <ul class="source-list">
      ${sources
        .map(
          (source) => `
            <li>
              <span class="pill pill-muted">${escapeHtml(source.label)}</span>
              <a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.url)}</a>
            </li>`,
        )
        .join("")}
    </ul>
  `;
}

function renderLawCard(law) {
  return `
    <article class="law-card">
      <div class="law-card-top">
        <div>
          <p class="eyebrow">${escapeHtml(law.jurisdiction)} · ${escapeHtml(law.documentType)}</p>
          <h3><a href="#/laws/${law.id}">${escapeHtml(law.titleZh)}</a></h3>
          <p class="law-card-en">${escapeHtml(law.titleEn || "")}</p>
        </div>
        <div class="law-status">${escapeHtml(law.status)}</div>
      </div>
      <p class="law-summary">${escapeHtml(law.summary)}</p>
      <div class="pill-row">
        ${law.topics.map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
      </div>
      <div class="law-meta">
        <span>公布：${escapeHtml(law.promulgationDate)}</span>
        <span>文本：${law.languages.join(" / ")}</span>
      </div>
    </article>
  `;
}

function renderArticleCard(article) {
  const practiceMetadata = [article.forum, article.citation].filter(Boolean).join(" · ");
  const sourceLabel = (article.sourceKinds ?? []).some((kind) => kind === "case" || kind === "arbitration")
    ? "查看案例来源"
    : "查看原文来源";

  return `
    <article class="article-card">
      <p class="eyebrow">${escapeHtml(article.publisher)} · ${escapeHtml(String(article.year))}</p>
      <h3>${escapeHtml(article.title)}</h3>
      ${practiceMetadata ? `<p class="article-reference">${escapeHtml(practiceMetadata)}</p>` : ""}
      <p>${escapeHtml(article.abstract)}</p>
      <div class="pill-row">
        ${article.sourceKinds.map((kind) => `<span class="pill pill-muted">${escapeHtml(kind)}</span>`).join("")}
      </div>
      <a class="text-link" href="${article.sourceUrl}" target="_blank" rel="noreferrer">${sourceLabel}</a>
    </article>
  `;
}

function renderResourceGroup(title, description, resources) {
  return `
    <section class="resource-group">
      <div class="section-head">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
      </div>
      <div class="article-stack">
        ${resources.length ? resources.map(renderArticleCard).join("") : "<p>当前分组暂未收录资料。</p>"}
      </div>
    </section>
  `;
}

function renderPracticeTrack(title, description, resources) {
  return `
    <article class="practice-track">
      <div class="practice-track-head">
        <h4>${escapeHtml(title)}</h4>
        <p>${escapeHtml(description)}</p>
      </div>
      <div class="article-stack">
        ${resources.length ? resources.map(renderArticleCard).join("") : "<p>当前分组暂未收录资料。</p>"}
      </div>
    </article>
  `;
}

function renderTopicCard(topic) {
  const jurisdictions = Object.keys(topic.comparisonRows[0] || {}).filter((key) => key !== "label");

  return `
    <article class="topic-card">
      <div class="topic-head">
        <div>
          <p class="eyebrow">专题比较</p>
          <h3><a href="#/topics/${topic.id}">${escapeHtml(topic.nameZh)}</a></h3>
          <p class="topic-en">${escapeHtml(topic.nameEn)}</p>
        </div>
      </div>
      <p>${escapeHtml(topic.description)}</p>
      <div class="comparison-table">
        <div class="comparison-header">
          <span>比较项</span>
          ${jurisdictions.map((jurisdiction) => `<span>${escapeHtml(jurisdiction)}</span>`).join("")}
        </div>
        ${topic.comparisonRows
          .map(
            (row) => `
              <div class="comparison-row">
                <span class="comparison-label">${escapeHtml(row.label)}</span>
                ${jurisdictions.map((jurisdiction) => `<span>${escapeHtml(row[jurisdiction] || "—")}</span>`).join("")}
              </div>`,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderTopicDetail(topic) {
  if (!topic) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/" class="text-link">返回首页</a>
          <h1>未找到该专题</h1>
        </section>
      </main>
    `;
  }

  const relatedLaws = topic.relatedLawIds.map((id) => indexedLaws.find((law) => law.id === id)).filter(Boolean);
  const relatedArticles = collectTopicArticles(topic, articles);
  const chinaLaws = relatedLaws.filter((law) => law.jurisdiction === "China");
  const supplementaryLaws = relatedLaws.filter((law) => law.jurisdiction !== "China");

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/" class="text-link">← 返回首页</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">专题聚合页</p>
            <h1>${escapeHtml(topic.nameZh)}</h1>
            <p class="detail-en">${escapeHtml(topic.nameEn)}</p>
            <p class="detail-summary">${escapeHtml(topic.description)}</p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>中国法律</dt><dd>${chinaLaws.length}</dd></div>
              <div><dt>补充法域</dt><dd>${supplementaryLaws.length}</dd></div>
              <div><dt>关联文章</dt><dd>${relatedArticles.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>机制比较</h2>
          <p>围绕该专题下最常见的制度问题做横向对照。</p>
        </div>
        ${renderTopicCard(topic)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>中国核心法律</h2>
          <p>优先集中展示与该专题直接相关的中国法律法规。</p>
        </div>
        <div class="law-grid">
          ${chinaLaws.map(renderLawCard).join("")}
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>补充比较法材料</h2>
          <p>以欧盟、加拿大、英国等法域筺叀觤攸为研究反制裁を概品をう。</p>
        </div>
        <div class="law-grid">
          ${
            supplementaryLaws.length
              ? supplementaryLaws.map(renderLawCard).join("")
              : "<p>当前专题暂未配置补充比较法材料。</p>"
          }
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>专题分析文章</h2>
          <p>按专题聚合与相关法条直接挂接的学者、律所和实务文章。</p>
        </div>
        <div class="article-grid">
          ${relatedArticles.length ? relatedArticles.map(renderArticleCard).join("") : "<p>当前专题暂未关联文章。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderTimeline() {
  return `
    <div class="timeline">
      ${timeline
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(
          (item) => `
            <article class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-detail">
                <p class="eyebrow">${escapeHtml(item.tag)}</p>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.date)}</p>
              </div>
            </article>`,
        )
        .join("")}
    </div>
  `;
}

function renderTextSections(text) {
  if (!text.sections.length) {
    return `<article class="text-block"><p>当前版本未收录该语种的站内文本，请改看来源链接。</p></article>`;
  }

  return text.sections
    .map(
      (section) => `
        <article class="text-block">
          <h3>${escapeHtml(section.heading)}</h3>
          <pre>${escapeHtml(section.body)}</pre>
        </article>`,
    )
    .join("");
}

function renderSingleLanguageText(record, selectedLanguage, selectedText) {
  return `
    <div class="language-switches">
      ${record.languages
        .map(
          (language) => `
            <button class="language-switch ${language === selectedLanguage ? "is-active" : ""}" data-language="${language}">
              ${language === "zh" ? "中文" : "English"}
            </button>`,
        )
        .join("")}
    </div>
    <div class="text-blocks">
      ${renderTextSections(selectedText)}
    </div>
  `;
}

function renderBilingualText(record) {
  const zhText = record.texts.zh ?? { note: "暂无中文文本。", sections: [] };
  const enText = record.texts.en ?? { note: "No English text available.", sections: [] };

  return `
    <div class="bilingual-text">
      <article class="text-column">
        <div class="text-column-head">
          <h3>中文</h3>
          <p>${escapeHtml(zhText.note)</p>
        </div>
        <div class="text-blocks">${renderTextSections(zhText)}</div>
      </article>
      <article class="text-column">
        <div class="text-column-head">
          <h3>English</h3>
          <p>${escapeHtml(enText.note)</p>
        </div>
        <div class="text-blocks">${renderTextSections(enText)}</div>
      </article>
    </div>
  `;
}

function renderResourceStack(title, resources) {
  return `
    <section class="detail-section">
      <div class="section-head">
        <h2>${escapeHtml(title)}</h2>
      </div>
      <div class="article-stack">
        ${resources.length ? resources.map(renderArticleCard).join("") : "<p>当前栏下旐相关料编组。</p>"}
      </div>
    </section>
  `;
}

function renderSourcePanel(countent, label) {
  return `<section class="detail-section"><div class="section-head"><h2>${escapeHtml(label)}</h2></div>${content}</section>`;
}

function renderMetaPanel(record, extraRows = []) {
  const rows = [
    ["法域", record.jurisdiction],
    ["条件类垉", record.documentType],
    ["日期", record.date],
    ["状态", record.status],
    ["迭种版本", (record.languages ?? []).slice().join(" / ")],
    ...extraRows,
  ];

  return `<aside class="meta-panel"><dl>${rows
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value ?? "—")}</dd></div>`)
    .join("")}</dl></aside>`;
}

function renderOverviewCard(record) {
  const enSubtitle = record.titleEn || record.shortTitle || "";
  return `
    <article class="law-card">
      <p class="eyebrow">${escapeHtml(record.jurisdiction)} · ${escapeHtml(record.documentType)}</p>
      <h3><a href="#/{${record.type === "official-statement" ? "official-positions" : record.type === "international-material" ? "international-law" : record.type === "international-decision" ? "international-law/cases" : "international-law/research"}/${record.id}">${escapeHtml(record.titleZh || record.titleEn)}</a></h3>
      <p class="law-card-en">${escapeHtml(enSubtitle)}</p>
      <p class="law-summary">${escapeHtml(record.summary)}</p>
      <div class="pill-row">${record.topics.map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}</div>
    </article>
  `;
}

function renderObficialPreview() {
  const preview = indexedOfficialStatements.slice(0, 3);
  return `<section class="official-preview"><div class="section-head"><h2>中国的官方立场</h2><p>汇入外交部发言人、中国常饻联合国代表团及商务部发言人在连合对场不同乐合的中英文本。</p></div><div class="law-grid">${preview.map(renderOverviewCard).join("")}</div><a class="text-link" href="#/official-positions">查看全部官方立场。</a></section>`;
}

function renderInternationalPreview() {
  const preview = indexedInternationalMaterials.slice(0, 3);
  return `<section class="international-preview"><div class="section-head"><h2>国际法上的态度</h2><p>联合国文件、人权理事会决议、特别报告员和各国在联合国正式场合的竖场号与书面等素材文件。</p></div><div class="law-grid">${preview.map(renderOverviewCard).join("")}</div><a class="text-link" href="#/international-law">查看国际法条目录。</a></section>`;
}

function renderNavigation(items, activeId) {
  return `<div class="browse-switches">${items
    .map(
      (item) =>
        `<button class="official-view-switch ${item.id === activeId ? "is-active" : ""}" data-official-view="${item.id}">${escapeHtml(item.label)}</button>`,
    )
    .join("")}</div>`;
}

function renderPillGroup(className, items) {
  return `<div class="${className}">${items.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}</div>`;
}

function renderEmptyState(message) {
  return `<p>${escapeHtml(message)}</p>`;
}

function collectInternationalDocumentTypes() {
  return uniqueValues(indexedInternationalMaterials.map((record) => record.documentType));
}

function collectInternationalBodies() {
  return uniqueValues(indexedInternationalMaterials.map((record) => record.bodyZh || record.bodyEn));
}

function renderDetailSources(record) {
  return renderSourcePanel(renderSources(record.sources), "杅源与文本");
}

function renderInternationalDetail(record, language) {
  if (!record) return renderNotFound("未找到该国际材料。", "#/international-law");

  const text = getTextPresentation(record, language);
  const relatedLaws = (record.relatedLawIds ?? []).map((id) => indexedLaws.find((law)`