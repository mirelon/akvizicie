import {words} from './words.js'

let json = words()

$(function () {
    document.getElementById('copy').onclick = copy
    document.getElementById('add').onclick = add
    render()
})

function add() {
    const word = document.getElementById('word').value.toLowerCase().trim()
    const image = document.getElementById('image').value.trim()
    const description = capitalizeFirstLetter(document.getElementById('description').value).trim()
    if (word.length > 0 && description.length > 0) {
        if (image.length > 0) {
            json.push({
                'word': word, 'image': image, 'description': description
            })
        } else {
            json.push({
                'word': word, 'description': description
            })
        }
        document.getElementById('word').value = ''
        document.getElementById('image').value = ''
        document.getElementById('description').value = ''
        render()
    } else {
        alert('Word and description must be non-empty')
    }
}

function copy() {
    const jsonInput = document.getElementById('json')
    jsonInput.select()
    jsonInput.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(jsonInput.value)
}

function render() {
    const jsonInput = document.getElementById('json')
    const sortedJson = json.sort((a, b) => {
        if (a['word'] > b['word']) {
            return 1
        } else {
            return -1
        }
    })
    const jsonString = JSON.stringify(sortedJson, null, 2)
    jsonInput.value = `export function words() { return ${cleanQuotes(jsonString)} }`
    jsonInput.scrollTop = jsonInput.scrollHeight
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function cleanQuotes(jsonString) {
    return jsonString.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, function (match) {
        return match.replace(/"/g, "");
    }).replaceAll("\"", "'")
}