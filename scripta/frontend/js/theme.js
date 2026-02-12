// Theme management
let currentTheme = localStorage.getItem('theme') || 'light';

// Применить тему СРАЗУ (до DOMContentLoaded)
document.documentElement.setAttribute('data-theme', currentTheme);

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    setTheme(currentTheme);
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
});
