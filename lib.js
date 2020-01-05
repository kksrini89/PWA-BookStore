import book from "./book.js";
import { searchWithQuery, getBookByIsbn } from "./api.js";

const containerElement = document.querySelector(".books-area");
const applied_filter_tmpl = `<div>
<span class="close">X</span>
<span class="filter-text"></span>
</div>`;

export function searchBook() {
  return new Promise((resolve, reject) => {
    const input = document.querySelector("#searchInput");
    if (!!input.value) {
      searchWithQuery(input.value)
        .then(({ books }) => {
          console.log(`[SEARCH BOOK]`);

          if (books && books.length) {
            // Reset values
            book.book_list.length = 0;
            book.book_imgs.length = 0;
            book.publisher_list.length = 0;
            book.authors.length = 0;

            // book.book_list = books;
            // Books area
            clearBookContainer();
            clearPublisherDropdown();
            clearAuthorDropdown();
            for (const info of books) {
              getBookByIsbn(info.isbn13).then(data => {
                book.book_imgs.push(data.image);
                book.publisher_list.push(data.publisher);
                book.authors.push(data.authors);
                book.book_list.push(data);

                populateBook(data);
              });
              populatePublisher([...new Set(book.publisher_list)]);
              populateAuthor([...new Set(book.authors)]);
            }
            // Publisher filter
            resolve(books);
          }
        })
        .catch(reject);
    } else {
      book.populate().then(() => console.log("Received [NEW Books]"));
    }
  });
}

export function populatePublisher(names) {
  // To populate publisher filter
  const publisherElement = document.querySelector(
    ".publishers-filter div.dropdown-menu"
  );
  const content = document.createElement("div");
  content.classList.add("dropdown-content");
  names.forEach(val => {
    if (!!val) {
      content.append(createPublisherElement(val));
    }
  });
  publisherElement.append(content);
}

export function populateAuthor(names) {
  // To populate publisher filter
  const authorElement = document.querySelector(
    ".authors-filter div.dropdown-menu"
  );
  const content = document.createElement("div");
  content.classList.add("dropdown-content");
  names.forEach(val => {
    if (!!val) {
      content.append(createAuthorElement(val));
    }
  });
  authorElement.append(content);
}

export function populateBook(book_info) {
  if (book_info) {
    // To create book UI element
    const bookInfoElement = createBookInfoElement(book_info);

    // To add book element to UI container
    containerElement.append(bookInfoElement);
  }
}

export function clearBookContainer() {
  document.querySelector(".books-area").innerHTML = "";
}

export function clearPublisherDropdown() {
  document.querySelector(".publishers-filter div.dropdown-menu").innerHTML = "";
}

export function clearAuthorDropdown() {
  document.querySelector(".authors-filter div.dropdown-menu").innerHTML = "";
}

/**
 * Publisher dropdown - On click handler
 */
function selectPublisher(event) {
  event.preventDefault();
  console.log(this.text);

  // Reset already selected option
  const menuItems = document.querySelectorAll(
    ".publishers-filter a.dropdown-item"
  );
  menuItems.forEach(item => item.classList.remove("is-active"));

  // add highlight option
  this.classList.add("is-active");

  filterByPublisher(this.text);
}

/**
 * Publisher dropdown - On click handler
 */
function selectAuthor(event) {
  event.preventDefault();
  console.log(this.text);

  // Reset already selected option
  const menuItems = document.querySelectorAll(
    ".authors-filter a.dropdown-item"
  );
  menuItems.forEach(item => item.classList.remove("is-active"));

  // add highlight option
  this.classList.add("is-active");

  filterByAuthor(this.text);
}

/**
 * To create publisher dropdown item
 * @param {string} name Publisher name
 * @returns { HTMLElement }
 */
function createPublisherElement(name) {
  if (name) {
    const anchorTag = document.createElement("a");
    anchorTag.classList.add("dropdown-item");
    anchorTag.setAttribute("href", "#");
    anchorTag.text = name;
    anchorTag.onclick = selectPublisher;
    return anchorTag;
  }
  //   return (
  //     name &&
  //     `<a class="dropdown-item">
  //   ${name}
  // </a>`
  //   );
}

function createAuthorElement(name) {
  if (name) {
    const anchorTag = document.createElement("a");
    anchorTag.classList.add("dropdown-item");
    anchorTag.setAttribute("href", "#");
    anchorTag.text = name;
    anchorTag.onclick = selectAuthor;
    return anchorTag;
  }
  //   return (
  //     name &&
  //     `<a class="dropdown-item">
  //   ${name}
  // </a>`
  //   );
}

/**
 * To create book ui element
 * @param {object} book
 * @returns { HTMLElement }
 */
function createBookInfoElement(book = null) {
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
}

// Utility methods
function filterByPublisher(publisher = null) {
  if (publisher) {
    // clear books area container
    containerElement.innerHTML = "";
    const { book_list } = book;

    if (book_list && book_list.length) {
      for (const book of book_list) {
        if (book.publisher.toLowerCase() === publisher.toLowerCase()) {
          populateBook(book);
        }
      }
    }
  }
}

function filterByAuthor(author = null) {
  if (author) {
    // clear books area container
    containerElement.innerHTML = "";
    const { book_list } = book;

    if (book_list && book_list.length) {
      for (const book of book_list) {
        if (book.authors.toLowerCase() === author.toLowerCase()) {
          populateBook(book);
        }
      }
    }
  }
}
