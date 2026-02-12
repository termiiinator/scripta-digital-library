// ── Favorites manager (localStorage) ──
const Favorites = {
    key: 'scripta_favorites',

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || [];
        } catch {
            return [];
        }
    },

    has(bookId) {
        return this.getAll().some(b => b.id === bookId);
    },

    add(book) {
        const favs = this.getAll();
        if (!favs.some(b => b.id === book.id)) {
            favs.push(book);
            localStorage.setItem(this.key, JSON.stringify(favs));
        }
    },

    remove(bookId) {
        const favs = this.getAll().filter(b => b.id !== bookId);
        localStorage.setItem(this.key, JSON.stringify(favs));
    },

    toggle(book) {
        if (this.has(book.id)) {
            this.remove(book.id);
            return false;
        } else {
            this.add(book);
            return true;
        }
    }
};

// ── Heart button HTML ──
function favBtnHTML(bookId) {
    const active = Favorites.has(bookId) ? ' active' : '';
    return `
        <button class="fav-btn${active}" data-fav-id="${bookId}" title="Избранное">
            <svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <svg class="heart-filled" viewBox="0 0 24 24" fill="#ef4444" stroke="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        </button>`;
}

// ── Stars HTML ──
function renderStars(rating) {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return '★'.repeat(full) + '<span class="star empty">' + '★'.repeat(empty) + '</span>';
}

// ── Book card with heart ──
function createBookCardWithFav(book, badgeClass, badgeText) {
    return `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'">
                ${badgeText ? `<span class="book-badge ${badgeClass}">${badgeText}</span>` : ''}
                ${favBtnHTML(book.id)}
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-rating">
                    <span class="stars">${renderStars(book.rating)}</span>
                    <span class="rating-value">${book.rating}</span>
                </div>
            </div>
        </div>`;
}

// ── Attach click handlers to all heart buttons ──
function attachFavListeners(booksData) {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = Number(btn.dataset.favId);
            const book = booksData.find(b => b.id === id);
            if (!book) return;

            const isNowFav = Favorites.toggle(book);
            btn.classList.toggle('active', isNowFav);
        });
    });
}