const mysql = require("mysql");
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql2 = require('mysql2');

 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lms'
  });

exports.register = (req, res) =>{
    console.log(req.body);

    const {name,email,password,passwordConfirm,role} = req.body;

    db.query('SELECT email FROM user where email = ?', [email], async(error, results) => {
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


// Login user
exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM user WHERE Email = ? AND Password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).send("Internal Server Error");
        }

        console.log("Query Results:", results);

        if (results.length === 0) {
            return res.render("login", { 
                message: "Invalid email or password" });
        }

        const user = results[0]; // Access the first row of the result
        req.session.user = {
            id: user.User_ID, // Match the correct column name
            name: user.Name, // Match the correct column name
            role: user.Role  // Match the correct column name
        };
        console.log("Logged in User:", user.Name, user.Role);

        res.redirect("/home");
    });
};



