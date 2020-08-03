const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./mysql.js');
const app = express();
const port = 8080;
// const {genSaltSync, hashSync, compareSync} = require("bcrypt");



  app.set('view engine', 'ejs');
  app.use(express.static('public'));
  app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/', function(req, res) {
    res.render('login.ejs');
  });

  app.get('/register', function(req, res) {
    res.render('register.ejs');
  });


  app.get('/user', function(request, response) {
    if (request.session.loggedin) {
      response.send('Welcome,' + request.session.email + '!');
    } else {
      response.send('Please login to view this page!');
    }
    response.end();
  });


  app.get('/lokasi', function(req, res) {
    res.render('lokasi.ejs');
  });

  app.get('/about', function(req, res) {
    res.render('about.ejs');
  });

  app.get('/kontak', function(req, res) {
    res.render('kontak.ejs');
  });

  app.post('/authlogin', function(req,res) {
    var email = req.body.email;
    // body.password = hashSync(body.password, salt);
    var password = req.body.password;
    const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
    if(email && password) {
      db.query(sql, [email, password], function(err, rows) {
        if (err) throw err;
        else if (rows.length > 0){
          req.session.loggedin = true;
          req.session.email = email;
          res.redirect('/home');
        } else {
          res.end('Kredensial Anda Salah!');
        }
      });
    }
  });


  app.post('/auth_register', function(req, res) {
    var register_data = {
      email: req.body.email,
      password: req.body.password,
      nama_user: req.body.nama_user
    };

    db.query('INSERT INTO user SET ?', register_data, function(err,results) {
      if (err) throw err;
      else {
        console.log('Data Masuk!', results);
        res.redirect('/');
      }
    });
  });


  app.get('/home', function(req, res) {
    if (req.session.loggedin) {
      res.render('home.ejs');
    } else {
      res.end('Silahkan login dulu');
    }
  });



  app.get('/logout', function(req, res) {
    if (req.session.loggedin === true) {
      req.session.loggedin = false;
      res.redirect('/');
    }
    res.end();
  });


  app.listen(port, function() {
    console.log(`Server di ${port}`);
  });
