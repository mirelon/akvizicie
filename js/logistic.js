export function calculateAgeOfAcquisition(data) {
    return nextLogisticParameters(1000.0, 300.0, data)
}

export function logistic(ageOfAcquisition, age) {
    return 1 / (1 + Math.exp(-(age - ageOfAcquisition) * 0.001))
}

function error(data, ageOfAcquisition) {
    const errors = data.map(answer => Math.pow(answer.correct - logistic(ageOfAcquisition, answer.age), 2))
    return errors.reduce((a, b) => a + b, 0)
}

function nextLogisticParameters(ageOfAcquisition, d = 1.0, data) {
    const currentError = error(data, ageOfAcquisition)
    console.log(`nextLogisticParameters(${ageOfAcquisition}, ${d}), current error = ${currentError}`)
    const neighbors = [
        ageOfAcquisition + d,
        ageOfAcquisition - d
    ]
    const newAgeOfAcquisition = neighbors.concat(ageOfAcquisition).reduce((x, y) => error(data, x) < error(data, y) ? x : y)
    if (newAgeOfAcquisition === ageOfAcquisition) {
        if (d > 0.1) {
            return nextLogisticParameters(ageOfAcquisition, d / 2, data)
        } else {
            return ageOfAcquisition
        }
    } else {
        return nextLogisticParameters(newAgeOfAcquisition, d, data)
    }
}
