import { randomBytes } from 'node:crypto';

export const MAX_BODY_BYTES = 16_384;
const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_PHONE_PATTERN = /^(?:\+?86[- ]?)?1[3-9]\d{9}$/;
const SERVICE_OPTIONS = new Set([
  '企业数字化升级',
  'AI Agent / 智能应用',
  '智能工作流重构',
  '软件 / APP / 小程序开发',
  '医疗健康 / 居家养老定制',
  '其他合作咨询'
]);

export const clean = (value, maxLength) => String(value || '').trim().slice(0, maxLength);

export const getRequestBody = (request) => {
  if (!request.body) return {};
  return typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
};

const getLeadId = () => {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date()).replaceAll('-', '');
  return `RPXX-${date}-${randomBytes(3).toString('hex').toUpperCase()}`;
};

export const createLead = (body) => ({
  leadId: getLeadId(),
  name: clean(body.name, 30),
  company: clean(body.company, 60),
  contact: clean(body.contact, 100),
  service: clean(body.service, 60),
  need: clean(body.need, 500),
  source: clean(body.source, 300),
  consentAt: Date.now(),
  createdAt: new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Asia/Shanghai',
    hour12: false
  }).format(new Date())
});

export const validateLead = (lead, consent) => {
  if (!lead.name || !lead.contact || !lead.need || consent !== true) {
    return '请完成必填项并确认授权。';
  }

  const normalizedContact = lead.contact.replaceAll(' ', '').replaceAll('-', '');
  if (!CONTACT_EMAIL_PATTERN.test(lead.contact) && !CONTACT_PHONE_PATTERN.test(normalizedContact)) {
    return '请填写有效的手机号或邮箱地址。';
  }

  if (!SERVICE_OPTIONS.has(lead.service)) return '请选择有效的服务方向。';
  return '';
};

export const isEmailContact = (contact) => CONTACT_EMAIL_PATTERN.test(contact);

export const isFeishuConfigured = (environment = process.env) => [
  'FEISHU_APP_ID',
  'FEISHU_APP_SECRET',
  'FEISHU_APP_TOKEN',
  'FEISHU_TABLE_ID'
].every((key) => environment[key]);
