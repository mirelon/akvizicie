import { words } from './words.js'

let available = []
let wrong = []
let correct = []

$(function(){
    if (document.getElementById('input')) {
        load()
        saveAndNext()
    }
})

function saveAndNext() {
    save()
    const item = randomAvailable()
    process(item)
}

function process(item) {
    if (item)
    {
        document.getElementById('input').innerHTML = render(item)
        document.getElementById('answer').value = ''
        document.getElementById('answer').focus()
        document.getElementById('answer').oninput = (e) => {
            console.log(`${e.target.value}`)
            if (check(e.target.value, item.word)) {
                console.log('correct')
                correct.push(item)
                available = available.filter(x => x.word !== item.word)
                saveAndNext()
            }
        }
        document.onkeydown = (e) => {
            if (["Escape", "Esc", "Enter"].includes(e.key)) {
                console.log(`${e.key} pressed, giving up`)
                wrong.push(item)
                available = available.filter(x => x.word !== item.word)
                saveAndNext()
            }
        }
    } else {
        document.getElementById('input').innerHTML = `Hotovo, pokračujte na <a href="porozumenie.html">porozumenie</a>`
        document.getElementById('answer').value = ''
        document.getElementById('answer').oninput = () => {}
        document.onkeydown = () => {}
    }
}

function render(item) {
    if (item.image) {
        return `<img src="${item.image}" alt="${item.description}" title="${item.description}" />`
    } else {
        return `<span>${item.description}</span>`
    }
}

function randomAvailable() {
    if (available.length > 1)
        return available[Math.floor(Math.random()*available.length)]
    else if (available.length === 1)
        return available[0]
    else
        return null
}

function load() {
    const all = words()
    const correctWords = localStorage.getItem("correct")?.split(",") ?? []
    correct = all.filter(item => correctWords.includes(item.word))
    const wrongWords = localStorage.getItem("wrong")?.split(",") ?? []
    wrong = all.filter(item => wrongWords.includes(item.word))
    available = all.filter(item => !correctWords.includes(item.word) && !wrongWords.includes(item.word))
    console.log(`Loaded ${correct.length} correct, ${wrong.length} wrong, ${available.length} available`)
}

function save() {
    localStorage.setItem("correct", correct.map(item => item.word).join(","))
    localStorage.setItem("wrong", wrong.map(item => item.word).join(","))
}

function check(actual, expected) {
    return normalize(actual) === normalize(expected)
}

function normalize(word) {
    return word
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "").toLowerCase()
        .replaceAll('y', 'i')
        .replace(/^v/, 'f')
        .replace(/j([aeiou])/g, 'i$1')
        .replace(/([aeiou])j/g, '$1i')
        .replace(/(.)\1+/g, '$1')
}