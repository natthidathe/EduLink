const express = require('express');

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

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

router.get('/enroll', (req, res) => {
    res.render('enroll');
});

router.get('/course', (req, res) => {
    res.render('course');
});

module.exports = router;