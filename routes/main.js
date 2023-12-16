module.exports = function(app, gymData) {
  const redirectLogin = (req, res, next) => {
    if (!req.session.memberID) {
      res.redirect('./login'); 
    } else { next(); }
  };   
  const { check, validationResult } = require ('express-validator');
  const bcrypt = require('bcrypt'); 

  //Handle our routes
  app.get('/',function(req,res){
      res.render('index.ejs', gymData)
  });

  app.get('/about',function(req,res){
      res.render('about.ejs', gymData);
  });

  app.get('/register', function (req,res) {
    res.render('register.ejs', gymData);                                                                     
  }); 

  app.post('/registered', [
    check('email').isEmail(),
    check('password').isLength({ min: 8 })
  ], function (req,res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation Errors:", errors.array());
        res.redirect('./register'); }
      else {
        const saltRounds = 10;
        const plainPassword = req.body.password;
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){
        //saving username and password in database
          if (err) {
            return console.error(err.message);
          }
        let newrecord = [req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), req.sanitize(hashedPassword)];
        // execute sql query
        let sqlquery = "INSERT INTO members (firstname, lastname, `email`, `hashedPassword`) VALUES (?,?,?,?)";
        db.query(sqlquery, newrecord, (err, result) => {
        //if it fails
          if (err) {
            return console.error(err.message);
          }          
          result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We will send a confirmation email to you at ' + req.body.email;
          result += '<a href='+'./'+'>Home</a>';
          res.send(result);
          });
        })    
      }                                                        
  });

  app.get('/login', function (req,res) {
    res.render('login.ejs', gymData);                                                                     
  }); 

  app.post('/loggedin', function (req,res) {
    let newrecord = [req.sanitize(req.body.name)]
    let sqlquery = "SELECT hashedPassword FROM members WHERE firstname = ?";
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).send('Internal server error. Please try again later. <a href='+'./'+'>Home</a>');
      } else {
        if (!result || !result[0] || !result[0].hashedPassword) {
          console.error('No user found or incorrect query result.');
          res.status(401).send('That name is not recognised, please try again. <a href='+'./login'+'>Return</a>');
        } else {
            const hashedPassword = result[0].hashedPassword;
            bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
              if (err) {
                console.error('bcrypt error:', err.message);
                res.status(500).send('Internal server error. Please try again later.<a href='+'./'+'>Home</a>');
              } else if (result === true) {
                //save user session here, when login is successful
                  req.session.memberID = req.body.name;
                  console.log("logged in")
                  res.send('Welcome ' + req.body.name + '. You are now logged in! <a href='+'./'+'>Home</a>');
              } else {
                console.log('Incorrect password');
                res.status(401).send('You have entered an incorrect password, please try again. <a href='+'./login'+'>Return</a>');
              }
          });
        }
      }
    });
  });

  app.get('/logout', redirectLogin, (req,res) => { 
    req.session.destroy(err => {
      if (err) {
        return res.redirect('./');
      }
      console.error("logged out")
      res.send('You are now logged out. <a href='+'./'+'>Home</a>');
    });
  });

  app.get('/classes', function(req, res) {
    let sqlquery = "SELECT * FROM gymClasses"; // query database to get all the classes available
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            res.redirect('./'); 
        }
        let newData = Object.assign({}, gymData, {availableClasses:result});
        console.log(newData)
        res.render("classes.ejs", newData)
    });
  });

  app.get('/search',function(req,res){
    res.render("search.ejs", gymData);
  });

  app.get('/search-result', function (req, res) {
    //searching in the database
    let sqlquery = "SELECT * FROM gymClasses WHERE name LIKE '%" + req.sanitize(req.query.keyword) + "%'"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            res.redirect('./'); 
        }
        let newData = Object.assign({}, gymData, {availableClasses:result});
        console.log(newData)
        res.render("classes.ejs", newData)
     });        
  });

  app.get('/bookings', redirectLogin, function(req, res) {
    let sqlQuery = "SELECT * FROM gymClasses"; //get all the classes from the database
    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect('/'); 
      }
      //creates a list of the classes available to book
      res.render('bookings.ejs', {gymName: 'Goldsmiths Gym', gymClasses: result});
    });
  });

  app.post('/booked', function (req, res) {
    // Get data from the bookings form
    let { selectedClassId, first, last } = req.body;
    if (!selectedClassId || !first || !last) {
        res.redirect('/bookings');
        return;
    }
    // Update the database to reduce spaces available
    let sqlUpdateQuery = 'UPDATE gymClasses SET spaces = spaces - 1 WHERE classes_id = ? AND spaces > 0';
    db.query(sqlUpdateQuery, [selectedClassId], (err, result) => {
        if (err) {
            console.error('Error updating spaces:', err);
            res.redirect('/bookings');
            return;
        }
        //finds the class name that has been selected in the bookings form
        let sqlClassName = "SELECT name, day, start FROM gymClasses WHERE classes_id = ?";
        db.query(sqlClassName, [selectedClassId], (err, result) => {
            if (err) {
                console.error(err);
                res.redirect('/bookings');
                return;
            }
            let newrecord = result[0];
            // Send confirmation message
            res.send('You are now booked on to ' + newrecord.name + ' on ' + newrecord.day + ' at ' + newrecord.start + '. We look forward to welcoming you! <a href="./">Home</a>');
        });
    });
  });

  app.get('/weather', function(req, res) {
    res.render('weather.ejs', gymData);
  });

  app.post('/weather', function(req, res) {
    const request = require('request');          
      let apiKey = '1ce2ff03743b33be460a8b285c80fffc';
      let city = req.body.city; //retrieves the city from the form input
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`             
      request(url, function (err, response, body) {
        if(err){
          console.log('error:', err);
        } else {
          // res.send(body);
          var weather = JSON.parse(body)
          if (weather !== undefined && weather.main !== undefined){
            var wmsg = 'It is '+ weather.main.temp + 
            ' degrees in '+ weather.name +
            '! <br> The humidity now is: ' + weather.main.humidity + 
            ' <br> The wind speed is: ' + weather.wind.speed + 'mph <br><a href='+'./'+'>Home</a>';
            res.send (wmsg);
          }
          else {
            res.send ('No data found! <a href='+'./'+'>Home</a>')
          }
        } 
      });
  });

}