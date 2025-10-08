const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Serve all static files (HTML, CSS, JS, images) from current folder
app.use(express.static(__dirname));

// Default route → serve home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint to send questions to the quiz page
app.get("/api/questions", (req, res) => {
  fs.readFile(path.join(__dirname, "questions.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading questions file:", err);
      res.status(500).send("Error loading questions");
    } else {
      res.send(JSON.parse(data));
    }
  });
});

// API endpoint to save score (for demonstration)
app.post("/api/score", (req, res) => {
  const { playerName, score } = req.body;
  console.log(`Score received → ${playerName}: ${score}`);

  // Here you could save data to a database or a file
  res.send({ message: "Score saved successfully!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
