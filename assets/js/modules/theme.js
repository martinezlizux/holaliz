/**
 * Theme Toggle Logic
 */
export function initThemeToggle() {
    const toggleButton = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    // Force light theme initially per user request
    htmlElement.setAttribute('data-theme', 'light');
    htmlElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');

    if (!toggleButton || !themeIcon) return;

    // Function to set theme for the toggle (if we re-enable it later)
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            themeIcon.classList.remove('bi-moon-stars-fill');
            themeIcon.classList.add('bi-sun-fill');
            themeIcon.style.color = 'var(--color-white)';
            toggleButton.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-stars-fill');
            themeIcon.style.color = '';
            toggleButton.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    setTheme('light');

    toggleButton.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}
