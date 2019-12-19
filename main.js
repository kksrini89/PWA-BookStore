import { books } from "./books-data.js";
import { populatePublisher, populateBook } from "./lib.js";
import { searchWithQuery, getBookByIsbn } from "./api.js";

if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("[SW] is registered."))
    .catch(console.error);
}

const book = {
  query: "javascript",
  page_no: 1,
  book_list: [],
  publisher_list: [],
  async populate() {
    const { books } = await searchWithQuery(this.query, this.page_no);
    console.log(books);
    if (books && books.length) {
      for (const book_info of books) {
        if (book_info) {
          // GET Book Meta Data Info
          const bookResult = await getBookByIsbn(book_info.isbn13);
          this.publisher_list.push(bookResult.publisher);

          // To populate book area
          populateBook(book_info);
          this.book_list.push(book_info);
        }
      }
      console.log(this.publisher_list);
    }
  }
};

book.populate();
