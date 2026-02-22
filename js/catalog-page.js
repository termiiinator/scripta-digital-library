// Catalog page — фильтрация и отображение книг

(function () {
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get('category');
    const urlSearch = params.get('search');

    const titleEl = document.getElementById('catalogTitle');
    const subtitleEl = document.getElementById('catalogSubtitle');
    const booksGrid = document.getElementById('catalogBooks');
    const noResults = document.getElementById('noResults');
    const resetBtn = document.getElementById('resetFilters');
    const genreFiltersEl = document.getElementById('genreFilters');

    if (!booksGrid) return;

    const lang = localStorage.getItem('lang') || 'az';

    const categoryTitles = {
        recommended: { ru: 'Рекомендуем', az: 'Tövsiyə olunanlar' },
        new:         { ru: 'Новинки',     az: 'Yeniliklər' },
        best:        { ru: 'Лучшие',      az: 'Ən yaxşılar' },
        all:         { ru: 'Каталог',     az: 'Kataloq' }
    };

    const categorySubtitles = {
        recommended: { ru: 'Книги, которые мы рекомендуем к прочтению', az: 'Oxumağı tövsiyə etdiyimiz kitablar' },
        new:         { ru: 'Самые свежие поступления',                  az: 'Ən son əlavə olunan kitablar' },
        best:        { ru: 'Самые популярные книги',                    az: 'Ən populyar kitablar' },
        all:         { ru: 'Все доступные книги',                       az: 'Bütün mövcud kitablar' }
    };

    // ── Отметить чекбокс по категории ──
    function checkCategory() {
        if (!urlCategory) return;
        document.querySelectorAll('input[name="category"]').forEach(cb => {
            cb.checked = (cb.value === urlCategory);
        });
    }

    // Ставим сразу
    checkCategory();
    // Повторно после lang.js / main.js DOMContentLoaded
    setTimeout(checkCategory, 50);
    setTimeout(checkCategory, 200);

    // ── Загрузка жанров в фильтры ──
    async function loadGenreFilters() {
        if (!genreFiltersEl) return;
        try {
            const genres = await fetchAPI(API_ENDPOINTS.genres.getAll());
            if (genres && genres.length) {
                genreFiltersEl.innerHTML = genres.map(genre => `
                    <li>
                        <label class="filter-checkbox">
                            <input type="checkbox" name="genre" value="${genre.id}">
                            <span>${genre.name}</span>
                        </label>
                    </li>
                `).join('');

                genreFiltersEl.querySelectorAll('input[name="genre"]').forEach(cb => {
                    cb.addEventListener('change', filterBooks);
                });
            }
        } catch (err) {
            console.warn('Жанры не загружены:', err.message);
        }
    }

    function updateTitle() {
        const checked = getSelectedCategories();
        const key = checked.length === 1 ? checked[0] : 'all';

        if (urlSearch) {
            if (titleEl) titleEl.textContent = (lang === 'ru' ? 'Поиск: ' : 'Axtarış: ') + urlSearch;
            if (subtitleEl) subtitleEl.textContent = '';
            return;
        }

        const t = categoryTitles[key] || categoryTitles.all;
        const s = categorySubtitles[key] || categorySubtitles.all;
        if (titleEl) titleEl.textContent = t[lang] || t.ru;
        if (subtitleEl) subtitleEl.textContent = s[lang] || s.ru;
    }

    function getSelectedCategories() {
        const checkboxes = document.querySelectorAll('input[name="category"]');
        const selected = [];
        checkboxes.forEach(cb => {
            if (cb.checked) selected.push(cb.value);
        });
        // Если ничего не выбрано, но есть urlCategory — использовать его
        if (selected.length === 0 && urlCategory) {
            return [urlCategory];
        }
        return selected;
    }

    function getSelectedGenres() {
        if (!genreFiltersEl) return [];
        const selected = [];
        genreFiltersEl.querySelectorAll('input[name="genre"]:checked').forEach(cb => {
            selected.push(cb.value);
        });
        return selected;
    }

    async function filterBooks() {

        booksGrid.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);padding:2rem;">Загрузка...</p>';
        if (noResults) noResults.style.display = 'none';

        // Мок-данные для fallback
        const mockBooks = [
            { id: 1, title: 'Код да Винчи', cover: 'img/covers/code-davinci.jpg' },
            { id: 2, title: 'Мастер и Маргарита', cover: 'img/covers/master.jpg' },
            { id: 3, title: 'Гарри Поттер', cover: 'img/covers/harry.jpg' },
            { id: 4, title: 'Маленький принц', cover: 'img/covers/prince.jpg' },
            { id: 5, title: 'Портрет Дориана Грея', cover: 'img/covers/dorian.jpg' },
            { id: 6, title: 'Дюна', cover: 'img/covers/dune.jpg' },
            { id: 7, title: 'Преступление и наказание', cover: 'img/covers/crime.jpg' },
            { id: 8, title: 'Атлант расправил плечи', cover: 'img/covers/atlas.jpg' },
            { id: 9, title: 'Хоббит', cover: 'img/covers/hobbit.jpg' },
            { id: 10, title: 'Сияние', cover: 'img/covers/shining.jpg' },
            { id: 11, title: '1984', cover: 'img/covers/1984.jpg' },
            { id: 12, title: 'Три товарища', cover: 'img/covers/three.jpg' },
            { id: 13, title: 'Шерлок Холмс', cover: 'img/covers/sherlock.jpg' },
            { id: 14, title: 'Война и мир', cover: 'img/covers/war-peace.jpg' },
            { id: 15, title: 'Анна Каренина', cover: 'img/covers/anna.jpg' }
        ];

        function createMockBookCard(book) {
            const lang = localStorage.getItem('lang') || 'az';
            const moreText = lang === 'ru' ? 'Подробнее' : 'Ətraflı';
            return `<a class="book-card" href="book.html?id=${book.id}">
                <div class="book-cover"><img src="${book.cover}" alt="${book.title}"></div>
                <div class="book-info"><div class="book-title">${book.title}</div><button class="book-more-btn">${moreText}</button></div>
            </a>`;
        }

        try {
            let allBooks = [];

            if (urlSearch) {
                allBooks = await fetchAPI(API_ENDPOINTS.books.search(urlSearch));
            } else {
                const selected = getSelectedCategories();
                const categories = selected.length > 0 ? selected : ['recommended', 'new', 'best'];

                const results = await Promise.all(
                    categories.map(cat =>
                        fetchAPI(API_ENDPOINTS.books.getByCategory(cat)).catch(() => [])
                    )
                );

                const seen = new Set();
                results.flat().forEach(book => {
                    if (book && book.id && !seen.has(book.id)) {
                        seen.add(book.id);
                        allBooks.push(book);
                    }
                });
            }

            const selectedGenres = getSelectedGenres();
            if (selectedGenres.length > 0) {
                allBooks = allBooks.filter(book =>
                    book.genreId && selectedGenres.includes(String(book.genreId))
                );
            }

            booksGrid.innerHTML = '';
            // Если API не вернул книг — fallback на mock
            if (!allBooks || allBooks.length === 0) {
                booksGrid.innerHTML = mockBooks.map(createMockBookCard).join('');
            } else {
                booksGrid.innerHTML = allBooks.map(book => {
                    const lang = localStorage.getItem('lang') || 'az';
                    const moreText = lang === 'ru' ? 'Подробнее' : 'Ətraflı';
                    return `<a class="book-card" href="book.html?id=${book.id}">
                        <div class="book-cover"><img src="${book.coverUrl || 'img/cover-placeholder.png'}" alt="${book.title}"></div>
                        <div class="book-info">
                            <div class="book-title">${book.title}</div>
                            <button class="book-more-btn">${moreText}</button>
                        </div>
                    </a>`;
                }).join('');
            }
        } catch (err) {
            // Fallback на mock при ошибке
            booksGrid.innerHTML = mockBooks.map(createMockBookCard).join('');
        }

        updateTitle();

        if (!urlSearch) {
            const url = new URL(window.location);
            const selected = getSelectedCategories();
            if (selected.length === 1) {
                url.searchParams.set('category', selected[0]);
            } else {
                url.searchParams.delete('category');
            }
            history.replaceState(null, '', url);
        }
    }

    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', filterBooks);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
            if (genreFiltersEl) {
                genreFiltersEl.querySelectorAll('input[name="genre"]').forEach(cb => cb.checked = false);
            }
            filterBooks();
        });
    }

    loadGenreFilters();
    // filterBooks(); // Не показываем книги сразу при загрузке страницы

    // Делегированный обработчик клика по карточке книги
    if (booksGrid) {
        booksGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.book-card');
            if (card && booksGrid.contains(card)) {
                // Получаем id книги из href или data-атрибута
                let bookId = null;
                const href = card.getAttribute('href');
                if (href && href.includes('id=')) {
                    const m = href.match(/id=(\d+)/);
                    if (m) bookId = m[1];
                }
                // Если id не найден — пробуем из data-book-id
                if (!bookId && card.dataset.bookId) {
                    bookId = card.dataset.bookId;
                }
                if (bookId) {
                    window.location.href = `book.html?id=${bookId}`;
                    e.preventDefault();
                } else if (href && href.endsWith('book.html')) {
                    // Если нет id, просто book.html
                    window.location.href = 'book.html';
                    e.preventDefault();
                }
            }
        });
    }
})();