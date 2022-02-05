export function bindDatumNarodenia() {
    document.getElementById("datum_narodenia").onblur = (e) => {
        check(e.target)
    }
    const datumNarodenia = localStorage.getItem(datumNarodeniaKey)
    if (datumNarodenia) {
        console.log(`Loaded ${datumNarodeniaKey}: ${datumNarodenia}`)
        document.getElementById("datum_narodenia").value = datumNarodenia
    }
}

const datumNarodeniaKey = 'datumNarodenia'

function check(el) {
    const dateString = el.value
    console.log(`Input contains: ${dateString}`)
    const parts = dateString.split('.')
    if (parts.length !== 3) {
        return showError(el, `Potrebné zadať deň, mesiac a rok, oddelené bodkou`)
    }
    if (Date.parse(parts.reverse().join('-'))) {
        console.log(`Saving to localStorage: ${dateString}`)
        localStorage.setItem(datumNarodeniaKey, dateString)
    }
}

function showError(el, msg) {
    console.error(msg)
}
