CREATE DATABASE myGym;
USE myGym;
CREATE TABLE members (id INT AUTO_INCREMENT,firstname VARCHAR(100),lastname VARCHAR(100),email VARCHAR(100),hashedPassword VARCHAR(255), PRIMARY KEY(id));

CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myGym.* TO 'appuser'@'localhost';