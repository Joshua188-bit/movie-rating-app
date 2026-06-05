import { API_URL, API_KEY } from '/src/config.js';

let formPage = document.querySelector('.form');


async function loadMovie() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    const res = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const data = await res.json();

    const { poster_path, title } = data;
    formPage.innerHTML = `
    <div class = "rating-page">
        <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}">
        <form action="/submit" method="post" class="rating-form">
        <h2>${title}</h2>
        <label for="Rate">Your Rating</label>
        <input type="number" id="Rate" name="Rate" min="1" max="10" placeholder="example 8.5">
        
        <label for="Desc">Your Review</label>
        <textarea id="Desc" name="Desc" rows="6" placeholder="What did you think?"></textarea>

        <button type="submit" class="submit-rating">Submit Rating</button>
        </form>
    </div>
  `;
}
loadMovie();