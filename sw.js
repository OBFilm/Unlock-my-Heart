const CACHE_NAME='unlock-my-heart-v1';
const FILES=['./','./index.html','./style.css','./main.js','./assets/level1.jpg','./assets/level2.jpg','./assets/level3.jpg','./assets/lock.png','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE_NAME?null:caches.delete(k)))))});
self.addEventListener('fetch',e=>{const url=new URL(e.request.url); if(url.origin===location.origin){e.respondWith(caches.match(e.request).then(res=>res||fetch(e.request)));}});
