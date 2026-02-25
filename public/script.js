// Dark Mode Toggle
const toggleButton = document.querySelector('#toggleButton');
const body = document.body;

toggleButton.addEventListener('click', () => {
  toggleButton.classList.toggle('active');
  toggleButton.innerHTML = toggleButton.classList.contains('active')
    ? '<i class="fa-regular fa-sun text-sun"></i>'
    : '<i class="fa-solid fa-moon text-dark"></i>';
  body.classList.toggle('dark-mode');
});

// Set current year in footer
const yearSpan = document.getElementById('year');
const currentYear = new Date().getFullYear();
yearSpan.textContent = currentYear;

// Note-taking functionality
const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const newNoteBtn = document.getElementById('newNoteBtn');
const notesList = document.getElementById('notesList');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');

// Discard Button, nothing will save when clicked
const discardInput = () => {
  titleInput.value = '';
  contentInput.value = '';
};

// Will Save the note title and content when clicked
const saveInput = () => {
  notesList.textContent = titleInput.value.trim();
  noteTitle.textContent = titleInput.value.trim();
  noteContent.textContent = contentInput.value.trim();
  titleInput.value = '';
  contentInput.value = '';
};
