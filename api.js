const url = `https://api.itbook.store/1.0`;
const proxy_url = `https://cors-anywhere.herokuapp.com`;

export function searchWithQuery(query = "javascript", page_no = 1) {
  return fetch(`${proxy_url}/${url}/search/${query}/${page_no}`).then(data =>
    data.json()
  );
}

export function getNewBooks() {
  return fetch(`${proxy_url}/${url}/new`).then(data => data.json());
}

export function getBookByIsbn(isbn) {
  return fetch(`${proxy_url}/${url}/books/${isbn}`).then(d => d.json());
}
