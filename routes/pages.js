const express = require('express');
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lms'
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



router.get('/enroll', function(req, res, next) {

    connection.query('SELECT * FROM user ORDER BY id desc',function(err,rows)     {
           if(err){
            req.flash('error', err);
            res.render('list',{page_title:"Users - Node.js",data:''});
           }else{
   
               res.render('list',{page_title:"Users - Node.js",data:rows});
           }
   
            });
   
       });


       
router.get("/admin_dashboard", (req, res) => {
    const userQuery = `SELECT User_ID, Name, Email, Password, Role FROM user;`;
    const courseQuery = `SELECT Course_ID, Instructor_ID, Description, Title FROM course;`;
    
    // Run both queries in parallel
    db.query(userQuery, (userErr, userResults) => {
        if (userErr) {
            console.error("Error fetching users:", userErr);
            return res.status(500).send("Error fetching user data.");
        }
    
        db.query(courseQuery, (courseErr, courseResults) => {
            if (courseErr) {
                console.error("Error fetching courses:", courseErr);
                return res.status(500).send("Error fetching course data.");
            }
    
            // Render the admin_dashboard with both datasets
            res.render("admin_dashboard", {
                users: userResults,
                 courses: courseResults,
            });
        });
    });
});
       
router.get("/gradebook", (req, res) => {
    const gradeQuery = `
        SELECT 
            g.Gradebook_ID, 
            g.Course_ID, 
            g.Student_ID, 
            u.Name AS Student_Name, 
            g.Final_Grade
        FROM 
            gradebook g
        INNER JOIN 
            user u 
        ON 
            g.Student_ID = u.User_ID
        WHERE 
            u.Role = 'student'
    `;

    db.query(gradeQuery, (gradeErr, gradeResults) => {
        if (gradeErr) {
            console.error("Error fetching grades:", gradeErr);
            return res.status(500).send("Error fetching grades.");
        }
        
        console.log("Grade Results with Student Names:", gradeResults);
        res.render("gradebook", {
            grade: gradeResults
        });
    });
});

router.get("/student_gradebook", (req, res) => {
    // Check if the user is logged in
    if (!req.session.user) {
        return res.status(403).send("You must be logged in to view your grades.");
    }

    const loggedInUserID = req.session.user.id;
    const loggedInUserRole = req.session.user.role;

    // Ensure only students can access this page
    if (loggedInUserRole !== 'student') {
        return res.status(403).send("Access denied. Only students can view this page.");
    }

    const studentgradeQuery = `
        SELECT 
            g.Gradebook_ID, 
            g.Course_ID, 
            g.Student_ID, 
            g.Final_Grade, 
            u.Name AS Student_Name
        FROM 
            gradebook g
        INNER JOIN 
            user u 
        ON 
            g.Student_ID = u.User_ID
        WHERE 
            g.Student_ID = ?
    `;

    db.query(studentgradeQuery, [loggedInUserID], (studentgradeErr, studentgradeResults) => {
        if (studentgradeErr) {
            console.error("Error fetching grades:", studentgradeErr);
            return res.status(500).send("Error fetching grades.");
        }

        res.render("student_gradebook", {
            grade: studentgradeResults
        });
    });
});


// ADD USER
router.get("/admin_dashboard/add_user", (req, res) => {
    res.render("add_user"); // Render the form for adding a user
});

// POST route to add a new user to the database
router.post("/admin_dashboard/add_user", (req, res) => {
    const { Name, Email, Password, Role } = req.body;

    const addQuery = `
        INSERT INTO user (Name, Email, Password, Role) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(addQuery, [Name, Email, Password, Role], (err) => {
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).send("Error adding user.");
        }

        res.redirect("/admin_dashboard"); // Redirect back to the admin dashboard after adding the user
    });
});


// Route for editing a user
router.get('/admin_dashboard/edit_user/:id', (req, res) => {
    const userID = req.params.id;
    console.log("Editing user with ID:", userID);  // Debug log

    const getUserQuery = "SELECT * FROM user WHERE User_ID = ?";
    db.query(getUserQuery, [userID], (err, results) => {
        if (err) {
            console.error("Error fetching user for edit:", err);
            return res.status(500).send("Error fetching user.");
        }

        if (results.length === 0) {
            return res.status(404).send("User not found.");
        }

        res.render('edit_user', { user: results[0] });
    });
});


// Route to handle updating the user (POST request)
router.post('/admin_dashboard/edit_user/:id', (req, res) => {
    const userID = req.params.id;
    const { name, email, password, role } = req.body;

    const updateQuery = "UPDATE user SET Name = ?, Email = ?, Password = ?, Role = ? WHERE User_ID = ?";
    db.query(updateQuery, [name, email, password, role, userID], (err) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).send("Error updating user.");
        }

        // After the update, redirect to the dashboard
        res.redirect('/admin_dashboard');
    });
});

//DELETE USER
// Handle the user deletion
router.post('/admin_dashboard/delete_user/:id', (req, res) => {
    const userID = req.params.id; // Get the user ID from the URL

    const deleteQuery = "DELETE FROM user WHERE User_ID = ?";
    db.query(deleteQuery, [userID], (err) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).send("Error deleting user.");
        }

        // After deletion, redirect back to the dashboard
        res.redirect('/admin_dashboard');
    });
});



module.exports = router;
