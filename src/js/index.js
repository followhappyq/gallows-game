const game = {
    width: 800,
    height: 600,
    ctx: undefined,
    cell: [],
    words: ['software','javascript','python','github','react','angular','ecmascript', 'documentation',
            'mongodb','bootstrap','semantic','junior','senior','developer','webdeveloper','linux'],
    running: true,
    gameStarted: false,
    sprites: {
        background: undefined,
        cell: undefined,        
        hangman0: undefined,
        hangman1: undefined,
        hangman2: undefined,
        hangman3: undefined,
        hangman4: undefined,            
        hangman5: undefined,
        hangman6: undefined      
    },sound: {
        wrong: document.getElementById('wrong')
    },
    word: undefined,
    stars: [],
    mistakes: 0,
    alphabet: [],
    letter: undefined,
    getLetter: undefined,
    menu: '\t \t \t \t PRESS SPACE',
    list: undefined,
    listener: [],
    init: function() {

        const canvas = document.getElementById('wisielec');
        this.ctx = canvas.getContext("2d");
        this.ctx.font = "15px PressStart";
        this.ctx.fillStyle = "#fff";

        window.addEventListener('keydown', e => {
            if(e.keyCode === 32) {
                this.gameStarted = true;
                this.letter = 'CHOOSE LETTER';
                this.run();            
            }
        });

        this.list = document.getElementById('alphabet');
        
    },
    load: function() {
        for(let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `./src/sprites/${key}.png`;      
                        
        }
       //API  
        const url =
                "https://newsapi.org/v2/top-headlines?" +
                "country=us&" +
                "apiKey=289e10225cda4d8db43998d869c78a27";

        const req = new Request(url);
            fetch(req).then(response => response.json().then(
                data => ({data: data,
                             status: response.status})
            )).then(res => {
                let news = res.data.articles.filter(news => {
                    return news.description != null;
                }).map(news => news.description);
                news = news[Math.floor(Math.random() * news.length)].split(' ');
                news = news.filter(elem => elem.length > 5);
                this.words = news;
            }).catch(console.log(''));              
    },
    create: function() {
        this.word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
        this.word = this.word.split('').filter(elem => {
            return elem.charCodeAt() >= 60 && elem.charCodeAt() <= 90;
        }).join('');

        console.log(this.word);

        //Add sprites on canvas
        for (let row = 0; row < this.word.length; row++) {
            this.cell.push({
                x: 46 * row + 46,
                width: 46,
                height: 42,
                isGuess: false
            });            
        }

        //Add * in cell
        for(key in this.word){
            this.stars.push('*');
        }

        //Add alphabet on canvas
        for (let letter = 0; letter < 26; letter++) {
            this.alphabet.push(String.fromCharCode(65+letter));
        }
        
        //Add alphabet on page
        for(key  in this.alphabet){
            this.list.innerHTML += `<li class="item">${this.alphabet[key]}</li>`
        }

        this.listener = document.getElementsByClassName("item");
    },
    eventListener: function(){
        for(let i = 0; i < 26; i++){
            this.listener[i].addEventListener('click',(e) => {
                this.letter = e.target.innerHTML;
            })
        }

    },
    start: function() {
        this.init();
        this.load();
        setTimeout(function(){
            game.create();
            game.eventListener();
            game.run();
        },1000);
        console.log('game start');
    },
    update: function() {
        if(this.gameStarted) {
            if(game.logick.checkLetters()) {
                game.logick.deleteLetterFromAlphabet(this.letter);
                game.logick.checkWord(this.letter);
                game.logick.deactivateLetter(this.letter);
            }
            if(this.mistakes === 6){
                game.logick.gameOver();
                this.running = false;
            }
        }
        if(this.stars.indexOf('*') === -1){
            this.menu = '\t \t \t \t You win!Press F5'
            this.gameStarted = false;
        }
    },
    render: function() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.drawImage(this.sprites.background, 0, 0);

        for(let i = 0; i < this.word.length; i++) {
            this.ctx.drawImage(this.sprites.cell,(this.sprites.cell.x + 45) + 46 * i, 500);
            this.ctx.fillText(this.stars[i], (this.sprites.cell.x + 60) + 46 * i, 528); 
        }

        if (!this.gameStarted) {
            this.ctx.fillText(this.menu, 200, 400);
        } else {
            this.ctx.fillText(`SELECTED LETTER: ${this.letter}`, 320 , 400);
        }
        
        this.ctx.drawImage(this.sprites[`hangman${this.mistakes}`], 0, 0);
        
        for(let i = 0; i < this.alphabet.length; i++) {
            this.ctx.fillText(this.alphabet[i],280 + 20 * i, 250);
        }

        this.ctx.fillText("Letters haven't yet been selected", 285, 200);
        this.ctx.fillText(`Mistakes: ${this.mistakes}`, 600, 50);

       
    },
    run: function() {
        setInterval(() => {
            this.update();
            this.render();
        },500);
    }
}

game.logick = {
    checkLetters: function() {
        if(game.alphabet.indexOf(game.letter) >= 0){
            return true;
        }
        return false;
    },
    deleteLetterFromAlphabet: function(letter) {
        game.alphabet = game.alphabet.filter((elem) => {
            return elem != letter;            
        });
    },
    checkWord: function(letter) {
        if(game.word.indexOf(letter) >= 0){
            let postion = [];
            for(let i = 0; i < game.word.length; i++){
                if(game.word[i] == letter){
                    postion.push(i);
                }
            }
            this.showLetter(postion);
        } else {
            game.mistakes++;
            game.sound.wrong.play();
        }        
    },
    showLetter: function(arr) {
        for(key in arr){
            game.stars[arr[key]] = game.letter;
        }
    },
    gameOver: function() {
        game.menu = `Game Over(Press F5) word: ${game.word}`;
        game.gameStarted = false;
    },
    deactivateLetter: function(letter) {
        for(key in game.listener){
            if(game.listener[key].innerHTML === game.letter) {
                game.listener[key].className = "deactivate";
            }
        }
    }
}

window.addEventListener("load", () => {
    game.start();
  });


