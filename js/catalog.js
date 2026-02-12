// Catalog page functionality

let currentFilters = {
    genre: '',
    author: '',
    language: '',
    yearFrom: '',
    yearTo: '',
    search: '',
    category: ''
};

let currentSort = 'popularity';
let allBooks = [];

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category') || '',
        genre: params.get('genre') || '',
        search: params.get('search') || ''
    };
}

// Load genres for filter
async function loadGenres() {
    try {
        const genres = await fetchAPI(API_ENDPOINTS.genres.getAll());
        const genreFilter = document.getElementById('genreFilter');
        
        if (genreFilter && genres) {
            const urlParams = getUrlParams();
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                if (genre.id == urlParams.genre) {
                    option.selected = true;
                    currentFilters.genre = genre.id;
                }
                genreFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

// Create book card
function createBookCard(book) {
    const badgeClass = book.badge === 'Новый' ? 'badge-new' : 
                       book.badge === 'Рекомендуем' ? 'badge-recommended' : 
                       'badge-best';
    
    const stars = Array(5).fill(0).map((_, i) => 
        `<span class="star ${i < Math.floor(book.rating) ? '' : 'empty'}">★</span>`
    ).join('');

    return `
        <a href="book.html?id=${book.id}" class="book-card">
            <div class="book-cover">
                ${book.coverUrl ? `<img src="${book.coverUrl}" alt="${book.title}">` : ''}
                ${book.badge ? `<div class="book-badge ${badgeClass}">${book.badge}</div>` : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-value">${book.rating.toFixed(1)}</span>
                </div>
            </div>
        </a>
    `;
}

// Filter and sort books
function filterAndSortBooks() {
    let filtered = [...allBooks];

    // Apply filters
    if (currentFilters.genre) {
        filtered = filtered.filter(book => book.genreId == currentFilters.genre);
    }

    if (currentFilters.author) {
        filtered = filtered.filter(book => 
            book.author.toLowerCase().includes(currentFilters.author.toLowerCase())
        );
    }

    if (currentFilters.language) {
        filtered = filtered.filter(book => book.language === currentFilters.language);
    }

    if (currentFilters.yearFrom) {
        filtered = filtered.filter(book => book.year >= parseInt(currentFilters.yearFrom));
    }

    if (currentFilters.yearTo) {
        filtered = filtered.filter(book => book.year <= parseInt(currentFilters.yearTo));
    }

    if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower) ||
            book.description.toLowerCase().includes(searchLower)
        );
    }

    if (currentFilters.category) {
        filtered = filtered.filter(book => {
            if (currentFilters.category === 'recommended') return book.badge === 'Рекомендуем';
            if (currentFilters.category === 'new') return book.badge === 'Новый';
            if (currentFilters.category === 'best') return book.badge === 'Лучший';
            return true;
        });
    }

    // Apply sorting
    switch (currentSort) {
        case 'popularity':
            filtered.sort((a, b) => b.viewCount - a.viewCount);
            break;
        case 'date':
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
    }

    return filtered;
}

// Display books
function displayBooks() {
    const catalogBooks = document.getElementById('catalogBooks');
    const resultsCount = document.getElementById('resultsCount');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('noResults');

    const filtered = filterAndSortBooks();

    if (resultsCount) {
        resultsCount.textContent = filtered.length;
    }

    if (catalogBooks) {
        if (filtered.length === 0) {
            catalogBooks.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
        } else {
            if (noResults) noResults.style.display = 'none';
            catalogBooks.innerHTML = filtered.map(book => createBookCard(book)).join('');
        }
    }

    if (loading) loading.style.display = 'none';
}

// Load all books
async function loadBooks() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';

    try {
        allBooks = await fetchAPI(API_ENDPOINTS.books.getAll());
        displayBooks();
    } catch (error) {
        console.error('Error loading books:', error);
        if (loading) loading.style.display = 'none';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Get URL parameters
    const urlParams = getUrlParams();
    currentFilters.category = urlParams.category;
    currentFilters.search = urlParams.search;

    // Set search input value if from URL
    const searchInput = document.getElementById('searchInput');
    if (searchInput && urlParams.search) {
        searchInput.value = urlParams.search;
    }

    await loadGenres();
    await loadBooks();

    // Apply filters button
    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
        applyFilters.addEventListener('click', () => {
            currentFilters.genre = document.getElementById('genreFilter').value;
            currentFilters.author = document.getElementById('authorFilter').value;
            currentFilters.language = document.getElementById('languageFilter').value;
            currentFilters.yearFrom = document.getElementById('yearFrom').value;
            currentFilters.yearTo = document.getElementById('yearTo').value;
            displayBooks();
        });
    }

    // Reset filters button
    const resetFilters = document.getElementById('resetFilters');
    if (resetFilters) {
        resetFilters.addEventListener('click', () => {
            document.getElementById('genreFilter').value = '';
            document.getElementById('authorFilter').value = '';
            document.getElementById('languageFilter').value = '';
            document.getElementById('yearFrom').value = '';
            document.getElementById('yearTo').value = '';
            
            currentFilters = {
                genre: '',
                author: '',
                language: '',
                yearFrom: '',
                yearTo: '',
                search: currentFilters.search,
                category: currentFilters.category
            };
            
            displayBooks();
        });
    }

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            displayBooks();
        });
    }

    // Search input
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = e.target.value.trim();
                displayBooks();
            }, 300);
        });
    }
});

