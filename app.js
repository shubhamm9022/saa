let movies = [];
let currentPage = 1;
const moviesPerPage = 10;

fetch('movies.json')
  .then(res => res.json())
  .then(data => {
    movies = data;
    renderMovies();
  });

function renderMovies() {
  const grid = document.getElementById('movieGrid');
  const start = (currentPage - 1) * moviesPerPage;
  const end = start + moviesPerPage;
  const paginated = movies.slice(start, end);

  grid.innerHTML = paginated.map(movie => `
    <div class="movie-card">
      <a href="movie.html?slug=${movie.slug}">
        <img src="${movie.poster}" alt="${movie.title}" />
        <h4>${movie.title} (${movie.year})</h4>
      </a>
    </div>
  `).join('');

  document.getElementById('pageNum').textContent = currentPage;
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  fetch('movies.json')
    .then(res => res.json())
    .then(data => {
      movies = data.filter(movie => movie.title.toLowerCase().includes(value));
      currentPage = 1;
      renderMovies();
    });
});

document.querySelectorAll('.categories button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    fetch('movies.json')
      .then(res => res.json())
      .then(data => {
        movies = category === 'All' ? data : data.filter(m => m.category === category);
        currentPage = 1;
        renderMovies();
      });
  });
});

document.getElementById('nextPage').addEventListener('click', () => {
  const maxPages = Math.ceil(movies.length / moviesPerPage);
  if (currentPage < maxPages) {
    currentPage++;
    renderMovies();
  }
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderMovies();
  }
});
