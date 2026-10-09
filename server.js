/**
 * Hope 4 Teen Parents Uganda — Local Network Server
 * Run: node server.js
 * Then open: http://192.168.167.38:3000 on any device on the same WiFi
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT    = 3000;
const HOST    = '0.0.0.0'; // listen on all interfaces
const ROOT    = __dirname;

const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.css'  : 'text/css',
  '.js'   : 'text/javascript',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.gif'  : 'image/gif',
  '.webp' : 'image/webp',
  '.svg'  : 'image/svg+xml',
  '.ico'  : 'image/x-icon',
  '.woff' : 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf'  : 'font/ttf',
  '.json' : 'application/json',
};

const server = http.createServer((req, res) => {
  // Decode URL and strip query string
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Default to index.html
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext      = path.extname(filePath).toLowerCase();
  const mimeType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h2 style="font-family:sans-serif;padding:2rem">404 — Page not found</h2>');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  console.log('\n✅  Hope 4 Teen Parents Uganda — Local Server Running\n');
  console.log('   Open on THIS computer:');
  console.log('   → http://localhost:' + PORT);
  console.log('\n   Open on OTHER devices (same WiFi):');
  
  Object.values(interfaces).flat().forEach(iface => {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log('   → http://' + iface.address + ':' + PORT);
    }
  });

  console.log('\n   Press Ctrl+C to stop the server.\n');
});
