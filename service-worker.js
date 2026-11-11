const CACHE = 'sales-track-shell-v8';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './firebase-config.js'];
const SDK = 'https://www.gstatic.com/firebasejs/';
const APP_PATHS = ['/', '/index.html', '/firebase-config.js'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

let updateReady = false;
function notifyUpdate() {
  updateReady = true;
  self.clients.matchAll({ type: 'window' }).then(cs => cs.forEach(c => c.postMessage({ type: 'update' })));
}
// A freshly opened page asks whether a newer version was found while it was loading.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'check' && updateReady && event.source) event.source.postMessage({ type: 'update' });
});

// App files: show the saved copy instantly, then check for a newer one in the background.
async function staleWhileRevalidate(event, req) {
  const cache = await caches.open(CACHE);
  const key = req.mode === 'navigate' ? './index.html' : req;
  const cached = (await cache.match(key)) || (await cache.match('./'));
  const spare = cached ? cached.clone() : null; // kept aside because the browser consumes the copy we return
  const target = req.mode === 'navigate' ? new Request('./index.html', { cache: 'no-cache' }) : new Request(req, { cache: 'no-cache' });
  const network = fetch(target).then(async res => {
    if (res && res.ok) {
      const copy = res.clone();
      } else {
        await cache.put(key, copy);
      }
    }
    return res;
  }).catch(() => null);
  if (cached) { event.waitUntil(network); return cached; }
  const res = await network;
  return res || (await cache.match('./index.html')) || Response.error();
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Firebase SDK files never change for a given version: keep them after the first download.
  if (req.url.startsWith(SDK)) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    })));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate' || APP_PATHS.includes(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event, req));
    return;
  }

  // Icons and other static files: saved copy first.
  event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
    }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
