
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

function charOK(c) {
	var ok = true;
	if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) < 0) {
		ok = false;
	}
	return ok;
}

function endgame() {
	gameover = true;
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





function evaluateGuess() {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard._data.activeRow];
	if (wrow._data.letters.length==wboard._data.wordlength) {
		for (var l in wrow._data.letters) {
			var letter = wrow._data.letters[l];

			var c = "letter";
			if (letter.l==wboard.word[l]) {
				c += " match";
			} else if ( wboard.word.indexOf(letter.l)>-1 ) {
				c += " present";
			}

			console.log(letter.l);
			console.log(wboard.word);
			console.log("class", c);

			Vue.set(wrow.spaces, l, {
				l: letter.l
				,
				c: c
			});

		}
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


function handleKeyInput(e) {
		var c = String.fromCharCode(e.keyCode).toUpperCase();
		if (e.keyCode==8)
			backspace();
		if (e.keyCode==13)
			evaluateGuess();
		if (charOK(c))
			handleKeyEntry(c);	
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


	$("#keypad").on("keyup input", function(e) {
		handleKeyInput(e);
		$("#keypad").val("");
	});
	$("#keypad").focus();

	$(window).on("keyup", (e) => {
		if (!$("#keypad").is(":focus"))
			handleKeyInput(e);
	});

}

$(window).on("load", () => {
	setTimeout(startup, 200);	
})

