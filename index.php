<?php
ini_set("display_errors", 1);
$json = file_get_contents("./words.txt");
//print $json; die;
$data = json_decode($json);
$words = $data->words;
$rand = random_int(0,count($words)-1);
$word = $words[$rand];
?><html>
    <head>
        <title>Wordl</title>
        <meta property="og:title" content="More than one a day." />
        <meta property="og:description" content="Enjoying those word puzzles? Why settle for one a day?" />
        <meta property="og:image" content="https://jonathantweedy.com/stuff/wordl/sample1.png" />
        <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F915Y4W3CD"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-F915Y4W3CD');
        </script>
        <script src="./public/main.js"></script>
        <link rel="stylesheet" type="text/css" href="./public/main.css" />
    </head>
    <body>
    	<!--
    	<div id="debug"></div>
	    -->
    	<h2>Wordl</h2>
    	<p>
    		Start typing your 5-letter word guesses below.
    		<br >You'll get 6 chances!
    	</p>
    	<div id="wordl">
	    	<wordl-board id="wordl-board" init_word="<?php print $word; ?>" init_wordlength=5 init_chances=6></wordl-board>
    	</div>
    	<div id="keyboard"></div>
    	<div id="specialchar">
	    	Special Character?: 
	    	<input type="text" id="inputSpecialChar" />
	    	<button id="btnSpecialChar">&rarr;</button>
	    </div>
	    <div id="solution"></div>
	    <div>
	    	<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
<?php print $word; ?>

	    </div>
	</body>
</html>