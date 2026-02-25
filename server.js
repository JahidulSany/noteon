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
  const data = file.trim() ? JSON.parse(file) : [];
  return data;
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Handle GET request at the root route
app.get('/', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Handle GET request to retrieve stored data
app.get('/notes', (req, res) => {
  try {
    const notes = readData();
    res.json(notes);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Handle POST request to save new data with a unique ID
app.post('/note', async (req, res) => {
  try {
    const newNote = { id: uuidv4(), ...req.body };
    const currentNote = readData();
    currentNote.push(newNote);
    writeData(currentNote);
    res
      .status(201)
      .json({ message: 'Note added successfully', notes: newNote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Handle GET request to retrieve data by ID
app.get('/notes/:id', (req, res) => {
  const allNotes = readData();
  const note = allNotes.find((note) => note.id === req.params.id);
  if (!note) {
    return res.status(404).json({ message: 'No Note is not found with this ID' });
  }
  res.status(200).json({note});
});


// Wildcard route to handle undefined routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
