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
  book_list: [],
  async populate() {
    const containerElement = document.querySelector(".books-area");
    for (const [i, isbn] of isbn_list.entries()) {
      setTimeout(() => {
        this.getBookCover(isbn).then(({ items }) => {
          console.log(items);
          if (items && items.length && items[0].volumeInfo) {
            const bookInfoElement = this.createBookInfoElement(items[0].volumeInfo);
            this.book_list.push(items[0].volumeInfo);
            containerElement.append(bookInfoElement);
          }
        });
      }, i * 1000);
    }
  },
  createBookInfoElement(book = null) {
    if (book) {
      const book_info_tmpl = `<figure class="image book-figure">
        <image class="book-image" src=${book.imageLinks.thumbnail}></image>
      </figure>
      <div class="book-meta">
        <div class="book-name" title=${book.title}>${book.title}</div>
        <div class="book-author" title=${book.authors.join(
          ","
        )}>${book.authors.join(",")}</div>
      </div>`;
      const bookInfoElement = document.createElement("div");
      bookInfoElement.classList.add("book-info");
      bookInfoElement.innerHTML = book_info_tmpl;
      return bookInfoElement;
    }
  },
  getBookCover(isbn) {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, {
      method: "GET"
    }).then(d => d.json());
  }
};

book.populate();
