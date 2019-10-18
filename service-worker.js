console.log("[STARTUP] Service worker init");

var cacheName = 'hello-world-page';
var filesToCache = [
    '/',
    '/index.html',
    '/res/bulma.min.css',
    '/res/instascan.min.js',
    '/res/jquery.min.js',
    '/res/qr-scanner-worker.min.js',
    '/res/qr-scanner.min.js',
    '/res/qrcode.js',
    '/export.html',
    '/import.html',
    '/service-worker.js'
];
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());

    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    if (event.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
      }
      event.respondWith(
          fetch(event.request)
              .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                      return cache.match('offline.html');
                    });
              })
      );
});
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request);
        })
    );
});