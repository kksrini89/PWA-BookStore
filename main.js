// import data from './books-data';

if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("[SW] is registered."))
    .catch(console.error);
}

const applied_filter_tmpl = `<div>
<span class="close">X</span>
<span class="filter-text"></span>
</div>`;

const book = {
  populate() {
    console.log(books);
    const containerElement = document.querySelector(".books-area");
    books.forEach(book => {
      const book_info_tmpl = `<figure class="image book-figure">
        <image class="book-image" src="https://bulma.io/images/placeholders/256x256.png"></image>
      </figure>
      <div class="book-meta">
        <div class="book-name">${book.title}</div>
        <div class="book-author">${book.author}</div>
      </div>`;
      const bookInfoElement = document.createElement("div");
      bookInfoElement.classList.add("book-info");
      bookInfoElement.innerHTML = book_info_tmpl;
      containerElement.append(bookInfoElement);
    });
  }
};

book.populate();
