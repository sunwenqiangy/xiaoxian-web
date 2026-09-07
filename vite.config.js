import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import inquiryHandler from './api/inquiry.js';

const createVercelResponseAdapter = (response) => ({
  status(code) {
    response.statusCode = code;
    return this;
  },
  setHeader(name, value) {
    response.setHeader(name, value);
  },
  json(payload) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(payload));
  }
});

const inquiryDevMiddleware = () => ({
  name: 'inquiry-dev-middleware',
  configureServer(server) {
    server.middlewares.use('/api/inquiry', async (request, response, next) => {
      if (request.method !== 'POST') {
        await inquiryHandler(request, createVercelResponseAdapter(response));
        return;
      }

      let rawBody = '';
      request.setEncoding('utf8');
      request.on('data', (chunk) => { rawBody += chunk; });
      request.on('error', next);
      request.on('end', async () => {
        try {
          request.body = rawBody ? JSON.parse(rawBody) : {};
          await inquiryHandler(request, createVercelResponseAdapter(response));
        } catch (error) {
          response.statusCode = 400;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ success: false, message: '请求内容不是有效的 JSON。' }));
        }
      });
    });
  }
});

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [vue(), inquiryDevMiddleware()]
  };
});
