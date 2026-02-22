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
const ctaBtn = document.getElementById('ctaBtn');

if (catalogBtn) {
    catalogBtn.addEventListener('click', () => {
        catalogSidebar.classList.add('active');
    if (window.fillGenresSidebar) window.fillGenresSidebar();
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
