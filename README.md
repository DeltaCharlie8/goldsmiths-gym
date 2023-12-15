To create this web application you can run the script below

CREATE DATABASE myGym;
USE myGym;
CREATE TABLE members (members_id INT AUTO_INCREMENT PRIMARY KEY,firstname VARCHAR(100),lastname VARCHAR(100),email VARCHAR(100),hashedPassword VARCHAR(255));

CREATE TABLE gymClasses (classes_id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(50),day VARCHAR(20),start TIME,end TIME,trainer VARCHAR(50),price DECIMAL(8, 2),spaces INT DEFAULT 30);

INSERT INTO gymClasses (name, day, start, end, trainer, price, spaces)
VALUES 
    ('Spinning/Cycling Class', 'Monday', TIME_FORMAT('09:00', '%H:%i'), TIME_FORMAT('10:00', '%H:%i'), 'Biniam Girmay', 15.99, 30),
    ('Spinning/Cycling Class', 'Wednesday', TIME_FORMAT('09:00', '%H:%i'), TIME_FORMAT('10:00', '%H:%i'), 'Biniam Girmay', 15.99, 30),
    ('Spinning/Cycling Class', 'Friday', TIME_FORMAT('19:00', '%H:%i'), TIME_FORMAT('20:00', '%H:%i'), 'Biniam Girmay', 15.99, 30),
    ('Yoga Class', 'Tuesday', TIME_FORMAT('19:00', '%H:%i'), TIME_FORMAT('20:00', '%H:%i'), 'Rosa Parks', 12.50, 30),
    ('Yoga Class', 'Thursday', TIME_FORMAT('19:00', '%H:%i'), TIME_FORMAT('20:00', '%H:%i'), 'Rosa Parks', 12.50, 30),
    ('Yoga Class', 'Saturday', TIME_FORMAT('11:00', '%H:%i'), TIME_FORMAT('12:00', '%H:%i'), 'Rosa Parks', 12.50, 30),
    ('HIIT Class', 'Monday', TIME_FORMAT('18:30', '%H:%i'), TIME_FORMAT('19:30', '%H:%i'), 'Derrick Evans', 18.75, 30),
    ('HIIT Class', 'Wednesday', TIME_FORMAT('18:30', '%H:%i'), TIME_FORMAT('19:30', '%H:%i'), 'Derrick Evans', 18.75, 30),
    ('HIIT Class', 'Friday', TIME_FORMAT('18:30', '%H:%i'), TIME_FORMAT('19:30', '%H:%i'), 'Derrick Evans', 18.75, 30),
    ('Zumba/Dance Fitness Class', 'Tuesday', TIME_FORMAT('18:30', '%H:%i'), TIME_FORMAT('19:30', '%H:%i'), 'Debbie ALlen', 14.00, 30),
    ('Zumba/Dance Fitness Class', 'Thursday', TIME_FORMAT('18:30', '%H:%i'), TIME_FORMAT('19:30', '%H:%i'), 'Debbie ALlen', 14.00, 30),
    ('Zumba/Dance Fitness Class', 'Saturday', TIME_FORMAT('18:30', '%H:%i'), TIME_FORMAT('19:30', '%H:%i'), 'Debbie ALlen', 14.00, 30),
    ('Strength Training/Weightlifting Class', 'Monday', TIME_FORMAT('11:30', '%H:%i'), TIME_FORMAT('12:30', '%H:%i'), 'Terry Crews', 20.00, 30),
    ('Strength Training/Weightlifting Class', 'Wednesday', TIME_FORMAT('15:30', '%H:%i'), TIME_FORMAT('16:30', '%H:%i'), 'Terry Crews', 20.00, 30),
    ('Strength Training/Weightlifting Class', 'Friday', TIME_FORMAT('19:30', '%H:%i'), TIME_FORMAT('20:30', '%H:%i'), 'Terry Crews', 20.00, 30);

You should then be able to register a user, and access all the pages in the application and book onto a class.
A profile page has not yet been created, so you cannot see what classes the user has been booked on, but this is a feature to been added.
