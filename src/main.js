window.addEventListener("DOMContentLoaded", loadPopularMovies);

async function loadPopularMovies() {
  try {
    const response = await fetch(
      `${API_URL}/movie/popular?api_key=${API_KEY}`
    );

    const data = await response.json();
  } catch (error) {
    console.error(error);
  }
}
