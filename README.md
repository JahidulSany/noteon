### 🌐 Noteon - A note-taking full stack application

# ✨ Project Description

Noteon is a Full Stack Notes Application using Node and Express that allows users to: <br>
• Create new notes <br>
• Read existing notes <br>
• Update notes <br>
• Delete notes <br>

Github Repo: https://github.com/JahidulSany/noteon <br>
Live Link: https://noteon-kmdp.onrender.com/

# 🛠️ Installation Instructions

```sh
    git clone https://github.com/JahidulSany/noteon.git
    cd noteon
    npm install
```

# 💥 Usage Instructions

**Open Terminal** <br>
Simply open the Terminal in your VScode or Terminal/bash/cmd — and follow the steps below

# Install dependencies

Start the server by choosing any of the command

```sh
    node start
    node run dev
```

Then open your browser and visit:

```sh
    http://localhost:3001
```

🔗 API Routes

Base URL:

```sh
    http://localhost:3001
```

📌 Get All Notes

```sh
    GET /notes
```

Returns all saved notes.

📌 Get Single Note

```sh
    GET /notes/:id
```

Returns a single note by ID.

📌 Create New Note

```sh
    POST /note
```

Body (JSON):

```sh
{
  "title": "Note Title",
  "content": "Note content here..."
}
```

📌 Update Note

```sh
    PUT /notes/:id
```

Body (JSON):

```sh
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

📌 Delete Note

```sh
    DELETE /notes/:id
```

Deletes a note by ID.

# ✍️ Author:

Jahidul Islam Sany - FullStack Software Developer

# 📇 Contact:

Feel free to reach out if you’d like to connect or work together!
📧 Email: jahidulsanypro@gmail.com

👏 Thanks for checking out! I hope it gives you a strong sense of my skills and capabilities.
