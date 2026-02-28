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

document.addEventListener('DOMContentLoaded', () => {
  // Note-taking functionality
  const titleInput = document.getElementById('titleInput');
  const contentInput = document.getElementById('contentInput');
  const notesList = document.getElementById('notesList');
  const noteTitle = document.getElementById('noteTitle');
  const noteContent = document.getElementById('noteContent');

  let currentNoteId = null;
  let currentNoteListItem = null;

  let notesCache = [];

  // Function to fetch data from the backend
  const fetchData = async (newCreatedNote = false) => {
    try {
      const response = await fetch('/notes');
      const notes = await response.json();

      notesCache = notes;
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

        noteTitle.textContent = 'No note';
        noteContent.value = 'Click the New Note + button to create a note';
        return;
      }

      notes.forEach((note, index) => {
        const wrapper = document.createElement('div');
        const newListEl = document.createElement('p');
        const deleteButton = document.createElement('button');

        wrapper.classList.add(
          'd-flex',
          'justify-content-around',
          'align-items',
          'mb-2',
        );
        newListEl.classList.add(
          'd-inline-block',
          'rounded-1',
          'w-100',
          'p-2',
          'me-2',
          'text-dark',
          'text-nowrap',
          'overflow-auto',
        );
        newListEl.style.cursor = 'pointer';
        newListEl.style.backgroundColor = '#e9ecef';

        newListEl.textContent = note.title;

        deleteButton.classList.add('btn', 'btn-danger');
        ((deleteButton.style.maxHeight = '45px'),
          (deleteButton.textContent = 'Delete'));

        newListEl.addEventListener('click', () => {
          const allNotesList = notesList.querySelectorAll('#notesList p');
          allNotesList.forEach((noteList) => {
            noteList.style.backgroundColor = '#e9ecef';
          });

          newListEl.style.backgroundColor = '#719cc7';

          const selectedNote = notesCache.find(
            (noteCache) => noteCache.id === note.id,
          );

          noteTitle.textContent = selectedNote.title;
          noteContent.value = selectedNote.content;
          currentNoteId = note.id;
          currentNoteListItem = newListEl;
        });

        wrapper.appendChild(newListEl);
        wrapper.appendChild(deleteButton);
        notesList.appendChild(wrapper);

        // Auto open note for First Note and Created Note
        if (!newCreatedNote && index === 0) {
          newListEl.click();
        } else if (newCreatedNote && index === notes.length - 1) {
          newListEl.click();
        }

        deleteButton.addEventListener('click', async (e) => {
          e.stopPropagation();
          await fetch(`/notes/${note.id}`, {
            method: 'DELETE',
          });

          if (currentNoteId === note.id) {
            noteTitle.style = '';
            noteContent.value = '';
            currentNoteId = null;
          }
          fetchData();
        });
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
    const noteTitle = titleInput.value.trim();
    const noteContent = contentInput.value.trim();

    if (!noteTitle || !noteContent) {
      alert('Please fill in both fields');
      return;
    }

    const newNote = {
      title: noteTitle,
      content: noteContent,
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

  // Auto Save for Note Title and Note Content
  let saveTimeout;

  const autoSave = () => {
    if (!currentNoteId) return;

    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      const updatedTitle = noteTitle.textContent.trim();
      const updatedContent = noteContent.value.trim();

      try {
        const response = await fetch(`/notes/${currentNoteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: updatedTitle,
            content: updatedContent,
          }),
        });

        if (response.ok) {
          if (currentNoteListItem) {
            currentNoteListItem.textContent = updatedTitle;
          }

          const noteIndex = notesCache.findIndex(
            (noteCache) => noteCache.id === currentNoteId,
          );
          
          if (noteIndex !== -1) {
            notesCache[noteIndex].title = updatedTitle;
            notesCache[noteIndex].content = updatedContent;
          }
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 300);
  };

  // Auto save when typing in title
  noteTitle.addEventListener('input', () => {
    autoSave();
  });

  // Auto save when typing in content
  noteContent.addEventListener('input', () => {
    autoSave();
  });

  // Fetch data on page load
  fetchData();
});
