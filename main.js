import book from "./book.js";

if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("[SW] is registered."))
    .catch(console.error);
}

function cleanBookAPIImage(imgs) {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg.active.postMessage({ action: "cleanBookImages", imgs: imgs });
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  book.populate().then(() => {
    // To clean cached book images if it's old
    if (navigator.serviceWorker) cleanBookAPIImage(book.book_imgs);
  });
});
