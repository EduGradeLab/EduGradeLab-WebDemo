-- Create database if not exists
CREATE DATABASE IF NOT EXISTS exam_ai_demo;
USE exam_ai_demo;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_demo_user BOOLEAN DEFAULT TRUE
);

-- Create exam_images table
CREATE TABLE IF NOT EXISTS exam_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filetype VARCHAR(50) NOT NULL,
    image_blob LONGBLOB NOT NULL,
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('UPLOADED', 'PROCESSING', 'COMPLETED', 'ERROR') DEFAULT 'UPLOADED',
    error_message TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create ocr_jobs table
CREATE TABLE IF NOT EXISTS ocr_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exam_image_id INT UNIQUE NOT NULL,
    status ENUM('WAITING', 'PROCESSING', 'DONE', 'ERROR') DEFAULT 'WAITING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_image_id) REFERENCES exam_images(id) ON DELETE CASCADE
);

-- Create ocr_results table
CREATE TABLE IF NOT EXISTS ocr_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT UNIQUE NOT NULL,
    exam_image_id INT NOT NULL,
    ocr_text LONGTEXT,
    ai_analysis JSON,
    processing_time_ms INT,
    processed_at TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES ocr_jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_image_id) REFERENCES exam_images(id) ON DELETE CASCADE
);

-- Create job_logs table
CREATE TABLE IF NOT EXISTS job_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    level ENUM('INFO', 'WARNING', 'ERROR') DEFAULT 'INFO',
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES ocr_jobs(id) ON DELETE CASCADE
);

-- Create demo_emails table
CREATE TABLE IF NOT EXISTS demo_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY (email)
);

-- Create indexes for better performance
CREATE INDEX idx_exam_images_user_id ON exam_images(user_id);
CREATE INDEX idx_exam_images_upload_time ON exam_images(upload_time);
CREATE INDEX idx_ocr_jobs_user_id ON ocr_jobs(user_id);
CREATE INDEX idx_ocr_jobs_status ON ocr_jobs(status);
CREATE INDEX idx_ocr_jobs_created_at ON ocr_jobs(created_at);
CREATE INDEX idx_job_logs_job_id ON job_logs(job_id);
CREATE INDEX idx_job_logs_created_at ON job_logs(created_at);
CREATE INDEX idx_demo_emails_email ON demo_emails(email);