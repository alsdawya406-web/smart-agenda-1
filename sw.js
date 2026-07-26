const CACHE_NAME = 'agenda-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// 1. التثبيت والتخزين
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// 2. التفعيل وتنظيف القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. التشغيل بدون إنترنت (Offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

// 4. المزامنة في الخلفية (Background Sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(Promise.resolve());
  }
});

// 5. المزامنة الدورية (Periodic Sync)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(Promise.resolve());
  }
});

// 6. الإشعارات (Push Notifications)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'تنبيه جديد من الأجندة!',
    icon: './logo.png',
    badge: './logo.png'
  };
  event.waitUntil(
    self.registration.showNotification('Smart Agenda Pro', options)
  );
});
