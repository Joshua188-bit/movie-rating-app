const seeMoreBtn = document.getElementById('see-more');

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

        const {title, overview, poster_path} = data;
        seeMoreBtn.innerHTML = `
    <div class="movie-details">
        <img class="detail-poster" src="https://image.tmdb.org/t/p/w500${poster_path}">
        <div class="genres">${genres}</div>
        <h1>${title}</h1>
        <p>${overview}</p>
    </div>
        `;


    } catch (error) {
        console.error(error);
    }

}

const movieId = localStorage.getItem('selectedMovieId');
getMovieDetails(movieId);


