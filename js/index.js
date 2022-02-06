window.addEventListener('DOMContentLoaded', () => {
    updateLocalStorageSize()
    generateUserId()
    document.getElementById("zmazat_data").onclick = (e) => {
        e.preventDefault()
        localStorage.clear()
        console.log('Data zmazane')
        updateLocalStorageSize()
    }
})

function updateLocalStorageSize() {
    document.getElementById('localStorageSize').innerText =
        new Set([
            localStorage.correct,
            localStorage.wrong,
            localStorage.ibaPorozumenie,
            localStorage.bezPorozumenia
        ].filter(x => x).join(',').split(',').filter(String)).size.toString()
}

function generateUserId() {
    if (!localStorage.userId) {
        localStorage.setItem('userId', randomUserId())
    }
    console.log(`Generated new userId = ${localStorage.userId}`)
}

function randomUserId() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}