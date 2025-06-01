CREATE DATABASE IF NOT EXISTS hrsystem;
USE hrsystem;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    userRole ENUM('ADMIN', 'USER', 'REQRUITER') NOT NULL,
    profile_image VARCHAR(512),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN department VARCHAR(255) AFTER userRole;

ALTER TABLE users MODIFY userRole VARCHAR(50) NOT NULL;

CREATE TABLE payroll (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  month VARCHAR(20),
  hours_worked INT DEFAULT 0,
  bonus DECIMAL(10, 2) DEFAULT 0,
  deductions DECIMAL(10, 2) DEFAULT 0,
  status ENUM('Pending', 'Generated', 'Paid') DEFAULT 'Pending',
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

ALTER TABLE users
ADD COLUMN pay_type ENUM('monthly', 'hourly') NOT NULL DEFAULT 'monthly',
ADD COLUMN base_salary DECIMAL(10, 2),
ADD COLUMN hourly_rate DECIMAL(10, 2);

USE hrsystem;
CREATE TABLE leaves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  leave_type ENUM('Annual Leave', 'Sick Leave', 'Emergency Leave') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

USE hrsystem;
CREATE TABLE applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    applicant_name VARCHAR(100),
    email VARCHAR(100),
    resume_link TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
USE hrsystem;
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    status ENUM('Open', 'Closed') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
USE hrsystem;
ALTER TABLE jobs
ADD COLUMN job_description TEXT AFTER job_title;

-- Step 1: Add columns allowing NULL initially
ALTER TABLE payroll
ADD COLUMN month_num TINYINT UNSIGNED NULL AFTER STATUS,
ADD COLUMN year_num SMALLINT UNSIGNED NULL AFTER month_num;

-- Step 2: Update existing rows with default values (e.g., current month/year)
UPDATE payroll
SET 
    month_num = MONTH(CURRENT_DATE),
    year_num = YEAR(CURRENT_DATE);

-- Step 3: Modify columns to enforce NOT NULL
ALTER TABLE payroll
MODIFY COLUMN month_num TINYINT UNSIGNED NOT NULL,
MODIFY COLUMN year_num SMALLINT UNSIGNED NOT NULL;

-- Add admin image to users table manually
UPDATE hrsystem.users
SET profile_image = 'http://localhost:3000/uploads/121.jpg'
WHERE id = 3;
