import { requestExternal } from './http.js';
import { isEmailContact } from './inquiry-validation.js';

const htmlEscape = (value) => String(value || '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[character]));

const createDetailRows = (lead) => [
  ['线索编号', lead.leadId],
  ['提交时间', lead.createdAt],
  ['您的称呼', lead.name],
  ['公司 / 组织', lead.company || '未填写'],
  ['联系方式', lead.contact],
  ['服务方向', lead.service]
].map(([label, value]) => `<tr><td style="width:118px;padding:12px 16px;border-bottom:1px solid #dce8e7;color:#5f7476;font-size:13px;line-height:20px;vertical-align:top;background:#f4f8f7;">${htmlEscape(label)}</td><td style="padding:12px 16px;border-bottom:1px solid #dce8e7;color:#16343a;font-size:14px;line-height:20px;vertical-align:top;word-break:break-word;">${htmlEscape(value)}</td></tr>`).join('');

const createReplyAction = (replyTo, replySubject) => {
  if (!replyTo) {
    return '<div style="padding:11px 14px;border-radius:7px;background:#f4f8f7;color:#5f7476;font-size:12px;font-weight:700;line-height:18px;">对方留存手机号，请通过电话联系</div>';
  }

  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="border-radius:7px;background:#0d6b70;"><a href="mailto:${htmlEscape(replyTo)}?subject=${encodeURIComponent(replySubject)}" style="display:inline-block;padding:11px 16px;color:#ffffff;font-size:13px;font-weight:700;line-height:18px;text-decoration:none;">邮件联系对方</a></td></tr></table><div style="padding-top:10px;color:#789092;font-size:12px;line-height:19px;">将打开邮件客户端，并自动带入对方邮箱与咨询编号。</div>`;
};

const createPlainText = (lead, canReply) => [
  '若烹小鲜官网收到一条新的项目咨询。',
  '',
  `线索编号：${lead.leadId}`,
  `称呼：${lead.name}`,
  `公司 / 组织：${lead.company || '未填写'}`,
  `联系方式：${lead.contact}`,
  `服务方向：${lead.service}`,
  '',
  '项目诉求：',
  lead.need,
  '',
  `来源页面：${lead.source || '官网表单'}`,
  `提交时间：${lead.createdAt}`,
  '',
  canReply ? '可直接回复此邮件或点击“邮件联系对方”联系对方。' : '对方留存手机号，请通过电话联系。'
].join('\n');

const createHtml = (lead, replyAction) => `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#edf3f2;color:#16343a;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',Arial,sans-serif;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0;padding:32px 12px;background:#edf3f2;"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;"><tr><td style="padding:30px 32px 27px;background:#08212b;background-image:linear-gradient(125deg,#08212b 0%,#0d3a42 100%);"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="color:#8be0bd;font-size:11px;font-weight:700;letter-spacing:1.5px;line-height:16px;">RUOPENG XIAOXIAN · PROJECT INQUIRY</td></tr><tr><td style="padding-top:11px;color:#ffffff;font-family:'Songti SC','STSong',serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;line-height:38px;">收到一条新的项目咨询</td></tr><tr><td style="padding-top:8px;color:#bbd0d1;font-size:14px;line-height:22px;">请尽快查看并与对方建立联系。</td></tr></table></td></tr><tr><td style="padding:28px 32px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #dce8e7;border-radius:10px;overflow:hidden;">${createDetailRows(lead)}</table></td></tr><tr><td style="padding:24px 32px 0;"><div style="padding:18px 20px;border-left:3px solid #43d7dc;background:#eff9f8;"><div style="color:#0d3a42;font-size:13px;font-weight:700;line-height:20px;">项目诉求</div><div style="padding-top:8px;color:#25474c;font-size:15px;line-height:25px;white-space:pre-wrap;word-break:break-word;">${htmlEscape(lead.need)}</div></div></td></tr><tr><td style="padding:24px 32px 32px;">${replyAction}<div style="padding-top:18px;color:#789092;font-size:12px;line-height:19px;">来源页面：${htmlEscape(lead.source || '官网表单')}</div></td></tr><tr><td style="padding:17px 32px;background:#f4f8f7;border-top:1px solid #dce8e7;color:#789092;font-size:11px;line-height:18px;">北京若烹小鲜科技有限公司 · 以敬畏驾驭复杂，以技术守护日常</td></tr></table></td></tr></table></body></html>`;

export const sendNotificationEmail = async (lead, environment = process.env) => {
  const replyTo = isEmailContact(lead.contact) ? lead.contact : undefined;
  const replySubject = `【若烹小鲜项目咨询】${lead.service}｜${lead.leadId}`;
  const response = await requestExternal('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${environment.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: environment.INQUIRY_FROM_EMAIL,
      to: [environment.INQUIRY_TO_EMAIL],
      reply_to: replyTo,
      subject: `【项目咨询】${lead.service}｜${lead.name}｜${lead.leadId}`,
      text: createPlainText(lead, Boolean(replyTo)),
      html: createHtml(lead, createReplyAction(replyTo, replySubject))
    })
  });
  const payload = await response.json();
  if (!response.ok || payload?.message) throw new Error('咨询通知邮件发送失败');
  return payload.data?.id || '';
};
