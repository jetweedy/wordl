
function initRow(row) {
	var spaces = [];
	for (var c=0;c<row.$parent.wordlength;c++) {
		spaces.push({c:"letter",l:"?"});
	}
	Vue.set(row, 'spaces', spaces);
}



var wordlRow = Vue.component('wordl-row', {
  data: function () {
  	var spaces = [];
    return {
    	spaces:spaces
    	,
    	letters:[]
    }
  }
  ,
  template: "<div class='wordl_row'><span v-for='letter in spaces' :class='letter.c'>{{letter.l}}</span></div>"
})

var wordlBoard = Vue.component('wordl-board', {
	props: ['init_word', 'init_chances', 'init_wordlength'],
	data: function() {
		var ris = [];
		for (var c=0;c<this.init_chances;c++) {
			ris.push(c);
		}
		return {
			activeRow:0
			,
			lettersUsed:[]
			,
			chances: this.init_chances
			,
			wordlength: this.init_wordlength
			,
			word: this.init_word.toUpperCase().split("")
			,
			rows: ris
		}
	}
		,
		template: "<div><wordl-row v-for='row in rows' :key='row.i'></wordl-row></div>"
})











var WORDL;

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function charOK(c) {
	var ok = true;
//	if (!isLetter(c)) { ok = false; }
	return ok;
}

function endgame() {
	gameover = true;
	$("#solution").html("Solution: " + WORDL.$children[0].word.join(""));
	evaluateGuess = () => {
		console.log("Game over. Can't keep playing.");
	}
}

function nextrow(r) {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard._data.activeRow];
	if (r >= wboard._data.chances) {
		endgame();
	} else {
		Vue.set(wboard, 'activeRow', r);
		initRow(wboard.$children[r]);
	}
}


/*

	for (var s in spaces) {
		spaces[s].c = "letter";
		if (spaces[s].l==row.$parent.word[s]) {
			spaces[s].c += " match";
		} else if ( row.$parent.word.indexOf(spaces[s].l)>-1 ) {
			spaces[s].c += " present";
		}
	}


*/









function drawKeyboard() {
	$("#keyboard").html("");
	var qwerty = "QWERTYUIOP ASDFGHJKL >ZXCVBNM<";
	for (var a in qwerty) {
		var l = qwerty[a];
		if (l==" ") {
			var btn = $("<br>");
		} else if (l=="<") {
			var btn = $("<button>").html("&larr;").addClass("key special");
			btn.on("click", backspace);
		} else if (l==">") {
			var btn = $("<button>").html("Go").addClass("key special");			
			btn.on("click", evaluateGuess);
		}
		else {
			var btn = $("<button>").html(l).addClass("key");
			btn.on("click", function() {
				handleKeyEntry(this.l)
			}.bind({l:l}));
		}
		var wi = WORDL.$children[0].lettersUsed.indexOf(l);
		if (wi > -1)
			btn.addClass("used");
		$("#keyboard").append(btn);
	}
}


function evaluateGuess() {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard._data.activeRow];
	if (wrow._data.letters.length==wboard._data.wordlength) {
		var lettersUsed = wboard.lettersUsed;
		for (var l in wrow._data.letters) {
			var letter = wrow._data.letters[l];
			var c = "letter";
			if (letter.l==wboard.word[l]) {
				c += " match";
			} else if ( wboard.word.indexOf(letter.l)>-1 ) {
				c += " present";
			} else {
				lettersUsed.push(letter.l);				
			}
			Vue.set(wrow.spaces, l, {
				l: letter.l
				,
				c: c
			});
		}
		Vue.set(wboard, 'lettersUsed', lettersUsed);
		drawKeyboard();
		nextrow(wboard._data.activeRow+1);
	}
}















function updateRowSpaces(row) {
	// Create a copy, not a reference
	var spaces = [].concat(row.letters);
	for (var i=spaces.length;i<row.$parent.wordlength;i++) {
		spaces.push({l:"?",c:"letter empty"});
	}
	Vue.set(row, 'spaces', spaces);
}

var gameover = false;
function handleKeyEntry(l) {
	l = l.toUpperCase();
	if (!gameover) {
		var wboard = WORDL.$children[0];
		var wrow = wboard.$children[wboard.activeRow];
		if (wrow.letters.length < wboard.wordlength) {
			Vue.set(wrow.letters, wrow.letters.length, {
				l: l
				,
				c: "letter"
			});
		}
		updateRowSpaces(wrow);		
	}
}

function backspace() {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard._data.activeRow];
	var letters = wrow._data.letters;
	if (letters.length > 0)
		letters.pop();
	Vue.set(wrow, 'letters', letters);
	updateRowSpaces(wrow);
}


function handleSpecialChar(c) {
		if (charOK(c))
			handleKeyEntry(c);	
}
function handleKeyInput(e) {
		var c = String.fromCharCode(e.keyCode).toUpperCase();
		if (e.keyCode==8) {
			backspace();
		} else
		if (e.keyCode==13) {
			evaluateGuess();
		} else
		if (charOK(c)) {
			handleKeyEntry(c);	
		}
}



var startup = () => {

    WORDL = new Vue({
			el: '#wordl',
			data: {
			}
			,
			components: {
				wordlRow: wordlRow
				,
				wordlBoard: wordlBoard
			}
    });

  initRow(WORDL.$children[0].$children[0]);

//  var qwerty = "QWERTYUIOPASDFGHJKLZXCVBNM";

//// #jetweedy
//// Make mobile react to keypresses too...
//// How??
//  $("#keypad").on("change", function(e) {
//  	console.log("test");
//  	var s = $("#keypad").val();
//  	$("#debug").html("test");
//  });


/*
	$("#keypad").on("keypress", function(e) {
//		for (var i=0;i<10;i++)
//			handleKeyInput(8);
		$("#keypad").val(e.keyCode);
	});
	$("#keypad").focus();
*/

	$(window).on("keyup", (e) => {
		if (!$("#inputSpecialChar").is(":focus")) {
				handleKeyInput(e);
		}
	});

	drawKeyboard();

	$("#btnSpecialChar").on("click", () => {
		var v = $("#inputSpecialChar").val();
		if (v.length==1) {
			handleKeyEntry(v);
		}
	})

	$(window).on("dblclick", function(e) {
		e.preventDefault();
	})

}

$(window).on("load", () => {
	setTimeout(startup, 200);	
})

