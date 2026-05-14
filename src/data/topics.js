export const topics = [
  {
    id: "blocking-statutes",
    nameZh: "阻断法与不得遵守机制",
    nameEn: "Blocking Statutes and Non-Compliance Mechanisms",
    description:
      "比较中国、欧盟、加拿大和英国如何应对外国法律和制裁措施的域外适用，尤其是私人主体是否被禁止遵守相关外国措施。",
    relatedLawIds: [
      "cn-blocking-rules-2021",
      "cn-extraterritorial-jurisdiction-2026",
      "eu-blocking-statute",
      "ca-fema",
      "uk-ptia-1980",
    ],
    comparisonRows: [
      { label: "禁止遵守外国措施", China: "有禁令机制", "European Union": "原则上禁止", Canada: "通过命令机制限制", "United Kingdom": "可由部长命令阻断" },
      { label: "报告义务", China: "30日内报告商务主管部门", "European Union": "向欧委会通报", Canada: "取决于具体命令", "United Kingdom": "并非核心设计" },
      { label: "民事救济", China: "可起诉请求赔偿", "European Union": "可回收损失", Canada: "可追偿损害", "United Kingdom": "以命令和判决阻断为主" },
    ],
  },
  {
    id: "counter-sanctions",
    nameZh: "反制裁授权、列单与反制措施",
    nameEn: "Counter-Sanctions, Listings, and Countermeasures",
    description:
      "围绕国家是否可以对制定、决定、实施外国限制措施的个人和组织采取签证、财产、交易和投资限制等反制措施进行比较。",
    relatedLawIds: [
      "cn-afsl-2021",
      "cn-afsl-implementation-2025",
      "cn-foreign-relations-law-2023",
      "cn-unreliable-entity-list-2020",
      "cn-export-control-law-2020",
      "cn-national-security-law-2015",
      "cn-foreign-trade-law-2025",
    ],
    comparisonRows: [
      { label: "专门反制清单", China: "有反制清单与不可靠实体清单", "European Union": "无统一对应清单", Canada: "无同类清单", "United Kingdom": "无同类清单" },
      { label: "财产冻结与交易限制", China: "有明确授权", "European Union": "阻断法不以此为主", Canada: "并非核心机制", "United Kingdom": "并非核心机制" },
      { label: "私人主体义务", China: "必须执行反制措施，不得协助执行歧视性措施", "European Union": "主要是不遵守与报告", Canada: "依命令而定", "United Kingdom": "依命令而定" },
    ],
  },
  {
    id: "extraterritorial-jurisdiction",
    nameZh: "反域外管辖与长臂管辖应对",
    nameEn: "Countering Extraterritorial Jurisdiction",
    description:
      "围绕国家如何认定外国域外管辖措施是否不当，并通过行政、司法或外交路径进行回应。",
    relatedLawIds: [
      "cn-extraterritorial-jurisdiction-2026",
      "cn-blocking-rules-2021",
      "cn-data-security-law-2021",
      "cn-cybersecurity-law-2016",
      "cn-export-control-law-2020",
      "ca-fema",
    ],
    comparisonRows: [
      { label: "识别工作机制", China: "有专门识别和协调机制", "European Union": "以欧委会执行为核心", Canada: "以联邦总检察长为核心", "United Kingdom": "以部长命令为核心" },
      { label: "对外磋商或调查", China: "明文允许调查和对外磋商", "European Union": "以执行和行政沟通为主", Canada: "通过命令和行政裁量", "United Kingdom": "通过命令介入" },
      { label: "私人诉权或损失回收", China: "保留私人诉权和支持机制", "European Union": "可索回损失", Canada: "可追偿损失", "United Kingdom": "相对有限" },
    ],
  },
  {
    id: "data-and-cybersecurity",
    nameZh: "数据、网络安全与域外执法请求",
    nameEn: "Data, Cybersecurity, and Extraterritorial Requests",
    description:
      "聚焦中国如何通过数据安全法、网络安全法与反域外管辖制度处理跨境数据、境外调查取证、关键信息基础设施保护和网络空间主权问题。",
    relatedLawIds: [
      "cn-data-security-law-2021",
      "cn-cybersecurity-law-2016",
      "cn-national-security-law-2015",
      "cn-extraterritorial-jurisdiction-2026",
    ],
    comparisonRows: [
      { label: "域外损害条款", China: "数据法与网安法均保留域外追责", "European Union": "以数据保护和主权规则为主", Canada: "无统一对应框架", "United Kingdom": "分散于部门法中" },
      { label: "跨境数据控制", China: "重要数据与关基数据出境受控", "European Union": "以GDPR和安全例外为核心", Canada: "以行业规则和隐私法为主", "United Kingdom": "延续英版数据保护体系" },
      { label: "境外执法取证回应", China: "主管机关审批和对等原则", "European Union": "依司法协助和数据保护规则处理", Canada: "依MLAT与法院程序处理", "United Kingdom": "依司法协助与披露制度处理" },
    ],
  },
  {
    id: "export-control-and-foreign-trade",
    nameZh: "出口管制、外贸治理与对等回应",
    nameEn: "Export Control, Foreign Trade Governance, and Reciprocal Response",
    description:
      "围绕出口管制法、外贸法、不可靠实体清单与国家安全框架，观察中国如何把贸易管理、供应链安全和对等反制连接为一套涉外经济治理工具。",
    relatedLawIds: [
      "cn-export-control-law-2020",
      "cn-foreign-trade-law-2025",
      "cn-unreliable-entity-list-2020",
      "cn-national-security-law-2015",
    ],
    comparisonRows: [
      { label: "对等反制条款", China: "出口管制法和外贸法均可承接", "European Union": "以共同贸易政策和制裁法为主", Canada: "以FEMA等个别工具回应", "United Kingdom": "以制裁和贸易法分流处理" },
      { label: "规避治理", China: "明文禁止拆分交易、第三地转运等规避", "European Union": "侧重海关和制裁执行", Canada: "依行政执法处理", "United Kingdom": "依出口管制和制裁执法处理" },
      { label: "实体列单或限制", China: "有不可靠实体清单和出口管制工具", "European Union": "无统一贸易反制列单", Canada: "无同类统一列单", "United Kingdom": "无同类统一列单" },
    ],
  },
];
