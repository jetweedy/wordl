

var wordlRow = Vue.component('wordl-row', {
  data: function () {
    return {
    	spaces:[]
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

function gameover() {
	evaluateGuess = () => {
		console.log("Game over. Can't keep playing.");
	}
}

function nextrow(r) {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard._data.activeRow];
	if (r >= wboard._data.chances) {
		gameover();
	} else {
		Vue.set(wboard, 'activeRow', r);
	}
}

function evaluateGuess() {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard._data.activeRow];
	if (wrow._data.letters.length==wboard._data.wordlength) {
		for (var l in wrow._data.letters) {
			var letter = wrow._data.letters[l].l;
			console.log(l, letter);
			var c = "normal";
			c = "letter";
			if (letter==wboard._data.word[l]) {
				c += " match";
			} else {
				if (wboard._data.word.indexOf(letter)>-1) {
					c += " present"
				}
			}
			Vue.set(wrow.letters, l, {
				l: letter
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

function handleKeyEntry(l) {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard.activeRow];
	if (wrow.letters.length < wboard.wordlength) {
		Vue.set(wrow.letters, wrow.letters.length, {
			l: l
			,
			c: "letter"
		});
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



$(window).on("load", () => {

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

	$(window).on("keyup", (e) => {
		var c = String.fromCharCode(e.keyCode).toUpperCase();
		if (e.keyCode==8)
			backspace();
		if (e.keyCode==13)
			evaluateGuess();
		if (charOK(c))
			handleKeyEntry(c);
	});

	$("#keypad").focus();

})

