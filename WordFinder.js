import { wordBank } from './WordBank.js';
const playerLettersBtn = document.getElementById('player-letters-btn');
if (playerLettersBtn !== null) {
    playerLettersBtn.addEventListener('click', () => {
        const playerLettersElem = document.getElementById('player-letters');
        let playerLetters = [];
        if (playerLettersElem !== null) {
            playerLetters = Array.from(playerLettersElem.value.toLowerCase().replace(/\s/g, ''));
        }
        const playerLettersFiltered = playerLetters.filter((character) => character !== '*');
        const numberOfWilds = playerLetters.reduce((accumulator, character) => {
            if (character === '*') {
                accumulator = accumulator + 1;
            }
            return accumulator;
        }, 0);
        const matches = wordBank.reduce(findMatches(playerLettersFiltered, numberOfWilds), []);
        //console.log(matches);
        getPointValueForEachMatch(matches);
    }, false);
}
const findMatches = (playerLetters, numberOfWilds) => {
    // reduce callback function...
    return (matches, word) => {
        const wordLetters = Array.from(word);
        const wordLettersLength = wordLetters.length;
        let wordLetter = '';
        const playerLettersCopy = [...playerLetters];
        let numberOfWildsCopy = numberOfWilds;
        let numberOfMatchedLetters = 0;
        const wildCharacters = [];
        const matchedWordsObject = {
            word: '',
            wilds: [],
            value: 0
        };
        // using a 'for' loop instead of a 'forEach' so we can break with a 'return' based on conditions
        for (let i = 0; i < wordLettersLength; i++) {
            wordLetter = wordLetters[i];
            if (playerLettersCopy.length + numberOfMatchedLetters + numberOfWildsCopy >= wordLettersLength) {
                if (playerLettersCopy.includes(wordLetter)) {
                    // Letter exists. Remove letter from player letters and add to matched letters so it can't be compared again
                    playerLettersCopy.splice(playerLettersCopy.indexOf(wordLetter), 1);
                    numberOfMatchedLetters++;
                }
                else if (numberOfWildsCopy > 0) {
                    // letter does NOT exist, but we have a wild we can use for this letter of the word
                    numberOfWildsCopy--;
                    wildCharacters.push(wordLetter);
                    numberOfMatchedLetters++;
                }
                else {
                    // letter does NOT exist, and no wilds, move on to next word
                    return matches;
                }
            }
            else {
                // not enough player letters, move on to next word
                return matches;
            }
        }
        matchedWordsObject.word = word;
        matchedWordsObject.wilds = wildCharacters;
        matches.push(matchedWordsObject);
        return matches;
    };
};
const highlightWilds = (word, wilds) => {
    const arrayOfWordCharacters = Array.from(word);
    const wildsCopy = [...wilds];
    if (wildsCopy.length) {
        arrayOfWordCharacters.forEach((character, index) => {
            if (wildsCopy.includes(character)) {
                wildsCopy.splice(wildsCopy.indexOf(character), 1);
                arrayOfWordCharacters[index] = '<span class="wild-character">' + character + '</span>';
            }
        });
        return arrayOfWordCharacters.join('');
    }
    else {
        return word;
    }
};
const outputMatches = (matches) => {
    const wordListOfMatches = document.getElementById('word-list');
    const matchesTableBefore = '<table><caption>Matches</caption><tr><th scope="col">Word</th><th scope="col">Value<th></tr>';
    const matchesTableAfter = '</table>';
    const matchesSorted = [...matches];
    matchesSorted.sort((a, b) => b.value - a.value);
    const matchesOutput = matchesSorted.reduce((accumulator, matchObject) => accumulator + '<tr><td>' + highlightWilds(matchObject.word, matchObject.wilds) + '</td><td>' + matchObject.value + '</td></tr>', '');
    if (wordListOfMatches !== null) {
        wordListOfMatches.innerHTML = matchesTableBefore + matchesOutput + matchesTableAfter;
    }
};
const getPointValueForEachMatch = (matches) => {
    const letterValues = {
        "a": 1,
        "b": 3,
        "c": 3,
        "d": 2,
        "e": 1,
        "f": 4,
        "g": 2,
        "h": 4,
        "i": 1,
        "j": 8,
        "k": 5,
        "l": 1,
        "m": 3,
        "n": 1,
        "o": 1,
        "p": 3,
        "q": 10,
        "r": 1,
        "s": 1,
        "t": 1,
        "u": 1,
        "v": 4,
        "w": 4,
        "x": 8,
        "y": 4,
        "z": 10
    };
    matches.forEach((matchObject) => {
        const wildsCopy = [...matchObject.wilds];
        const pointValue = Array.from(matchObject.word)
            .filter((letter) => {
            // exclude wilds
            if (wildsCopy.includes(letter)) {
                wildsCopy.splice(wildsCopy.indexOf(letter), 1);
            }
            else {
                return true;
            }
        })
            .map((letter) => letterValues[letter])
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        matchObject.value = pointValue;
    });
    outputMatches(matches);
};
//# sourceMappingURL=WordFinder.js.map