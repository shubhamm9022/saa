fetch('movies.json')
  .then(res => res.json())
  .then(data => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const movie = data.find(m => m.slug === slug);

    if (movie) {
      document.getElementById('movieDetails').innerHTML = `
        <h2>${movie.title} (${movie.year})</h2>
        <img src="${movie.poster}" alt="${movie.title}" />
        <p>Category: ${movie.category}</p>
        <a href="${movie.stream}" target="_blank" class="btn">Stream</a>
        <a href="${movie.download}" target="_blank" class="btn">Download</a>
      `;
    } else {
      document.getElementById('movieDetails').innerHTML = '<p>Movie not found.</p>';
    }
  });
