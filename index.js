const API_KEY = 'fe813f2061b5ec7528a998d1ea732182';
const BASE_URL = 'https://api.themoviedb.org/3';

function getMovieInfo(movieTitle) {
  fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${movieTitle}&page=1&include_adult=false`)
    .then(response => response.json())
    .then(data => {
      const movie = data.results[0];
      if (movie) {
        // Get the trailer video
        fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`)
          .then(response => response.json())
          .then(data => {
            const video = data.results.find(result => result.type === 'Trailer');
            const trailer = video ? `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${video.key}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` : '';
            const movieInfo = `
              ${trailer}
              <h3>${movie.title}</h3>
              <p>${movie.release_date}</p>
              <p>${movie.overview}</p>
            `;
            document.getElementById('movies').innerHTML = movieInfo;
          })
          .catch(error => console.error(error));
      } else {
        document.getElementById('movies').innerHTML = '<p>No movie found.</p>';
      }
    })
    .catch(error => console.error(error));
}

