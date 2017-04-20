var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.post('/contract',function(req,res){

	console.log(req.body)

	res.render('index.html', { title: 'Express' });
	// alert("Your information is well received! Thank you")
})

module.exports = router;
