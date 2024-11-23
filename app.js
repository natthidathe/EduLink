const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session");

dotenv.config({ path: "./.env" });

const app = express();


const hbs = require("hbs");

// Set Handlebars as the view engine
app.set("view engine", "hbs");
// Register an 'eq' helper
hbs.registerHelper("eq", (a, b) => a === b);
// Serve static files
const publicDirectory = path.join(__dirname, "/public");
app.use(express.static(publicDirectory));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);






// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "edulink",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

// Existing GET routes
app.get("/", (req, res) => res.render("index"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/admin_dashboard", (req, res) => res.render("admin_dashboard"));
app.get("/home", (req, res) => {
    const user = req.session.user; // Assuming user info is stored in the session
    res.render("home", {
        name: user.name,
        role: user.role
    });
});



// Additional pages
app.get("/enroll", (req, res) => res.render("enroll"));
app.get("/course", (req, res) => res.render("course"));
app.get("/instructor_course", (req, res) => res.render("instructor_course"));
app.get("/assignment", (req, res) => res.render("assignment"));
app.get("/gradebook", (req, res) => res.render("gradebook"));

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
