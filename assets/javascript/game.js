import { words as INITIAL_WORDS } from './game_data.js';

export default function monkeyGame($container) {

    const $time = $container.querySelector("time");
    const $paragraph = $container.querySelector("p");
    const $input = $container.querySelector("input");

    const $game = document.querySelector("#game");
    const $results = document.querySelector("#results");
    const $wps = $results.querySelector(".wps span");
    const $accuracy = $results.querySelector(".accuracy span");
    const $button = $results.querySelector("button");

    const INITIAL_TIME = 30;

    let words = [];
    let currentTime = 0;

    initGame();
    initEvents();

    function initGame() {
        $game.classList.remove('hidden');
        $results.classList.add('hidden');
        $input.value = '';

        words = INITIAL_WORDS.toSorted(() => Math.random() - 0.5).slice(0, 48);
        currentTime = INITIAL_TIME;

        $time.textContent = currentTime;

        $paragraph.innerHTML = words.map(word =>
            `<c-word>
                ${word.split('')
                .map(letter => `<c-letter>${letter}</c-letter>`)
                .join('')}
            </c-word>`
        ).join(' ');

        const $firstWord = $paragraph.querySelector('c-word');
        $firstWord.classList.add('active');

        const $firstLetter = $firstWord.querySelector('c-letter');
        $firstLetter.classList.add('active');

        const intervalID = setInterval(() => {
            $time.textContent = --currentTime;

            if (currentTime === 0) {
                clearInterval(intervalID);
                gameOver();
            }
        }, 1000);
    }

    function initEvents() {

        document.addEventListener('keydown', () => {
            $input.focus();


        })

        $input.addEventListener('keyup', onKeyUp);
        $input.addEventListener('keydown', onKeyDown);
        $button.addEventListener('click', ()=>{initGame()});

    }

    function onKeyDown() {
        const $currentWord = $paragraph.querySelector('c-word.active');
        const $currentLetter = $currentWord.querySelector('c-letter.active');

        const { key } = event;

        if (key == ' ') {

            event.preventDefault();
            const $nextWord = $currentWord.nextElementSibling;
            const $nextLetter = $nextWord.querySelector('c-letter');

            $currentWord.classList.remove('active', 'wrong', 'correct');
            $currentLetter.classList.remove('active');

            $nextWord.classList.add('active');
            $nextLetter.classList.add('active');

            $input.value = '';

            const hasMissedLetters = $currentWord.querySelectorAll('c-letter:not(.correct)').length > 0;

            const classToAdd = hasMissedLetters ? 'wrong' : 'correct';
            $currentWord.classList.add(classToAdd);
            return;
        }

        if (key == 'Backspace') {
            const $prevWord = $currentWord.previousElementSibling;
            const $prevLetter = $currentLetter.previousElementSibling;

            if (!$prevWord && !$prevLetter) {
                event.preventDefault();
                return
            };

            const $wordMarked = $paragraph.querySelector('c-word.wrong');
            if (!$prevLetter && $wordMarked) {
                event.preventDefault();
                $prevWord.classList.remove('wrong');
                $prevWord.classList.add('active');

                const $letterToGo = $prevWord.querySelector('c-letter:last-child');

                $currentLetter.classList.remove('active');
                $letterToGo.classList.add('active');

                $input.value = [...$prevWord.querySelectorAll('c-letter.correct, c-letter.wrong')].map($el => $el.classList.contains('correct') ? $el.innerText : '*').join('');
            }
        }

    }
    function onKeyUp() {
        const $currentWord = $paragraph.querySelector('c-word.active');
        const $currentLetter = $currentWord.querySelector('c-letter.active');

        const currentWord = $currentWord.innerText.trim();

        $input.maxLength = currentWord.length;

        const $allLetters = $currentWord.querySelectorAll('c-letter');

        $allLetters.forEach($letter => $letter.classList.remove('correct', 'wrong'));

        $input.value.split('').forEach((char, index) => {
            const $letter = $allLetters[index];
            const letterToCheck = currentWord[index];

            const letterClass = char == letterToCheck ? 'correct' : 'wrong';

            $letter.classList.add(letterClass);
        });

        $currentLetter.classList.remove('active', 'is-last');

        const inputLength = $input.value.length;
        const $nextActiveLetter = $allLetters[inputLength];

        if ($nextActiveLetter)
            $nextActiveLetter.classList.add('active');
        else {
            $currentLetter.classList.add('active', 'is-last');
        }
    }

    function gameOver() {
        $game.classList.add('hidden');
        $results.classList.remove('hidden');

        const correctLetters = $paragraph.querySelectorAll('c-letter.correct').length;
        const wrongLetters = $paragraph.querySelectorAll('c-letter.wrong').length;

        const totalLetters = correctLetters - wrongLetters;

        const wps = totalLetters * 60 / INITIAL_TIME;

        const accuracy = totalLetters > 0 ?correctLetters / totalLetters * 100: 0;

        $wps.textContent = wps;
        $accuracy.textContent = `${accuracy.toFixed(2)}%`;

    }

}

