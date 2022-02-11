import "https://cdn.plot.ly/plotly-2.9.0.min.js"
import {stats} from "./firebase.js"
import {calculateAgeOfAcquisition, logistic} from "./logistic.js";

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded')
    bindButtons()
});

function bindButtons() {
    document.getElementById('produkcia').onclick = () => {
        buttonClicked('produkcia')
    }
    document.getElementById('porozumenie').onclick = () => {
        buttonClicked('porozumenie')
    }
}

function buttonClicked(measure) {
    const word = document.getElementById('word').value
    console.log(`Button clicked: ${measure}, getting data for ${word}`)
    stats(word, measure).then(answers => {
        const data = answers.docs.map(answer => {
                return {
                    age: answer.data().age,
                    correct: answer.data().correct
                }
            }
        )
        console.log(`Received data with size ${data.length}`)
        console.log(data)
        const ageOfAcquisition = calculateAgeOfAcquisition(data)
        const xValues = [...Array(30_000).keys()]
        const yValues = xValues.map(x => logistic(ageOfAcquisition, x))
        Plotly.newPlot('results-plot', [{
            x: data.map(answer => answer.age / 365.25),
            y: data.map(answer => answer.correct ? 1 : 0),
            mode: 'markers',
            type: 'scatter'
        }, {
            x: xValues.map(x => x / 365.25),
            y: yValues
        }], {
            dragmode: 'pan',
            margin: {t: 0}
        })
    })
}
