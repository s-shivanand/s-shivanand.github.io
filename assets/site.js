const menuButton = document.querySelector('.mobile-toggle');
const sidebar = document.querySelector('.sidebar');

function closeMenu() {
  sidebar.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  const open = sidebar.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sidebar.classList.contains('menu-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

const filterButtons = [...document.querySelectorAll('.filter-button')];
const projects = [...document.querySelectorAll('.project')];
const projectCount = document.querySelector('.filter-count');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    projects.forEach((project) => {
      const visible = filter === 'all' || project.dataset.category.split(' ').includes(filter);
      project.hidden = !visible;
      if (visible) count++;
    });
    projectCount.textContent = `${count} projects`;
  });
});

// Reveal the requested case study even if a visitor previously applied a filter.
function revealLinkedProject() {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.classList.contains('project') && target.hidden) {
    filterButtons.find((button) => button.dataset.filter === 'all')?.click();
    target.scrollIntoView();
  }
}
window.addEventListener('hashchange', revealLinkedProject);
revealLinkedProject();

document.querySelector('.copy-button')?.addEventListener('click', async (event) => {
  const status = document.querySelector('.copy-status');
  const button = event.currentTarget;
  const email = document.querySelector('.contact-email')?.textContent.trim() || 'sharana.shivanand@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    if (status) status.textContent = 'Email address copied.';
    button.dataset.copied = 'true';
    button.setAttribute('aria-label', 'Email address copied');
    clearTimeout(button.copyResetTimer);
    button.copyResetTimer = setTimeout(() => {
      delete button.dataset.copied;
      button.setAttribute('aria-label', 'Copy email address');
      if (status) status.textContent = '';
    }, 2500);
  } catch {
    if (status) status.textContent = 'You can select and copy the email address above.';
  }
});

// With JavaScript disabled the mobile navigation and every project remain visible.
document.documentElement.classList.add('js');
