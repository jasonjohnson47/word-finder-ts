import { wordBank } from './WordBank.js';

// Loop through every word in the word bank
// For every word, check to see if every letter of that word exists in the player's letters. If it does, add that word to the list of matches
// Try every letter that isn't an asterisk first. If the letter in the word isn't one of the normal letters in the player's letters, use the asterisk as the matched letter
// If there are no wilds (asterisks), as soon as one of the letters in the word does not exist in the player's letters, stop and move on to the next word.
// Get the length of the word. Compare the length to the number of player letters. If the word is too long, stop and test the next word.

interface Match {
    word: string;
    wilds: string[];
    value: number;
}

const playerLettersBtn = document.getElementById('player-letters-btn');

if (playerLettersBtn !== null) {

    playerLettersBtn.addEventListener('click', () => {

        const playerLettersElem = document.getElementById('player-letters') as HTMLInputElement;
        let playerLetters: string[] = [];

        if (playerLettersElem !== null) {
            playerLetters = Array.from(playerLettersElem.value.toLowerCase().replace(/\s/g,''));
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

const findMatches = (playerLetters: string[], numberOfWilds: number) => {
    // reduce callback function...
    return (matches: Match[], word: string): Match[] => {

        const wordLetters: string[] = Array.from(word);
        const wordLettersLength: number = wordLetters.length;
        let wordLetter: string = '';
        const playerLettersCopy: string[] = [...playerLetters];
        let numberOfWildsCopy:number = numberOfWilds;
        let numberOfMatchedLetters: number = 0;
        const wildCharacters: string[] = [];
        const matchedWordsObject: Match = {
            word: '',
            wilds: [],
            value: 0
        };

        // using a 'for' loop instead of a 'forEach' so we can break with a 'return' based on conditions
        for(let i = 0; i < wordLettersLength; i++) {

            wordLetter = wordLetters[i];

            if (playerLettersCopy.length + numberOfMatchedLetters + numberOfWildsCopy >= wordLettersLength) {
                if (playerLettersCopy.includes(wordLetter)) {
                    // Letter exists. Remove letter from player letters and add to matched letters so it can't be compared again
                    playerLettersCopy.splice(playerLettersCopy.indexOf(wordLetter), 1);
                    numberOfMatchedLetters++;
                } else if (numberOfWildsCopy > 0) {
                    // letter does NOT exist, but we have a wild we can use for this letter of the word
                    numberOfWildsCopy--;
                    wildCharacters.push(wordLetter);
                    numberOfMatchedLetters++;
                } else {
                    // letter does NOT exist, and no wilds, move on to next word
                    return matches;
                }
            } else {
                // not enough player letters, move on to next word
                return matches;
            }
        
        }

        matchedWordsObject.word = word;
        matchedWordsObject.wilds = wildCharacters;
        matches.push(matchedWordsObject);
        return matches;

    };
}

const highlightWilds = (word: string, wilds: string[]): string => {

    const arrayOfWordCharacters: string[] = Array.from(word);
    const wildsCopy: string[] = [...wilds];

    if (wildsCopy.length) {
        arrayOfWordCharacters.forEach((character: string, index: number): void => {
            if (wildsCopy.includes(character)) {
                wildsCopy.splice(wildsCopy.indexOf(character), 1);
                arrayOfWordCharacters[index] = '<span class="wild-character">' + character + '</span>';
            }
        });
        return arrayOfWordCharacters.join('');
    } else {
        return word;
    }
}

const outputMatches = (matches: Match[]) => {

    const wordListOfMatches = document.getElementById('word-list');
    const matchesTableBefore: string = '<table><caption>Matches</caption><tr><th scope="col">Word</th><th scope="col">Value<th></tr>';
    const matchesTableAfter: string = '</table>';
    const matchesSorted: Match[] = [...matches];

    matchesSorted.sort((a, b): number => b.value - a.value);

    const matchesOutput: string = matchesSorted.reduce(
        (accumulator: string, matchObject: Match): string =>
            accumulator + '<tr><td>' + highlightWilds(matchObject.word, matchObject.wilds) + '</td><td>' + matchObject.value + '</td></tr>', ''
    );

    if (wordListOfMatches !== null) {
        wordListOfMatches.innerHTML = matchesTableBefore + matchesOutput + matchesTableAfter;
    }
    
}

const getPointValueForEachMatch = (matches: Match[]): void => {

    interface LetterValues {
        [propName: string]: number;
    }

    const letterValues: LetterValues = {
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

    matches.forEach((matchObject: Match): void => {

        const wildsCopy: string[] = [...matchObject.wilds];

        const pointValue: number = Array.from(matchObject.word)
        .filter((letter: string): true | undefined => {
            // exclude wilds
            if (wildsCopy.includes(letter)) {
                wildsCopy.splice(wildsCopy.indexOf(letter), 1);
            } else {
                return true;
            }
        })
        .map((letter: string): number => letterValues[letter])
        .reduce((accumulator: number, currentValue: number): number => accumulator + currentValue, 0);
        
        matchObject.value = pointValue;
    });
    outputMatches(matches);
}