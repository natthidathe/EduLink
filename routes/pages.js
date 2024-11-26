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

//Gradebook
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
    // Ensure the session middleware is working and user data is available
    if (!req.session.user) {
        return res.status(401).send("Unauthorized. Please log in.");
    }

    const studentId = req.session.user.id;
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
            g.Student_ID = ?
    `;

    db.query(gradeQuery, [studentId], (gradeErr, gradeResults) => {
        if (gradeErr) {
            console.error("Error fetching grades:", gradeErr);
            return res.status(500).send("Error fetching grades.");
        }
        
        res.render("student_gradebook", {
            grade: gradeResults
        });
    });
});
//EDIT USER
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
    console.log(req.body)
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

//EDIT USER
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
    console.log(req.body)
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

// ADD COURSE
router.get("/admin_dashboard/course", (req, res) => {
    res.render("add_course"); // Render the form for adding a user
});

// POST route to add a new user to the database
router.post("/admin_dashboard/add_course", (req, res) => {
    const { Course_ID, Instructor_ID, Description, Title } = req.body;

    const addQuery = `
        INSERT INTO course (Course_ID, Instructor_ID, Description, Title) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(addQuery, [Course_ID, Instructor_ID, Description, Title], (err) => {
        if (err) {
            console.error("Error adding course:", err);
            return res.status(500).send("Error adding course.");
        }

        res.redirect("/admin_dashboard"); // Redirect back to the admin dashboard after adding the user
    });
});



//EDIT COURSE
// Route for editing a course
router.get('/edit_course/:id', (req, res) => {
    const CourseID = req.params.id;
    console.log("Editing course with ID:", CourseID); // Debug log

    const getCourseQuery = "SELECT * FROM course WHERE Course_ID = ?";
    db.query(getCourseQuery, [CourseID], (err, results) => {
        if (err) {
            console.error("Error fetching course for edit:", err);
            return res.status(500).send("Error fetching course.");
        }

        if (results.length === 0) {
            return res.status(404).send("Course not found.");
        }

        res.render('edit_course', { course: results[0] });
    });
});

// Route to handle updating the course (POST request)
router.post('/edit_course/:id', (req, res) => {
    const CourseID = req.params.id;
    const { Title, Description, Instructor_id } = req.body;
    console.log(req.body);

    const updateQuery = "UPDATE course SET Title = ?, Description = ?, Instructor_ID = ? WHERE Course_ID = ?";
    db.query(updateQuery, [Title, Description, Instructor_id, CourseID], (err) => {
        if (err) {
            console.error("Error updating course:", err);
            return res.status(500).send("Error updating course.");
        }

        // After the update, redirect to the dashboard
        res.redirect('/admin_dashboard');
    });
});

//DELETE COURSE
// Handle the course deletion
router.post('/admin_dashboard/delete_course/:id', (req, res) => {
    const CourseID = req.params.id; // Get the course ID from the URL

    const deleteQuery = "DELETE FROM course WHERE Course_ID = ?";
    db.query(deleteQuery, [CourseID], (err) => {
        if (err) {
            console.error("Error deleting course:", err);
            return res.status(500).send("Error deleting course.");
        }

        // After deletion, redirect back to the dashboard
        res.redirect('/admin_dashboard');
    });
});

//ADD GRADEBOOK
router.post("/gradebook/add_gradebook", (req, res) => {
    const { Course_ID, Student_ID, Final_Grade } = req.body;

    const addQuery = `
        INSERT INTO gradebook (Course_ID, Student_ID, Final_Grade) 
        VALUES (?, ?, ?)
    `;
    db.query(addQuery, [ Course_ID, Student_ID, Final_Grade], (err) => {
        if (err) {
            console.error("Error adding user:", err);
            return res.render("add_gradebook", { 
                message: "Student_ID must belong to a user with the role Student" });
            
        }

        res.redirect("/gradebook"); // Redirect back to the admin dashboard after adding the user
    });
});


//EDIT GRADEBOOK
router.get('/gradebook/edit_gradebook/:id', (req, res) => {
    const GradebookID = req.params.id;
    console.log("Editing course with ID:", GradebookID); // Debug log

    const getGradeQuery = "SELECT * FROM gradebook WHERE Gradebook_ID = ?";
    db.query(getGradeQuery, [GradebookID], (err, results) => {
        if (err) {
            console.error("Error fetching course for edit:", err);
            return res.status(500).send("Error fetching grade.");
        }

        if (results.length === 0) {
            return res.status(404).send("Grade not found.");
        }

        res.render('edit_gradebook', { gradebook: results[0] });
    });
});

// Route to handle updating the gradebook (POST request)
router.post('/gradebook/edit_gradebook/:id', (req, res) => {
    const GradebookID = req.params.id;
    const { Course_ID, Student_ID, Final_Grade } = req.body;
    console.log(req.body);

    const updateQuery = "UPDATE gradebook SET Course_ID = ?, Student_ID = ? , Final_Grade = ? WHERE Gradebook_ID = ?";
    db.query(updateQuery, [Course_ID, Student_ID, Final_Grade, GradebookID], (err) => {
        if (err) {
            console.error("Error updating grade:", err);
            return res.status(500).send("Error updating grade.");
        }

        // After the update, redirect to the dashboard
        res.redirect('/gradebook');
    });
});

//DELETE COURSE
// Handle the gradebook deletion
router.post('/gradebook/delete_gradebook/:id', (req, res) => {
    const GradebookID = req.params.id; // Get the course ID from the URL

    const deleteQuery = "DELETE FROM gradebook WHERE Gradebook_ID = ?";
    db.query(deleteQuery, [GradebookID], (err) => {
        if (err) {
            console.error("Error deleting course:", err);
            return res.status(500).send("Error deleting course.");
        }

        // After deletion, redirect back to the dashboard
        res.redirect('/gradebook');
    });
});


//PAGE INSTRUCTOR COURSE
router.get("/instructor_course", (req, res) => {
    const assignmentQuery = `SELECT * FROM assignment;`;
    const quizQuery = `SELECT * FROM quiz;`;
    
    // Run both queries in parallel
    db.query(assignmentQuery, (assignmentErr, assignmentResults) => {
        if (assignmentErr) {
            console.error("Error fetching assignment:", assignmentErr);
            return res.status(500).send("Error fetching assignment data.");
        }
    
        db.query(quizQuery, (quizErr, quizResults) => {
            if (quizErr) {
                console.error("Error fetching quiz:", quizErr);
                return res.status(500).send("Error fetching quiz data.");
            }
    
            // Render the admin_dashboard with both datasets
            res.render("instructor_course", {
                assignment: assignmentResults,
                quiz: quizResults,
            });
        });
    });
});


module.exports = router;


