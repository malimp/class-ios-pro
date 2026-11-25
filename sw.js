const VERSION='v1.33.49';
const CACHE='class-shell-'+VERSION;
const ASSETS=[
 './index.html',
 './manifest.webmanifest',
 './logo.jpg',
 './icons/icon-180.png',
 './icons/icon-192.png',
 './icons/icon-512.png',
 './icons/icon-512-maskable.png',
 './fonts/vazirmatn-arabic.woff2',
 './fonts/vazirmatn-latin-ext.woff2',
 './fonts/vazirmatn-latin.woff2',
 './xlsx.full.min.js'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('class-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))
});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const res=await fetch(req);
    if(res.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',res.clone())}
    return res
   }catch(_){
    return (await caches.match('./index.html'))||Response.error()
   }
  })());
  return
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
  if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}
  return res
 })))
});
