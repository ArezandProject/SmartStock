// Nome do cache
const CACHE_NAME = 'smart_stock_v1.5';

// Arquivos que serão armazenados para uso offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './style.css',      
  './service-worker.js',
  './icons/192.png',
  './icons/512.png',
  './entradas.html',
  './saidas.html',
  './sobre.html'
  
];

// Instala o service worker e faz o cache inicial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Intercepta requisições e serve do cache quando offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Cache de recursos dinâmicos, como imagens ou dados
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      }).catch(() => caches.match('./index.html')); 
    })
  );
});

