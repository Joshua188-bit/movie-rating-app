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

    data.results.forEach(movie => {
      const { title, poster_path, vote_average, overview, release_date } = movie;
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML += `
      <div class= "movie-card">
      <img class="poster" src = "https://image.tmdb.org/t/p/w500${poster_path}">
      <div class = "hover-card">
      <h3>${title}</h3>
      <p>${vote_average}</p>
      <p>${formatDate(release_date)}</p>
       </div>
      </div>`
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