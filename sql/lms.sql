-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 26, 2024 at 07:51 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `Announcement_ID` int(11) NOT NULL,
  `Course_ID` int(11) NOT NULL,
  `Posted_By` int(11) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Content` text NOT NULL,
  `Date_Posted` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `announcement`
--

INSERT INTO `announcement` (`Announcement_ID`, `Course_ID`, `Posted_By`, `Title`, `Content`, `Date_Posted`) VALUES
(1, 1, 4, 'Welcome to CS101', 'This is the first announcement for the course.', '2024-11-01'),
(2, 2, 2, 'Welcome to Mathematics 201', 'This is the first announcement for Math 201.', '2024-11-02');

--
-- Triggers `announcement`
--
DELIMITER $$
CREATE TRIGGER `announcement_role_insert` BEFORE INSERT ON `announcement` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.posted_by;

    -- Check if the role is 'instructor' or 'admin'
    IF user_role NOT IN ('instructor', 'admin') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Posted_By must reference a user with the role of instructor or admin';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `announcement_role_update` BEFORE UPDATE ON `announcement` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.posted_by;

    -- Check if the role is 'instructor' or 'admin'
    IF user_role NOT IN ('instructor', 'admin') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Posted_By must reference a user with the role of instructor or admin';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `enforce_course_announcement_role_insert` BEFORE INSERT ON `announcement` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.posted_by;

    -- Check if the role is 'instructor' or 'admin'
    IF user_role NOT IN ('instructor', 'admin') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Posted_By must reference a user with the role of instructor or admin';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `assignment`
--

CREATE TABLE `assignment` (
  `Assignment_ID` int(11) NOT NULL,
  `Course_ID` int(11) NOT NULL,
  `Description` text NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Due_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assignment`
--

INSERT INTO `assignment` (`Assignment_ID`, `Course_ID`, `Description`, `Title`, `Due_Date`) VALUES
(1, 1, 'Complete the first programming assignment.', 'Programming Assignment 1', '2024-11-01');

