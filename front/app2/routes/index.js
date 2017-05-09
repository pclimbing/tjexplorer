var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard-1-2.html', { title: 'Express' });
});

router.get('/dashboard-1.html', function(req, res, next) {
  res.render('dashboard-1-2.html', { title: 'Express' });
});

router.get('/dashboard-2.html', function(req, res, next) {
  res.render('dashboard-2.html', { title: 'Express' });
});


module.exports = router;
