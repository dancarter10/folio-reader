/* Folio Reader service worker: offline support and the Android "share to" target. */
const VERSION = '1.0.0-05ea5ba87c';
const CACHE = `folio-reader-${VERSION}`;
const SHARE_CACHE = 'folio-reader-share';
const PRECACHE = [
  "./app.css",
  "./app.js",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./index.html",
  "./lib/iccs/CGATS001Compat-v2-micro.icc",
  "./lib/images/annotation-check.svg",
  "./lib/images/annotation-comment.svg",
  "./lib/images/annotation-help.svg",
  "./lib/images/annotation-insert.svg",
  "./lib/images/annotation-key.svg",
  "./lib/images/annotation-newparagraph.svg",
  "./lib/images/annotation-noicon.svg",
  "./lib/images/annotation-note.svg",
  "./lib/images/annotation-paperclip.svg",
  "./lib/images/annotation-paragraph.svg",
  "./lib/images/annotation-pushpin.svg",
  "./lib/pdf.worker.min.js",
  "./lib/pdf_viewer.css",
  "./lib/standard_fonts/FoxitDingbats.pfb",
  "./lib/standard_fonts/FoxitFixed.pfb",
  "./lib/standard_fonts/FoxitFixedBold.pfb",
  "./lib/standard_fonts/FoxitFixedBoldItalic.pfb",
  "./lib/standard_fonts/FoxitFixedItalic.pfb",
  "./lib/standard_fonts/FoxitSerif.pfb",
  "./lib/standard_fonts/FoxitSerifBold.pfb",
  "./lib/standard_fonts/FoxitSerifBoldItalic.pfb",
  "./lib/standard_fonts/FoxitSerifItalic.pfb",
  "./lib/standard_fonts/FoxitSymbol.pfb",
  "./lib/standard_fonts/LiberationSans-Bold.ttf",
  "./lib/standard_fonts/LiberationSans-BoldItalic.ttf",
  "./lib/standard_fonts/LiberationSans-Italic.ttf",
  "./lib/standard_fonts/LiberationSans-Regular.ttf",
  "./lib/wasm/jbig2.wasm",
  "./lib/wasm/openjpeg.wasm",
  "./lib/wasm/qcms_bg.wasm",
  "./manifest.webmanifest"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(PRECACHE.map((path) => new Request(path, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('folio-reader-') && key !== CACHE && key !== SHARE_CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

async function receiveSharedFile(request) {
  const scope = self.registration.scope;
  try {
    const form = await request.formData();
    const files = form.getAll('file').filter((f) => f && typeof f === 'object' && 'size' in f);
    const file = files.find((f) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name || '')) || files[0];
    if (!file) return Response.redirect(new URL('./?shared=none', scope).href, 303);
    const cache = await caches.open(SHARE_CACHE);
    await cache.put('shared-file', new Response(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'X-File-Name': encodeURIComponent(file.name || 'Shared document.pdf'),
      },
    }));
    return Response.redirect(new URL('./?shared=file', scope).href, 303);
  } catch (err) {
    return Response.redirect(new URL('./?shared=none', scope).href, 303);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method === 'POST' && url.origin === self.location.origin && url.pathname.endsWith('/share-target')) {
    event.respondWith(receiveSharedFile(request));
    return;
  }
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match('./index.html');
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic' && !response.redirected) cache.put('./index.html', response.clone()).catch(() => {});
        return response;
      } catch {
        return Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const response = await fetch(request);
    // Keep a copy so the app keeps working offline (and repairs itself if the cache was cleared).
    if (response.ok && response.type === 'basic') cache.put(request, response.clone()).catch(() => {});
    return response;
  })());
});
