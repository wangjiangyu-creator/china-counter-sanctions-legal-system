const officialZh = "官方中文";
const officialEn = "官方英文";
const officialEnSummary = "官方英文消息稿";
const unofficialEn = "非官方英文";

export const laws = [
  {
    id: "cn-foreign-relations-law-2023",
    type: "law",
    titleZh: "中华人民共和国对外关系法",
    titleEn: "Law on Foreign Relations of the People's Republic of China",
    shortTitle: "对外关系法",
    jurisdiction: "China",
    documentType: "法律",
    authorityLevel: "法律",
    promulgationDate: "2023-06-28",
    effectiveDate: "2023-07-01",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "节录", en: "官方英文节录" },
    topics: ["反制裁", "涉外法治", "联合国制裁执行"],
    relatedArticleIds: ["cjcl-2022-emerging-unilateral-sanctions", "poon-2023-context"],
    summary: "中国涉外法治的基础性立法，为反制裁和限制措施提供总括授权。",
    sources: [
      { label: officialZh, url: "https://www.gov.cn/yaowen/liebiao/202306/content_6888929.htm" },
      { label: officialEn, url: "https://en.moj.gov.cn/2023-06/29/c_898506.htm" },
    ],
    texts: {
      zh: {
        note: "站内收录与反制裁法律体系直接相关的核心条文节录。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第三十二条 国家在遵守国际法基本原则和国际关系基本准则的基础上，加强涉外领域法律法规的实施和适用，并依法采取执法、司法等措施，维护国家主权、安全、发展利益，保护中国公民、组织合法权益。

第三十三条 对于违反国际法和国际关系基本准则，危害中华人民共和国主权、安全、发展利益的行为，中华人民共和国有权采取相应反制和限制措施。`,
          },
        ],
      },
      en: {
        note: "Official English excerpt from the Ministry of Justice database.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Article 32 The State shall strengthen the implementation and application of its laws and regulations in foreign-related fields and shall take law enforcement, judicial, or other measures in accordance with the law.

Article 33 The People's Republic of China has the right to take countermeasures or restrictive measures against acts that endanger its sovereignty, national security, and development interests.`,
          },
        ],
      },
    },
  },
  {
    id: "cn-afsl-2021",
    type: "law",
    titleZh: "中华人民共和国反外国制裁法",
    titleEn: "Law of the PRC on Countering Foreign Sanctions",
    shortTitle: "反外国制裁法",
    jurisdiction: "China",
    documentType: "法律",
    authorityLevel: "法律",
    promulgationDate: "2021-06-10",
    effectiveDate: "2021-06-10",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "全文节选", en: "非官方英文节选" },
    topics: ["反制裁", "反制清单", "民事救济"],
    relatedArticleIds: ["poon-2023-context", "svetlicinii-2022-eu-lessons", "jonesday-2025-afsl-enforcement"],
    summary: "中国反制裁体系的主轴法律，规定反制清单、反制措施和第12条私人诉权。",
    sources: [
      { label: officialZh, url: "https://www.npc.gov.cn/c2/c30834/202106/t20210610_311884.html" },
      { label: officialEnSummary, url: "https://en.moj.gov.cn/2021-06/15/c_632639.htm" },
      { label: unofficialEn, url: "https://www.chinalawtranslate.com/en/countering-foreign-sanctions-law/" },
    ],
    texts: {
      zh: {
        note: "站内节选覆盖授权、措施和救济条款。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第三条 外国国家违反国际法和国际关系基本准则，对我国公民、组织采取歧视性限制措施，干涉我国内政的，我国有权采取相应反制措施。

第六条 国务院有关部门可以决定采取签证、入境、财产冻结、交易限制及其他必要措施。

第十二条 任何组织和个人均不得执行或者协助执行外国国家对我国公民、组织采取的歧视性限制措施。组织和个人违反前款规定，侵害我国公民、组织合法权益的，我国公民、组织可以依法向人民法院提起诉讼。`,
          },
        ],
      },
      en: {
        note: "Unofficial English excerpt based on China Law Translate; official English news note linked above.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Article 3 Where a foreign state adopts discriminatory restrictive measures against Chinese citizens or organizations, China has the right to adopt corresponding countermeasures.

Article 6 Relevant departments of the State Council may take visa, entry, property-freezing, transaction-restriction, and other necessary measures.

Article 12 No organization or individual may implement or assist in implementing discriminatory restrictive measures taken by a foreign state against Chinese citizens or organizations; injured parties may bring suit before a people's court.`,
          },
        ],
      },
    },
  },
  {
    id: "cn-blocking-rules-2021",
    type: "law",
    titleZh: "阻断外国法律与措施不当域外适用办法",
    titleEn: "Rules on Counteracting Unjustified Extra-territorial Application of Foreign Legislation and Other Measures",
    shortTitle: "商务部阻断规则",
    jurisdiction: "China",
    documentType: "部门规章",
    authorityLevel: "商务部令2021年第1号",
    promulgationDate: "2021-01-09",
    effectiveDate: "2021-01-09",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "全文节选", en: "官方英文节选" },
    topics: ["阻断法", "次级制裁", "民事追偿"],
    relatedArticleIds: ["svetlicinii-2022-eu-lessons", "dlapiper-2021-blocking-rules"],
    summary: "中国针对外国法律和措施不当域外适用的专门阻断规则。",
    sources: [
      { label: officialZh, url: "https://chinawto.mofcom.gov.cn/article/e/r/202101/20210103030572.shtml" },
      { label: officialEn, url: "https://english.mofcom.gov.cn/Policies/GeneralPolicies/art/2021/art_98677d0ed28b41b9adeff27b00c9d001.html" },
    ],
    texts: {
      zh: {
        note: "站内节选覆盖报告、禁令、豁免和民事追偿。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第五条 中国公民、法人或者其他组织遇到外国法律与措施禁止或者限制其与第三国（地区）正常经贸活动情形的，应当在30日内向国务院商务主管部门如实报告有关情况。

第七条 国务院商务主管部门可以发布不得承认、不得执行、不得遵守有关外国法律与措施的禁令。

第九条 当事人遵守禁令范围内的外国法律与措施，侵害中国公民、法人或者其他组织合法权益的，中国公民、法人或者其他组织可以依法向人民法院提起诉讼。`,
          },
        ],
      },
      en: {
        note: "Official English excerpt from MOFCOM.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Article 5 Reports on foreign measures restricting normal economic and trade activities must be submitted within 30 days.

Article 7 The competent department of commerce under the State Council may issue a prohibition order.

Article 9 Injured Chinese parties may bring a lawsuit before a people's court and claim compensation for losses.`,
          },
        ],
      },
    },
  },
  {
    id: "cn-afsl-implementation-2025",
    type: "law",
    titleZh: "实施《中华人民共和国反外国制裁法》的规定",
    titleEn: "Provisions on the Implementation of the Law of the PRC on Countering Foreign Sanctions",
    shortTitle: "反外国制裁法实施规定",
    jurisdiction: "China",
    documentType: "行政法规",
    authorityLevel: "国务院令第803号",
    promulgationDate: "2025-03-24",
    effectiveDate: "2025-03-24",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "节录", en: "站内英译节录" },
    topics: ["反制裁", "程序规则", "执行机制"],
    relatedArticleIds: ["cms-2025-afsl-implementation", "jonesday-2025-afsl-enforcement"],
    summary: "把2021年框架性法律进一步程序化的关键行政法规。",
    sources: [
      { label: officialZh, url: "https://www.gov.cn/zhengce/content/202503/content_7015400.htm" },
      { label: officialEnSummary, url: "https://english.www.gov.cn/policies/latestreleases/202503/25/content_WS67e1df5dc6d0868f4e8f11fd.html" },
    ],
    texts: {
      zh: {
        note: "站内收录中国政府网公开文本中的核心条文节录。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第三条 国务院有关部门有权决定将有关组织、个人及与其相关的组织、个人列入反制清单、采取反制措施。

第七条 国务院有关部门在实施反制措施过程中，有权开展相应调查和对外磋商。

第十四条 被列入反制清单的组织、个人及其相关组织、个人可以依法申请暂停、变更或者取消有关反制措施。`,
          },
        ],
      },
      en: {
        note: "Site translation based on the Chinese official text; official English release linked above.",
        sections: [
          {
            heading: "Selected provisions (site translation)",
            body: `Article 3 Relevant departments of the State Council may place organizations or individuals on the countermeasure list and impose countermeasures.

Article 7 Relevant departments of the State Council have authority to conduct investigations and external consultations.

Article 14 Listed organizations and individuals may apply for suspension, modification, or cancellation of relevant countermeasures.`,
          },
        ],
      },
    },
  },
  {
    id: "cn-extraterritorial-jurisdiction-2026",
    type: "law",
    titleZh: "中华人民共和国反外国不当域外管辖条例",
    titleEn: "Regulations of the PRC on Countering Unjustified Foreign Extraterritorial Jurisdiction",
    shortTitle: "反外国不当域外管辖条例",
    jurisdiction: "China",
    documentType: "行政法规",
    authorityLevel: "国务院令第835号",
    promulgationDate: "2026-04-07",
    effectiveDate: "2026-04-07",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "节录", en: "站内英译节录" },
    topics: ["反域外管辖", "恶意实体清单", "禁执令"],
    relatedArticleIds: ["brownstein-2026-extraterritorial-jurisdiction", "jonesday-2025-afsl-enforcement"],
    summary: "中国首部专门面向外国不当域外管辖的国务院行政法规。",
    sources: [
      { label: officialZh, url: "https://xzfg.moj.gov.cn/front/law/detail?LawID=1813" },
      { label: officialEnSummary, url: "https://english.www.gov.cn/policies/latestreleases/202604/13/content_WS69dcc947c6d00ca5f9a0a5b9.html" },
    ],
    texts: {
      zh: {
        note: "站内收录识别机制、禁执令和救济条款节录。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第五条 国家建立健全应对外国不当域外管辖有关工作机制。

第八条 可以将推动实施或者参与实施外国不当域外管辖措施的外国组织、个人列入恶意实体清单，并采取反制和限制措施。

第九条 工作机制可以根据识别结果决定发布禁执令。

第十一条 因遵守外国不当域外管辖措施侵害中国公民、组织合法权益的，中国公民、组织可以依法向人民法院提起诉讼。`,
          },
        ],
      },
      en: {
        note: "Site translation based on the official Chinese text; official English release linked above.",
        sections: [
          {
            heading: "Selected provisions (site translation)",
            body: `Article 5 The State shall establish a working mechanism for responding to unjustified foreign extraterritorial jurisdiction.

Article 8 Foreign organizations and individuals that promote or participate in implementing such measures may be placed on a malicious entity list.

Article 9 The working mechanism may issue a prohibition order.

Article 11 Injured Chinese parties may bring a lawsuit before a people's court.`,
          },
        ],
      },
    },
  },
  {
    id: "cn-unreliable-entity-list-2020",
    type: "law",
    titleZh: "不可靠实体清单规定",
    titleEn: "Provisions on the Unreliable Entity List",
    shortTitle: "不可靠实体清单规定",
    jurisdiction: "China",
    documentType: "部门规章",
    authorityLevel: "商务部令2020年第4号",
    promulgationDate: "2020-09-19",
    effectiveDate: "2020-09-19",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "节录", en: "官方英文节录" },
    topics: ["不可靠实体清单", "反制裁", "贸易限制"],
    relatedArticleIds: ["mayerbrown-2020-uel", "dlapiper-2020-uel"],
    summary: "建立中国不可靠实体清单制度。",
    sources: [
      { label: officialZh, url: "https://www.mofcom.gov.cn/zfxxgk/zc/gz/art/2021/art_31e0eda6c1954aa7898b6f97c0ead8bb.html" },
      { label: officialEn, url: "https://english.mofcom.gov.cn/Policies/AnnouncementsOrders/art/2020/art_26e3c471536d443c944d60c91bacaf9a.html" },
    ],
    texts: {
      zh: {
        note: "站内收录构成要件、考量因素和措施条款。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第二条 国家建立不可靠实体清单制度，对危害中国国家主权、安全、发展利益，或者严重损害中国主体合法权益的外国实体采取相应措施。

第十条 对列入不可靠实体清单的外国实体，可以决定采取限制进出口、限制在华投资、限制人员入境、罚款等措施。`,
          },
        ],
      },
      en: {
        note: "Official English excerpt from MOFCOM.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Article 2 The State shall establish the Unreliable Entity List System.

Article 10 Measures may include restricting China-related import or export activities, restricting investment in China, restricting entry of relevant personnel, and imposing fines.`,
          },
        ],
      },
    },
  },
  {
    id: "cn-export-control-law-2020",
    type: "law",
    titleZh: "中华人民共和国出口管制法",
    titleEn: "Export Control Law of the People's Republic of China",
    shortTitle: "出口管制法",
    jurisdiction: "China",
    documentType: "法律",
    authorityLevel: "法律",
    promulgationDate: "2020-10-17",
    effectiveDate: "2020-12-01",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "节录", en: "官方英文节录" },
    topics: ["出口管制", "对等措施", "域外效力"],
    relatedArticleIds: ["chinalawinsight-2020-export-control", "shang-2024-export-control"],
    summary: "把出口管制、域外责任和对等反制引入中国涉外法律工具箱。",
    sources: [
      { label: officialZh, url: "https://www.npc.gov.cn/npc/c2/c30834/202010/t20201017_308279.html" },
      { label: officialEn, url: "https://www.npc.gov.cn/englishnpc/c2759/c23934/202112/t20211209_384804.html" },
    ],
    texts: {
      zh: {
        note: "站内收录出口管制定义、域外责任和对等措施条款。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第二条 本法所称出口管制，是指国家对从中华人民共和国境内向境外转移管制物项，以及中华人民共和国公民、法人和非法人组织向外国组织和个人提供管制物项，采取禁止或者限制性措施。

第四十四条 中华人民共和国境外的组织和个人，违反本法规定危害中华人民共和国国家安全和利益的，依法追究法律责任。

第四十八条 任何国家或者地区滥用出口管制措施危害中华人民共和国国家安全和利益的，中华人民共和国可以采取对等措施。`,
          },
        ],
      },
      en: {
        note: "Official English excerpt from the National People's Congress website.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Article 2 Export control means prohibitive or restrictive measures on the transfer of controlled items from the PRC to overseas and on the provision of controlled items to foreign organizations or foreigners.

Article 44 Organizations or individuals outside the PRC that violate this Law and endanger China's national security or interests shall be held legally liable.

Article 48 China may take countermeasures where another country or region abuses export control measures to endanger China's national security or interests.`,
          },
        ],
      },
    },
  },
  {
    id: "cn-data-security-law-2021",
    type: "law",
    titleZh: "中华人民共和国数据安全法",
    titleEn: "Data Security Law of the People's Republic of China",
    shortTitle: "数据安全法",
    jurisdiction: "China",
    documentType: "法律",
    authorityLevel: "法律",
    promulgationDate: "2021-06-10",
    effectiveDate: "2021-09-01",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "节录", en: "官方英文节录" },
    topics: ["数据安全", "域外适用", "跨境数据"],
    relatedArticleIds: ["ropesgray-2021-data-security", "jonesday-2021-data-security"],
    summary: "建立跨境数据、域外损害和国家安全联动框架。",
    sources: [
      { label: officialZh, url: "https://www.npc.gov.cn/npc/c2/c30834/202106/t20210610_311888.html" },
      { label: officialEn, url: "https://www.npc.gov.cn/englishnpc/c2759/c23934/202112/t20211209_385109.html" },
    ],
    texts: {
      zh: {
        note: "站内收录与域外适用和数据出境直接相关的条文。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第二条 在中华人民共和国境外开展数据处理活动，损害中华人民共和国国家安全、公共利益或者公民、组织合法权益的，依法追究法律责任。

第三十一条 重要数据出境安全管理办法，由国家网信部门会同国务院有关部门制定。

第三十六条 未经中华人民共和国主管机关批准，境内的组织、个人不得向外国司法或者执法机构提供存储于中华人民共和国境内的数据。`,
          },
        ],
      },
      en: {
        note: "Official English excerpt from the National People's Congress website.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Article 2 Where data processing activities conducted outside the territory of the PRC harm China's national security, public interests, or the lawful rights and interests of citizens or organizations, legal liability shall be pursued.

Article 31 Outbound security management measures for important data shall be formulated by the national cyberspace administration and relevant State Council departments.

Article 36 Without approval from the competent Chinese authorities, no organization or individual within China may provide data stored within China to foreign judicial or law enforcement authorities.`,
          },
        ],
      },
    },
  },
  {
    id: "cn-foreign-trade-law-2025",
    type: "law",
    titleZh: "中华人民共和国对外贸易法（2025年修订）",
    titleEn: "Foreign Trade Law of the People's Republic of China (2025 Revision)",
    shortTitle: "对外贸易法（2025年修订）",
    jurisdiction: "China",
    documentType: "法律",
    authorityLevel: "法律",
    promulgationDate: "2025-12-27",
    effectiveDate: "2026-03-01",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "节录", en: "站内英译节录" },
    topics: ["对外贸易", "贸易反制", "供应链安全"],
    relatedArticleIds: ["covington-2026-foreign-trade-law", "shang-2024-export-control"],
    summary: "2025年修订后的对外贸易法把贸易反制、知识产权相关贸易措施和规避治理纳入基础外贸立法。",
    sources: [
      { label: officialZh, url: "https://www.mofcom.gov.cn/zfxxgk/gkml/art/2025/art_fdc193e921ce4a298fe46e85c242b54e.html" },
      { label: officialEn, url: "http://en.moj.gov.cn/2023-12/15/c_948360.htm" },
      { label: officialEnSummary, url: "https://english.www.gov.cn/news/202512/27/content_WS694f542ec6d00ca5f9a084bc.html" },
    ],
    texts: {
      zh: {
        note: "站内收录与国家主权、安全和规避治理直接相关的核心条文。",
        sections: [
          {
            heading: "核心条文节录",
            body: `第十五条 国家可以对与军事有关的货物、技术、服务以及与维护国家安全相关的货物、技术、服务的进出口，采取必要的禁止性或者限制性措施。

第三十五条 国务院对外贸易主管部门可以对与知识产权保护相关的对外贸易采取必要措施。

第五十四条 任何组织和个人不得通过分拆交易、第三地转运、虚构最终用户或者其他方式规避依法实施的对外贸易管理措施。`,
          },
        ],
      },
      en: {
        note: "Site translation based on the MOFCOM Chinese text; official English law link and State Council news note attached for reference.",
        sections: [
          {
            heading: "Selected provisions (site translation)",
            body: `Article 15 The State may adopt necessary prohibitive or restrictive measures on the import or export of military-related goods, technologies, and services, as well as items related to safeguarding national security.

Article 35 The competent foreign trade department of the State Council may adopt necessary trade measures relating to intellectual property protection.

Article 54 No organization or individual may evade lawfully implemented foreign trade administration measures by splitting transactions, transshipping through a third place, fabricating end users, or by other means.`,
          },
        ],
      },
    },
  },
  {
    id: "eu-blocking-statute",
    type: "law",
    titleZh: "欧盟阻断条例",
    titleEn: "Council Regulation (EC) No 2271/96",
    shortTitle: "EU Blocking Statute",
    jurisdiction: "European Union",
    documentType: "条例",
    authorityLevel: "欧盟条例",
    promulgationDate: "1996-11-22",
    effectiveDate: "1996-11-29",
    status: "现行",
    languages: ["en"],
    textStatus: { zh: "none", en: "excerpt" },
    topics: ["阻断法", "报告义务", "损失回收"],
    relatedArticleIds: ["svetlicinii-2022-eu-lessons"],
    summary: "欧盟最典型的阻断法工具。",
    sources: [{ label: officialEn, url: "https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:31996R2271" }],
    texts: {
      zh: { note: "暂未收录站内中文译文。", sections: [] },
      en: {
        note: "Official English excerpt from EUR-Lex.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Article 2 Affected persons shall inform the Commission within 30 days.

Article 5 Covered persons shall not comply with requirements or prohibitions based on the listed foreign laws.

Article 6 Covered persons may recover damages caused by the application of the listed laws.`,
          },
        ],
      },
    },
  },
  {
    id: "ca-fema",
    type: "law",
    titleZh: "加拿大《外国域外措施法》",
    titleEn: "Foreign Extraterritorial Measures Act",
    shortTitle: "FEMA",
    jurisdiction: "Canada",
    documentType: "Act",
    authorityLevel: "Federal statute",
    promulgationDate: "1984-01-01",
    effectiveDate: "1985-01-01",
    status: "current",
    languages: ["en"],
    textStatus: { zh: "none", en: "excerpt" },
    topics: ["阻断法", "命令机制", "损害追偿"],
    relatedArticleIds: ["cba-2025-fema-icc"],
    summary: "加拿大经典反阻断法框架。",
    sources: [{ label: officialEn, url: "https://laws-lois.justice.gc.ca/eng/acts/f-29/FullText.html" }],
    texts: {
      zh: { note: "暂未收录站内中文译文。", sections: [] },
      en: {
        note: "Official English excerpt from the Department of Justice Canada.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Section 3 The Attorney General of Canada may prohibit or restrict the production of records or the giving of information for the purposes of a foreign tribunal.

Section 5 The Attorney General of Canada may prohibit any person in Canada from complying with certain measures of a foreign state or foreign tribunal.

Section 9 A person carrying on business in Canada may recover damages from a person who obtained a judgment under a listed foreign trade law.`,
          },
        ],
      },
    },
  },
  {
    id: "uk-ptia-1980",
    type: "law",
    titleZh: "英国《1980年贸易利益保护法》",
    titleEn: "Protection of Trading Interests Act 1980",
    shortTitle: "PTIA 1980",
    jurisdiction: "United Kingdom",
    documentType: "Act",
    authorityLevel: "Act of Parliament",
    promulgationDate: "1980-03-20",
    effectiveDate: "1980-03-20",
    status: "current",
    languages: ["en"],
    textStatus: { zh: "none", en: "excerpt" },
    topics: ["阻断法", "外国判决阻断", "部长命令"],
    relatedArticleIds: ["svetlicinii-2022-eu-lessons"],
    summary: "英国处理外国域外经济措施和判决影响的传统法律工具。",
    sources: [{ label: officialEn, url: "https://www.legislation.gov.uk/ukpga/1980/11/pdfs/ukpga_19800011_en.pdf" }],
    texts: {
      zh: { note: "暂未收录站内中文译文。", sections: [] },
      en: {
        note: "Official English excerpt from legislation.gov.uk.",
        sections: [
          {
            heading: "Selected provisions",
            body: `Section 1 The Secretary of State may prohibit compliance with certain foreign requirements where compliance would damage the trading interests of the United Kingdom.

Section 5 The Secretary of State may direct that no sums shall be paid under a covered judgment except with leave of the court.

Section 6 A person who has paid multiple damages under a foreign judgment may sue in the United Kingdom to recover the excess.`,
          },
        ],
      },
    },
  },
];
