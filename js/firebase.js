// Import the functions you need from the SDKs you need
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import {
    addDoc,
    collection,
    enableIndexedDbPersistence,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'

const firebaseConfig = {
    apiKey: 'AIzaSyCCLEOkNb1xajfGTtmnIHe5CvR47jOse9U',
    authDomain: 'akvizicie-728d3.firebaseapp.com',
    projectId: 'akvizicie-728d3',
    storageBucket: 'akvizicie-728d3.appspot.com',
    messagingSenderId: '52761266824',
    appId: '1:52761266824:web:a6356e9eb461c603ee2d3d'
}

initializeApp(firebaseConfig)

const db = getFirestore()

enableIndexedDbPersistence(db).catch((e) => {
    if (e.code === 'failed-precondition') {
        console.error(`${e.code}: Multiple tabs open, persistence can only be enabled in one tab at a time.`)
    } else if (e.code === 'unimplemented') {
        console.error(`${e.code}: The current browser does not support all of the features required to enable persistence`)
    }
})

export async function storeAnswer(userId, age, word, correct, measure) {
    createNewDocInAnswers(userId, word, measure, correct, age)

    const q = query(
        collection(db, 'wordStats'),
        where('word', '==', word),
        where('measure', '==', measure)
    )
    const docs = await getDocs(q)
    if (docs.docs.length === 1) {
        console.log('Update doc in wordStats')
        const data = docs.docs[0].data()
        updateDoc(docs.docs[0].ref, {
            answerCount: data.answerCount + 1,
            correctCount: data.correctCount + (correct ? 1 : 0),
            youngestCorrect: correct ? Math.min(age, data.youngestCorrect) : data.youngestCorrect
        })
    } else if (docs.docs.length === 0) {
        createNewDocInWordStats(word, measure, correct, age)
    } else {
        console.error(`Multiple ${word} docs in wordStats: ${docs.docs.length}`)
    }
}

function createNewDocInAnswers(userId, word, measure, correct, age) {
    const answer = {
        userId: userId,
        age: age,
        word: word,
        correct: correct,
        measure: measure
    }

    addDoc(collection(db, 'answers'), answer)
        .then(
            () => console.log(`Answer stored: ${JSON.stringify(answer)}`),
            error => console.error(`Error when adding doc to answers: ${error}`)
        )
}

function createNewDocInWordStats(word, measure, correct, age) {
    console.log('Create new doc in wordStats')
    const wordStatsDoc = {
        word: word,
        measure: measure,
        answerCount: 1,
        correctCount: correct ? 1 : 0,
        youngestCorrect: correct ? age : null
    }
    addDoc(collection(db, 'wordStats'), wordStatsDoc)
        .then(
            () => console.log(`Doc in wordStats created: ${JSON.stringify(wordStatsDoc)}`),
            error => console.error(`Error when adding doc to wordStats: ${error}`)
        )
}

export async function retrieve(userId, measure) {
    const q = query(
        collection(db, 'answers'),
        where('userId', '==', userId),
        where('measure', '==', measure)
    )
    return await getDocs(q)
}

export async function retrieveCorrect(userId, measure) {
    const q = query(
        collection(db, 'answers'),
        where('userId', '==', userId),
        where('measure', '==', measure),
        where('correct', '==', true)
    )
    return await getDocs(q)
}

export async function retrieveIncorrect(userId, measure) {
    const q = query(
        collection(db, 'answers'),
        where('userId', '==', userId),
        where('measure', '==', measure),
        where('correct', '==', false)
    )
    return await getDocs(q)
}

export async function wordStats(word, measure) {
    const q = query(
        collection(db, 'answers'),
        where('word', '==', word),
        where('measure', '==', measure)
    )
    return await getDocs(q)
}

// TODO "mean", "scale", "max" will be calculated on the fly