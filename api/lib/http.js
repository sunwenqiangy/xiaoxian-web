import { request as httpsRequest } from 'node:https';

/**
 * 使用原生 fetch；在本地 Node 16 环境中回退到 HTTPS，保持 Vercel 与本地行为一致。
 */
export const requestExternal = async (url, options = {}) => {
  if (typeof globalThis.fetch === 'function') return globalThis.fetch(url, options);

  const target = new URL(url);
  const body = options.body instanceof URLSearchParams ? options.body.toString() : options.body;
  const headers = { ...(options.headers || {}) };

  if (options.body instanceof URLSearchParams && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  }
  if (body && !headers['Content-Length']) headers['Content-Length'] = Buffer.byteLength(body);

  return new Promise((resolve, reject) => {
    const request = httpsRequest(target, { method: options.method || 'GET', headers }, (response) => {
      let rawPayload = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { rawPayload += chunk; });
      response.on('end', () => resolve({
        ok: response.statusCode >= 200 && response.statusCode < 300,
        status: response.statusCode,
        json: async () => rawPayload ? JSON.parse(rawPayload) : {}
      }));
    });

    request.on('error', reject);
    if (body) request.write(body);
    request.end();
  });
};
