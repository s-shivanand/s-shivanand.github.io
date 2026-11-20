const projectDeck = document.querySelector('.project-list');

function showProject(card) {
  const dialog = card.querySelector('.project-dialog');
  if (!dialog.open) dialog.showModal();
}

projectDeck.addEventListener('click', (event) => {
  const preview = event.target.closest('.project-preview');
  if (preview) showProject(preview.closest('.project'));

  const dialog = event.target.closest('.project-dialog');
  if (event.target === dialog) dialog.close();
});

function openLinkedProject() {
  const card = document.getElementById(location.hash.slice(1));
  if (card?.matches('.project') && !card.hidden) showProject(card);
}

window.addEventListener('hashchange', openLinkedProject);
openLinkedProject();
