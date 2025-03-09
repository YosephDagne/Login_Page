const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql2.createConnection({
  host: "localhost",
  user: "signup",
  password: "login",
  database: "signup",
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Route to create the "login" table
app.get("/create", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS login (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
      return res.status(500).send("Error creating table");
    }
    console.log("Table created successfully");
    res.send("Table created successfully");
  });
});

// Route for user signup
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Please provide all fields");
  }

  const sql = `INSERT INTO login (name, email, password) VALUES (?, ?, ?)`;
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error("Error during signup:", err.message);
      return res
        .status(500)
        .json({ error: "Email already exists or database error" });
    }
    return res.status(200).json({ message: "Signup successful", data: result });
  });
});

// Route for user login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please provide both email and password");
  }

  const sql = `SELECT * FROM login WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Error during login:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      // User exists
      return res.json({ message: "Login successful", user: results[0] });
    } else {
      // No matching user
      return res.json({ error: "Invalid email or password" });
    }
  });
});

// Start the server
app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
