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

function typeHomepageGreeting() {
  const heading = document.querySelector('#hero-title');
  if (!heading || window.self !== window.top ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines = [...heading.querySelectorAll('.code-greeting, .title-second')];
  if (lines.length !== 2 || lines.some(line => line.childElementCount)) return;

  try {
    const greetingKey = 'portfolio:greeting-seen';
    if (sessionStorage.getItem(greetingKey)) return;
    sessionStorage.setItem(greetingKey, '1');
  } catch {
    // Keep the greeting static if the browser cannot remember this visit.
    return;
  }

  const originalText = lines.map(line => line.textContent);
  heading.setAttribute('aria-label', originalText.join(' '));
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter() : null;
  let delay = 120;

  for (const [index, line] of lines.entries()) {
    const content = originalText[index];
    const characters = segmenter
      ? Array.from(segmenter.segment(content), part => part.segment)
      : Array.from(content);
    const fragment = document.createDocumentFragment();
    for (const character of characters) {
      const span = document.createElement('span');
      span.className = 'greeting-character';
      span.style.setProperty('--typing-delay', `${delay}ms`);
      span.textContent = character;
      fragment.append(span);
      delay += 55;
    }
    line.setAttribute('aria-hidden', 'true');
    line.replaceChildren(fragment);
    delay += 250;
  }

  function showFullGreeting() {
    clearTimeout(finishTimer);
    window.removeEventListener('pagehide', showFullGreeting);
    document.removeEventListener('visibilitychange', finishIfHidden);
    heading.removeAttribute('aria-label');
    lines.forEach((line, index) => {
      line.textContent = originalText[index];
      line.removeAttribute('aria-hidden');
    });
  }

  function finishIfHidden() {
    if (document.hidden) showFullGreeting();
  }

  const finishTimer = setTimeout(showFullGreeting, delay - 250);
  window.addEventListener('pagehide', showFullGreeting);
  document.addEventListener('visibilitychange', finishIfHidden);
  finishIfHidden();
}

typeHomepageGreeting();

// With JavaScript disabled the mobile navigation and every project remain visible.
document.documentElement.classList.add('js');
