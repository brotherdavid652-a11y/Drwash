const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..', 'dist');
const port = Number(process.env.PORT || 3000);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8' };
const cache = new Map();
const server = http.createServer(async (req, res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); return res.end(); }
    const url = new URL(req.url, 'http://localhost');
    const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const file = path.resolve(root, '.' + name);
    if (!file.startsWith(root + path.sep) || name.includes('/.')) { res.writeHead(403); return res.end('Forbidden'); }
    const stat = await fs.stat(file);
    if (!stat.isFile()) throw new Error('Not a file');
    const key = file + ':' + stat.mtimeMs;
    let entry = cache.get(key);
    if (!entry) {
      const raw = await fs.readFile(file);
      const compressible = /\.(html|css|js|svg|xml|txt)$/.test(file);
      entry = {raw, etag:'"'+crypto.createHash('sha256').update(raw).digest('hex').slice(0,20)+'"'};
      if (compressible) {
        entry.br = zlib.brotliCompressSync(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } });
        entry.gzip = zlib.gzipSync(raw);
      }
      cache.set(key, entry);
    }
    const headers = { 'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', 'Permissions-Policy':'camera=(), microphone=(), geolocation=()', 'X-Frame-Options':'DENY', 'ETag':entry.etag, 'Vary':'Accept-Encoding', 'Cache-Control':url.searchParams.has('v') ? 'public, max-age=31536000, immutable' : /\.(woff2|webp)$/.test(file) ? 'public, max-age=2592000' : 'no-cache' };
    if (req.headers['if-none-match'] === entry.etag) { res.writeHead(304,headers); return res.end(); }
    const accept = req.headers['accept-encoding'] || '';
    const encoding = entry.br && /\bbr\b/.test(accept) ? 'br' : entry.gzip && /\bgzip\b/.test(accept) ? 'gzip' : '';
    const body = encoding ? entry[encoding] : entry.raw;
    if (encoding) headers['Content-Encoding'] = encoding;
    headers['Content-Length'] = body.length;
    res.writeHead(200,headers);
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, {'Content-Type':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff'});
    res.end('<!doctype html><html lang="en"><title>Page not found | Dr Wash Laundry</title><meta name="viewport" content="width=device-width, initial-scale=1"><h1>Page not found</h1><p><a href="/">Return to Dr Wash Laundry</a></p></html>');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Dr Wash preview: http://localhost:${port}`));
