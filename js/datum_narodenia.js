export function bindDatumNarodenia() {
    document.getElementById("datum_narodenia").onblur = (e) => {
        saveFromElement(e.target)
    }
    const datumNarodenia = localStorage.getItem(datumNarodeniaKey)
    if (datumNarodenia) {
        console.log(`Loaded ${datumNarodeniaKey}: ${datumNarodenia}`)
        document.getElementById("datum_narodenia").value = datumNarodenia
    }
}

export function age() {
    return Math.floor((Date.now() - parse(localStorage.datumNarodenia)) / 86400000)
}

const datumNarodeniaKey = 'datumNarodenia'

function saveFromElement(el) {
    const dateString = el.value
    if (parse(dateString)) {
        console.log(`Saving to localStorage: ${dateString}`)
        localStorage.setItem(datumNarodeniaKey, dateString)
    }
}

function parse(string) {
    const parts = string.split('.')
    if (parts.length !== 3) {
        return showError(`Potrebné zadať deň, mesiac a rok, oddelené bodkou`)
    }
    return Date.parse(parts.reverse().join('-'))
}

function showError(msg) {
    console.error(msg)
}
