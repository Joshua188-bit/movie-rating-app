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
          <p class="rating-review">${r.rating_description}</p>
        </div>
      </div>
    `).join('');
    

    } catch (error) {
        console.log(error);
    }
};

ratingResults();