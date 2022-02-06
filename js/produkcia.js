import {words} from './words.js'
import {domAndSpeechLoaded, speak} from './speak.js'
import {bindDatumNarodenia} from './datum_narodenia.js'
import {load, save, wordsForPorozumenie} from './storage.js'

domAndSpeechLoaded(() => {
    bindDatumNarodenia()
    next()
})

function next() {
    updatePocetSlovPorozumenie()
    randomAvailable().then(item => process(item))
}

function updatePocetSlovPorozumenie() {
    wordsForPorozumenie().then(words =>
        document.getElementById('pocet_slov_porozumenie').innerText = words.length.toString()
    )
}

function process(item) {
    if (item) {
        document.getElementById('input').innerHTML = render(item)
        document.getElementById('input').onclick = () => {
            speak(item.description)
        }
        speak(item.description)
        document.getElementById('answer').value = ''
        document.getElementById('answer').focus()
        document.getElementById('answer').oninput = (e) => {
            console.log(`${e.target.value}`)
            if (check(e.target.value, item.word)) {
                console.log('correct')
                speechSynthesis.cancel()
                save(item.word, true, 'produkcia')
                next()
            }
        }
        document.onkeydown = (e) => {
            if (["Escape", "Esc", "Enter"].includes(e.key)) {
                console.log(`${e.key} pressed, giving up`)
                speechSynthesis.cancel()
                save(item.word, false, 'produkcia')
                next()
            }
        }
    } else {
        document.getElementById('input').innerHTML = `Hotovo, pokračujte na <a href="/porozumenie.html">porozumenie</a>`
        document.getElementById('answer').value = ''
        document.getElementById('answer').oninput = () => {
        }
        document.onkeydown = () => {
        }
    }
}

function render(item) {
    if (item.image) {
        return `<img src="${item.image}" alt="${item.description}" title="${item.description}" />`
    } else {
        return `<span>${item.description}</span>`
    }
}

async function randomAvailable() {
    const answeredWords = await load('produkcia')
    const available = words().filter(item => !answeredWords.has(item.word))
    console.log(`Available words size: ${available.length}`)
    if (available.length > 1)
        return available[Math.floor(Math.random() * available.length)]
    else if (available.length === 1)
        return available[0]
    else
        return null
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