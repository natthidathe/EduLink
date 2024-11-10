const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: process.env.database
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
} 