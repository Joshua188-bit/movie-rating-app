let formPage = document.querySelector('.form');

formPage.innerHTML = movies.map(movie => 
    `
    <img src="https://image.tmdb.org/t/p/w500${movies.poster_path}" alt="Movie overview">
    `

).join('');