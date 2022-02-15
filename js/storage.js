import {retrieve, retrieveCorrect, retrieveIncorrect, storeAnswer} from './firebase.js'
import {age} from './datum_narodenia.js'
import {getUserId} from './user_id.js'

export async function save(word, correct, measure) {
    await storeAnswer(getUserId(), age(), word, correct, measure)
}

export async function load(measure, correct = null) {
    return loadInternal(getUserId(), measure, correct).then(answers =>
        new Set(answers.docs.map(answer => answer.data().word))
    )
}

export async function wordsForPorozumenie() {
    const wrongProdukciaAnsweredWords = await load('produkcia', false)
    const porozumenieAnsweredWords = await load('porozumenie')
    return [...wrongProdukciaAnsweredWords].filter(word => !porozumenieAnsweredWords.has(word))
}

function loadInternal(userId, measure, correct = null) {
    if (correct == null) {
        return retrieve(userId, measure)
    } else if (correct) {
        return retrieveCorrect(userId, measure)
    } else {
        return retrieveIncorrect(userId, measure)
    }
}