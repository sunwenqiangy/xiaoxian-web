import { requestExternal } from './http.js';

export const verifyTurnstile = async (token, request, environment = process.env) => {
  if (!environment.TURNSTILE_SECRET_KEY) return;
  if (!token) throw new Error('请完成人机验证后再提交');

  const body = new URLSearchParams({
    secret: environment.TURNSTILE_SECRET_KEY,
    response: token
  });
  const remoteIp = request.headers['x-forwarded-for']?.split(',')[0]?.trim();
  if (remoteIp) body.set('remoteip', remoteIp);

  const response = await requestExternal('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body
  });
  const payload = await response.json();
  if (!payload.success) throw new Error('人机验证未通过，请刷新页面后重试');
};
