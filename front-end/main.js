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

const loadMoreBtn = document.getElementById("load-more");
loadMoreBtn.addEventListener("click", loadMore);


const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const heroSection = document.querySelector('.hero-section');
const searchDrop = document.getElementById('search-dropdown');


async function fetchSearchResults(query) {
  const response = await fetch(
    `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
}

async function showDropdown() {
  const query = searchInput.value.trim();

  if (query === "") {
    searchDrop.innerHTML = "";
    return;
  }

  try {
    const results = await fetchSearchResults(query);
    searchDrop.innerHTML = "";

    results.slice(0, 5).forEach(movie => {
      const li = document.createElement('li');

      let poster;
      if (movie.poster_path) {
        poster = `https://image.tmdb.org/t/p/w92${movie.poster_path}`;
      } else {
        poster = 'https://via.placeholder.com/92x138?text=N/A';
      }

      li.innerHTML = `
        <img src="${poster}" alt="">
        <span>${movie.title}</span>
      `;
      li.addEventListener('click', () => {
        localStorage.setItem('selectedMovieId', movie.id);
        window.location.href = '/front-end/pages/see-more.html';
      });
      searchDrop.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

async function showSearchResults() {
  const query = searchInput.value.trim();
  if (query === "") return;

  heroSection.style.display = "none";
  searchResults.innerHTML = `
    <h2>Results for "${query}"</h2>
    <div id="search-movies"></div>
  `;

  const grid = document.getElementById('search-movies');
  try {
    const results = await fetchSearchResults(query);

    results.forEach(movie => {
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
      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

searchInput.addEventListener('input', () => {
  showDropdown();
  showSearchResults();
});

searchButton.addEventListener('click', () => {
  searchDrop.innerHTML = "";
  showSearchResults();
});
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchDrop.innerHTML = "";
    showSearchResults();
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-group')) {
    searchDrop.innerHTML = "";
  }
});
