const watchList = document.querySelector(".watchlist-result");


async function getWatchList() {
    try {
        const response = await fetch('http://localhost:3000/watchlist');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();


        watchList.innerHTML = data.map(movies =>
            `
            <div class = "movieoverview-card">
            <img src="https://image.tmdb.org/t/p/w500${movies.poster_path}" alt="Movie overview">
                <div class="movie-description">
                    <p>${movies.movie_name}</p>
                    <p class="desc-movie">${movies.movie_description}</p>
                </div>
                    <div class="delete-flex">
                        <button class="dlt-button" data-id="${movies.movie_id}">Delete</button>
                    </div>
            </div>
             `
        ).join('');

        document.querySelectorAll('.dlt-button').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                try {
                    const response = await fetch(`http://localhost:3000/watchlist/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error(`Error: ${response.status}`);
                    getWatchList();
                } catch (error) {
                    console.log(error);
                }
            });
        });

    } catch (error) {
        console.log(error);
    }
}

getWatchList();