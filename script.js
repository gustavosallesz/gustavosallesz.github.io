const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

function updateThemeIcon() {
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
  themeToggle.setAttribute('title', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
}

themeToggle.addEventListener('click', () => {
  const switchTheme = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeIcon();
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof document.startViewTransition !== 'function') {
    switchTheme();
    return;
  }

  const isDark = document.body.classList.contains('dark-mode');
  const rect = themeToggle.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  if (isDark) {
    document.documentElement.classList.add('theme-closing');
  }

  const transition = document.startViewTransition(switchTheme);
  transition.ready.then(() => {
    const animation = document.documentElement.animate(
      {
        clipPath: isDark
          ? [`circle(${radius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`]
          : [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
      },
      {
        duration: 1800,
        easing: 'cubic-bezier(.22,1,.36,1)',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    );
    return animation.finished;
  }).catch(() => {}).finally(() => {
    document.documentElement.classList.remove('theme-closing');
  });
});

updateThemeIcon();
