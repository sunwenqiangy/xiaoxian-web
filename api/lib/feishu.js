import { requestExternal } from './http.js';

const getTenantAccessToken = async (environment) => {
  const response = await requestExternal('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      app_id: environment.FEISHU_APP_ID,
      app_secret: environment.FEISHU_APP_SECRET
    })
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0 || !payload.tenant_access_token) throw new Error('飞书授权失败');
  return payload.tenant_access_token;
};

const createRecord = async (accessToken, lead, environment) => {
  const response = await requestExternal(`https://open.feishu.cn/open-apis/bitable/v1/apps/${environment.FEISHU_APP_TOKEN}/tables/${environment.FEISHU_TABLE_ID}/records`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      fields: {
        '线索编号': lead.leadId,
        '称呼': lead.name,
        '公司 / 组织': lead.company,
        '联系方式': lead.contact,
        '服务方向': lead.service,
        '项目诉求': lead.need,
        '来源': '官网表单',
        '页面地址': lead.source,
        '跟进状态': '待跟进',
        '通知状态': '已发送',
        '隐私授权时间': lead.consentAt
      }
    })
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0 || !payload.data?.record?.record_id) {
    throw new Error('飞书线索写入失败');
  }
};

export const syncFeishuLead = async (lead, environment = process.env) => {
  const accessToken = await getTenantAccessToken(environment);
  await createRecord(accessToken, lead, environment);
};
