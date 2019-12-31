import { getBookByIsbn, getNewBooks } from "./api.js";
import {
  populateBook,
  populatePublisher,
  clearBookContainer,
  searchBook
} from "./lib.js";

const book = {
  query: "javascript",
  page_no: 1,
  book_list: [],
  book_imgs: [],
  publisher_list: [],
  populate() {
    return new Promise(async (resolve, reject) => {
      // clear the books area
      clearBookContainer();

      // const { books } = await searchWithQuery(this.query, this.page_no);
      const { books } = await getNewBooks();
      console.log(books);
      if (!books.length) {
        reject("No [NEW BOOKS] available...");
      }
      // if (books && books.length) {
      for (const book_info of books) {
        if (book_info) {
          // Reset presaved values
          this.publisher_list.length = 0;
          this.book_imgs.length = 0;
          this.book_list.length = 0;

          // GET Book Meta Data Info
          const bookResult = await getBookByIsbn(book_info.isbn13);
          this.publisher_list.push(bookResult.publisher);
          this.book_imgs.push(bookResult.image);
          this.book_list.push(bookResult);

          // To populate book area
          populateBook(bookResult);
        }
      }
      // To fill publishers dropdown values
      populatePublisher([...new Set(this.publisher_list)]);
      resolve(true);
      // }
    });
  },
  search() {
    document.querySelector("#searchInput").addEventListener("keypress", e => {
      var code = e.keyCode || e.which;
      if (code == 13) {
        //Enter keycode
        searchBook().then(() => console.log(`Results are shown!!!`));
      }
    });
  }
};

export default book;
