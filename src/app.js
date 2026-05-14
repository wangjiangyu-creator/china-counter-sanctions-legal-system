import { laws } from "./data/laws.js?v=20260514";
import { articles } from "./data/articles.js?v=20260514";
import { topics } from "./data/topics.js?v=20260514";
import { timeline } from "./data/timeline.js?v=20260514";
import { buildCatalogIndex, filterCatalog, uniqueValues } from "./lib/catalog.js?v=20260514";
import { validateArticleRecord, validateLawRecord } from "./lib/schema.js?v=20260514";
import {
  collectLawArticles,
  collectTopicArticles,
  getTextPresentation,
  getViewModel,
  groupLawResources,
  groupPracticeResources,
  summarizeCatalog,
} from "./lib/render.js?v=20260514";

laws.forEach(validateLawRecord);
articles.forEach(validateArticleRecord);

const indexedLaws = buildCatalogIndex(laws.map((law) => ({ ...law, type: "law" })));

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
          <p class="eyebrow">中国反制裁法律体系专题站</p>
          <h1>面向律师、合规与法务的法律文本库</h1>
          <p class="hero-summary">
            以中国反制裁、反域外不当措施和反域外管辖法律为主轴，提供中英对照节录、权威来源链接，并以欧盟、加拿大、英国等法域作为比较补充。
          </p>
          <div class="hero-credit">
            <p>${"\u672c\u7f51\u7ad9\u7531\u9999\u6e2f\u57ce\u5e02\u5927\u5b66\u6cd5\u5f8b\u5b66\u9662\u738b\u6c5f\u96e8\u6559\u6388\u7528Codex\u5236\u4f5c\uff082026\uff09\u3002"}</p>
            <p>${"\u6240\u6709\u6587\u7ae0\u7248\u6743\u5f52\u539f\u4f5c\u8005\u3002"}</p>
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
  };

  function syncDetailLanguage() {
    const route = window.location.hash || "#/";
    const view = getViewModel(route, { laws: indexedLaws, topics });
    if (view.type === "law-detail" && view.record) {
      state.detailLanguage = view.record.languages.includes("zh") ? "zh" : view.record.languages[0];
    }
  }

  function render() {
    const route = window.location.hash || "#/";
    const view = getViewModel(route, { laws: indexedLaws, topics });

    root.innerHTML = (() => {
      if (view.type === "law-detail") return renderLawDetail(view.record, state.detailLanguage);
      if (view.type === "topic-detail") return renderTopicDetail(view.topic);
      return renderHome(state);
    })();

    bindEvents();
  }

  function bindEvents() {
    const query = root.querySelector("#query");
    const jurisdiction = root.querySelector("#jurisdiction");
    const language = root.querySelector("#language");

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
