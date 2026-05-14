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
          <p>以欧盟、加拿大、英国等法域作为补充比较入口。</p>
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
              <div>
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
          <p>${escapeHtml(zhText.note)}</p>
        </div>
        <div class="text-blocks">
          ${renderTextSections(zhText)}
        </div>
      </article>
      <article class="text-column">
        <div class="text-column-head">
          <h3>English</h3>
          <p>${escapeHtml(enText.note)}</p>
        </div>
        <div class="text-blocks">
          ${renderTextSections(enText)}
        </div>
      </article>
    </div>
  `;
}

function renderLawDetail(record, detailLanguage) {
  if (!record) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/" class="text-link">返回首页</a>
          <h1>未找到该条目</h1>
        </section>
      </main>
    `;
  }

  const textPresentation = getTextPresentation(record);
  const availableLanguages = record.languages.filter((language) => (record.texts[language]?.sections ?? []).length > 0);
  const selectedLanguage = availableLanguages.includes(detailLanguage) ? detailLanguage : availableLanguages[0] || record.languages[0];
  const selectedText = record.texts[selectedLanguage] ?? { note: "暂无站内文本。", sections: [] };
  const relatedArticles = collectLawArticles(record, articles);
  const groupedResources = groupLawResources(relatedArticles);
  const groupedPractice = groupPracticeResources(groupedResources.practice);
  const relatedTopics = topics.filter((topic) => topic.relatedLawIds.includes(record.id));

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/" class="text-link">← 返回首页</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">${escapeHtml(record.jurisdiction)} · ${escapeHtml(record.documentType)}</p>
            <h1>${escapeHtml(record.titleZh)}</h1>
            <p class="detail-en">${escapeHtml(record.titleEn || "")}</p>
            <p class="detail-summary">${escapeHtml(record.summary)}</p>
            <div class="pill-row">
              ${record.topics.map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
            </div>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>效力层级</dt><dd>${escapeHtml(record.authorityLevel)}</dd></div>
              <div><dt>公布日期</dt><dd>${escapeHtml(record.promulgationDate)}</dd></div>
              <div><dt>生效日期</dt><dd>${escapeHtml(record.effectiveDate)}</dd></div>
              <div><dt>文本状态</dt><dd>中文 ${escapeHtml(record.textStatus.zh)} / 英文 ${escapeHtml(record.textStatus.en)}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>来源与版本</h2>
          <p>官方来源优先，非官方英文均已标明。</p>
        </div>
        ${renderSources(record.sources)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>文本</h2>
          <p>${escapeHtml(
            textPresentation === "bilingual"
              ? "中国法律默认并排展示中文与英文；英文栏已区分官方英文、官方英文消息稿和站内译文。"
              : selectedText.note,
          )}</p>
        </div>
        ${
          textPresentation === "bilingual"
            ? renderBilingualText(record)
            : renderSingleLanguageText(record, selectedLanguage, selectedText)
        }
      </section>

      <section class="detail-section two-col">
        <div>
          <div class="section-head">
            <h2>相关专题</h2>
          </div>
          <div class="topic-stack">
            ${relatedTopics.length ? relatedTopics.map(renderTopicCard).join("") : "<p>暂无站内专题关联。</p>"}
          </div>
        </div>
        <div>
          <div class="section-head">
            <h2>研究与实务资源</h2>
          </div>
          ${
            relatedArticles.length
              ? `
                <div class="resource-stack">
                  ${renderResourceGroup("学者文章", "优先保留支持中国反制裁体系解释的学术资料。", groupedResources.scholar)}
                  ${renderResourceGroup("律所与实务文章", "集中收录合规、交易和争议解决可直接参考的实务分析。", groupedResources.practitioner)}
                  <section class="resource-group">
                    <div class="section-head">
                      <h3>实践提示</h3>
                      <p>按合同条款争议、阻断法与域外管辖冲突、仲裁与执行材料分组，便于直接对照实务场景。</p>
                    </div>
                    <div class="practice-track-stack">
                      ${renderPracticeTrack("合同条款争议", "聚焦制裁条款、付款条件和履约抗辩如何在争议中被解释。", groupedPractice.contractDisputes)}
                      ${renderPracticeTrack("阻断法与域外管辖冲突", "观察法院如何处理不得遵守外国措施、终止交易与比例性审查等问题。", groupedPractice.blockingConflicts)}
                      ${renderPracticeTrack("仲裁与执行", "聚焦制裁压力下的仲裁席位、反诉或反仲裁策略，以及裁决执行风险。", groupedPractice.arbitrationEnforcement)}
                    </div>
                  </section>
                </div>
              `
              : "<p>暂无已关联资源。</p>"
          }
        </div>
      </section>
    </main>
  `;
}

function renderOfficialStatementCard(record) {
  return `
    <article class="official-card">
      <div class="law-card-top">
        <div>
          <p class="eyebrow">${escapeHtml(record.institutionZh)} · ${escapeHtml(record.venueZh)}</p>
          <h3><a href="#/official-positions/${record.id}">${escapeHtml(record.titleZh)}</a></h3>
          <p class="law-card-en">${escapeHtml(record.titleEn)}</p>
        </div>
        <div class="law-status">${escapeHtml(record.date)}</div>
      </div>
      <p class="law-summary">${escapeHtml(record.summary)}</p>
      <div class="pill-row">
        ${record.topics.map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
      </div>
      <div class="law-meta">
        <span>发言人：${escapeHtml(record.speakerZh)}</span>
        <span>文本：${record.languages.join(" / ")}</span>
      </div>
    </article>
  `;
}

function slugifyAnchor(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function filterOfficialArchive(records, filters) {
  return filterCatalog(records, {
    query: filters.officialQuery,
    language: filters.officialLanguage,
    type: "official-statement",
  }).filter((record) => {
    if (filters.officialInstitution && record.institutionEn !== filters.officialInstitution) return false;
    if (filters.officialVenue && record.venueEn !== filters.officialVenue) return false;
    if (filters.officialYear && !record.date.startsWith(filters.officialYear)) return false;
    return true;
  });
}

function renderOfficialSecondaryNav(state) {
  const views = [
    { id: "catalog", label: "目录检索" },
    { id: "year", label: "按年份归档" },
    { id: "topic", label: "按主题聚合" },
    { id: "fixed", label: "固定专题" },
  ];

  return `
    <section class="detail-section official-subnav">
      <div class="section-head">
        <h2>二级导航</h2>
        <p>在总目录、年份归档、主题聚合和固定专题之间切换，适合长期追踪官方立场演变。</p>
      </div>
      <div class="official-view-switches">
        ${views
          .map(
            (view) => `
              <button class="official-view-switch ${state.officialBrowseMode === view.id ? "is-active" : ""}" data-official-view="${view.id}">
                ${view.label}
              </button>`,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderOfficialYearArchive(records) {
  const groups = groupOfficialStatementsByYear(records);

  return `
    <section class="catalog">
      <div class="section-head">
        <h2>按年份归档</h2>
        <p>按年份回看中国官方对制裁、反制裁和域外措施的立场变化。</p>
      </div>
      <div class="anchor-row">
        ${groups
          .map(
            (group) => `<a class="pill" href="#official-year-${group.year}">${escapeHtml(group.year)} <span class="pill-count">${group.records.length}</span></a>`,
          )
          .join("")}
      </div>
      <div class="official-archive-stack">
        ${groups.length
          ? groups
              .map(
                (group) => `
                  <section class="official-group" id="official-year-${group.year}">
                    <div class="section-head">
                      <h3>${escapeHtml(group.year)}</h3>
                      <p>${group.records.length} 条官方发言</p>
                    </div>
                    <div class="official-grid">
                      ${group.records.map(renderOfficialStatementCard).join("")}
                    </div>
                  </section>`,
              )
              .join("")
          : "<p>当前筛选条件下暂无归档结果。</p>"}
      </div>
    </section>
  `;
}

function renderOfficialTopicArchive(records) {
  const groups = groupOfficialStatementsByTopic(records);

  return `
    <section class="catalog">
      <div class="section-head">
        <h2>按主题聚合</h2>
        <p>围绕制裁、出口管制、长臂管辖、关税战等主题查看官方表达。</p>
      </div>
      <div class="anchor-row">
        ${groups
          .map(
            (group) =>
              `<a class="pill" href="#official-topic-${slugifyAnchor(group.topic)}">${escapeHtml(group.topic)} <span class="pill-count">${group.count}</span></a>`,
          )
          .join("")}
      </div>
      <div class="official-archive-stack">
        ${groups.length
          ? groups
              .map(
                (group) => `
                  <section class="official-group" id="official-topic-${slugifyAnchor(group.topic)}">
                    <div class="section-head">
                      <h3>${escapeHtml(group.topic)}</h3>
                      <p>${group.count} 条官方发言</p>
                    </div>
                    <div class="official-grid">
                      ${group.records.map(renderOfficialStatementCard).join("")}
                    </div>
                  </section>`,
              )
              .join("")
          : "<p>当前筛选条件下暂无专题聚合结果。</p>"}
      </div>
    </section>
  `;
}

function renderOfficialThemeCard(theme, records) {
  const matchedStatements = collectOfficialThemeStatements(theme, records);

  return `
    <article class="topic-card">
      <div class="topic-head">
        <div>
          <p class="eyebrow">固定专题</p>
          <h3><a href="#/official-positions/themes/${theme.id}">${escapeHtml(theme.nameZh)}</a></h3>
          <p class="topic-en">${escapeHtml(theme.nameEn)}</p>
        </div>
      </div>
      <p>${escapeHtml(theme.description)}</p>
      <div class="pill-row">
        <span class="pill">官方发言 ${matchedStatements.length}</span>
      </div>
    </article>
  `;
}

function renderOfficialFixedThemes(records) {
  return `
    <section class="catalog">
      <div class="section-head">
        <h2>固定专题</h2>
        <p>把官方发言稳定收束为几个长期研究入口，便于持续追踪中国在制裁、反制裁和出口管制问题上的官方表达。</p>
      </div>
      <div class="topic-stack">
        ${officialPositionTopics.map((theme) => renderOfficialThemeCard(theme, records)).join("")}
      </div>
    </section>
  `;
}

function renderOfficialList(state) {
  const filtered = filterOfficialArchive(indexedOfficialStatements, state);
  const institutions = uniqueValues(indexedOfficialStatements, "institutionEn");
  const venues = uniqueValues(indexedOfficialStatements, "venueEn");
  const years = [...new Set(indexedOfficialStatements.map((record) => record.date.slice(0, 4)))].sort().reverse();

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/" class="text-link">← 返回首页</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">中国的官方立场</p>
            <h1>制裁、反制裁与域外措施官方发言库</h1>
            <p class="detail-summary">
              收录外交部、中国常驻联合国代表团、商务部等机构就制裁、反制裁、域外管辖、出口管制、联合国制裁和经贸限制措施所作的官方中英文发言。
            </p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>官方发言</dt><dd>${indexedOfficialStatements.length}</dd></div>
              <div><dt>机构来源</dt><dd>${institutions.length}</dd></div>
              <div><dt>当前结果</dt><dd>${filtered.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="filter-panel">
        <div class="section-head">
          <h2>官方发言检索</h2>
          <p>按机构、场合、年份和关键词快速定位双语官方立场文本。</p>
        </div>
        <div class="filter-grid filter-grid-official">
          <label>
            <span>关键词</span>
            <input id="official-query" type="search" placeholder="如：单边强制措施 / export controls / 加拿大" value="${escapeHtml(
              state.officialQuery,
            )}" />
          </label>
          <label>
            <span>机构</span>
            <select id="official-institution">
              <option value="">全部机构</option>
              ${institutions
                .map(
                  (institution) => `
                    <option value="${escapeHtml(institution)}" ${institution === state.officialInstitution ? "selected" : ""}>
                      ${escapeHtml(institution)}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span>场合</span>
            <select id="official-venue">
              <option value="">全部场合</option>
              ${venues
                .map(
                  (venue) => `
                    <option value="${escapeHtml(venue)}" ${venue === state.officialVenue ? "selected" : ""}>
                      ${escapeHtml(venue)}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span>年份</span>
            <select id="official-year">
              <option value="">全部年份</option>
              ${years
                .map(
                  (year) => `
                    <option value="${escapeHtml(year)}" ${year === state.officialYear ? "selected" : ""}>
                      ${escapeHtml(year)}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
        </div>
      </section>

      ${renderOfficialSecondaryNav(state)}

      ${
        state.officialBrowseMode === "year"
          ? renderOfficialYearArchive(filtered)
          : state.officialBrowseMode === "topic"
            ? renderOfficialTopicArchive(filtered)
            : state.officialBrowseMode === "fixed"
              ? renderOfficialFixedThemes(filtered)
              : `
              <section class="catalog">
                <div class="section-head">
                  <h2>官方发言目录</h2>
                  <p>当前结果 ${filtered.length} 条</p>
                </div>
                <div class="official-grid">
                  ${filtered.length ? filtered.map(renderOfficialStatementCard).join("") : "<p>当前筛选条件下暂无结果。</p>"}
                </div>
              </section>
            `
      }
    </main>
  `;
}

function renderOfficialDetail(record) {
  if (!record) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/official-positions" class="text-link">返回官方立场栏目</a>
          <h1>未找到该官方发言</h1>
        </section>
      </main>
    `;
  }

  const relatedLaws = record.relatedLawIds.map((id) => indexedLaws.find((law) => law.id === id)).filter(Boolean);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/official-positions" class="text-link">← 返回官方立场栏目</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">${escapeHtml(record.institutionZh)} · ${escapeHtml(record.venueZh)}</p>
            <h1>${escapeHtml(record.titleZh)}</h1>
            <p class="detail-en">${escapeHtml(record.titleEn)}</p>
            <p class="detail-summary">${escapeHtml(record.summary)}</p>
            <div class="pill-row">
              ${record.topics.map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
            </div>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>机构</dt><dd>${escapeHtml(record.institutionZh)}</dd></div>
              <div><dt>发言人</dt><dd>${escapeHtml(record.speakerZh)} / ${escapeHtml(record.speakerEn)}</dd></div>
              <div><dt>场合</dt><dd>${escapeHtml(record.venueZh)}</dd></div>
              <div><dt>日期</dt><dd>${escapeHtml(record.date)}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>官方来源</h2>
          <p>仅收录中国政府部门或常驻联合国代表团官方中英文页面。</p>
        </div>
        ${renderSources(record.sources)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>中英文本</h2>
          <p>默认并排展示官方中文和官方英文节录，便于对照使用。</p>
        </div>
        ${renderBilingualText(record)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>相关中国法律</h2>
          <p>把官方立场发言与网站内的中国反制裁、反域外措施和出口管制法律条文直接挂接。</p>
        </div>
        <div class="law-grid">
          ${relatedLaws.length ? relatedLaws.map(renderLawCard).join("") : "<p>当前条目暂无挂接相关法律。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderOfficialThemeDetail(theme) {
  if (!theme) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/official-positions" class="text-link">返回官方立场栏目</a>
          <h1>未找到该固定专题</h1>
        </section>
      </main>
    `;
  }

  const relatedStatements = collectOfficialThemeStatements(theme, indexedOfficialStatements);
  const relatedLaws = collectOfficialThemeLaws(theme, indexedOfficialStatements);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/official-positions" class="text-link">← 返回官方立场栏目</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">固定专题</p>
            <h1>${escapeHtml(theme.nameZh)}</h1>
            <p class="detail-en">${escapeHtml(theme.nameEn)}</p>
            <p class="detail-summary">${escapeHtml(theme.description)}</p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>官方发言</dt><dd>${relatedStatements.length}</dd></div>
              <div><dt>关联法律</dt><dd>${relatedLaws.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>专题内官方发言</h2>
          <p>按固定研究主题聚合外交部、商务部和驻联合国代表团的双语官方表述。</p>
        </div>
        <div class="official-grid">
          ${relatedStatements.length ? relatedStatements.map(renderOfficialStatementCard).join("") : "<p>当前专题暂无已匹配发言。</p>"}
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>相关中国法律</h2>
          <p>从本专题涉及的官方发言反向聚合网站内对应的中国法律文本。</p>
        </div>
        <div class="law-grid">
          ${relatedLaws.length ? relatedLaws.map(renderLawCard).join("") : "<p>当前专题暂无相关法律挂接。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalMaterialCard(record) {
  return `
    <article class="law-card">
      <div class="law-card-top">
        <div>
          <p class="eyebrow">${escapeHtml(record.jurisdiction)} · ${escapeHtml(record.documentType)}</p>
          <h3><a href="#/international-law/${record.id}">${escapeHtml(record.titleZh)}</a></h3>
          <p class="law-card-en">${escapeHtml(record.titleEn)}</p>
        </div>
        <div class="law-status">${escapeHtml(record.date)}</div>
      </div>
      <p class="law-summary">${escapeHtml(record.summary)}</p>
      <div class="pill-row">
        ${(record.topics ?? []).map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
      </div>
      <div class="law-meta">
        <span>文号：${escapeHtml(record.shortTitle || "—")}</span>
        <span>机构：${escapeHtml(record.bodyZh || record.bodyEn)}</span>
        <span>文本：${escapeHtml((record.languages ?? []).join(" / "))}</span>
      </div>
    </article>
  `;
}

function renderInternationalThemeCard(theme, records) {
  const matchedMaterials = collectInternationalThemeMaterials(theme, records);

  return `
    <article class="topic-card">
      <div class="topic-head">
        <div>
          <p class="eyebrow">固定专题</p>
          <h3><a href="#/international-law/themes/${theme.id}">${escapeHtml(theme.nameZh)}</a></h3>
          <p class="topic-en">${escapeHtml(theme.nameEn)}</p>
        </div>
      </div>
      <p>${escapeHtml(theme.description)}</p>
      <div class="pill-row">
        <span class="pill">国际材料 ${matchedMaterials.length}</span>
      </div>
    </article>
  `;
}

const INTERNATIONAL_RESEARCH_GROUP_LABELS = {
  "government-parliament": "政府与议会研究",
  "international-organization": "国际组织与机构研究",
  "think-tank": "智库报告",
};

function renderInternationalResearchCard(record) {
  return `
    <article class="law-card">
      <div class="law-card-top">
        <div>
          <p class="eyebrow">${escapeHtml(record.jurisdiction)} · ${escapeHtml(record.documentType)}</p>
          <h3><a href="#/international-law/research/${record.id}">${escapeHtml(record.titleZh)}</a></h3>
          <p class="law-card-en">${escapeHtml(record.titleEn)}</p>
        </div>
        <div class="law-status">${escapeHtml(record.date)}</div>
      </div>
      <p class="law-summary">${escapeHtml(record.summary)}</p>
      <div class="pill-row">
        <span class="pill pill-muted">${escapeHtml(INTERNATIONAL_RESEARCH_GROUP_LABELS[record.institutionType] || record.institutionType)}</span>
        ${(record.topics ?? []).slice(0, 3).map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
      </div>
      <div class="law-meta">
        <span>机构：${escapeHtml(record.institutionZh || record.institutionEn)}</span>
        <span>语种：${escapeHtml((record.languages ?? []).join(" / "))}</span>
      </div>
    </article>
  `;
}

function renderInternationalDecisionCard(record) {
  return `
    <article class="law-card">
      <div class="law-card-top">
        <div>
          <p class="eyebrow">${escapeHtml(record.jurisdiction)} · ${escapeHtml(record.decisionType)}</p>
          <h3><a href="#/international-law/cases/${record.id}">${escapeHtml(record.titleZh)}</a></h3>
          <p class="law-card-en">${escapeHtml(record.titleEn)}</p>
        </div>
        <div class="law-status">${escapeHtml(record.date)}</div>
      </div>
      <p class="law-summary">${escapeHtml(record.summary)}</p>
      <div class="pill-row">
        ${(record.topics ?? []).slice(0, 3).map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
      </div>
      <div class="law-meta">
        <span>机构：${escapeHtml(record.forumZh || record.forumEn)}</span>
        <span>文本：${escapeHtml((record.languages ?? []).join(" / "))}</span>
      </div>
    </article>
  `;
}

function filterInternationalResearchReports(records, filters) {
  return filterCatalog(records, {
    query: filters.internationalResearchQuery,
    language: filters.internationalResearchLanguage,
    type: "international-research-report",
  }).filter((record) => {
    if (filters.internationalResearchInstitutionType && record.institutionType !== filters.internationalResearchInstitutionType) return false;
    if (filters.internationalResearchJurisdiction && record.jurisdiction !== filters.internationalResearchJurisdiction) return false;
    return true;
  });
}

function groupInternationalResearchReports(records) {
  const grouped = new Map();

  (records ?? []).forEach((record) => {
    const key = INTERNATIONAL_RESEARCH_GROUP_LABELS[record.institutionType] || record.institutionType || "其他";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  });

  return [...grouped.entries()]
    .map(([group, groupRecords]) => ({
      group,
      records: groupRecords.slice().sort((left, right) => right.date.localeCompare(left.date)),
    }))
    .sort((left, right) => right.records.length - left.records.length || left.group.localeCompare(right.group, "zh-Hans-CN"));
}

function filterInternationalDecisions(records, filters) {
  return filterCatalog(records, {
    query: filters.internationalDecisionQuery,
    language: filters.internationalDecisionLanguage,
    type: "international-decision",
  }).filter((record) => {
    if (filters.internationalDecisionForum && record.forumEn !== filters.internationalDecisionForum) return false;
    if (filters.internationalDecisionType && record.decisionType !== filters.internationalDecisionType) return false;
    return true;
  });
}

function groupInternationalDecisions(records) {
  const grouped = new Map();

  (records ?? []).forEach((record) => {
    const key = record.forumZh || record.forumEn || "其他";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  });

  return [...grouped.entries()]
    .map(([group, groupRecords]) => ({
      group,
      records: groupRecords.slice().sort((left, right) => right.date.localeCompare(left.date)),
    }))
    .sort((left, right) => right.records.length - left.records.length || left.group.localeCompare(right.group, "zh-Hans-CN"));
}

function collectInternationalDecisionThemeRecords(theme, records) {
  if (!theme) return [];

  const topicSet = new Set(theme.matchTopics ?? []);
  const typeSet = new Set(theme.matchDecisionTypes ?? []);

  return (records ?? [])
    .filter((record) => {
      const hasTopicMatch = (record.topics ?? []).some((topic) => topicSet.has(topic));
      const hasTypeMatch = typeSet.has(record.decisionType);
      return hasTopicMatch || hasTypeMatch;
    })
    .sort((left, right) => right.date.localeCompare(left.date));
}

function collectInternationalDecisionThemeLaws(theme, records) {
  const relatedLawIds = new Set(
    collectInternationalDecisionThemeRecords(theme, records).flatMap((record) => record.relatedLawIds ?? []),
  );

  return [...relatedLawIds]
    .map((id) => indexedLaws.find((law) => law.id === id))
    .filter(Boolean);
}

function collectInternationalReportMaterials(records) {
  return (records ?? []).filter(
    (record) =>
      Boolean(record.reportSeries) ||
      ["Secretary-General Report", "OHCHR Thematic Study", "OHCHR Explainer", "Special Rapporteur Report", "Special Rapporteur Country Visit", "State Submission / Reply"].includes(
        record.documentType,
      ),
  );
}

function groupInternationalReports(records) {
  const grouped = new Map();

  collectInternationalReportMaterials(records).forEach((record) => {
    const key = record.reportSeries || "其他正式工作文件";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  });

  return [...grouped.entries()]
    .map(([series, seriesRecords]) => ({
      series,
      records: seriesRecords.slice().sort((left, right) => right.date.localeCompare(left.date)),
    }))
    .sort((left, right) => right.records.length - left.records.length || left.series.localeCompare(right.series, "zh-Hans-CN"));
}

function filterInternationalArchive(records, filters) {
  return filterCatalog(records, {
    query: filters.internationalQuery,
    language: filters.internationalLanguage,
    type: "international-material",
  }).filter((record) => {
    if (filters.internationalBody && record.bodyEn !== filters.internationalBody) return false;
    if (filters.internationalType && record.documentType !== filters.internationalType) return false;
    return true;
  });
}

function renderInternationalSecondaryNav(state) {
  const views = [
    { id: "catalog", label: "目录检索" },
    { id: "year", label: "按年份归档" },
    { id: "fixed", label: "固定专题" },
    { id: "reports", label: "文献与报告" },
  ];

  return `
    <section class="detail-section official-subnav">
      <div class="section-head">
        <h2>二级导航</h2>
        <p>在国际材料总目录和固定专题之间切换，适合长期比较研究和持续补档。</p>
      </div>
      <div class="official-view-switches">
        ${views
          .map(
            (view) => `
              <button class="international-view-switch ${state.internationalBrowseMode === view.id ? "is-active" : ""}" data-international-view="${view.id}">
                ${view.label}
              </button>`,
          )
          .join("")}
        <a class="international-view-switch" href="#/international-law/cases">判决与裁决</a>
        <a class="international-view-switch" href="#/international-law/research">研究报告与政策文件</a>
      </div>
    </section>
  `;
}

function renderInternationalDecisionPreview() {
  const highlights = indexedInternationalDecisions.slice(0, 4);

  return `
    <section class="catalog">
      <div class="section-head">
        <div>
          <h2>判决与裁决</h2>
          <p>新增独立分支，收录国际法院、欧盟法院、英国和美国最高法院，以及重要仲裁庭围绕制裁、单边强制措施、资产冻结和次级制裁作出的判决与裁决。</p>
        </div>
        <a class="text-link" href="#/international-law/cases">进入分支栏目</a>
      </div>
      <div class="law-grid">
        ${highlights.map(renderInternationalDecisionCard).join("")}
      </div>
    </section>
  `;
}

function renderInternationalIssuePreview() {
  return `
    <section class="catalog">
      <div class="section-head">
        <div>
          <h2>专题导航页</h2>
          <p>把正式国际材料、研究报告与政策文件、判决与裁决三条线按同一争点并排聚合，适合长期研究和教学使用。</p>
        </div>
        <a class="text-link" href="#/international-law/issues">进入专题导航</a>
      </div>
      <div class="topic-stack">
        ${internationalIssueTopics.map((theme) => renderInternationalIssueTopicCard(theme)).join("")}
      </div>
    </section>
  `;
}

function renderInternationalDecisionThemeCard(theme) {
  const matched = collectInternationalDecisionThemeRecords(theme, indexedInternationalDecisions);

  return `
    <article class="topic-card">
      <div class="topic-head">
        <div>
          <p class="eyebrow">固定专题</p>
          <h3><a href="#/international-law/cases/themes/${theme.id}">${escapeHtml(theme.nameZh)}</a></h3>
          <p class="topic-en">${escapeHtml(theme.nameEn)}</p>
        </div>
      </div>
      <p>${escapeHtml(theme.description)}</p>
      <div class="pill-row">
        <span class="pill">判决与裁决 ${matched.length}</span>
      </div>
    </article>
  `;
}

function renderInternationalIssueTopicCard(theme) {
  const materials = collectInternationalIssueMaterials(theme);
  const reports = collectInternationalIssueResearchReports(theme);
  const decisions = collectInternationalIssueDecisions(theme);

  return `
    <article class="topic-card">
      <div class="topic-head">
        <div>
          <p class="eyebrow">专题导航页</p>
          <h3><a href="#/international-law/issues/${theme.id}">${escapeHtml(theme.nameZh)}</a></h3>
          <p class="topic-en">${escapeHtml(theme.nameEn)}</p>
        </div>
      </div>
      <p>${escapeHtml(theme.description)}</p>
      <div class="pill-row">
        <span class="pill">正式材料 ${materials.length}</span>
        <span class="pill">研究报告 ${reports.length}</span>
        <span class="pill">判决裁决 ${decisions.length}</span>
      </div>
    </article>
  `;
}

function renderInternationalResearchPreview() {
  const highlights = indexedInternationalResearchReports.slice(0, 4);

  return `
    <section class="catalog">
      <div class="section-head">
        <div>
          <h2>研究报告与政策文件</h2>
          <p>新增独立分支，收录国际组织、国会或议会研究服务，以及美国、欧洲、中国等重要智库关于制裁、UCMs、次级制裁和出口管制的研究报告。</p>
        </div>
        <a class="text-link" href="#/international-law/research">进入分支栏目</a>
      </div>
      <div class="law-grid">
        ${highlights.map(renderInternationalResearchCard).join("")}
      </div>
    </section>
  `;
}

function renderInternationalReportsView(records) {
  const groups = groupInternationalReports(records);

  return `
    <section class="catalog">
      <div class="section-head">
        <h2>文献与报告</h2>
        <p>集中展示秘书长报告、OHCHR 主题研究、特别报告员报告、说明性材料以及国家或区域组织提交的正式工作文件。</p>
      </div>
      <div class="anchor-row">
        ${groups
          .map(
            (group) =>
              `<a class="pill" href="#international-report-${slugifyAnchor(group.series)}">${escapeHtml(group.series)} <span class="pill-count">${group.records.length}</span></a>`,
          )
          .join("")}
      </div>
      <div class="official-archive-stack">
        ${groups.length
          ? groups
              .map(
                (group) => `
                  <section class="official-group" id="international-report-${slugifyAnchor(group.series)}">
                    <div class="section-head">
                      <h3>${escapeHtml(group.series)}</h3>
                      <p>${group.records.length} 份工作文件或说明性报告</p>
                    </div>
                    <div class="law-grid">
                      ${group.records.map(renderInternationalMaterialCard).join("")}
                    </div>
                  </section>`,
              )
              .join("")
          : "<p>当前筛选条件下暂无文献与报告结果。</p>"}
      </div>
    </section>
  `;
}

function renderInternationalYearArchive(records) {
  const groups = groupInternationalMaterialsByYear(records);

  return `
    <section class="catalog">
      <div class="section-head">
        <h2>按年份归档</h2>
        <p>按年份回看联合国系统和各国在正式场合关于单边强制措施、制裁和域外管辖的材料演进。</p>
      </div>
      <div class="anchor-row">
        ${groups
          .map(
            (group) => `<a class="pill" href="#international-year-${group.year}">${escapeHtml(group.year)} <span class="pill-count">${group.records.length}</span></a>`,
          )
          .join("")}
      </div>
      <div class="official-archive-stack">
        ${groups.length
          ? groups
              .map(
                (group) => `
                  <section class="official-group" id="international-year-${group.year}">
                    <div class="section-head">
                      <h3>${escapeHtml(group.year)}</h3>
                      <p>${group.records.length} 条国际材料</p>
                    </div>
                    <div class="law-grid">
                      ${group.records.map(renderInternationalMaterialCard).join("")}
                    </div>
                  </section>`,
              )
              .join("")
          : "<p>当前筛选条件下暂无年份归档结果。</p>"}
      </div>
    </section>
  `;
}

function renderInternationalFixedThemes(records) {
  return `
    <section class="catalog">
      <div class="section-head">
        <h2>固定专题</h2>
        <p>围绕联合国体系、安理会制裁、人权机制和国家立场分歧四个长期入口组织国际法材料。</p>
      </div>
      <div class="topic-stack">
        ${internationalLawTopics.map((theme) => renderInternationalThemeCard(theme, records)).join("")}
      </div>
    </section>
  `;
}

function renderInternationalPreview() {
  const highlights = indexedInternationalMaterials.slice(0, 4);

  return `
    <section class="official-positions-home">
      <div class="section-head">
        <div>
          <h2>国际法上的态度</h2>
          <p>收录联合国大会、安理会、人权理事会、特别报告员以及各国在正式联合国场合就单边强制措施、制裁和域外管辖作出的官方文本。</p>
        </div>
        <a class="text-link" href="#/international-law">进入栏目</a>
      </div>
      <div class="law-grid">
        ${highlights.map(renderInternationalMaterialCard).join("")}
      </div>
    </section>
  `;
}

function renderInternationalList(state) {
  const filtered = filterInternationalArchive(indexedInternationalMaterials, state);
  const bodies = uniqueValues(indexedInternationalMaterials, "bodyEn");
  const documentTypes = uniqueValues(indexedInternationalMaterials, "documentType");

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/" class="text-link">← 返回首页</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">国际法上的态度</p>
            <h1>单边强制措施、制裁与域外管辖国际材料库</h1>
            <p class="detail-summary">
              只收录联合国大会、安理会、人权理事会、特别程序以及国家或区域组织在联合国正式场合中直接讨论单边强制措施、制裁和域外管辖的官方文本。
            </p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>材料总数</dt><dd>${indexedInternationalMaterials.length}</dd></div>
              <div><dt>发布机构</dt><dd>${bodies.length}</dd></div>
              <div><dt>当前结果</dt><dd>${filtered.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="filter-panel">
        <div class="section-head">
          <h2>国际材料检索</h2>
          <p>按关键词、发布机构、文件类型和语种筛选正式国际法材料。</p>
        </div>
        <div class="filter-grid filter-grid-official">
          <label>
            <span>关键词</span>
            <input id="international-query" type="search" placeholder="如：unilateral coercive measures / Security Council / extraterritoriality" value="${escapeHtml(
              state.internationalQuery,
            )}" />
          </label>
          <label>
            <span>发布机构</span>
            <select id="international-body">
              <option value="">全部机构</option>
              ${bodies
                .map(
                  (body) => `
                    <option value="${escapeHtml(body)}" ${body === state.internationalBody ? "selected" : ""}>
                      ${escapeHtml(body)}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span>文件类型</span>
            <select id="international-type">
              <option value="">全部类型</option>
              ${documentTypes
                .map(
                  (documentType) => `
                    <option value="${escapeHtml(documentType)}" ${documentType === state.internationalType ? "selected" : ""}>
                      ${escapeHtml(documentType)}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span>语种</span>
            <select id="international-language">
              <option value="">全部</option>
              <option value="zh" ${state.internationalLanguage === "zh" ? "selected" : ""}>中文</option>
              <option value="en" ${state.internationalLanguage === "en" ? "selected" : ""}>English</option>
            </select>
          </label>
        </div>
      </section>

      ${renderInternationalSecondaryNav(state)}

      ${renderInternationalIssuePreview()}

      ${renderInternationalDecisionPreview()}

      ${renderInternationalResearchPreview()}

      ${
        state.internationalBrowseMode === "year"
          ? renderInternationalYearArchive(filtered)
          : state.internationalBrowseMode === "reports"
            ? renderInternationalReportsView(filtered)
          : state.internationalBrowseMode === "fixed"
          ? renderInternationalFixedThemes(filtered)
          : `
            <section class="catalog">
              <div class="section-head">
                <h2>材料目录</h2>
                <p>当前结果 ${filtered.length} 条</p>
              </div>
              <div class="law-grid">
                ${filtered.length ? filtered.map(renderInternationalMaterialCard).join("") : "<p>当前筛选条件下暂无结果。</p>"}
              </div>
            </section>
          `
      }
    </main>
  `;
}

function renderInternationalResearchList(state) {
  const filtered = filterInternationalResearchReports(indexedInternationalResearchReports, state);
  const jurisdictions = uniqueValues(indexedInternationalResearchReports, "jurisdiction");
  const groups = groupInternationalResearchReports(filtered);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law" class="text-link">← 返回国际法栏目</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">研究报告与政策文件</p>
            <h1>国际组织、政府与智库研究报告库</h1>
            <p class="detail-summary">
              收录与制裁、单边强制措施、次级制裁、出口管制和域外管辖直接相关的研究型报告。优先纳入国际组织、国会或议会研究服务，以及美国、欧洲、中国等重要智库的原始机构页面。
            </p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>条目总数</dt><dd>${indexedInternationalResearchReports.length}</dd></div>
              <div><dt>当前结果</dt><dd>${filtered.length}</dd></div>
              <div><dt>机构类型</dt><dd>${new Set(indexedInternationalResearchReports.map((record) => record.institutionType)).size}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="filter-panel">
        <div class="section-head">
          <h2>研究报告检索</h2>
          <p>按关键词、机构类型、法域和语种筛选研究报告与政策文件。</p>
        </div>
        <div class="filter-grid filter-grid-official">
          <label>
            <span>关键词</span>
            <input id="international-research-query" type="search" placeholder="如：secondary sanctions / export controls / China" value="${escapeHtml(
              state.internationalResearchQuery,
            )}" />
          </label>
          <label>
            <span>机构类型</span>
            <select id="international-research-institution-type">
              <option value="">全部</option>
              <option value="government-parliament" ${state.internationalResearchInstitutionType === "government-parliament" ? "selected" : ""}>政府与议会</option>
              <option value="international-organization" ${state.internationalResearchInstitutionType === "international-organization" ? "selected" : ""}>国际组织</option>
              <option value="think-tank" ${state.internationalResearchInstitutionType === "think-tank" ? "selected" : ""}>智库</option>
            </select>
          </label>
          <label>
            <span>法域</span>
            <select id="international-research-jurisdiction">
              <option value="">全部法域</option>
              ${jurisdictions
                .map(
                  (jurisdiction) => `
                    <option value="${escapeHtml(jurisdiction)}" ${jurisdiction === state.internationalResearchJurisdiction ? "selected" : ""}>
                      ${escapeHtml(jurisdiction)}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span>语种</span>
            <select id="international-research-language">
              <option value="">全部</option>
              <option value="zh" ${state.internationalResearchLanguage === "zh" ? "selected" : ""}>中文</option>
              <option value="en" ${state.internationalResearchLanguage === "en" ? "selected" : ""}>English</option>
            </select>
          </label>
        </div>
      </section>

      <section class="catalog">
        <div class="section-head">
          <h2>分组浏览</h2>
          <p>按机构类型浏览，先看政府与议会研究，再看国际组织与主要智库的政策研究。</p>
        </div>
        <div class="anchor-row">
          ${groups
            .map(
              (group) =>
                `<a class="pill" href="#international-research-${slugifyAnchor(group.group)}">${escapeHtml(group.group)} <span class="pill-count">${group.records.length}</span></a>`,
            )
            .join("")}
        </div>
        <div class="official-archive-stack">
          ${groups.length
            ? groups
                .map(
                  (group) => `
                    <section class="official-group" id="international-research-${slugifyAnchor(group.group)}">
                      <div class="section-head">
                        <h3>${escapeHtml(group.group)}</h3>
                        <p>${group.records.length} 份研究报告或政策文件</p>
                      </div>
                      <div class="law-grid">
                        ${group.records.map(renderInternationalResearchCard).join("")}
                      </div>
                    </section>`,
                )
                .join("")
            : "<p>当前筛选条件下暂无研究报告结果。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalIssueList() {
  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law" class="text-link">← 返回国际法栏目</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">专题导航页</p>
            <h1>国际法资料库专题导航</h1>
            <p class="detail-summary">
              按争点而不是按资料类型组织整个国际法资料库，把联合国正式文本、政策研究报告和司法判决或仲裁裁决统一聚合到同一入口。
            </p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>专题数</dt><dd>${internationalIssueTopics.length}</dd></div>
              <div><dt>正式材料</dt><dd>${indexedInternationalMaterials.length}</dd></div>
              <div><dt>研究报告</dt><dd>${indexedInternationalResearchReports.length}</dd></div>
              <div><dt>判决裁决</dt><dd>${indexedInternationalDecisions.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="catalog">
        <div class="section-head">
          <h2>导航专题</h2>
          <p>进入任一专题后，可并排看到正式国际材料、研究报告与政策文件、判决与裁决三类内容。</p>
        </div>
        <div class="topic-stack">
          ${internationalIssueTopics.map((theme) => renderInternationalIssueTopicCard(theme)).join("")}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalIssueDetail(theme) {
  if (!theme) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/international-law/issues" class="text-link">返回专题导航页</a>
          <h1>未找到该专题</h1>
        </section>
      </main>
    `;
  }

  const materials = collectInternationalIssueMaterials(theme);
  const reports = collectInternationalIssueResearchReports(theme);
  const decisions = collectInternationalIssueDecisions(theme);
  const laws = collectInternationalIssueLaws(theme);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law/issues" class="text-link">← 返回专题导航页</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">专题导航页</p>
            <h1>${escapeHtml(theme.nameZh)}</h1>
            <p class="detail-en">${escapeHtml(theme.nameEn)}</p>
            <p class="detail-summary">${escapeHtml(theme.description)}</p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>正式材料</dt><dd>${materials.length}</dd></div>
              <div><dt>研究报告</dt><dd>${reports.length}</dd></div>
              <div><dt>判决裁决</dt><dd>${decisions.length}</dd></div>
              <div><dt>相关中国法律</dt><dd>${laws.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>正式国际材料</h2>
          <p>聚合联合国和各国在正式国际法场合的文本与制度材料。</p>
        </div>
        <div class="law-grid">
          ${materials.length ? materials.map(renderInternationalMaterialCard).join("") : "<p>当前专题暂无已匹配的正式国际材料。</p>"}
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>研究报告与政策文件</h2>
          <p>聚合国际组织、议会研究服务和主要智库的研究成果。</p>
        </div>
        <div class="law-grid">
          ${reports.length ? reports.map(renderInternationalResearchCard).join("") : "<p>当前专题暂无已匹配的研究报告。</p>"}
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>判决与裁决</h2>
          <p>聚合同一争点下的重要国际法院、国内最高法院和仲裁裁决。</p>
        </div>
        <div class="law-grid">
          ${decisions.length ? decisions.map(renderInternationalDecisionCard).join("") : "<p>当前专题暂无已匹配的判决或裁决。</p>"}
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>相关中国法律</h2>
          <p>从国际法资料和争点反向挂接站内中国法律文本，便于专题式比较研究。</p>
        </div>
        <div class="law-grid">
          ${laws.length ? laws.map(renderLawCard).join("") : "<p>当前专题暂无挂接的中国法律。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalDecisionList(state) {
  const filtered = filterInternationalDecisions(indexedInternationalDecisions, state);
  const forums = uniqueValues(indexedInternationalDecisions, "forumEn");
  const decisionTypes = uniqueValues(indexedInternationalDecisions, "decisionType");
  const groups = groupInternationalDecisions(filtered);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law" class="text-link">← 返回国际法栏目</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">判决与裁决</p>
            <h1>制裁、单边强制措施与域外管辖判决库</h1>
            <p class="detail-summary">
              收录与制裁、单边强制措施、资产冻结、次级制裁、阻断机制和域外管辖直接相关的重要司法判决与仲裁裁决，尤其优先纳入国际法院、英美最高法院、欧盟法院和重要国际仲裁庭材料。
            </p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>条目总数</dt><dd>${indexedInternationalDecisions.length}</dd></div>
              <div><dt>当前结果</dt><dd>${filtered.length}</dd></div>
              <div><dt>裁判机构</dt><dd>${forums.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="filter-panel">
        <div class="section-head">
          <h2>判决与裁决检索</h2>
          <p>按关键词、裁判机构、文书类型和语种筛选。</p>
        </div>
        <div class="filter-grid filter-grid-official">
          <label>
            <span>关键词</span>
            <input id="international-decision-query" type="search" placeholder="如：ICJ / secondary sanctions / asset freezes" value="${escapeHtml(
              state.internationalDecisionQuery,
            )}" />
          </label>
          <label>
            <span>裁判机构</span>
            <select id="international-decision-forum">
              <option value="">全部</option>
              ${forums
                .map(
                  (forum) => `
                    <option value="${escapeHtml(forum)}" ${forum === state.internationalDecisionForum ? "selected" : ""}>
                      ${escapeHtml(forum)}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span>文书类型</span>
            <select id="international-decision-type">
              <option value="">全部</option>
              ${decisionTypes
                .map(
                  (decisionType) => `
                    <option value="${escapeHtml(decisionType)}" ${decisionType === state.internationalDecisionType ? "selected" : ""}>
                      ${escapeHtml(decisionType)}
                    </option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span>语种</span>
            <select id="international-decision-language">
              <option value="">全部</option>
              <option value="zh" ${state.internationalDecisionLanguage === "zh" ? "selected" : ""}>中文</option>
              <option value="en" ${state.internationalDecisionLanguage === "en" ? "selected" : ""}>English</option>
            </select>
          </label>
        </div>
      </section>

      <section class="catalog">
        <div class="section-head">
          <h2>固定专题</h2>
          <p>按争点而不是按法院浏览，把反复出现的制裁合法性、资产冻结、阻断法冲突和仲裁争议整理成固定研究入口。</p>
        </div>
        <div class="topic-stack">
          ${internationalDecisionTopics.map((theme) => renderInternationalDecisionThemeCard(theme)).join("")}
        </div>
      </section>

      <section class="catalog">
        <div class="section-head">
          <h2>分组浏览</h2>
          <p>按裁判机构分组，先看国际法院与欧盟法院，再看英美最高法院和仲裁裁决。</p>
        </div>
        <div class="anchor-row">
          ${groups
            .map(
              (group) =>
                `<a class="pill" href="#international-decision-${slugifyAnchor(group.group)}">${escapeHtml(group.group)} <span class="pill-count">${group.records.length}</span></a>`,
            )
            .join("")}
        </div>
        <div class="official-archive-stack">
          ${groups.length
            ? groups
                .map(
                  (group) => `
                    <section class="official-group" id="international-decision-${slugifyAnchor(group.group)}">
                      <div class="section-head">
                        <h3>${escapeHtml(group.group)}</h3>
                        <p>${group.records.length} 份判决或裁决</p>
                      </div>
                      <div class="law-grid">
                        ${group.records.map(renderInternationalDecisionCard).join("")}
                      </div>
                    </section>`,
                )
                .join("")
            : "<p>当前筛选条件下暂无判决与裁决结果。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalDecisionThemeDetail(theme) {
  if (!theme) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/international-law/cases" class="text-link">返回判决与裁决分支</a>
          <h1>未找到该固定专题</h1>
        </section>
      </main>
    `;
  }

  const relatedDecisions = collectInternationalDecisionThemeRecords(theme, indexedInternationalDecisions);
  const relatedLaws = collectInternationalDecisionThemeLaws(theme, indexedInternationalDecisions);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law/cases" class="text-link">← 返回判决与裁决分支</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">固定专题</p>
            <h1>${escapeHtml(theme.nameZh)}</h1>
            <p class="detail-en">${escapeHtml(theme.nameEn)}</p>
            <p class="detail-summary">${escapeHtml(theme.description)}</p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>判决与裁决</dt><dd>${relatedDecisions.length}</dd></div>
              <div><dt>相关中国法律</dt><dd>${relatedLaws.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>专题内判决与裁决</h2>
          <p>围绕同一争点聚合国际法院、欧盟法院、英美最高法院和仲裁庭的重要材料。</p>
        </div>
        <div class="law-grid">
          ${relatedDecisions.length ? relatedDecisions.map(renderInternationalDecisionCard).join("") : "<p>当前专题暂无已匹配材料。</p>"}
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>相关中国法律</h2>
          <p>从专题内案例反向挂接站内中国法律条目，便于比较法研究。</p>
        </div>
        <div class="law-grid">
          ${relatedLaws.length ? relatedLaws.map(renderLawCard).join("") : "<p>当前专题暂无挂接的中国法律。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalDecisionDetail(record, detailLanguage) {
  if (!record) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/international-law/cases" class="text-link">返回判决与裁决分支</a>
          <h1>未找到该判决或裁决</h1>
        </section>
      </main>
    `;
  }

  const hasBilingualText = (record.languages ?? []).includes("zh") && (record.languages ?? []).includes("en");
  const availableLanguages = (record.languages ?? []).filter(
    (language) => (record.texts?.[language]?.sections ?? []).length > 0,
  );
  const selectedLanguage = availableLanguages.includes(detailLanguage)
    ? detailLanguage
    : availableLanguages[0] || record.languages[0];
  const selectedText = record.texts[selectedLanguage] ?? { note: "No onsite text available.", sections: [] };
  const relatedLaws = (record.relatedLawIds ?? [])
    .map((id) => indexedLaws.find((law) => law.id === id))
    .filter(Boolean);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law/cases" class="text-link">← 返回判决与裁决分支</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">${escapeHtml(record.jurisdiction)} · ${escapeHtml(record.decisionType)}</p>
            <h1>${escapeHtml(record.titleZh)}</h1>
            <p class="detail-en">${escapeHtml(record.titleEn)}</p>
            <p class="detail-summary">${escapeHtml(record.summary)}</p>
            <div class="pill-row">
              ${(record.topics ?? []).map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
            </div>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>简称</dt><dd>${escapeHtml(record.shortTitle || "—")}</dd></div>
              <div><dt>裁判机构</dt><dd>${escapeHtml(record.forumZh || record.forumEn)}</dd></div>
              <div><dt>日期</dt><dd>${escapeHtml(record.date)}</dd></div>
              <div><dt>状态</dt><dd>${escapeHtml(record.status)}</dd></div>
              <div><dt>语种</dt><dd>${escapeHtml((record.languages ?? []).join(" / "))}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>原始来源</h2>
          <p>优先保留法院、仲裁庭和官方案例数据库原始链接。</p>
        </div>
        ${renderSources(record.sources)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>内容提要</h2>
          <p>${escapeHtml(
            hasBilingualText
              ? "如能找到官方中文版本，则并排显示中英文；目前大多数司法与仲裁文书以英文官方文本为主。"
              : selectedText.note,
          )}</p>
        </div>
        ${hasBilingualText ? renderBilingualText(record) : renderSingleLanguageText(record, selectedLanguage, selectedText)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>相关中国法律</h2>
          <p>把判决与裁决中的核心制度问题反向挂接到站内中国法律文本，便于比较研究。</p>
        </div>
        <div class="law-grid">
          ${relatedLaws.length ? relatedLaws.map(renderLawCard).join("") : "<p>当前条目暂无挂接的中国法律。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalResearchDetail(record, detailLanguage) {
  if (!record) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/international-law/research" class="text-link">返回研究报告分支</a>
          <h1>未找到该研究报告</h1>
        </section>
      </main>
    `;
  }

  const hasBilingualText = (record.languages ?? []).includes("zh") && (record.languages ?? []).includes("en");
  const availableLanguages = (record.languages ?? []).filter(
    (language) => (record.texts?.[language]?.sections ?? []).length > 0,
  );
  const selectedLanguage = availableLanguages.includes(detailLanguage)
    ? detailLanguage
    : availableLanguages[0] || record.languages[0];
  const selectedText = record.texts[selectedLanguage] ?? { note: "No onsite text available.", sections: [] };
  const relatedLaws = (record.relatedLawIds ?? [])
    .map((id) => indexedLaws.find((law) => law.id === id))
    .filter(Boolean);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law/research" class="text-link">← 返回研究报告分支</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">${escapeHtml(record.jurisdiction)} · ${escapeHtml(record.documentType)}</p>
            <h1>${escapeHtml(record.titleZh)}</h1>
            <p class="detail-en">${escapeHtml(record.titleEn)}</p>
            <p class="detail-summary">${escapeHtml(record.summary)}</p>
            <div class="pill-row">
              <span class="pill pill-muted">${escapeHtml(INTERNATIONAL_RESEARCH_GROUP_LABELS[record.institutionType] || record.institutionType)}</span>
              ${(record.topics ?? []).map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
            </div>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>简称</dt><dd>${escapeHtml(record.shortTitle || "—")}</dd></div>
              <div><dt>机构</dt><dd>${escapeHtml(record.institutionZh || record.institutionEn)}</dd></div>
              <div><dt>日期</dt><dd>${escapeHtml(record.date)}</dd></div>
              <div><dt>状态</dt><dd>${escapeHtml(record.status)}</dd></div>
              <div><dt>语种</dt><dd>${escapeHtml((record.languages ?? []).join(" / "))}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>原始来源</h2>
          <p>优先保留国会、议会、欧盟机构和智库官网的原始页面或官方PDF链接。</p>
        </div>
        ${renderSources(record.sources)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>内容提要</h2>
          <p>${escapeHtml(
            hasBilingualText
              ? "如能找到官方中文版本，则并排显示中英文；目前大多数研究报告以英文官方文本为主。"
              : selectedText.note,
          )}</p>
        </div>
        ${hasBilingualText ? renderBilingualText(record) : renderSingleLanguageText(record, selectedLanguage, selectedText)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>相关中国法律</h2>
          <p>把研究报告中的核心制度问题反向挂接到站内中国法律文本，便于比较阅读。</p>
        </div>
        <div class="law-grid">
          ${relatedLaws.length ? relatedLaws.map(renderLawCard).join("") : "<p>当前条目暂无挂接的中国法律。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalDetail(record, detailLanguage) {
  if (!record) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/international-law" class="text-link">返回国际法栏目</a>
          <h1>未找到该国际材料</h1>
        </section>
      </main>
    `;
  }

  const hasBilingualText = (record.languages ?? []).includes("zh") && (record.languages ?? []).includes("en");
  const availableLanguages = (record.languages ?? []).filter(
    (language) => (record.texts?.[language]?.sections ?? []).length > 0,
  );
  const selectedLanguage = availableLanguages.includes(detailLanguage)
    ? detailLanguage
    : availableLanguages[0] || record.languages[0];
  const selectedText = record.texts[selectedLanguage] ?? { note: "No onsite text available.", sections: [] };
  const relatedLaws = (record.relatedLawIds ?? [])
    .map((id) => indexedLaws.find((law) => law.id === id))
    .filter(Boolean);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law" class="text-link">← 返回国际法栏目</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">${escapeHtml(record.jurisdiction)} · ${escapeHtml(record.documentType)}</p>
            <h1>${escapeHtml(record.titleZh)}</h1>
            <p class="detail-en">${escapeHtml(record.titleEn)}</p>
            <p class="detail-summary">${escapeHtml(record.summary)}</p>
            <div class="pill-row">
              ${(record.topics ?? []).map((topic) => `<span class="pill">${escapeHtml(topic)}</span>`).join("")}
            </div>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>文号</dt><dd>${escapeHtml(record.shortTitle || "—")}</dd></div>
              <div><dt>机构</dt><dd>${escapeHtml(record.bodyZh || record.bodyEn)}</dd></div>
              <div><dt>日期</dt><dd>${escapeHtml(record.date)}</dd></div>
              <div><dt>状态</dt><dd>${escapeHtml(record.status)}</dd></div>
              <div><dt>语种</dt><dd>${escapeHtml((record.languages ?? []).join(" / "))}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>官方来源</h2>
          <p>优先保留联合国、联合国人权系统及国家政府正式网站链接。</p>
        </div>
        ${renderSources(record.sources)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>文本节录</h2>
          <p>${escapeHtml(
            hasBilingualText
              ? "有正式中文版本时并排展示中英文；没有正式中文版本时，以英文官方文本为主。"
              : selectedText.note,
          )}</p>
        </div>
        ${hasBilingualText ? renderBilingualText(record) : renderSingleLanguageText(record, selectedLanguage, selectedText)}
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>相关中国法律</h2>
          <p>把国际法讨论中的关键文件与站内相关中国法律文本直接挂接，便于比较使用。</p>
        </div>
        <div class="law-grid">
          ${relatedLaws.length ? relatedLaws.map(renderLawCard).join("") : "<p>当前条目暂无挂接的中国法律。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderInternationalThemeDetail(theme) {
  if (!theme) {
    return `
      <main class="shell">
        <section class="not-found">
          <a href="#/international-law" class="text-link">返回国际法栏目</a>
          <h1>未找到该固定专题</h1>
        </section>
      </main>
    `;
  }

  const relatedMaterials = collectInternationalThemeMaterials(theme, indexedInternationalMaterials);
  const relatedLaws = collectInternationalThemeLaws(theme, indexedInternationalMaterials);

  return `
    <main class="shell detail-shell">
      <section class="detail-hero">
        <a href="#/international-law" class="text-link">← 返回国际法栏目</a>
        <div class="detail-grid">
          <div>
            <p class="eyebrow">固定专题</p>
            <h1>${escapeHtml(theme.nameZh)}</h1>
            <p class="detail-en">${escapeHtml(theme.nameEn)}</p>
            <p class="detail-summary">${escapeHtml(theme.description)}</p>
          </div>
          <aside class="meta-panel">
            <dl>
              <div><dt>国际材料</dt><dd>${relatedMaterials.length}</dd></div>
              <div><dt>关联中国法律</dt><dd>${relatedLaws.length}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>关键分歧点</h2>
          <p>把这一专题下最稳定、最反复出现的制度分歧直接抽出来，方便快速比较不同立场。</p>
        </div>
        <div class="article-stack">
          ${(theme.keyDifferences ?? []).map((item) => `<article class="article-card"><p>${escapeHtml(item)}</p></article>`).join("")}
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>专题内国际材料</h2>
          <p>把联合国、联合国人权系统和国家在正式联合国场合的相关文本按长期研究入口聚合展示。</p>
        </div>
        <div class="law-grid">
          ${relatedMaterials.length ? relatedMaterials.map(renderInternationalMaterialCard).join("") : "<p>当前专题暂无已匹配材料。</p>"}
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head">
          <h2>相关中国法律</h2>
          <p>从国际法文本中出现频率最高的议题反向聚合站内相关中国法律，便于比较阅读。</p>
        </div>
        <div class="law-grid">
          ${relatedLaws.length ? relatedLaws.map(renderLawCard).join("") : "<p>当前专题暂无挂接的中国法律。</p>"}
        </div>
      </section>
    </main>
  `;
}

function renderOfficialPreview() {
  const highlights = indexedOfficialStatements.slice(0, 4);

  return `
    <section class="official-positions-home">
      <div class="section-head">
        <div>
          <h2>中国的官方立场</h2>
          <p>聚合外交部、驻联合国代表团、商务部就制裁、反制裁、域外管辖和出口管制问题的官方中英文发言。</p>
        </div>
        <a class="text-link" href="#/official-positions">进入栏目</a>
      </div>
      <div class="official-grid">
        ${highlights.map(renderOfficialStatementCard).join("")}
      </div>
    </section>
  `;
}

function renderHome(state) {
  const filters = {
    query: state.query,
    jurisdiction: state.jurisdiction,
    language: state.language,
    type: "law",
  };
  const filteredLaws = filterCatalog(indexedLaws, filters);
  const summary = summarizeCatalog(indexedLaws);
  const jurisdictions = uniqueValues(indexedLaws, "jurisdiction");

  return `
    <main class="shell">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">${"\u4e2d\u56fd\u53cd\u5236\u88c1\u6cd5\u5f8b\u4f53\u7cfb\u4e13\u9898\u7ad9"}</p>
          <p class="detail-en hero-detail-en">China Counter-Sanctions Legal System</p>
          <h1>${"\u9762\u5411\u5f8b\u5e08\u3001\u5408\u89c4\u4e0e\u6cd5\u52a1\u7684\u6cd5\u5f8b\u6587\u672c\u5e93"}</h1>
          <p class="detail-en hero-detail-en">A bilingual legal text archive for lawyers, compliance teams, and in-house counsel</p>
          <p class="hero-summary">
            ${"\u4ee5\u4e2d\u56fd\u53cd\u5236\u88c1\u3001\u53cd\u57df\u5916\u4e0d\u5f53\u63aa\u65bd\u548c\u53cd\u57df\u5916\u7ba1\u8f96\u6cd5\u5f8b\u4e3a\u4e3b\u8f74\uff0c\u63d0\u4f9b\u4e2d\u82f1\u5bf9\u7167\u8282\u5f55\u3001\u6743\u5a01\u6765\u6e90\u94fe\u63a5\uff0c\u5e76\u4ee5\u6b27\u76df\u3001\u52a0\u62ff\u5927\u3001\u82f1\u56fd\u7b49\u6cd5\u57df\u4f5c\u4e3a\u6bd4\u8f83\u8865\u5145\u3002"}
          </p>
          <p class="hero-summary hero-summary-en">
            Built around China's counter-sanctions, anti-extraterritorial measures, and anti-long-arm jurisdiction framework, with bilingual excerpts, authoritative source links, and comparative materials from the European Union, Canada, the United Kingdom, and other jurisdictions.
          </p>
          <div class="hero-credit">
            <p>${"\u672c\u7f51\u7ad9\u7531\u9999\u6e2f\u57ce\u5e02\u5927\u5b66\u6cd5\u5f8b\u5b66\u9662\u738b\u6c5f\u96e8\u6559\u6388\u7528Codex\u5236\u4f5c\uff082026\uff09\u3002"}</p>
            <p class="detail-en hero-credit-en">Created with Codex by Professor Jiangyu Wang, School of Law, City University of Hong Kong (2026).</p>
            <p>${"\u6240\u6709\u6587\u7ae0\u7248\u6743\u5f52\u539f\u4f5c\u8005\u3002"}</p>
            <p class="detail-en hero-credit-en">Copyright in all articles belongs to their original authors.</p>
          </div>
        </div>
        <div class="hero-stats">
          <article>
            <strong>${summary.totalRecords}</strong>
            <span>首批法律条目</span>
          </article>
          <article>
            <strong>${summary.jurisdictionCount}</strong>
            <span>法域</span>
          </article>
          <article>
            <strong>${summary.bilingualRecords}</strong>
            <span>含中英文文本</span>
          </article>
          <article>
            <strong>${indexedOfficialStatements.length}</strong>
            <span>官方立场档案</span>
          </article>
          <article>
            <strong>${indexedInternationalMaterials.length}</strong>
            <span>国际法材料</span>
          </article>
        </div>
      </section>

      <section class="filter-panel">
        <div class="section-head">
          <h2>法律检索</h2>
          <p>按名称、法域和语种筛选首批收录内容。</p>
        </div>
        <div class="filter-grid">
          <label>
            <span>关键词</span>
            <input id="query" type="search" placeholder="如：反外国制裁法 / blocking statute" value="${escapeHtml(state.query)}" />
          </label>
          <label>
            <span>法域</span>
            <select id="jurisdiction">
              <option value="">全部法域</option>
              ${jurisdictions
                .map(
                  (jurisdiction) =>
                    `<option value="${escapeHtml(jurisdiction)}" ${jurisdiction === state.jurisdiction ? "selected" : ""}>${escapeHtml(jurisdiction)}</option>`,
                )
                .join("")}
            </select>
          </label>
          <label>
            <span>语种</span>
            <select id="language">
              <option value="">全部</option>
              <option value="zh" ${state.language === "zh" ? "selected" : ""}>中文</option>
              <option value="en" ${state.language === "en" ? "selected" : ""}>English</option>
            </select>
          </label>
        </div>
      </section>

      <section class="catalog">
        <div class="section-head">
          <h2>法律文本目录</h2>
          <p>当前结果 ${filteredLaws.length} 条</p>
        </div>
        <div class="law-grid">
          ${filteredLaws.map(renderLawCard).join("")}
        </div>
      </section>

      ${renderOfficialPreview()}

      ${renderInternationalPreview()}

      <section class="topics">
        <div class="section-head">
          <h2>专题比较</h2>
          <p>围绕阻断法、反制裁清单和反域外管辖三条主线组织内容。</p>
        </div>
        <div class="topic-stack">
          ${topics.map(renderTopicCard).join("")}
        </div>
      </section>

      <section class="timeline-section">
        <div class="section-head">
          <h2>制度时间线</h2>
          <p>把中国制度发展放入更长的比较法坐标中看。</p>
        </div>
        ${renderTimeline()}
      </section>

      <section class="articles">
        <div class="section-head">
          <h2>分析文章索引</h2>
          <p>默认以摘要和原链接为主，避免超出版权边界。</p>
        </div>
        <div class="article-grid">
          ${articles.map(renderArticleCard).join("")}
        </div>
      </section>
    </main>
  `;
}

export function createApp(root) {
  const state = {
    query: "",
    jurisdiction: "",
    language: "",
    detailLanguage: "zh",
    internationalBrowseMode: "catalog",
    internationalQuery: "",
    internationalBody: "",
    internationalType: "",
    internationalLanguage: "",
    internationalDecisionQuery: "",
    internationalDecisionForum: "",
    internationalDecisionType: "",
    internationalDecisionLanguage: "",
    internationalResearchQuery: "",
    internationalResearchInstitutionType: "",
    internationalResearchJurisdiction: "",
    internationalResearchLanguage: "",
    officialQuery: "",
    officialInstitution: "",
    officialVenue: "",
    officialYear: "",
    officialLanguage: "",
    officialBrowseMode: "catalog",
  };

  function syncDetailLanguage() {
    const route = window.location.hash || "#/";
    const view = getViewModel(route, {
      laws: indexedLaws,
      topics,
      internationalMaterials: indexedInternationalMaterials,
      internationalDecisions: indexedInternationalDecisions,
      internationalDecisionTopics,
      internationalIssueTopics,
      internationalResearchReports: indexedInternationalResearchReports,
      internationalLawTopics,
      officialStatements: indexedOfficialStatements,
      officialPositionTopics,
    });
    if (
      (
        view.type === "law-detail" ||
        view.type === "international-detail" ||
        view.type === "international-decision-detail" ||
        view.type === "international-research-detail"
      ) &&
      view.record
    ) {
      state.detailLanguage = view.record.languages.includes("zh") ? "zh" : view.record.languages[0];
    }
  }

  function render() {
    const route = window.location.hash || "#/";
    const view = getViewModel(route, {
      laws: indexedLaws,
      topics,
      internationalMaterials: indexedInternationalMaterials,
      internationalDecisions: indexedInternationalDecisions,
      internationalDecisionTopics,
      internationalIssueTopics,
      internationalResearchReports: indexedInternationalResearchReports,
      internationalLawTopics,
      officialStatements: indexedOfficialStatements,
      officialPositionTopics,
    });

    root.innerHTML = (() => {
      if (view.type === "law-detail") return renderLawDetail(view.record, state.detailLanguage);
      if (view.type === "topic-detail") return renderTopicDetail(view.topic);
      if (view.type === "international-list") return renderInternationalList(state);
      if (view.type === "international-issue-list") return renderInternationalIssueList();
      if (view.type === "international-issue-detail") return renderInternationalIssueDetail(view.theme);
      if (view.type === "international-decision-list") return renderInternationalDecisionList(state);
      if (view.type === "international-decision-theme-detail") return renderInternationalDecisionThemeDetail(view.theme);
      if (view.type === "international-decision-detail") return renderInternationalDecisionDetail(view.record, state.detailLanguage);
      if (view.type === "international-research-list") return renderInternationalResearchList(state);
      if (view.type === "international-research-detail") return renderInternationalResearchDetail(view.record, state.detailLanguage);
      if (view.type === "international-theme-detail") return renderInternationalThemeDetail(view.theme);
      if (view.type === "international-detail") return renderInternationalDetail(view.record, state.detailLanguage);
      if (view.type === "official-list") return renderOfficialList(state);
      if (view.type === "official-theme-detail") return renderOfficialThemeDetail(view.theme);
      if (view.type === "official-detail") return renderOfficialDetail(view.record);
      return renderHome(state);
    })();

    bindEvents();
  }

  function bindEvents() {
    const query = root.querySelector("#query");
    const jurisdiction = root.querySelector("#jurisdiction");
    const language = root.querySelector("#language");
    const internationalQuery = root.querySelector("#international-query");
    const internationalBody = root.querySelector("#international-body");
    const internationalType = root.querySelector("#international-type");
    const internationalLanguage = root.querySelector("#international-language");
    const internationalDecisionQuery = root.querySelector("#international-decision-query");
    const internationalDecisionForum = root.querySelector("#international-decision-forum");
    const internationalDecisionType = root.querySelector("#international-decision-type");
    const internationalDecisionLanguage = root.querySelector("#international-decision-language");
    const internationalResearchQuery = root.querySelector("#international-research-query");
    const internationalResearchInstitutionType = root.querySelector("#international-research-institution-type");
    const internationalResearchJurisdiction = root.querySelector("#international-research-jurisdiction");
    const internationalResearchLanguage = root.querySelector("#international-research-language");
    const officialQuery = root.querySelector("#official-query");
    const officialInstitution = root.querySelector("#official-institution");
    const officialVenue = root.querySelector("#official-venue");
    const officialYear = root.querySelector("#official-year");

    if (query) {
      query.addEventListener("input", (event) => {
        state.query = event.currentTarget.value;
        render();
      });
    }

    if (jurisdiction) {
      jurisdiction.addEventListener("change", (event) => {
        state.jurisdiction = event.currentTarget.value;
        render();
      });
    }

    if (language) {
      language.addEventListener("change", (event) => {
        state.language = event.currentTarget.value;
        render();
      });
    }

    if (internationalQuery) {
      internationalQuery.addEventListener("input", (event) => {
        state.internationalQuery = event.currentTarget.value;
        render();
      });
    }

    if (internationalBody) {
      internationalBody.addEventListener("change", (event) => {
        state.internationalBody = event.currentTarget.value;
        render();
      });
    }

    if (internationalType) {
      internationalType.addEventListener("change", (event) => {
        state.internationalType = event.currentTarget.value;
        render();
      });
    }

    if (internationalLanguage) {
      internationalLanguage.addEventListener("change", (event) => {
        state.internationalLanguage = event.currentTarget.value;
        render();
      });
    }

    if (internationalDecisionQuery) {
      internationalDecisionQuery.addEventListener("input", (event) => {
        state.internationalDecisionQuery = event.currentTarget.value;
        render();
      });
    }

    if (internationalDecisionForum) {
      internationalDecisionForum.addEventListener("change", (event) => {
        state.internationalDecisionForum = event.currentTarget.value;
        render();
      });
    }

    if (internationalDecisionType) {
      internationalDecisionType.addEventListener("change", (event) => {
        state.internationalDecisionType = event.currentTarget.value;
        render();
      });
    }

    if (internationalDecisionLanguage) {
      internationalDecisionLanguage.addEventListener("change", (event) => {
        state.internationalDecisionLanguage = event.currentTarget.value;
        render();
      });
    }

    if (internationalResearchQuery) {
      internationalResearchQuery.addEventListener("input", (event) => {
        state.internationalResearchQuery = event.currentTarget.value;
        render();
      });
    }

    if (internationalResearchInstitutionType) {
      internationalResearchInstitutionType.addEventListener("change", (event) => {
        state.internationalResearchInstitutionType = event.currentTarget.value;
        render();
      });
    }

    if (internationalResearchJurisdiction) {
      internationalResearchJurisdiction.addEventListener("change", (event) => {
        state.internationalResearchJurisdiction = event.currentTarget.value;
        render();
      });
    }

    if (internationalResearchLanguage) {
      internationalResearchLanguage.addEventListener("change", (event) => {
        state.internationalResearchLanguage = event.currentTarget.value;
        render();
      });
    }

    root.querySelectorAll(".international-view-switch").forEach((button) => {
      if (button.tagName === "A") return;
      button.addEventListener("click", () => {
        state.internationalBrowseMode = button.dataset.internationalView;
        render();
      });
    });

    if (officialQuery) {
      officialQuery.addEventListener("input", (event) => {
        state.officialQuery = event.currentTarget.value;
        render();
      });
    }

    if (officialInstitution) {
      officialInstitution.addEventListener("change", (event) => {
        state.officialInstitution = event.currentTarget.value;
        render();
      });
    }

    if (officialVenue) {
      officialVenue.addEventListener("change", (event) => {
        state.officialVenue = event.currentTarget.value;
        render();
      });
    }

    if (officialYear) {
      officialYear.addEventListener("change", (event) => {
        state.officialYear = event.currentTarget.value;
        render();
      });
    }

    root.querySelectorAll(".official-view-switch").forEach((button) => {
      button.addEventListener("click", () => {
        state.officialBrowseMode = button.dataset.officialView;
        render();
      });
    });

    root.querySelectorAll(".language-switch").forEach((button) => {
      button.addEventListener("click", () => {
        state.detailLanguage = button.dataset.language;
        render();
      });
    });
  }

  window.addEventListener("hashchange", () => {
    syncDetailLanguage();
    render();
  });

  syncDetailLanguage();
  render();

  return { render };
}
