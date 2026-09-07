import { syncFeishuLead } from './lib/feishu.js';
import {
  clean,
  createLead,
  getRequestBody,
  isFeishuConfigured,
  MAX_BODY_BYTES,
  validateLead
} from './lib/inquiry-validation.js';
import { sendNotificationEmail } from './lib/resend.js';
import { verifyTurnstile } from './lib/turnstile.js';

const json = (response, statusCode, payload) => response.status(statusCode).json(payload);
const requiredEmailConfig = ['RESEND_API_KEY', 'INQUIRY_FROM_EMAIL', 'INQUIRY_TO_EMAIL'];
const turnstileErrors = new Set(['请完成人机验证后再提交', '人机验证未通过，请刷新页面后重试']);

const isEmailConfigured = (environment = process.env) => requiredEmailConfig.every((key) => environment[key]);

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { success: false, message: '仅支持 POST 提交。' });
  }

  if (Number(request.headers['content-length'] || 0) > MAX_BODY_BYTES) {
    return json(response, 413, { success: false, message: '提交内容过长，请精简后重试。' });
  }

  if (!isEmailConfigured()) {
    return json(response, 503, { success: false, message: '咨询邮件服务正在配置中，请稍后重试或直接邮件联系。' });
  }

  try {
    const body = getRequestBody(request);
    const lead = createLead(body);

    if (clean(body.website, 100)) return json(response, 200, { success: true, leadId: lead.leadId });

    const validationMessage = validateLead(lead, body.consent);
    if (validationMessage) return json(response, 400, { success: false, message: validationMessage });

    await verifyTurnstile(clean(body.turnstileToken, 4096), request);
    await sendNotificationEmail(lead);

    if (isFeishuConfigured()) {
      try {
        await syncFeishuLead(lead);
      } catch (error) {
        console.error(`[${lead.leadId}] feishu lead sync failed`, error);
      }
    }

    return json(response, 200, { success: true, leadId: lead.leadId });
  } catch (error) {
    console.error('Inquiry submission failed', error);
    const message = turnstileErrors.has(error.message)
      ? error.message
      : '提交暂时未成功，请稍后重试或直接邮件联系我们。';
    return json(response, 500, { success: false, message });
  }
}
