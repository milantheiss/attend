import { precacheAndRoute } from "workbox-precaching";
let self;
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

//Fix für automatische Aktualisierung auf iOS
const version = "1.0.1"
const staticCacheName = version + "_pwa-static";
const dynamicCacheName = version + "_pwa-dynamic";

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    if (!cacheName.startsWith(staticCacheName) &&
                        !cacheName.startsWith(dynamicCacheName)) {
                        return true;
                    }
                }).map(function(cacheName) {
                    // completely deregister for ios to get changes too
                    console.log('deregistering Serviceworker')
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(function(registrations) {
                            registrations.map(r => {
                                r.unregister()
                            })
                        })
                        window.location.reload(true)
                    }

                    console.log('Removing old cache.', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);
