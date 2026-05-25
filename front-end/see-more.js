const seeMoreBtn = document.getElementById('see-more');

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function getMovieDetails(id) {
  try {
    const response = await fetch(
      `${API_URL}/movie/${id}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    const genres = data.genres.map(genre => `
        <span class="badge">${genre.name}</span>
        `).join('');
    const language = data.spoken_languages.map(spoken_languages => `
            <p>${spoken_languages.name}</p>
        `).join('');
    const { title, overview, poster_path, vote_average, runtime, release_date, revenue, budget, status, } = data;
    seeMoreBtn.innerHTML = `
      <div class="movie-details">
        <div class="movie-items">
          <img class="detail-poster" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="movie poster">
          <div class="movie-description">
            <div class="genres">${genres}</div>
            <h1>${title}</h1>
            <p class="overview-text">${overview}</p>
            <div class="stat-boxes">
              <div class="stat-box">
                <p class="stat-label">Rating</p>
                <p class="stat-value">${vote_average.toFixed(1)}</p>
              </div>
              <div class="stat-box">
                <p class="stat-label">Runtime</p>
                <p class="stat-value">${Math.floor(runtime / 60)}h ${runtime % 60}m</p>
              </div>
              <div class="stat-box">
                <p class="stat-label">Release date</p>
                <p class="stat-value">${formatDate(release_date)}</p>
              </div>
            </div>
            <div class="details-part">
              <h3>Details</h3>
              <div class="details-grid">
                <div>
                  <p class="detail-label">Status</p>
                  <p class="detail-value">${status}</p>
                </div>
                <div>
                  <p class="detail-label">Language</p>
                  <p class="detail-value">${language}</p>
                </div>
                <div>
                  <p class="detail-label">Budget</p>
                  <p class="detail-value">$${budget.toLocaleString()}</p>
                </div>
                <div>
                  <p class="detail-label">Revenue</p>
                  <p class="detail-value">$${revenue.toLocaleString()}</p>
                </div>
              </div>
              <div class="saving-buttons">
                <button class="Save-btn">Add To Watchlist</button>
                <button class="favourites-btn">Favourite</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const saveBtn = document.querySelector(".Save-btn");

    saveBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3000/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movieId: id,
            movie_name: title,
            movie_description: overview,
            poster_path: poster_path
          })
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        saveBtn.textContent = 'Added to Watchlist!';
        saveBtn.disabled = true;
      }
      catch (error) {
        console.error(error);
      }
    })

    const favBtn = document.querySelector('.favourites-btn');

    favBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3000/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movieId: id,
            movie_name: title,
            poster_path: poster_path
          })
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        favBtn.textContent = 'Added to Favourites!';
        favBtn.disabled = true;

      } catch (error) {
        console.error(error);
      }
    })


  } catch (error) {
    console.error(error);
  }

}


const movieId = localStorage.getItem('selectedMovieId');
getMovieDetails(movieId);


