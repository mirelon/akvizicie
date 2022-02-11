export function calculateAgeOfAcquisition(data) {
    return nextLogisticParameters(
        {mean: 1000.0, scale: 1000.0, max: 1.0},
        1.0,
        data
    )
}

// params: object with keys: max, mean, scale
export function logistic(params, age) {
    return params.max / (1 + Math.exp(-(age - params.mean) / params.scale))
}

function error(data, params) {
    const errors = data.map(answer => Math.pow(answer.correct - logistic(params, answer.age), 2))
    return errors.reduce((a, b) => a + b, 0)
}

function nextLogisticParameters(params, d, data) {
    const currentError = error(data, params)
    console.log(`nextLogisticParameters(${JSON.stringify(params, (k, v) => v.toFixed ? Number(v.toFixed(3)) : v)}, ${d}), current error = ${currentError}`)
    const neighbors = [
        {...params, mean: params.mean + d * 200.0},
        {...params, mean: params.mean - d * 200.0},
        {...params, scale: params.scale + d * 200.0},
        {...params, scale: params.scale - d * 200.0},
        {...params, max: params.max + d / 10.0},
        {...params, max: params.max - d / 10.0}]
        .filter(neighbor => neighbor.scale > neighbor.mean / 100.0)
    const newParams = neighbors.concat(params)
        .reduce((x, y) => error(data, x) < error(data, y) ? x : y)
    if (newParams === params) {
        if (d > 0.1) {
            return nextLogisticParameters(params, d / 2, data)
        } else {
            return params
        }
    } else {
        return nextLogisticParameters(newParams, d, data)
    }
}
