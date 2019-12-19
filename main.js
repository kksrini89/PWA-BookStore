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
  url: `https://api.itbook.store/1.0`,
  proxy_url: `https://cors-anywhere.herokuapp.com`,
  query: "javascript",
  page_no: 1,
  book_list: [],
  publisher_list: [],
  async populate() {
    const containerElement = document.querySelector(".books-area");
    this.searchWithQuery().then(async ({ books }) => {
      console.log(books);
      if (books && books.length) {
        for (const book_info of books) {
          const bookResult = await this.getBookByIsbn(book_info.isbn13);
          this.publisher_list.push(bookResult.publisher);
          const bookInfoElement = this.createBookInfoElement(book_info);
          this.book_list.push(book_info);
          containerElement.append(bookInfoElement);
        }
        console.log(this.publisher_list);
        
      }
    });
  },
  createBookInfoElement(book = null) {
    if (book) {
      const book_info_tmpl = `<figure class="image book-figure">
        <image class="book-image" src=${book.image}></image>
      </figure>
      <div class="book-meta">
        <div class="book-name" title=${book.title}>${book.title}</div>
        <div class="book-author" title=${book.subtitle}>${book.subtitle}</div>
      </div>`;
      const bookInfoElement = document.createElement("div");
      bookInfoElement.classList.add("book-info");
      bookInfoElement.innerHTML = book_info_tmpl;
      return bookInfoElement;
    }
  },
  searchWithQuery() {
    const proxy_url = `https://cors-anywhere.herokuapp.com/`;
    return fetch(`${this.proxy_url}/${this.url}/search/${this.query}/${this.page_no}`).then(
      data => {
        return data.json();
      }
    );
  },
  getBookByIsbn(isbn) {
    return fetch(`${this.proxy_url}/${this.url}/books/${isbn}`).then(d => d.json());
  }
};

book.populate();