--
-- Triggers `assignment`
--
DELIMITER $$
CREATE TRIGGER `enforce_assignment_course_id_insert` BEFORE INSERT ON `assignment` FOR EACH ROW BEGIN
    DECLARE course_exists INT;

    -- Check if the Course_ID exists in the course table
    SELECT COUNT(*) INTO course_exists FROM course WHERE course.Course_ID = NEW.Course_ID;

    -- If the Course_ID does not exist, raise an error
    IF course_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course_ID in assignment must reference an existing Course_ID in the course table';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `enforce_assignment_course_id_update` BEFORE UPDATE ON `assignment` FOR EACH ROW BEGIN
    DECLARE course_exists INT;

    -- Check if the Course_ID exists in the course table
    SELECT COUNT(*) INTO course_exists FROM course WHERE course.Course_ID = NEW.Course_ID;

    -- If the Course_ID does not exist, raise an error
    IF course_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course_ID in assignment must reference an existing Course_ID in the course table';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `Course_ID` int(11) NOT NULL,
  `Instructor_ID` int(11) NOT NULL,
  `Description` text NOT NULL,
  `Title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`Course_ID`, `Instructor_ID`, `Description`, `Title`) VALUES
(1, 2, 'Introduction to Computer Science', 'Computer Science 101'),
(2, 2, 'Advanced Mathematics', 'Mathematics 201');

--
-- Triggers `course`
--
DELIMITER $$
CREATE TRIGGER `before_insert_course` BEFORE INSERT ON `course` FOR EACH ROW BEGIN
   
    IF (SELECT `Role` FROM `User` WHERE `User_ID` = NEW.`Instructor_ID`) != 'Instructor' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Instructor_ID must belong to a user with the role "Instructor".';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_course` BEFORE UPDATE ON `course` FOR EACH ROW BEGIN
    
    IF (SELECT `Role` FROM `User` WHERE `User_ID` = NEW.`Instructor_ID`) != 'Instructor' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Instructor_ID must belong to a user with the role "Instructor".';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `enforce_instructor_role_insert` BEFORE INSERT ON `course` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.instructor_id;

    -- Check if the role is 'instructor'
    IF user_role != 'instructor' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Instructor_ID must reference a user with the role of instructor';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `enforce_instructor_role_update` BEFORE UPDATE ON `course` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.instructor_id;

    -- Check if the role is 'instructor'
    IF user_role != 'instructor' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Instructor_ID must reference a user with the role of instructor';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `Enrollment_ID` int(11) NOT NULL,
  `Course_ID` int(11) NOT NULL,
  `Student_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`Enrollment_ID`, `Course_ID`, `Student_ID`) VALUES
(1, 1, 3),
(2, 2, 3),
(10, 2, 3),
(11, 2, 3);

--
-- Triggers `enrollment`
--
DELIMITER $$
CREATE TRIGGER `before_insert_enrollment` BEFORE INSERT ON `enrollment` FOR EACH ROW BEGIN
    -- ตรวจสอบว่า Student_ID ต้องเป็น Role 'Student'
    IF (SELECT `Role` FROM `User` WHERE `User_ID` = NEW.`Student_ID`) != 'Student' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student_ID must belong to a user with the role "Student".';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `enforce_enrollment_student_role_insert` BEFORE INSERT ON `enrollment` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.student_id;

    -- Check if the role is 'student'
    IF user_role != 'student' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student_ID must reference a user with the role of student';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `enforce_enrollment_student_role_update` BEFORE UPDATE ON `enrollment` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.student_id;

    -- Check if the role is 'student'
    IF user_role != 'student' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student_ID must reference a user with the role of student';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `gradebook`
--

CREATE TABLE `gradebook` (
  `Gradebook_ID` int(11) NOT NULL,
  `Course_ID` int(11) NOT NULL,
  `Student_ID` int(11) NOT NULL,
  `Final_Grade` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `gradebook`
--

INSERT INTO `gradebook` (`Gradebook_ID`, `Course_ID`, `Student_ID`, `Final_Grade`) VALUES
(3, 1, 5, '84'),
(9, 1, 3, '23');

--
-- Triggers `gradebook`
--
DELIMITER $$
CREATE TRIGGER `enforce_gradebook_student_role_insert` BEFORE INSERT ON `gradebook` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.student_id;

    -- Check if the role is 'student'
    IF user_role != 'student' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student_ID must reference a user with the role of student';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `enforce_gradebook_student_role_update` BEFORE UPDATE ON `gradebook` FOR EACH ROW BEGIN
    DECLARE user_role VARCHAR(50);

    -- Fetch the role of the user
    SELECT role INTO user_role FROM user WHERE user_id = NEW.student_id;

    -- Check if the role is 'student'
    IF user_role != 'student' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student_ID must reference a user with the role of student';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `Question_ID` int(11) NOT NULL,
  `Quiz_ID` int(11) NOT NULL,
  `Question_Text` text NOT NULL,
  `Points` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`Question_ID`, `Quiz_ID`, `Question_Text`, `Points`) VALUES
(1, 1, 'What is a variable in programming?', '5'),
(2, 1, 'Explain the concept of loops.', '5'),
(3, 2, 'Solve the integral of x^2.', '10');

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `Quiz_ID` int(11) NOT NULL,
  `Course_ID` int(11) NOT NULL,
  `Due_Date` date NOT NULL,
  `Title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`Quiz_ID`, `Course_ID`, `Due_Date`, `Title`) VALUES
(1, 1, '2024-11-20', 'Quiz 1: Basics of Programming'),
(2, 2, '2024-11-03', 'Quiz 1: Advanced Calculus');

--
-- Triggers `quiz`
--
DELIMITER $$
CREATE TRIGGER `enforce_quiz_course_id_insert` BEFORE INSERT ON `quiz` FOR EACH ROW BEGIN
    DECLARE course_exists INT;

    -- Check if the Course_ID exists in the course table
    SELECT COUNT(*) INTO course_exists FROM course WHERE course.Course_ID = NEW.Course_ID;

    -- If the Course_ID does not exist, raise an error
    IF course_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course_ID in quiz must reference an existing Course_ID in the course table';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `enforce_quiz_course_id_update` BEFORE UPDATE ON `quiz` FOR EACH ROW BEGIN
    DECLARE course_exists INT;

    -- Check if the Course_ID exists in the course table
    SELECT COUNT(*) INTO course_exists FROM course WHERE course.Course_ID = NEW.Course_ID;

    -- If the Course_ID does not exist, raise an error
    IF course_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course_ID in quiz must reference an existing Course_ID in the course table';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `submission`
