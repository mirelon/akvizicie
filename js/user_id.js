export function getUserId() {
    if (!localStorage.userId) {
        localStorage.setItem('userId', randomUserId())
        console.log(`Generated new userId = ${localStorage.userId}`)
    }
    return localStorage.userId
}

function randomUserId() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}