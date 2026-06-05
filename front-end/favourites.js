import { API_URL, API_KEY } from '/src/config.js';

let favourites = document.querySelector('.favs-movies');

async function getFavourites() {
    try {
        const response = await fetch('http://localhost:3000/favourites');

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const movies = await response.json();

        if (movies.length === 0) {
            favourites.innerHTML = `<p class="empty-message">No favourites yet!</p>`;
            return;
        }

        favourites.innerHTML = movies.map(movie =>
            `
        <div class="fav-column">
            <div class="movie-column">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.movie_name}">
                <div class="fav-hover-card">
                    <p>${movie.movie_name}</p>
                    <button class="delete-button" data-id="${movie.movie_id}">Delete</button>
                </div>
            </div>
        </div>
    `
        ).join('');

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                try {
                    const response = await fetch(`http://localhost:3000/favourites/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error(`Error: ${response.status}`);
                    getFavourites()
                } catch (error) {
                    console.log(error);
                }
            });
        });

    } catch (error) {
        console.error(error);
        favourites.innerHTML = `<p class="empty-message">Failed to load favourites.</p>`;
    }
}

getFavourites();