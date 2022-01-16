
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
const fs = require('fs');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const server = express()
	.set('view engine', 'ejs')
	.use('/public', express.static('public'))
	.use(express.urlencoded({extended:true}))
	.get('/getwords', function(req, res) {
		var words = [];
		var listtext = fs.readFileSync("vocab.txt", 'utf8');
		var listrows = listtext.split("\n");
		for (var lr in listrows) {
			var bits = listrows[lr].split("\t");
			if (bits[0].length==5) {
				words.push(bits[0]);
			}
			if (words.length >= 500) {
				break;
			}
		}
		res.json({l:words.length, words:words});
	})
	.get('/', function(req, res){
		var listtext = fs.readFileSync("words.txt", 'utf8');
		var list = JSON.parse(listtext);
		var rand = getRandomInt(list.length-1);
		res.render('index', {word:list[rand]});
	})
	.listen(PORT, () => console.log("Listening on PORT " + PORT))
	;



