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

        seeMoreBtn.innerHTML = `
    <div class="movie-details">
        <h1>${data.title}</h1>
        <img class="detail-poster" src="https://image.tmdb.org/t/p/w500${data.poster_path}">
        <p>${data.overview}</p>
    </div>
        `;


    } catch (error) {
        console.error(error);
    }

}

const movieId = localStorage.getItem('selectedMovieId');
getMovieDetails(movieId);


