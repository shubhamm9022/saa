const SUPABASE_URL = 'https://ordokuezdipglyivqwus.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZG9rdWV6ZGlwZ2x5aXZxd3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzAzMzcsImV4cCI6MjA1OTQ0NjMzN30.cEQ5G4b83Hd-lnfBKm6wLPZwa2mwpVY78tqFBuWdvjY';
const pageSize = 10;

let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
let currentCategory = 'All';
let searchTerm = '';

document.addEventListener('DOMContentLoaded', async () => {
  await fetchMovies();
  setupEventListeners();
  renderMovies();
});

async function fetchMovies() {
  const { data } = await fetch(`${SUPABASE_URL}/rest/v1/movies?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  }).then(res => res.json());

  allMovies = data.reverse();
  filteredMovies = [...allMovies];
}

function setupEventListeners() {
  document.getElementById('searchInput').addEventListener('input', e => {
    searchTerm = e.target.value.toLowerCase();
    applyFilters();
  });

  document.querySelectorAll('.category').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      applyFilters();
    });
  });

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderMovies();
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < Math.ceil(filteredMovies.length / pageSize)) {
      currentPage++;
      renderMovies();
    }
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
  });
}

function applyFilters() {
  filteredMovies = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm) &&
    (currentCategory === 'All' || movie.category === currentCategory)
  );
  currentPage = 1;
  renderMovies();
}

function renderMovies() {
  const movieList = document.getElementById('movieList');
  movieList.innerHTML = '';

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const moviesToShow = filteredMovies.slice(start, end);

  moviesToShow.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie';
    movieCard.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>${movie.year}</p>
      <a href="movie.html?slug=${movie.slug}">View</a>
    `;
    movieList.appendChild(movieCard);
  });

  document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${Math.ceil(filteredMovies.length / pageSize)}`;
}
