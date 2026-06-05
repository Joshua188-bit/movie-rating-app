import { API_URL, API_KEY } from "../src/config";
let currentPage = 1;
window.addEventListener("DOMContentLoaded", loadPopularMovies);

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function loadPopularMovies() {
  const container = document.getElementById("popular-movies");
  

  try {
    const response = await fetch(
      `${API_URL}/movie/popular?api_key=${API_KEY}&page=${currentPage}`
    );

    const data = await response.json();

    data.results.map(movie => {
      const { title, poster_path, vote_average, overview, release_date } = movie;
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
  <img class="poster" src="https://image.tmdb.org/t/p/w500${poster_path}">
  <div class="hover-card">
    <h3>${title}</h3>
    <p class="description">${overview}</p>
    <p>${vote_average}</p>
    <p>${formatDate(release_date)}</p>
    <a class="see-more-link" href="#">See More</a>
  </div>
`;

      card.querySelector(".see-more-link").addEventListener('click', () => {
        localStorage.setItem('selectedMovieId', movie.id);
        window.location.href = '/front-end/pages/see-more.html';
      });
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

function loadMore() {
  currentPage++;
  loadPopularMovies();
}

