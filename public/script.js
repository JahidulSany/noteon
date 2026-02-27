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

///////---------------------------------------------------//////////
/////// --------------------------------------------------//////////

document.addEventListener('DOMContentLoaded', () => {
  // Note-taking functionality
  const titleInput = document.getElementById('titleInput');
  const contentInput = document.getElementById('contentInput');
  const newNoteBtn = document.getElementById('newNoteBtn');
  const notesList = document.getElementById('notesList');
  const noteTitle = document.getElementById('noteTitle');
  const noteContent = document.getElementById('noteContent');

  // Function to fetch data from the backend
  const fetchData = async (selected = false) => {
    try {
      const response = await fetch('/notes');
      const notes = await response.json();
      notesList.innerHTML = ''; // Clear the list before rendering

      // IF no note exists, Get Started will appear
      if (notes.length === 0) {
        const createNoteMsg = document.createElement('p');

        createNoteMsg.textContent = 'Get Started';
        createNoteMsg.style.backgroundColor = '#e9ecef';
        createNoteMsg.style.color = 'black';
        createNoteMsg.style.borderRadius = '5px';
        createNoteMsg.style.padding = '5px';

        notesList.appendChild(createNoteMsg);

        noteTitle.textContent = 'No Note';
        noteContent.textContent =
          'Click the New Note + button to create a note';
        return;
      }

      notes.forEach((note, index) => {
        const newListEl = document.createElement('p');

        newListEl.style.backgroundColor = '#e9ecef';
        newListEl.style.color = 'black';
        newListEl.style.borderRadius = '5px';
        newListEl.style.padding = '5px';
        newListEl.style.cursor = 'pointer';

        newListEl.textContent = note.title;

        newListEl.addEventListener('click', () => {
          const allNotesLists = notesList.querySelectorAll('p');
          allNotesLists.forEach((noteList) => {
            noteList.style.backgroundColor = '#e9ecef';
          });

          newListEl.style.backgroundColor = '#719cc7';

          noteTitle.textContent = note.title;
          noteContent.textContent = note.content;
        });

        notesList.appendChild(newListEl);

        if (!selected && index === 0) {
          return newListEl.click();
        } else if (selected && index === notes.length - 1) {
          return newListEl.click();
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Discard Button, nothing will save when clicked
  document.getElementById('closeButton').addEventListener('click', () => {
    titleInput.value = '';
    contentInput.value = '';
  });

  // Save the note title and content to the backend
  document.getElementById('saveButton').addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      alert('Please fill in both fields');
      return;
    }

    const newNote = {
      title,
      content,
    };

    try {
      const response = await fetch('/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        titleInput.value = ''; // Clear input field
        contentInput.value = ''; // Clear textarea field
        fetchData(true); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  });

  // Fetch data on page load
  fetchData();
});
