// Автоматическое переключение языка для книги
function getDefaultDisplay(tag) {
    const blockTags = ['DIV', 'SECTION', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'TABLE', 'TR', 'TD', 'TH', 'ARTICLE', 'ASIDE', 'FOOTER', 'HEADER', 'NAV', 'MAIN', 'FIGURE', 'FORM'];
    if (blockTags.includes(tag)) return 'block';
    if (tag === 'BUTTON') return 'inline-block';
    return 'inline';
}

function updateBookLang() {
    let lang = localStorage.getItem('lang');
    if (!lang) lang = document.documentElement.lang || 'az';
    ['ru', 'az'].forEach(l => {
        document.querySelectorAll('[data-lang-' + l + ']').forEach(el => {
            el.style.display = (l === lang) ? getDefaultDisplay(el.tagName) : 'none';
        });
    });
}
document.addEventListener('DOMContentLoaded', updateBookLang);
document.addEventListener('langChanged', updateBookLang);

window.setLang = function(newLang) {
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
    document.dispatchEvent(new Event('langChanged'));
};

// ===== Star Rating Component =====
function renderStarRating(rating, container) {
    const maxStars = 5;
    container.innerHTML = '';
    for (let i = 1; i <= maxStars; i++) {
        let starType = 'empty';
        if (rating >= i) {
            starType = 'full';
        } else if (rating >= i - 0.5) {
            starType = 'half';
        }
        const star = document.createElement('span');
        star.className = 'star ' + starType;
        if (starType === 'half') {
            star.innerHTML = `
            <svg viewBox="0 0 24 24">
                <defs>
                    <clipPath id="half-star">
                        <rect x="0" y="0" width="12" height="24" />
                    </clipPath>
                </defs>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" class="" />
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" class="half" clip-path="url(#half-star)" />
            </svg>`;
        } else {
            star.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>`;
        }
        container.appendChild(star);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // Рендер звёзд рейтинга
    var starContainer = document.getElementById('star-rating');
    if (starContainer) {
        var rating = parseFloat(starContainer.getAttribute('data-rating'));
        if (!isNaN(rating)) renderStarRating(rating, starContainer);
    }

    // ===== PDF Reader =====
    var readBtn  = document.getElementById('readOnlineBtn');
    var modal    = document.getElementById('readerModal');
    var viewer   = document.getElementById('pdfViewer');
    var closeBtn = document.getElementById('closeReader');

    function openReader() {
        var pdfUrl = readBtn.getAttribute('data-pdf-url');
        if (!pdfUrl) {
            console.error('data-pdf-url не задан на кнопке!');
            return;
        }
        viewer.src = pdfUrl;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeReader() {
        modal.classList.remove('active');
        viewer.src = '';  // сбрасываем — останавливаем загрузку PDF
        document.body.style.overflow = '';
    }

    if (readBtn && modal && viewer) {
        // Кнопка "Читать онлайн"
        readBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openReader();
        });

        // Закрытие кнопкой ×
        if (closeBtn) closeBtn.addEventListener('click', closeReader);

        // Закрытие кликом по тёмному фону
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeReader();
        });

        // Закрытие клавишей Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeReader();
        });
    } else {
        console.warn('Не найдены элементы ридера: readBtn/modal/viewer');
    }

    // ===== Кнопка "Скачать" =====
    var downloadBtn = document.getElementById('downloadLink');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function (e) {
            var pdfUrl = downloadBtn.getAttribute('href');
            if (!pdfUrl || pdfUrl === '#') { e.preventDefault(); return; }
            e.preventDefault();
            var link = document.createElement('a');
            link.href = pdfUrl;
            link.download = pdfUrl.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});
