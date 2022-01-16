

var wordlRow = Vue.component('wordl-row', {
  data: function () {
    return {
    	word: this.$parent.word
    	,
    	letters:[]
    }
  }
  ,
  template: "<div class='wordl_row'><span v-for='letter in letters' class='letter'>{{letter}}</span></div>"
})

var wordlBoard = Vue.component('wordl-board', {
	props: ['init_word', 'init_chances', 'init_wordlength'],
	data: function() {
		var ris = [];
		for (var c=0;c<this.init_chances;c++) {
			ris.push(c);
		}
		console.log("ris", ris);
		return {
			activeRow:0
			,
			chances: this.init_chances
			,
			wordlength: this.init_wordlength
			,
			word: this.init_word.split()
			,
			rows: ris
		}
	}
		,
		template: "<div class='wordl-board'><wordl-row v-for='row in rows' class='wordl-board' :key='row.i'></wordl-row></div>"
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
		nextrow(wboard._data.activeRow+1);
	}

}

function handleKeyEntry(c) {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard._data.activeRow];
	if (wrow.letters.length < wboard._data.wordlength) {
		Vue.set(wrow.letters, wrow.letters.length, c);
	}
}

function backspace() {
	var wboard = WORDL.$children[0];
	var wrow = wboard.$children[wboard._data.activeRow];
	var letters = wrow._data.letters;
	if (letters.length > 0)
		letters.pop();
	Vue.set(wrow, 'letters', letters);
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

})

