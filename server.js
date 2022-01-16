
//// Initiatlize an NPM project and Require a few more libraries that will require installation:
/*
npm init -y
npm install dotenv
npm install express
npm install ejs
*/

require('dotenv').config()

const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3000;

const server = express()
	.set('view engine', 'ejs')
	.use('/public', express.static('public'))
	.use(express.urlencoded({extended:true}))
	.get('/', function(req, res){
		/*
		Pick word from dictionary as 'word' and fill in below
		*/
		res.render('index', {word:'wordl'});
	})
	.listen(PORT, () => console.log("Listening on PORT " + PORT))
	;



