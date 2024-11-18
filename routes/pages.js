const express = require('express');
const mysql = require("mysql");
 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: process.env.database
});

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/admin_dashboard', (req, res) => {
    res.render('admin_dashboard');
});

router.get('/student_dashboard', (req, res) => {
    res.render('student_dashboard');
});

router.get('/instructor_dashboard', (req, res) => {
    res.render('instructor_dashboard');
});

router.get('/enroll', (req, res) => {
    res.render('enroll');
});

router.get('/course', (req, res) => {
    res.render('course');
});

router.get('/instructor_course', (req, res) => {
    res.render('instructor_course');
});

router.get('/assignment', (req, res) => {
    res.render('assignment');
});

router.get('/gradebook', (req, res) => {
    res.render('gradebook');
});

router.get('/admin_dashboard', function(req, res, next) {
    db.query('SELECT * FROM user ORDER BY id desc',function(err,rows)     {
           if(error){
            req.flash('error', err);
            res.render('list',{page_title:"Users - Node.js",data:''});
           }else{
   
               res.render('list',{page_title:"Users - Node.js",data:rows});
           }
   
            });
   
       });

module.exports = router;