// ── All books with categories ──
const allBooks = [
    // Recommended
    { id: 101, title: 'Код да Винчи',         author: 'Дэн Браун',              genre: 'Детектив',    rating: 4.5, cover: './img/covers/code-davinci.jpg', category: 'recommended' },
    { id: 102, title: 'Мастер и Маргарита',    author: 'М. Булгаков',             genre: 'Классика',    rating: 5,   cover: './img/covers/master.jpg',        category: 'recommended' },
    { id: 103, title: 'Гарри Поттер',          author: 'Дж. К. Роулинг',          genre: 'Фэнтези',    rating: 4.8, cover: './img/covers/harry.jpg',         category: 'recommended' },
    { id: 104, title: 'Маленький принц',       author: 'Антуан де Сент-Экзюпери', genre: 'Классика',    rating: 4.8, cover: './img/covers/prince.jpg',        category: 'recommended' },

    // Best
    { id: 201, title: '1984',                  author: 'Джордж Оруэлл',           genre: 'Антиутопия',  rating: 4.7, cover: './img/covers/1984.jpg',          category: 'best' },
    { id: 202, title: 'Три товарища',          author: 'Э. М. Ремарк',            genre: 'Классика',    rating: 4.6, cover: './img/covers/three.jpg',         category: 'best' },
    { id: 203, title: 'Шерлок Холмс',          author: 'А. Конан Дойл',           genre: 'Детектив',    rating: 4.9, cover: './img/covers/sherlock.jpg',      category: 'best' },
    { id: 204, title: 'Война и мир',           author: 'Л. Толстой',              genre: 'Классика',    rating: 4.5, cover: './img/covers/war-peace.jpg',     category: 'best' },

    // New
    { id: 301, title: 'Дюна',                  author: 'Фрэнк Герберт',           genre: 'Фантастика',  rating: 4.4, cover: './img/covers/dune.jpg',          category: 'new' },
    { id: 302, title: 'Преступление и наказание', author: 'Ф. Достоевский',        genre: 'Классика',    rating: 4.6, cover: './img/covers/crime.jpg',         category: 'new' },
    { id: 303, title: 'Атлант расправил плечи', author: 'Айн Рэнд',               genre: 'Философия',   rating: 4.3, cover: './img/covers/atlas.jpg',         category: 'new' },
    { id: 304, title: 'Хоббит',                author: 'Дж. Р. Р. Толкин',        genre: 'Фэнтези',    rating: 4.7, cover: './img/covers/hobbit.jpg',        category: 'new' },
];

// ── Read URL param ──
const urlParams   = new URLSearchParams(window.location.search);
const urlCategory = urlParams.get('category');

// Pre-check category from URL
if (urlCategory) {
    const cb = document.querySelector(`[data-filter="category"][value="${urlCategory}"]`);
    if (cb) cb.checked = true;
}

// ── Build genre checkboxes ──
const genres = [...new Set(allBooks.map(b => b.genre))].sort();
genres.forEach(genre => {
    const li = document.createElement('li');
    li.innerHTML = `
        <label class="filter-checkbox">
            <input type="checkbox" value="${genre}" data-filter="genre"> ${genre}
        </label>`;
    genreFilter.appendChild(li);
});

// ── Badge info ──
const badgeMap = {
    recommended: { cls: 'badge-recommended', label: 'Рекомендуем' },
    best:        { cls: 'badge-best',        label: 'Лучшие' },
    new:         { cls: 'badge-new',          label: 'Новинка' }
};

// ── Render ──
function render() {
    const checkedCats    = [...document.querySelectorAll('[data-filter="category"]:checked')].map(cb => cb.value);
    const checkedGenres  = [...document.querySelectorAll('[data-filter="genre"]:checked')].map(cb => cb.value);
    const checkedRatings = [...document.querySelectorAll('[data-filter="rating"]:checked')].map(cb => Number(cb.value));
    const query          = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let filtered = allBooks;

    if (checkedCats.length) {
        filtered = filtered.filter(b => checkedCats.includes(b.category));
    }
    if (checkedGenres.length) {
        filtered = filtered.filter(b => checkedGenres.includes(b.genre));
    }
    if (checkedRatings.length) {
        const minRating = Math.min(...checkedRatings);
        filtered = filtered.filter(b => b.rating >= minRating);
    }
    if (query) {
        filtered = filtered.filter(b =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query)
        );
    }

    grid.innerHTML = filtered.map(book => {
        const badge = badgeMap[book.category] || {};
        return createBookCardWithFav(book, badge.cls || '', badge.label || '');
    }).join('');

    noResults.style.display = filtered.length ? 'none' : 'block';

    // Heart listeners
    attachFavListeners(allBooks);
}

// ── Events ──
document.querySelectorAll('[data-filter]').forEach(cb => {
    cb.addEventListener('change', render);
});

if (searchInput) {
    searchInput.addEventListener('input', render);
}

resetBtn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(cb => cb.checked = false);
    if (searchInput) searchInput.value = '';
    render();
});

render();
