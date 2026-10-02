// KKBC Church Service Worker for Push Notifications
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  let data = {
    title: '📖 آية اليوم المباركة',
    message: 'تأمل في كلمة الرب لهذا اليوم المبارك.',
    url: '/?tab=verse',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'daily-verse'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
      if (!data.message && parsed.body) {
        data.message = parsed.body;
      }
    } catch (e) {
      data.message = event.data.text();
    }
  }

  const options = {
    body: data.message,
    icon: data.icon || '/favicon.svg',
    badge: data.badge || '/favicon.svg',
    tag: data.tag || 'kkbc-verse',
    renotify: true,
    data: {
      url: data.url || '/?tab=verse',
      timestamp: Date.now()
    },
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          if (client.url.includes(urlToOpen) || urlToOpen === '/') {
            return client.focus();
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
