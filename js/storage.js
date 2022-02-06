import {retrieve, retrieveCorrect, retrieveIncorrect, store} from './firebase.js'
import {age} from './datum_narodenia.js'

export function save(word, correct, measure) {
    store({
        userId: localStorage.userId,
        age: age(),
        word: word,
        correct: correct,
        measure: measure
    })
}

export async function load(measure, correct = null) {
    if (localStorage.userId) {
        return loadInternal(localStorage.userId, measure, correct).then(answers =>
            new Set(answers.docs.map(answer => answer.data().word))
        )
    } else {
        return new Set()
    }
}

export async function wordsForPorozumenie() {
    const wrongProdukciaAnsweredWords = await load('produkcia', false)
    const porozumenieAnsweredWords = await load('porozumenie')
    return [...wrongProdukciaAnsweredWords].filter(word => !porozumenieAnsweredWords.has(word))
}

function loadInternal(userId, measure, correct = null) {
    if (correct == null) {
        return retrieve(localStorage.userId, measure)
    } else if (correct) {
        return retrieveCorrect(localStorage.userId, measure)
    } else {
        return retrieveIncorrect(localStorage.userId, measure)
    }
}