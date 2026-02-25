// Import the required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = process.env.PORT || 3001;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const file = fs.readFileSync(dataFilePath, 'utf-8');
  return file.trim() ? JSON.parse(file) : [];
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Handle GET request at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST request to save new data with a unique ID
app.post('/note', (req, res) => {
  const currentNote = readData();
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    content: req.body.content,
  };
  currentNote.push(newNote);
  writeData(currentNote);
  res.status(201).json({ message: 'Note added successfully', note: newNote });
});

// Handle GET request to retrieve stored data
app.get('/notes', (req, res) => {
  const notes = readData();
  res.json(notes);
});

// Handle GET request to retrieve data by ID
app.get('/notes/:id', (req, res) => {
  const allNotes = readData();
  const { id } = req.params;
  const note = allNotes.find((note) => note.id === id);
  if (!note) {
    return res
      .status(404)
      .json({ message: 'No Note is not found with this ID' });
  }
  res.status(200).json({ note: note });
});

// Handle PUT request to fully update data by ID
app.put('/notes/:id', (req, res) => {
  const allNotes = readData();
  const { id } = req.params;
  const index = allNotes.findIndex((note) => note.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }
  allNotes[index] = { id, title: req.body.title, content: req.body.content };
  writeData(allNotes);
  res.json({
    message: 'Note Updated Successfully',
    notes: allNotes[index],
  });
});

// Wildcard route to handle undefined routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
