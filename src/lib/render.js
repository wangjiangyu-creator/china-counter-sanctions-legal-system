export function summarizeCatalog(records) {
  return {
    totalRecords: records.length,
    bilingualRecords: records.filter(
      (record) => (record.languages ?? []).includes("zh") && (record.languages ?? []).includes("en"),
    ).length,
    jurisdictionCount: new Set(records.map((record) => record.jurisdiction)).size,
  };
}

export function getTextPresentation(record) {
  const languages = record?.languages ?? [];
  if (record?.jurisdiction === "China" && languages.includes("zh") && languages.includes("en")) {
    return "bilingual";
  }

  return "single";
}

export function collectTopicArticles(topic, articles) {
  const relatedLawIds = new Set(topic?.relatedLawIds ?? []);

  return (articles ?? []).filter((article) =>
    (article.relatedLawIds ?? []).some((relatedLawId) => relatedLawIds.has(relatedLawId)),
  );
}

export function collectLawArticles(law, articles) {
  const relatedLawId = law?.id;
  const explicitArticleIds = new Set(law?.relatedArticleIds ?? []);

  return (articles ?? []).filter((article) => {
    const reverseLinked = relatedLawId ? (article.relatedLawIds ?? []).includes(relatedLawId) : false;
    return explicitArticleIds.has(article.id) || reverseLinked;
  });
}

export function groupLawResources(articles) {
  return (articles ?? []).reduce(
    (groups, article) => {
      const sourceKinds = article.sourceKinds ?? [];
      if (sourceKinds.some((kind) => kind === "case" || kind === "arbitration")) {
        groups.practice.push(article);
        return groups;
      }

      if (sourceKinds.includes("scholar")) {
        groups.scholar.push(article);
        return groups;
      }

      groups.practitioner.push(article);
      return groups;
    },
    {
      scholar: [],
      practitioner: [],
      practice: [],
    },
  );
}

export function groupPracticeResources(articles) {
  return (articles ?? []).reduce(
    (groups, article) => {
      if (article.practiceTrack === "contract-disputes") {
        groups.contractDisputes.push(article);
        return groups;
      }

      if (article.practiceTrack === "arbitration-enforcement") {
        groups.arbitrationEnforcement.push(article);
        return groups;
      }

      groups.blockingConflicts.push(article);
      return groups;
    },
    {
      contractDisputes: [],
      blockingConflicts: [],
      arbitrationEnforcement: [],
    },
  );
}

export function groupOfficialStatementsByYear(records) {
  const grouped = new Map();

  (records ?? []).forEach((record) => {
    const year = String(record.date ?? "").slice(0, 4);
    if (!year) return;
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year).push(record);
  });

  return [...grouped.entries()]
    .sort((left, right) => right[0].localeCompare(left[0]))
    .map(([year, yearRecords]) => ({
      year,
      records: yearRecords.slice().sort((left, right) => right.date.localeCompare(left.date)),
    }));
}

export function groupInternationalMaterialsByYear(records) {
  const grouped = new Map();

  (records ?? []).forEach((record) => {
    const year = String(record.date ?? "").slice(0, 4);
    if (!year) return;
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year).push(record);
  });

  return [...grouped.entries()]
    .sort((left, right) => right[0].localeCompare(left[0]))
    .map(([year, yearRecords]) => ({
      year,
      records: yearRecords.slice().sort((left, right) => right.date.localeCompare(left.date)),
    }));
}

export function groupOfficialStatementsByTopic(records) {
  const grouped = new Map();

  (records ?? []).forEach((record) => {
    (record.topics ?? []).forEach((topic) => {
      if (!grouped.has(topic)) grouped.set(topic, []);
      grouped.get(topic).push(record);
    });
  });

  return [...grouped.entries()]
    .map(([topic, topicRecords]) => ({
      topic,
      count: topicRecords.length,
      records: topicRecords.slice().sort((left, right) => right.date.localeCompare(left.date)),
    }))
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count;
      return left.topic.localeCompare(right.topic, "zh-Hans-CN");
    });
}

export function getViewModel(route, state) {
  const lawMatch = String(route || "#/").match(/^#\/laws\/(.+)$/);
  const topicMatch = String(route || "#/").match(/^#\/topics\/(.+)$/);
  const internationalIssueMatch = String(route || "#/").match(/^#\/international-law\/issues\/(.+)$/);
  const internationalDecisionThemeMatch = String(route || "#/").match(/^#\/international-law\/cases\/themes\/(.+)$/);
  const internationalDecisionMatch = String(route || "#/").match(/^#\/international-law\/cases\/(.+)$/);
  const internationalResearchMatch = String(route || "#/").match(/^#\/international-law\/research\/(.+)$/);
  const internationalThemeMatch = String(route || "#/").match(/^#\/international-law\/themes\/(.+)$/);
  const internationalMatch = String(route || "#/").match(/^#\/international-law\/(.+)$/);
  const officialThemeMatch = String(route || "#/").match(/^#\/official-positions\/themes\/(.+)$/);
  const officialMatch = String(route || "#/").match(/^#\/official-positions\/(.+)$/);

  if (lawMatch) {
    return {
      type: "law-detail",
      record: state.laws.find((law) => law.id === lawMatch[1]) ?? null,
    };
  }

  if (topicMatch) {
    return {
      type: "topic-detail",
      topic: state.topics.find((topic) => topic.id === topicMatch[1]) ?? null,
    };
  }

  if (String(route || "#/") === "#/international-law") {
    return { type: "international-list" };
  }

  if (String(route || "#/") === "#/international-law/issues") {
    return { type: "international-issue-list" };
  }

  if (String(route || "#/") === "#/international-law/research") {
    return { type: "international-research-list" };
  }

  if (String(route || "#/") === "#/international-law/cases") {
    return { type: "international-decision-list" };
  }

  if (internationalDecisionThemeMatch) {
    return {
      type: "international-decision-theme-detail",
      theme: state.internationalDecisionTopics.find((theme) => theme.id === internationalDecisionThemeMatch[1]) ?? null,
    };
  }

  if (internationalDecisionMatch) {
    return {
      type: "international-decision-detail",
      record: state.internationalDecisions.find((record) => record.id === internationalDecisionMatch[1]) ?? null,
    };
  }

  if (internationalResearchMatch) {
    return {
      type: "international-research-detail",
      record: state.internationalResearchReports.find((record) => record.id === internationalResearchMatch[1]) ?? null,
    };
  }

  if (internationalIssueMatch) {
    return {
      type: "international-issue-detail",
      theme: state.internationalIssueTopics.find((theme) => theme.id === internationalIssueMatch[1]) ?? null,
    };
  }

  if (internationalThemeMatch) {
    return {
      type: "international-theme-detail",
      theme: state.internationalLawTopics.find((theme) => theme.id === internationalThemeMatch[1]) ?? null,
    };
  }

  if (internationalMatch) {
    return {
      type: "international-detail",
      record: state.internationalMaterials.find((record) => record.id === internationalMatch[1]) ?? null,
    };
  }

  if (String(route || "#/") === "#/official-positions") {
    return { type: "official-list" };
  }

  if (officialThemeMatch) {
    return {
      type: "official-theme-detail",
      theme: state.officialPositionTopics.find((theme) => theme.id === officialThemeMatch[1]) ?? null,
    };
  }

  if (officialMatch) {
    return {
      type: "official-detail",
      record: state.officialStatements.find((record) => record.id === officialMatch[1]) ?? null,
    };
  }

  return { type: "home" };
}
