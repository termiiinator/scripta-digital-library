document.addEventListener('DOMContentLoaded', () => {
    const grid      = document.getElementById('favoritesGrid');
    const emptyMsg  = document.getElementById('favoritesEmpty');

    function render() {
        const favs = Favorites.getAll();

        if (!favs.length) {
            grid.style.display = 'none';
            emptyMsg.style.display = 'block';
            return;
        }

        grid.style.display = '';
        emptyMsg.style.display = 'none';

        grid.innerHTML = favs.map(book =>
            createBookCardWithFav(book, '', '')
        ).join('');

        // При удалении из избранного — карточка исчезает
        document.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = Number(btn.dataset.favId);
                Favorites.remove(id);

                // Плавное удаление карточки
                const card = btn.closest('.book-card');
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => render(), 300);
            });
        });
    }

    render();
});