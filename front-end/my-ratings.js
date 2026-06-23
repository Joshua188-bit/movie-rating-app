const allRatings = document.querySelector('.all-ratings');

const ratingResults = async () => {
    try {
        const res = await fetch(`http://localhost:3000/ratings`);
        const data = await res.json();

        allRatings.innerHTML = data.map(r => `
      <div class="rating-card">
        <img src="https://image.tmdb.org/t/p/w500${r.poster_path}" alt="${r.movie_name}">
        <div class="rating-info">
          <h3>${r.movie_name}</h3>
          <p class="rating-score">${r.rate}/10</p>
          <p class="desc">Description:</p>
          <p class="rating-review">${r.rating_description}</p>
              <button class="dlt-button" data-id="${r.id}">Delete</button>
        </div>
      </div>
    `).join('');

          
    document.querySelectorAll('.dlt-button').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                try {
                    const response = await fetch(`http://localhost:3000/ratings/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error(`Error: ${response.status}`);
                    ratingResults();
                } catch (error) {
                    console.log(error);
                }
            });
        });

    } catch (error) {
        console.log(error);
    }
};

ratingResults();