export const capabilities = [
  {
    code: '01 / SOFTWARE FOUNDATION',
    icon: 'software',
    title: '传统软件开发',
    description: '从 Web、移动端、小程序到业务中后台，构建兼顾体验、稳定性、安全性与长期维护的数字化系统。',
    tags: ['WEB', 'APP', 'MINI PROGRAM', 'BACKEND']
  },
  {
    code: '02 / AI AUGMENTATION',
    icon: 'ai',
    title: 'AI 智能应用',
    description: '以 AI Agent、知识工程、模型评测与人机协作为基础，让智能能力可靠地进入业务流程与产品体验。',
    tags: ['AI AGENT', 'RAG', 'WORKFLOW', 'EVALUATION']
  },
  {
    code: '03 / VERTICAL SOLUTIONS',
    icon: 'vertical',
    title: '垂类定制开发',
    description: '深入健康、养老及企业服务等专业场景，协同产品、业务与技术边界，设计从验证到运营的定制解决方案。',
    tags: ['HEALTHCARE', 'AGING', 'ENTERPRISE', 'IOT']
  }
];

export const cases = [
  { id: '01', domain: 'MEDICAL', title: '知护 · 连续照护平台', summary: '连接患者、医护与健康资料，让咨询、随访、健康教育与服务反馈形成连续体验。', detail: '面向医疗服务场景的患者服务平台构想。重点解决资料分散、随访低效与服务链路断裂问题，预留专业知识库与 AI 辅助能力。', stack: ['PATIENT SERVICE', 'FOLLOW-UP', 'KNOWLEDGE'] },
  { id: '02', domain: 'AGING', title: '伴居 · 居家养老服务', summary: '以轻量设备、服务连接与家属沟通为基础，让安心陪伴自然发生在熟悉的居住空间。', detail: '包含长者端、家属端与服务人员端的小程序场景构想，将提醒、服务预约、异常关怀和家属协同组织成日常可见的安心感。', stack: ['MINI PROGRAM', 'IOT', 'FAMILY CARE'] },
  { id: '03', domain: 'AI AGENT', title: '知行 · 企业知识助手', summary: '让检索、引用溯源与人工确认形成闭环，为业务人员提供可信、可追溯的智能协作。', detail: '面向企业制度、项目资料与专业文档的知识工作台构想。通过权限、出处、评测和人工复核，让 AI 更好地成为专业人员的助手。', stack: ['RAG', 'CITATION', 'HUMAN REVIEW'] },
  { id: '04', domain: 'WORKFLOW', title: '安序 · 智能运营工作台', summary: '把分散任务、业务数据与协作动作沉淀为清晰流程，让团队把时间还给真正重要的人和事。', detail: '面向企业服务团队的流程重构构想。通过任务编排、数据看板、提醒与 AI 摘要，降低重复沟通成本，增强运营连续性。', stack: ['SAAS', 'AUTOMATION', 'INSIGHT'] }
];

export const teamPoints = [
  { code: '01 / PRODUCT', title: '资深产品与技术协同', copy: '从问题定义、业务流程到工程交付，让每一步都服务于真实价值。' },
  { code: '02 / AI AGENT', title: '可落地的智能应用经验', copy: '明确知识边界、角色分工和人工复核机制，避免“看起来智能”的空转。' },
  { code: '03 / EXPERT LINK', title: '专业资源深度连接', copy: '连接北大、协和等专家教授资源，为高专业度场景提供持续的知识与协作支撑。' }
];

export const serviceOptions = ['企业数字化升级', 'AI Agent / 智能应用', '智能工作流重构', '软件 / APP / 小程序开发', '医疗健康 / 居家养老定制', '其他合作咨询'];
