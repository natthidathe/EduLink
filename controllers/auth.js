const mysql = require("mysql");
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'edulink'
});

exports.register = (req, res) =>{
    console.log(req.body);

    const {name,email,password,passwordConfirm,role} = req.body;

    db.query('SELECT email FROM user where email = ', [email], async(error, results) => {
        if(error){
            console.log(error);
        }

        if(results.length > 0){
            return res.render('register', {
                message: 'That email is already in use'
            });
        } else if( password !== passwordConfirm){
            return res.render('register', {
                message: 'Password do not match'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO user SET ?', {name: name, email: email, password: password, role: role}, (error, results) => {
            if(error){
                console.log(error);
            } else{
                console.log(results);
                return res.render('login');
            }
        })


    });
} ;


exports.login = (req, res) => {
    const { email, password } = req.body;

    // Query the database to find the user by email
    var sql = 'SELECT * FROM user WHERE email = ?';
    db.query(sql, [email], function (err, results) {
        if (err) {
            console.log('Error during query:', err);
            return res.status(500).render('login', {
                message: 'An error occurred. Please try again later.'
            });
        }

        // If no user found with the provided email
        if (results.length === 0) {
            return res.render('login', {
                message: 'Email or password is incorrect'
            });
        }

        const user = results[0];  // Take the first user from the result

        // Check if the user has a password field
        if (!user.password) {
            return res.render('login', {
                message: 'Password not found in the database'
            });
        }

        // Compare the provided password with the stored password (plaintext comparison)
        if (password !== user.password) {
            return res.render('login', {
                message: 'Email or password is incorrect'
            });
        }

        // If the login is successful, store user information in the session
        req.session.user = { id: user.id, role: user.role, name: user.name };

        // Redirect to the home page after successful login
        return res.redirect('/home');
    });
};



