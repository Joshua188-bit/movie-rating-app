window.addEventListener("DOMContentLoaded", loadPopularMovies);

async function loadPopularMovies() {
  const container = document.getElementById("popular-movies");

  try {
    const response = await fetch(
      `${API_URL}/movie/popular?api_key=${API_KEY}`
    );

    const data = await response.json();

    data.results.forEach(movie => {
      const { title, poster_path, vote_average, overview } = movie;
      container.innerHTML += `
      <div class= <"movie-card">
      <img class="poster" src = "https://image.tmdb.org/t/p/w500${poster_path}">
      <h3>${title}</h3>
      <p>${overview}</p>
      <p>${vote_average}</p>
      </div>`
    });
  } catch (error) {
    console.error(error);
  }
}
