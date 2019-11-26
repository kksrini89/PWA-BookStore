if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(() => console.log('[SW] is registered.'))
    .catch(console.error);
}
