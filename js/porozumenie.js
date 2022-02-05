import {words} from './words.js'
import {speak, domAndSpeechLoaded} from './speak.js'
import {bindDatumNarodenia} from './datum_narodenia.js'

const answersCount = 5

let wrong = []
let bezPorozumenia = []
let ibaPorozumenie = []

let questionedItem = null

domAndSpeechLoaded(() => {
    bindDatumNarodenia()
    load()
    saveAndNext()
})

function saveAndNext() {
    save()
    const items = randomWrong(answersCount)
    process(items)
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
                bezPorozumenia.push(questionedItem)
                wrong = wrong.filter(x => x.word !== questionedItem.word)
                saveAndNext()
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
        ibaPorozumenie.push(questionedItem)
    } else {
        console.info(`Clicked incorrect: ${word}. Expected: ${questionedItem.word}`)
        bezPorozumenia.push(questionedItem)
    }
    wrong = wrong.filter(x => x.word !== questionedItem.word)
    saveAndNext()
}

function randomWrong(count) {
    const arr = wrong.filter(item => !ibaPorozumenie.map(x => x.word).includes(item.word) && !bezPorozumenia.map(x => x.word).includes(item.word))
    return getRandom(arr, Math.min(arr.length, count))
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

function load() {
    const all = words()
    const wrongWords = localStorage.getItem("wrong")?.split(",") ?? []
    const bezPorozumeniaWords = localStorage.getItem("bezPorozumenia")?.split(",") ?? []
    const ibaPorozumenieWords = localStorage.getItem("ibaPorozumenie")?.split(",") ?? []
    wrong = all.filter(item => wrongWords.includes(item.word))
    bezPorozumenia = all.filter(item => bezPorozumeniaWords.includes(item.word))
    ibaPorozumenie = all.filter(item => ibaPorozumenieWords.includes(item.word))
    console.log(`Loaded ${wrong.length}, ${bezPorozumenia.length} bezPorozumenia, ${ibaPorozumenie.length} ibaPorozumenie`)
}

function save() {
    localStorage.setItem("bezPorozumenia", bezPorozumenia.map(item => item.word).join(","))
    localStorage.setItem("ibaPorozumenie", ibaPorozumenie.map(item => item.word).join(","))
}
