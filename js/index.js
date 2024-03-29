import {getUserId} from './user_id.js'

window.addEventListener('DOMContentLoaded', () => {
    updateLocalStorageSize()
    getUserId()
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
