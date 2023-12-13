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

}