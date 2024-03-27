var express = require('express');
const passport = require('passport');
var router = express.Router();
var UserModel = require('./users');
const upload = require('./multer')

const localStrategy = require('passport-local');
const {request} = require('express');
passport.use(new localStrategy(UserModel.authenticate()))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{ error: req.flash('error') });
});

router.get('/newAccount', function (req, res, next) {
  res.render('register',{ error: req.flash('error') });
});

router.get('/profile',isLoggedIn,async function (req, res, next){
  var users = await UserModel.find()
  res.render('profile',{user:req.user,users});
})

router.post('/register',upload.single('file'), (req, res, next) => {
  var newUser = {
    //user data here
    username: req.body.username,
    number: req.body.number,
    picture: req.file ? req.file.filename : null
    //user data here
  };
  UserModel
    .register(newUser, req.body.password)
    .then((result) => {
      passport.authenticate('local')(req, res, () => {
        //destination after user register
        res.redirect('/profile');
      });
    })
    .catch((err) => {
      req.flash('error', err.message)
      res.redirect('/newAccount')
    });
});

router.post('/login', passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true,
}),function(req, res, next){});


function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/')
  }
}

router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/');
    });
  else {
    res.redirect('/');
  }
});

module.exports = router;
