module.exports = function(app, gymData) {
    const { check, validationResult } = require ('express-validator');
    const bcrypt = require('bcrypt');
    const redirectLogin = (req, res, next) => {
      if (!req.session.memberID) {
        res.redirect('./login')
      } else { next (); }
    }

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
        let newrecord = [req.sanitize(req.body.username), req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), req.sanitize(hashedPassword)];
        // execute sql query
        let sqlquery = "INSERT INTO users (`username`, first_name, last_name, `email`, `hashedPassword`) VALUES (?,?,?,?,?)";
        db.query(sqlquery, newrecord, (err, result) => {
        //if it fails
          if (err) {
            return console.error(err.message);
          }          
          result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We will send a confirmation email to you at ' + req.body.email;
          result += ' Your password is ' + plainPassword + ' and your hashed password is ' + hashedPassword + '<a href='+'./'+'>Home</a>';
          res.send(result);
          });
        })    
      }                                                        
  });

  app.get('/login', function (req,res) {
    res.render('login.ejs', gymData);                                                                     
  }); 

  app.post('/loggedin', function (req,res) {
    let newrecord = [req.sanitize(req.body.username)]
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?"      
    db.query(sqlquery, newrecord, (err, result) => {
      if(err) {
        return console.error(err.message);
      }
      else {
        console.error("logged in")

        hashedPassword = result[0].hashedPassword;
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
          if(err) {
            return console.error(err.message);
          }
          else if (result == true) {
            //save user session here, when login is successful
            req.session.userID = req.body.username;
            //res.send('You are now logged in! <a href='+'./'+'>Home</a>');
            res.send('Welcome ' + req.body.username + '. You are now logged in! <a href='+'./'+'>Home</a>');
          }
          else {
            res.send('You have entered an incorrect, please try again');
          }
        });
      }
    });
  });

  app.get('/logout',  (req,res) => {  //redirectLogin, for some reason this prevents the user from logging out
    req.session.destroy(err => {
      if (err) {
        return res.redirect('./')
      }
      console.error("logged out")
      res.send('You are now logged out. <a href='+'./'+'>Home</a>');
    });
  });

}