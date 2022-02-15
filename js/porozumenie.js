import {domAndSpeechLoaded, speak} from './speak.js'
import {bindDatumNarodenia} from './datum_narodenia.js'
import {save, wordsForPorozumenie} from './storage.js'
import {words} from './words.js'

const answersCount = 5

let questionedItem = null

domAndSpeechLoaded(() => {
    bindDatumNarodenia()
    next()
})

function next() {
    randomWrong(answersCount).then(items => process(items))
}

function process(items) {
    if (items.length === answersCount) {
        questionedItem = items[Math.floor(Math.random() * answersCount)]
        renderInput(questionedItem)
        speak(questionedItem.word)
        renderAnswers(items)
        for (let el of document.getElementsByClassName('answer')) {
            el.addEventListener('click', () => {
                answerClicked(el.getAttribute('data-word'))
            })
        }
        document.onkeydown = (e) => {
            if (["Escape", "Esc", "Enter"].includes(e.key)) {
                console.log(`${e.key} pressed, giving up`)
                save(questionedItem.word, false, 'porozumenie').then(next)
            }
        }
    } else {
        document.getElementById('input').innerHTML = 'HOTOVO'
        document.getElementById('answers').innerText = ''
        document.onkeydown = () => {
        }
    }
}

function renderInput(item) {
    document.getElementById('input').innerHTML = item.word
}

function renderAnswers(items) {
    document.getElementById('answers').innerHTML = items.map(renderAnswer).join('\n')
}

function renderAnswer(item) {
    const content = item.image ? `<img src="${item.image}" alt="${item.description}" title="${item.description}" />` : item.description
    return `<td class="answer" data-word="${item.word}">${content}</td>`
}

function answerClicked(word) {
    if (questionedItem.word === word) {
        console.info(`Clicked correct: ${word}`)
        save(questionedItem.word, true, 'porozumenie').then(next)
    } else {
        console.info(`Clicked incorrect: ${word}. Expected: ${questionedItem.word}`)
        save(questionedItem.word, false, 'porozumenie').then(next)
    }
}

async function randomWrong(count) {
    const wordsArray = await wordsForPorozumenie()
    const items = words().filter(item => wordsArray.includes(item.word))
    return getRandom(items, Math.min(items.length, count))
}

function getRandom(arr, count) {
    let result = new Array(count), len = arr.length, taken = new Array(len);
    if (count > len) throw new RangeError("getRandom: more elements taken than available");
    while (count--) {
        let x = Math.floor(Math.random() * len);
        result[count] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
