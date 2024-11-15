const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');


dotenv.config({path: './.env'});


const app = express();


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: process.env.database
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

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

app.get("/enroll", (req, res) => {
    res.render("enroll");
});

app.get("/course", (req, res) => {
    res.render("course");
});

//Define Routes
app.use('/', require('./routes/pages'));
// app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log("Server started on Port 3000");
})
