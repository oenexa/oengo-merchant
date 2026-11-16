import http from 'node:http';
import { MerchantService } from './service/MerchantService.js';

export * from './domain/types.js';
export * from './service/MerchantService.js';

const merchant = new MerchantService();
const PORT = Number(process.env.PORT) || 3012;

export const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: 'UP', service: 'oengo-merchant', timestamp: new Date().toISOString() }));
  }

  if (req.url?.startsWith('/api/merchant/menu') && req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const merchantId = url.searchParams.get('id') || 'mch_default';
    const menu = merchant.getMenu(merchantId);
    res.writeHead(200);
    return res.end(JSON.stringify({ success: true, data: menu }));
  }

  res.writeHead(404);
  return res.end(JSON.stringify({ success: false, error: 'Endpoint Not Found' }));
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[oengo-merchant] Merchant Store & Menu Management Microservice listening on port ${PORT}`);
  });
}
