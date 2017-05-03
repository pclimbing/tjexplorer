'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var c=require('./config.js')
var util = require('util');
var mysql      = require('mysql');

var connection = mysql.createConnection(c.mysql_path)
// var connection = mysql.createConnection({
//   host     : '127.0.0.1',
//   user     : 'root',
//   password : '123456',
//   database : 'test1'
// });
// connection.connect();
// connection.query('SELECT * from Blockinfo1', function(err, rows, fields) {
//   if (err) throw err;
//   //console.log('The solution is: ', rows[0].solution);
//   console.log(rows)
// });
// connection.end();

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
	daily_blocks_height : daily_blocks_height
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function daily_blocks_height(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  // var name = req.swagger.params.name.value || 'stranger';
  //var hello = util.format('Blocks: 9');
  //onnection.connect();
  connection.query('SELECT day , AVG(number) AS avgHeight FROM ( SELECT  LEFT(timestamp,10) AS day, number AS number FROM transactions) as daytable group by day',
   function(err, rows, fields) {
      if (err) throw err;
    //console.log('The solution is: ', rows[0].solution);
      // console.log(rows)
  	  for(var j = 0; j < rows.length; j++) {
  		  var a = []
  		  for(var x in rows[j]){
  			  a.push(rows[j][x])
  		  }
    		rows[j]=a
  	  } 
      res.json(rows.join('|'));

  });
  //onnection.end();
  // this sends back a JSON response which is a single string
  // res.json("9");
}
