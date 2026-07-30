import { createReadStream, stat } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = '0.0.0.0';
const PORT = 4173;
const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
]);

function sendError(response, statusCode, message) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(message);
}

function resolveRequestPath(requestUrl = '/') {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const absolutePath = resolve(ROOT, `.${requestedPath}`);
  if (absolutePath !== ROOT && !absolutePath.startsWith(`${ROOT}${sep}`)) return null;
  return absolutePath;
}

const server = createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendError(response, 405, 'Method Not Allowed');
    return;
  }

  let absolutePath;
  try {
    absolutePath = resolveRequestPath(request.url);
  } catch {
    sendError(response, 400, 'Bad Request');
    return;
  }
  if (!absolutePath) {
    sendError(response, 403, 'Forbidden');
    return;
  }

  stat(absolutePath, (error, fileStat) => {
    if (error || !fileStat.isFile()) {
      sendError(response, 404, 'Not Found');
      return;
    }

    const extension = extname(absolutePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': MIME_TYPES.get(extension) || 'application/octet-stream',
      'Content-Length': fileStat.size,
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    createReadStream(absolutePath).pipe(response);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`LiveLab listening on http://${HOST}:${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
