// Gra i dane: najpierw sieć (zawsze świeża wersja). Grafiki z assets/: najpierw pamięć podręczna, odświeżane w tle.
const C='rl-cache';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin&&u.pathname.includes('/assets/')){
    e.respondWith(caches.open(C).then(c=>c.match(e.request).then(hit=>{
      const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
      return hit||net;
    })));
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)));
});
