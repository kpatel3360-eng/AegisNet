import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const BACKEND_URL = 'http://127.0.0.1:5000';

// 1. Compile Tailwind CSS
console.log("Compiling Tailwind CSS...");
try {
  execSync('npx tailwindcss -i src/index.css -o dist/style.css', { cwd: __dirname });
  console.log("Tailwind CSS compiled successfully.");
} catch (e) {
  console.error("Tailwind CSS error:", e.message);
}

// 2. Start Esbuild Context Watcher
console.log("Starting Esbuild Watcher for React App...");
const ctx = await esbuild.context({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  define: { 'process.env.NODE_ENV': '"development"' },
  format: 'esm',
  sourcemap: true,
});

await ctx.watch();
console.log("Esbuild watcher active.");

// 3. Create HTTP Dev Server with Proxy
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Proxy to Flask
  if (req.url.startsWith('/api')) {
    const proxyUrl = new URL(req.url, BACKEND_URL);
    const proxyReq = http.request(
      proxyUrl,
      {
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Backend API Gateway Error: ' + err.message }));
    });
    req.pipe(proxyReq);
    return;
  }

  // File serving
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);

  // SPA Route Fallback: if file doesn't exist and has no extension, serve index.html
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'index.html'), (e, htmlContent) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(htmlContent);
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`AEGISNET React Frontend Running on http://127.0.0.1:${PORT}`);
  console.log(`Proxying /api requests to Flask Backend at ${BACKEND_URL}`);
  console.log(`==================================================`);
});
