const BASE = self.location.pathname.replace(/sw\.js$/, '');
const CACHE_NAME = 'fitness-app-v10';
const ASSETS = [
  '/',
  BASE + 'index.html',
  BASE + 'css/style.css',
  BASE + 'js/app.js',
  BASE + 'js/data.js',
  BASE + 'icons/icon.svg',
  BASE + 'manifest.json'
];

// 安装：预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Delete ALL caches to force fresh load
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
}););

// 请求拦截：静态资源走缓存优先，API 请求走网络优先
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API / Worker 请求不缓存，离线时返回友好提示
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: '离线状态下无法识别，请连网后重试' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // 静态资源：缓存优先 + 网络回退更新
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
