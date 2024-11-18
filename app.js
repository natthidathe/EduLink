const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const flash = require('connect-flash');


dotenv.config({path: './.env'});


const app = express();


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'edulink'
});


const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'hbs');

db.connect((error) =>{
    if(error){
        console.log(error)
    } else {
        console.log("MYSQL Connected")
    }
})


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

//Define Routes
app.use('/', require('./routes/pages'));
// app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log("Server started on Port 3000");
})


app.use(flash());
