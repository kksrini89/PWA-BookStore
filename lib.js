const containerElement = document.querySelector(".books-area");
const applied_filter_tmpl = `<div>
<span class="close">X</span>
<span class="filter-text"></span>
</div>`;

export function populatePublisher(names) {
  // TO-DO, To populate publisher filter
  const publisherElement = document.querySelector(
    ".publishers-filter div.dropdown-menu"
  );
  const content = document.createElement("div");
  content.classList.add("dropdown-content");
  Array.of(names).forEach(val => {
    if (!!val) {
      content.append(createPublisherElement(val));
    }
  });
  publisherElement.append(content);
}

export function populateBook(book_info) {
  if (book_info) {
    // To create book UI element
    const bookInfoElement = createBookInfoElement(book_info);

    // To add book element to UI container
    containerElement.append(bookInfoElement);
  }
}

function createPublisherElement(name) {
  if (name) {
    const anchorTag = document.createElement("a");
    anchorTag.classList.add("dropdown-item");
    anchorTag.setAttribute("href", "#");
    anchorTag.text = name;
    return anchorTag;
  }
  //   return (
  //     name &&
  //     `<a class="dropdown-item">
  //   ${name}
  // </a>`
  //   );
}

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
