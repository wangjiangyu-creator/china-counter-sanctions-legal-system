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

export function getViewModel(route, state) {
  const lawMatch = String(route || "#/").match(/^#\/laws\/(.+)$/);
  const topicMatch = String(route || "#/").match(/^#\/topics\/(.+)$/);

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

  return { type: "home" };
}
