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
              <button class="like-button"><i class="far fa-heart"></i></button>
              <span class="like-counter">0</span>
              <p>${movie.release_date}</p>
              <p>${movie.overview}</p>
            `;
            document.getElementById('movies').innerHTML = movieInfo;
            const likeButton = document.querySelector('.like-button');
            const likeCounter = document.querySelector('.like-counter');
            let likes = 0;
            likeButton.addEventListener('click', () => {
              likes++;
              likeCounter.innerText = likes;
              likeButton.innerHTML = '<i class="fas fa-heart"></i>';
            });
          })
          .catch(error => console.error(error));
      } else {
        document.getElementById('movies').innerHTML = '<p>No movie found.</p>';
      }
    })
    .catch(error => console.error(error));
}

function getPopularMovies() {
  fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
    .then(response => response.json())
    .then(data => {
      const moviesContainer = document.getElementById('movies');
      moviesContainer.innerHTML = '';
      data.results.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const movieInfoDiv = document.createElement('div');
        movieInfoDiv.classList.add('movie-info');
        movieInfoDiv.innerHTML = `
          <img id="movie-${movie.id}" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title} poster" onclick="getMovieInfo('${movie.title}')">
          <div>
            <h3>${movie.title}</h3>
            <button class="like-button"><i class="far fa-heart"></i></button>
            <span class="like-counter">0</span>
            <p>${movie.release_date}</p>
            <p>${movie.overview}</p>
          </div>
        `;
        movieDiv.appendChild(movieInfoDiv);
        moviesContainer.appendChild(movieDiv);

        const likeButton = movieDiv.querySelector('.like-button');
        const likeCounter = movieDiv.querySelector('.like-counter');
        let likes = 0;
        likeButton.addEventListener('click', () => {
          likes++;
          likeCounter.innerText = likes;
          likeButton.innerHTML = '<i class="fas fa-heart"></i>';
        });
      });
    })
    .catch (error => console.error(error));
}

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchTerm = searchInput.value;
  getMovieInfo(searchTerm);
});

document.addEventListener('DOMContentLoaded', () => {
  getPopularMovies();
});
