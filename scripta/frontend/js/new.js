document.addEventListener('DOMContentLoaded', () => {
    const newBooks = [
        { id: 1,  title: 'Код да Винчи',        author: 'Дэн Браун',              genre: 'Детектив',   rating: 4.5, cover: './img/covers/code-davinci.jpg' },
        { id: 2,  title: 'Мастер и Маргарита',   author: 'М. Булгаков',             genre: 'Классика',   rating: 5,   cover: './img/covers/master.jpg' },
        { id: 3,  title: 'Гарри Поттер',         author: 'Дж. К. Роулинг',          genre: 'Фэнтези',    rating: 4.8, cover: './img/covers/harry.jpg' },
        { id: 4,  title: '1984',                 author: 'Джордж Оруэлл',           genre: 'Антиутопия',  rating: 4.7, cover: './img/covers/1984.jpg' },
        { id: 5,  title: 'Три товарища',         author: 'Э. М. Ремарк',            genre: 'Классика',   rating: 4.6, cover: './img/covers/three.jpg' },
        { id: 6,  title: 'Дюна',                 author: 'Фрэнк Герберт',           genre: 'Фантастика', rating: 4.4, cover: './img/covers/dune.jpg' },
        { id: 7,  title: 'Шерлок Холмс',         author: 'А. Конан Дойл',           genre: 'Детектив',   rating: 4.9, cover: './img/covers/sherlock.jpg' },
        { id: 8,  title: 'Маленький принц',      author: 'Антуан де Сент-Экзюпери', genre: 'Классика',   rating: 4.8, cover: './img/covers/prince.jpg' },
    ];

    const grid        = document.getElementById('newBooksGrid');
    const genreFilter = document.getElementById('genreFilter');
    const noResults   = document.getElementById('noResults');
    const resetBtn    = document.getElementById('resetFilters');
    const searchInput = document.getElementById('searchInput');

    const genres = [...new Set(newBooks.map(b => b.genre))];
    genres.forEach(genre => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label class="filter-checkbox">
                <input type="checkbox" value="${genre}" data-filter="genre"> ${genre}
            </label>`;
        genreFilter.appendChild(li);
    });

    function render() {
        const checkedGenres  = [...document.querySelectorAll('[data-filter="genre"]:checked')].map(cb => cb.value);
        const checkedRatings = [...document.querySelectorAll('[data-filter="rating"]:checked')].map(cb => Number(cb.value));
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        let filtered = newBooks;

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

        grid.innerHTML = filtered.map(book =>
            createBookCardWithFav(book, 'badge-new', 'Новинка')
        ).join('');

        noResults.style.display = filtered.length ? 'none' : 'block';

        attachFavListeners(newBooks);
    }

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
});