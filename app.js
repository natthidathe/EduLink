const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session");
var flash = require('express-flash');
const exphbs = require('express-handlebars');


dotenv.config({ path: "./.env" });

const app = express();

app.use(flash());

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




// Set up the view engine as Handlebars
app.set('view engine', 'hbs');



app.use(flash());

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lms'
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("MySQL connected");
  }
});

// Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

// Existing GET routes
app.get("/", (req, res) => res.render("index"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/student_dashboard", (req, res) => res.render("student_dashboard"));
app.get("/admin_dashboard", (req, res) => res.render("admin_dashboard"));
app.get("/add_user", (req, res) => res.render("add_user"));
app.get("/add_course", (req, res) => res.render("add_course"));
app.get("/add_gradebook", (req, res) => res.render("add_gradebook"));
app.get("/add_quiz", (req, res) => res.render("add_quiz"));
app.get("/add_assignment", (req, res) => res.render("add_assignment"));

app.get("/edit_user/:id", (req, res) => res.render("edit_user/:id"));
app.get("/delete_user/:id", (req, res) => res.render("delete_user/:id"));

app.get("/edit_course/:id", (req, res) => res.render("edit_course/:id"));
app.get("/delete_course/:id", (req, res) => res.render("delete_course/:id"));

app.get("/edit_gradebook/:id", (req, res) => res.render("edit_gradebook/:id"));
app.get("/delete_gradebook/:id", (req, res) => res.render("delete_gradebook/:id"));

app.get("/edit_assignment/:id", (req, res) => res.render("edit_assignment/:id"));
app.get("/delete_assignment/:id", (req, res) => res.render("delete_assignment/:id"));

app.get("/instructor_dashboard", (req, res) => res.render("instructor_dashboard"));
app.get("/home", (req, res) => {
    const user = req.session.user; // Assuming user info is stored in the session
    res.render("home", {
        name: user.name,
        role: user.role
    });
});

app.get("/course", (req, res) => res.render("course"));
app.get("/instructor_course", (req, res) => res.render("instructor_course"));
app.get("/assignment", (req, res) => res.render("assignment"));
app.get("/gradebook", (req, res) => res.render("gradebook"));
app.get("/student_gradebook", (req, res) => res.render("student_gradebook"));

const pagesRouter = require('./routes/pages');
app.use('/admin_dashboard', pagesRouter);  // This ensures routes in pages.js are prefixed with /admin_dashboard



// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

