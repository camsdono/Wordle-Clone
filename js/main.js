

document.addEventListener('DOMContentLoaded', () => {
    createSquares()

    const keys = document.querySelectorAll('.keyboard-row button')
    const guessedWords = [[]]
    word = ""

    $.get('new_words.txt', function(txt) {
        var lines = txt.split(',');
        var randLineNum = Math.floor(Math.random() * lines.length);
        word = lines[randLineNum].split('\n')[1]
        console.log(word)
    });

    

    let availableSpace = 1;
    
    let guessedWordCount = 0;

    

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1]
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr()

        if(getCurrentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter)

            const availableSpaceEl = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1

            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)

        if(!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPosition

        if(isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();

        const fireLetterId = guessedWordCount * 5 + 1;

        

        const interval = 125;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = fireLetterId + index;
                const letterEl = document.getElementById(letterId)
                letterEl.classList.add("animate__flipInX")
                letterEl.style = `background-color:${tileColor}; border-color:${tileColor}`;
            }, interval * index)
        });

        guessedWordCount += 1;

        if(currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
        }

        const currentWord = currentWordArr.join('')


        /*
       
        if (currentWord === word) {
            window.alert("Correct Word!")
        }

        */

        if(guessedWords.length === 6 && currentWord != word) {
            window.alert(`You have no more guesses / word is ${word}`)
        }

        guessedWords.push([])
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr()
        const removedLetter = currentWordArr.pop()

        guessedWords[guessedWords.length - 1] = currentWordArr

        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ""
        availableSpace = availableSpace - 1
    }

    function createSquares() {
        const gameBoard = document.getElementById('board')
        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div")
            square.classList.add('square')
            square.classList.add('animate__animated');
            square.setAttribute('id', index + 1)
            gameBoard.appendChild(square)
        }
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key")

            if (letter === "enter") {
                handleSubmitWord() 
                return;
            }
            

            else if(letter === "del") {
                handleDeleteLetter()
                return;
            }
            updateGuessedWords(letter);   
        }
    }
})