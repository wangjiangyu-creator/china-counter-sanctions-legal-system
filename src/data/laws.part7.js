export const lawsPart7 = [
  {
    id: "cn-pipl-2021",
    type: "law",
    titleZh: "中华人民共和国个人信息保护法",
    titleEn: "Personal Information Protection Law of the People's Republic of China",
    shortTitle: "个人信息保护法",
    jurisdiction: "China",
    documentType: "法律",
    authorityLevel: "全国人大常委会",
    promulgationDate: "2021-08-20",
    effectiveDate: "2021-11-01",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "official", en: "official reference translation" },
    topics: ["个人信息", "数据出境", "外国司法执法请求", "域外适用", "冲突法合规"],
    relatedArticleIds: [
      "ropesgray-2021-data-security",
      "jonesday-2021-data-security",
      "mondaq-2023-cross-border-ediscovery",
    ],
    summary:
      "个人信息保护法并非制裁专门法，但其域外适用、个人信息跨境提供以及未经主管机关批准不得向外国司法或执法机构提供境内个人信息的规则，是中国反域外不当取证、反长臂调查和冲突法合规体系的重要组成部分。",
    sources: [
      { label: "官方中文", url: "https://www.npc.gov.cn/npc/c2/c30834/202108/t20210820_313088.html" },
      { label: "官方英文参考译文", url: "https://www.npc.gov.cn/npc/c2597/c5854/bfflywwb/202311/t20231117_433007.html" },
    ],
    texts: {
      zh: {
        note: "官方中文全文链接至中国人大网。本页摘录与域外适用、跨境提供和外国司法执法请求有关的结构。",
        sections: [
          {
            heading: "域外适用",
            body:
              "个人信息保护法规定，在中华人民共和国境外处理中华人民共和国境内自然人个人信息，且以向境内自然人提供产品或者服务、分析评估境内自然人行为等为目的的，适用本法。",
          },
          {
            heading: "跨境提供规则",
            body:
              "个人信息处理者向境外提供个人信息，应当符合安全评估、认证、标准合同或者法律行政法规规定的其他条件，并向个人告知境外接收方、处理目的、处理方式、个人信息种类和权利行使方式。",
          },
          {
            heading: "外国司法执法请求",
            body:
              "未经中华人民共和国主管机关批准，个人信息处理者不得向外国司法或者执法机构提供存储于中华人民共和国境内的个人信息。该条与数据安全法、国际刑事司法协助法共同构成中国反不当跨境取证规则。",
          },
        ],
      },
      en: {
        note: "Official NPC reference translation is available. The archive excerpt focuses on sanctions and extraterritoriality relevance.",
        sections: [
          {
            heading: "Extraterritorial reach",
            body:
              "The Law applies to certain processing of personal information outside China where the processing targets individuals within China, including offering products or services or analyzing and assessing behavior.",
          },
          {
            heading: "Cross-border provision",
            body:
              "Personal information processors that transfer personal information overseas must satisfy statutory mechanisms such as security assessment, certification, standard contracts, or other conditions set by law and administrative regulations.",
          },
          {
            heading: "Foreign judicial and law-enforcement requests",
            body:
              "Without approval by competent Chinese authorities, personal information processors may not provide personal information stored in China to foreign judicial or law-enforcement bodies. This is directly relevant to cross-border investigation and sanctions-compliance conflicts.",
          },
        ],
      },
    },
  },
  {
    id: "cn-international-criminal-judicial-assistance-law-2018",
    type: "law",
    titleZh: "中华人民共和国国际刑事司法协助法",
    titleEn: "Law of the People's Republic of China on International Criminal Judicial Assistance",
    shortTitle: "国际刑事司法协助法",
    jurisdiction: "China",
    documentType: "法律",
    authorityLevel: "全国人大常委会",
    promulgationDate: "2018-10-26",
    effectiveDate: "2018-10-26",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "official", en: "unofficial translation" },
    topics: ["刑事司法协助", "跨境取证", "外国执法请求", "司法主权", "长臂管辖"],
    relatedArticleIds: [
      "ropesgray-2019-icjal-blocking",
      "mondaq-2023-cross-border-ediscovery",
      "cn-sealed-case-2019-chinese-bank",
    ],
    summary:
      "国际刑事司法协助法明确刑事司法协助不得损害中国主权、安全和社会公共利益，未经主管机关同意，境内机构、组织和个人不得向外国提供刑事诉讼活动所需证据材料和协助，是中国反不当境外执法和跨境取证冲突中的关键支撑法。",
    sources: [
      { label: "官方中文", url: "https://www.npc.gov.cn/zgrdw/npc/xinwen/2018-10/26/content_2064576.htm" },
      { label: "非官方英文译文索引", url: "https://npcobserver.com/legislation/international-criminal-justice-assistance-law/" },
    ],
    texts: {
      zh: {
        note: "官方中文全文链接至中国人大网。本页摘录与司法主权和跨境取证最相关的制度点。",
        sections: [
          {
            heading: "司法协助范围",
            body:
              "国际刑事司法协助包括送达文书、调查取证、安排证人作证或者协助调查、查封扣押冻结涉案财物、没收返还违法所得及其他涉案财物、移管被判刑人以及其他协助。",
          },
          {
            heading: "主权与公共利益限制",
            body:
              "国际刑事司法协助不得损害中华人民共和国的主权、安全和社会公共利益，不得违反中华人民共和国法律的基本原则。",
          },
          {
            heading: "未经同意不得协助外国刑事程序",
            body:
              "非经主管机关同意，中华人民共和国境内的机构、组织和个人不得向外国提供本法规定的证据材料和协助。该规则在跨境调查、制裁规避刑事执法和外国法院传票冲突中具有重要意义。",
          },
        ],
      },
      en: {
        note:
          "No official full English text was identified in this update. The English panel is a site translation excerpt and research summary.",
        sections: [
          {
            heading: "Scope",
            body:
              "International criminal judicial assistance includes service of documents, evidence collection, witness assistance, freezing and seizure of property, confiscation and return of unlawful proceeds, transfer of sentenced persons, and other assistance.",
          },
          {
            heading: "Sovereignty limitation",
            body:
              "Assistance may not impair China's sovereignty, security, or public interests, and may not violate the basic principles of Chinese law.",
          },
          {
            heading: "Blocking function",
            body:
              "Without consent from competent authorities, institutions, organizations, and individuals in China may not provide evidence or assistance to foreign countries for criminal proceedings. This functions as a blocking rule for foreign criminal enforcement and cross-border evidence demands.",
          },
        ],
      },
    },
  },
  {
    id: "cn-spc-foreign-related-civil-commercial-jurisdiction-2022",
    type: "law",
    titleZh: "最高人民法院关于涉外民商事案件管辖若干问题的规定",
    titleEn: "SPC Provisions on Several Issues concerning Jurisdiction over Foreign-Related Civil and Commercial Cases",
    shortTitle: "涉外民商事案件管辖规定",
    jurisdiction: "China",
    documentType: "司法解释",
    authorityLevel: "最高人民法院法释〔2022〕18号",
    promulgationDate: "2022-11-14",
    effectiveDate: "2023-01-01",
    status: "现行",
    languages: ["zh", "en"],
    textStatus: { zh: "official", en: "site translation excerpt" },
    topics: ["涉外民商事管辖", "涉制裁诉讼", "仲裁司法审查", "外国判决承认执行"],
    relatedArticleIds: [
      "huo-chen-2023-court-civil-disputes-counter-sanctions",
      "jinmao-2026-afsl-arbitration",
      "legal-daily-2026-maritime-long-arm",
    ],
    summary:
      "该司法解释调整涉外民商事案件一审管辖布局，明确基层法院一般可管辖一审涉外民商事案件，但仲裁司法审查、申请承认和执行外国法院判决等仍依照法律和司法解释确定由相应法院管辖。它是反外国制裁民事诉讼和涉外管辖实践的重要程序背景。",
    sources: [
      { label: "官方中文", url: "https://www.court.gov.cn/shenpan/xiangqing/379181.html" },
      { label: "最高法答记者问", url: "https://www.court.gov.cn/zixun/xiangqing/379171.html" },
    ],
    texts: {
      zh: {
        note: "官方中文文本链接至最高人民法院。",
        sections: [
          {
            heading: "核心规则",
            body:
              "基层人民法院管辖第一审涉外民商事案件，法律、司法解释另有规定的除外。中级人民法院和高级人民法院仍按照级别管辖标准和特别规定管辖相关涉外民商事案件。",
          },
          {
            heading: "保留中级法院管辖的事项",
            body:
              "最高法答记者问说明，申请承认和执行外国法院判决案件、仲裁司法审查案件以及其他依法应由中级人民法院管辖的案件，仍依照现行法律和司法解释处理。",
          },
          {
            heading: "反制裁诉讼意义",
            body:
              "在反外国制裁侵权诉讼、阻断规则损害赔偿、仲裁协议效力和外国判决承认执行争议中，该规定影响当事人选择中国法院路径和确定具体受理法院。",
          },
        ],
      },
      en: {
        note: "No official English translation was identified in this update. This panel is a site summary.",
        sections: [
          {
            heading: "Jurisdictional allocation",
            body:
              "The Provisions adjust the jurisdictional allocation of first-instance foreign-related civil and commercial cases, generally allowing basic-level courts to hear such cases unless laws or judicial interpretations provide otherwise.",
          },
          {
            heading: "Reserved matters",
            body:
              "SPC explanatory materials indicate that cases involving recognition and enforcement of foreign judgments, arbitration judicial review, and other matters assigned to intermediate courts remain governed by special rules.",
          },
          {
            heading: "Sanctions relevance",
            body:
              "The Provisions are important procedural background for counter-sanctions tort claims, blocking-rule damages claims, arbitration-related disputes, and recognition or enforcement conflicts involving foreign sanctions measures.",
          },
        ],
      },
    },
  },
];
