// Автоматическое переключение языка для книги
// Универсальное определение display по тегу
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
            if (l === lang) {
                el.style.display = getDefaultDisplay(el.tagName);
            } else {
                el.style.display = 'none';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', updateBookLang);
document.addEventListener('langChanged', updateBookLang);

// Для ручного теста: window.setLang('ru') или window.setLang('az')
window.setLang = function(newLang) {
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
    document.dispatchEvent(new Event('langChanged'));
};

document.addEventListener('DOMContentLoaded', function () {
    const pdfUrl = 'books/code-davinci.pdf';

    // Кнопка "Читать онлайн" / "Onlayn oxu"
    const readBtn = document.querySelector('.primary-btn');
    if (readBtn) {
        readBtn.addEventListener('click', function() {
            // Открываем модальное окно
            const modal = document.getElementById('readerModal');
            const viewer = document.getElementById('pdfViewer');
            if (modal && viewer) {
                viewer.src = pdfUrl;
                modal.style.display = 'block';
            }
        });
    }

    // Кнопка "Скачать"
    const downloadBtn = document.getElementById('downloadLink');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = pdfUrl.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Кнопка закрытия модального окна
    const closeReader = document.getElementById('closeReader');
    if (closeReader) {
        closeReader.addEventListener('click', function () {
            document.getElementById('readerModal').style.display = 'none';
            document.getElementById('pdfViewer').src = '';
        });
    }
});
