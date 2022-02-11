// Import the functions you need from the SDKs you need
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
import {
    addDoc,
    collection,
    enableIndexedDbPersistence,
    getDocs,
    getFirestore,
    query,
    where
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCCLEOkNb1xajfGTtmnIHe5CvR47jOse9U',
    authDomain: 'akvizicie-728d3.firebaseapp.com',
    projectId: 'akvizicie-728d3',
    storageBucket: 'akvizicie-728d3.appspot.com',
    messagingSenderId: '52761266824',
    appId: '1:52761266824:web:a6356e9eb461c603ee2d3d'
}

// Initialize Firebase
initializeApp(firebaseConfig)

const db = getFirestore()

enableIndexedDbPersistence(db).catch((e) => {
    if (e.code === 'failed-precondition') {
        console.error(`${e.code}: Multiple tabs open, persistence can only be enabled in one tab at a time.`)
    } else if (e.code === 'unimplemented') {
        console.error(`${e.code}: The current browser does not support all of the features required to enable persistence`)
    }
})

export function store(obj) {
    addDoc(collection(db, 'answers'), obj)
        .then(
            doc => console.log(`Answer stored: ${doc}`),
            error => console.error(error)
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

export async function stats(word, measure) {
    const q = query(
        collection(db, 'answers'),
        where('word', '==', word),
        where('measure', '==', measure)
    )
    return await getDocs(q)
}