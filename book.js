import { getBookByIsbn, getNewBooks } from "./api.js";
import { populateBook, populatePublisher } from "./lib.js";

const book = {
  query: "javascript",
  page_no: 1,
  book_list: [],
  publisher_list: [],
  async populate() {
    // clear the books area
    document.querySelector(".books-area").innerHTML = "";

    // const { books } = await searchWithQuery(this.query, this.page_no);
    const { books } = await getNewBooks();
    console.log(books);
    if (books && books.length) {
      for (const book_info of books) {
        if (book_info) {
          // GET Book Meta Data Info
          const bookResult = await getBookByIsbn(book_info.isbn13);
          this.publisher_list.push(bookResult.publisher);
          this.book_list.push(bookResult);
          // To populate book area
          populateBook(bookResult);
        }
      }
      // To fill publishers dropdown values
      populatePublisher([...new Set(this.publisher_list)]);
    }
  }
};

export default book;
