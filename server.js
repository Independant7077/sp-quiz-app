const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bodyParser = require("body-parser")
const cors = require("cors")

// Create express application
const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))

// Connect to SQLite database
const db = new sqlite3.Database("database.db")

// Create table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    score REAL,
    date TEXT
)
`)

// API to store quiz result
app.post("/submit", (req, res) => {

    const { name, email, score } = req.body

    db.run(
        "INSERT INTO results(name,email,score,date) VALUES(?,?,?,datetime('now'))",
        [name, email, score],
        function(err) {

            if (err) {
                res.status(500).send(err)
            } else {
                res.send({ message: "Result saved successfully" })
            }

        }
    )
})

// API to fetch results
app.get("/results", (req, res) => {

    db.all("SELECT * FROM results", (err, rows) => {

        if (err) {
            res.status(500).send(err)
        } else {
            res.json(rows)
        }

    })

})

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})

app.get("/results/:email",(req,res)=>{
  const email = req.params.email;

  db.all(
    "SELECT * FROM results WHERE email=? ORDER BY id DESC",
    [email],
    (err,rows)=>{
      res.json(rows)
    }
  )
})
