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
  async populate() {
    const containerElement = document.querySelector(".books-area");

    const isbns = await Promise.all(
      isbn_list.map(book =>
        this.getBookCover(book).then(({ items }) => items[0].volumeInfo)
      )
    );
    console.log(isbns);
    isbns.forEach(book => {
      const book_info_tmpl = `<figure class="image book-figure">
        <image class="book-image" src=${book.imageLinks.thumbnail}></image>
      </figure>
      <div class="book-meta">
        <div class="book-name" title=${book.title}>${book.title}</div>
        <div class="book-author" title=${book.authors.join(',')}>${book.authors.join(',')}</div>
      </div>`;
      const bookInfoElement = document.createElement("div");
      bookInfoElement.classList.add("book-info");
      bookInfoElement.innerHTML = book_info_tmpl;
      containerElement.append(bookInfoElement);
    });
  },
  getBookCover(isbn) {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, {
      method: "GET"
    }).then(d => d.json());
  }
};

book.populate();
