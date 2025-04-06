const supabaseUrl = 'https://ordokuezdipglyivqwus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZG9rdWV6ZGlwZ2x5aXZxd3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzAzMzcsImV4cCI6MjA1OTQ0NjMzN30.cEQ5G4b83Hd-lnfBKm6wLPZwa2mwpVY78tqFBuWdvjY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const movieContainer = document.getElementById('movie-container');
const searchInput = document.getElementById('search-input');
const pagination = document.getElementById('pagination');
const categoryButtons = document.querySelectorAll('.category-btn');

let currentPage = 1;
let moviesPerPage = 10;
let currentCategory = 'All';
let allMovies = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  disableActions();
});

searchInput.addEventListener('input', () => {
  currentPage = 1;
  displayMovies();
});

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = btn.dataset.category;
    currentPage = 1;
    displayMovies();
  });
});

async function fetchMovies() {
  const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
  if (!error) {
    allMovies = data;
    displayMovies();
  } else {
    console.error('Error fetching movies:', error);
  }
}

function displayMovies() {
  let filtered = allMovies;

  const searchText = searchInput.value.toLowerCase();
  if (searchText) {
    filtered = filtered.filter(movie =>
      movie.title.toLowerCase().includes(searchText)
    );
  }

  if (currentCategory !== 'All') {
    filtered = filtered.filter(movie => movie.category === currentCategory);
  }

  const totalPages = Math.ceil(filtered.length / moviesPerPage);
  const start = (currentPage - 1) * moviesPerPage;
  const pageMovies = filtered.slice(start, start + moviesPerPage);

  movieContainer.innerHTML = '';
  pageMovies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
      <div class="movie-title">${movie.title}</div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `movie.html?slug=${movie.slug}`;
    });
    movieContainer.appendChild(card);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.classList.add('page-btn');
    btn.textContent = i;
    if (i === currentPage) btn.style.background = '#e50914';
    btn.addEventListener('click', () => {
      currentPage = i;
      displayMovies();
    });
    pagination.appendChild(btn);
  }
}

// Asset protection
function disableActions() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
}
