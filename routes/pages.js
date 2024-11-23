const express = require('express');
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: process.env.DATABASE // Make sure you define this in your .env
});

const router = express.Router();

// Main Routes
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

// Home Route (Redirect to login if not logged in)
router.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }

    const { name, role } = req.session.user;
    res.render('home', { name, role });
});

// Dashboard Routes (role-based rendering)
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const role = req.session.user.role;
    switch(role) {
        case 'admin':
            return res.render('admin_dashboard', { 
                layout: 'dashboard',
                role: role,
                user: req.session.user 
            });
        case 'student':
            return res.render('student_dashboard', { 
                layout: 'dashboard',
                role: role,
                user: req.session.user 
            });
        case 'instructor':
            return res.render('instructor_dashboard', { 
                layout: 'dashboard',
                role: role,
                user: req.session.user 
            });
        default:
            return res.status(403).send('Unauthorized');
    }
});

// Other Routes
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

module.exports = router;
