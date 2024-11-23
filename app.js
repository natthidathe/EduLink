const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const app = express();


// Set Handlebars as the view engine
// app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'edulink'
});

const session = require('express-session');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
}));



const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({extended: true}));
app.use(express.json());



db.connect(function(err){
    if(err) throw(err);
    console.log("Mysql connected")
});

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

//request n respond res= send something to frontend
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/admin_dashboard", (req, res) => {
    res.render("admin_dashboard");
});

app.get("/instructor_dashboard", (req, res) => {
    res.render("instructor_dashboard");
});

app.get("/student_dashboard", (req, res) => {
    res.render("student_dashboard");
});

app.get("/enroll", (req, res) => {
    res.render("enroll");
});

app.get("/course", (req, res) => {
    res.render("course");
});

app.get("/instructor_course", (req, res) => {
    res.render("instructor_course");
});

app.get("/assignment", (req, res) => {
    res.render("assignment");
});

app.get("/gradebook", (req, res) => {
    res.render("gradebook");
});



app.listen(3000, () => {
    console.log("Server started on Port 3000");
})


