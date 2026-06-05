import { API_URL, API_KEY } from '/src/config.js';

let formPage = document.querySelector('.form');


async function loadMovie() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    const res = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const data = await res.json();

    const { poster_path, title } = data;
    formPage.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}">
    <form action="/submit" method="post">
      <label for="Rate">Rate:
        <input type="text" id="Rate" name="Rate" placeholder="Rate the movie">
      </label>
      <label for="Desc">Description:
        <input type="text" id="Desc" name="Desc" placeholder="How was the movie?">
      </label>
    </form>
  `;
}
loadMovie();