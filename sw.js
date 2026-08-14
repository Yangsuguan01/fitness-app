const CACHE_NAME = 'fitness-app-v6';
const BASE_PATH = new URL(self.registration.scope).pathname;
const ASSETS = [
  '',
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/data.js',
  'icons/icon.svg',
  'manifest.json'
].map(path => `${BASE_PATH}${path}`);

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
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 请求拦截：静态资源走缓存优先，API 请求走网络优先
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API / Worker 请求不缓存，离线时返回友好提示
  if (url.pathname.endsWith('/api/recognize')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: '离线状态下无法识别，请连网后重试' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // 训练计划更新频繁，优先使用最新版本，离线时再回退缓存
  if (url.pathname.endsWith('/js/data.js') || url.pathname.endsWith('/index.html') || event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request))
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