--

CREATE TABLE `submission` (
  `Submission_ID` int(11) NOT NULL,
  `Student_ID` int(11) NOT NULL,
  `Assignment_ID` int(11) NOT NULL,
  `File` blob NOT NULL,
  `Grade` decimal(10,0) NOT NULL,
  `Feedback` text NOT NULL,
  `Submission_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `submission`
--
DELIMITER $$
CREATE TRIGGER `before_insert_submission` BEFORE INSERT ON `submission` FOR EACH ROW BEGIN
    -- ตรวจสอบว่า Student_ID ต้องเป็น Role 'Student'
    IF (SELECT `Role` FROM `User` WHERE `User_ID` = NEW.`Student_ID`) != 'Student' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student_ID must belong to a user with the role "Student".';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `User_ID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`User_ID`, `Name`, `Email`, `Password`, `Role`) VALUES
(2, 'Admin', 'admin@email.com', 'password123', 'Admin'),
(3, 'Student', 'student@email.com', 'password123', 'Student'),
(4, 'Instructor', 'instructor@email.com', 'Password123', 'Instructor'),
(5, 'luna', 'luna@email.com', '123456', 'Student'),
(7, 'pepperluna', 'pepperluna@email.com', '123456', 'Admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`Announcement_ID`),
  ADD KEY `Course_ID` (`Course_ID`),
  ADD KEY `fk_Announcement_Posted_By` (`Posted_By`);

--
-- Indexes for table `assignment`
--
ALTER TABLE `assignment`
  ADD PRIMARY KEY (`Assignment_ID`),
  ADD KEY `Course_ID` (`Course_ID`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`Course_ID`),
  ADD KEY `Instructor_ID` (`Instructor_ID`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`Enrollment_ID`),
  ADD KEY `Course_ID` (`Course_ID`),
  ADD KEY `Student_ID` (`Student_ID`);

--
-- Indexes for table `gradebook`
--
ALTER TABLE `gradebook`
  ADD PRIMARY KEY (`Gradebook_ID`),
  ADD KEY `Course_ID` (`Course_ID`),
  ADD KEY `Student_ID` (`Student_ID`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`Question_ID`),
  ADD KEY `Quiz_ID` (`Quiz_ID`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`Quiz_ID`),
  ADD KEY `Course_ID` (`Course_ID`);

--
-- Indexes for table `submission`
--
ALTER TABLE `submission`
  ADD PRIMARY KEY (`Submission_ID`),
  ADD KEY `Student_ID` (`Student_ID`),
  ADD KEY `Assignment_ID` (`Assignment_ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `Announcement_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `assignment`
--
ALTER TABLE `assignment`
  MODIFY `Assignment_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `Course_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `Enrollment_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `gradebook`
--
ALTER TABLE `gradebook`
  MODIFY `Gradebook_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `Question_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `Quiz_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `submission`
--
ALTER TABLE `submission`
  MODIFY `Submission_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcement`
--
ALTER TABLE `announcement`
  ADD CONSTRAINT `fk_Announcement_Course` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Announcement_Posted_By` FOREIGN KEY (`Posted_By`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `assignment`
--
ALTER TABLE `assignment`
  ADD CONSTRAINT `fk_Assignment_Course` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `fk_Course_Instructor` FOREIGN KEY (`Instructor_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `fk_Enrollment_Course` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Enrollment_Student` FOREIGN KEY (`Student_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `gradebook`
--
ALTER TABLE `gradebook`
  ADD CONSTRAINT `fk_Gradebook_Course` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Gradebook_Student` FOREIGN KEY (`Student_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `fk_Question_Quiz` FOREIGN KEY (`Quiz_ID`) REFERENCES `quiz` (`Quiz_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `fk_Quiz_Course` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `submission`
--
ALTER TABLE `submission`
  ADD CONSTRAINT `fk_Submission_Assignment` FOREIGN KEY (`Assignment_ID`) REFERENCES `assignment` (`Assignment_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Submission_Student` FOREIGN KEY (`Student_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
