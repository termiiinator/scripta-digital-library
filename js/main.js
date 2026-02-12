function updateBookMoreButtons() {
    var lang = localStorage.getItem('lang') || 'az';
    var moreText = lang === 'ru' ? 'Подробнее' : 'Ətraflı';
    document.querySelectorAll('.book-more-btn').forEach(function(btn) {
        btn.textContent = moreText;
    });
}
document.addEventListener('DOMContentLoaded', updateBookMoreButtons);
document.addEventListener('langChanged', updateBookMoreButtons);
const catalogBtn = document.getElementById('catalogBtn');
const catalogSidebar = document.getElementById('catalogSidebar');
const closeCatalog = document.getElementById('closeCatalog');
const ctaBtn = document.getElementById('ctaBtn');

if (catalogBtn) {
    catalogBtn.addEventListener('click', () => {
        catalogSidebar.classList.add('active');
    });
}

if (closeCatalog) {
    closeCatalog.addEventListener('click', () => {
        catalogSidebar.classList.remove('active');
    });
}

if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        window.location.href = 'catalog.html';
    });
}

catalogSidebar?.addEventListener('click', (e) => {
    if (e.target === catalogSidebar) {
        catalogSidebar.classList.remove('active');
    }
});
function createBookCard(book) {
    const stars = Array(5).fill(0).map((_, i) =>
        `<span class="star ${i < Math.floor(book.rating) ? '' : 'empty'}">★</span>`
    ).join('');

    return `
        <a href="book.html?id=${book.id}" class="book-card">
            <div class="book-cover">
                ${book.coverUrl ? `<img src="${book.coverUrl}" alt="${book.title}">` : ''}
                ${book.badge ? `<div class="book-badge">${book.badge}</div>` : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.authorName}</p>
                <div class="book-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-value">${book.rating.toFixed(1)}</span>
                </div>
            </div>
        </a>
    `;
}
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Trying to load books...");

    try {
        const books = await fetchAPI(API_ENDPOINTS.books.getAll());
        console.log("Books from backend:", books);

        const container = document.getElementById("recommendedBooks");

        if (container && books.length > 0) {
            container.innerHTML = books
                .slice(0, 6)
                .map(book => createBookCard(book))
                .join("");
        }

    } catch (error) {
        console.error("API error:", error);
    }
});