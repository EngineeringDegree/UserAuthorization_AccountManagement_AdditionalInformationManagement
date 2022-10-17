/**
 * Function which changes an image in image-display id
 * @param {DOMElement} e event emitter
 */
function imageChanged(e) {
    var imageDisplay = document.getElementById('image-display')
    if (imageDisplay) {
        imageDisplay.src = e.target.value
    }
}

/**
 * Function which draws overlay if data is good for it
 * @param {DOMElement} e event emitter
 * @param {boolean} emittedByLoad if draw was initiated on load (it sends other event emitter, needs to check it)
 */
function drawOverlay(e, emittedByLoad = false) {
    var value
    var overlay = document.getElementById('field-grid')
    if (overlay) {
        if (emittedByLoad) {
            value = formatValue(e.value)
        } else {
            value = formatValue(e.target.value)
        }
    }

    if (value) {
        displayOverlay(value)
    }

}

/**
 * Formates value to use to display overlay on the map
 * @param {string} value to format to numberxnumber
 * @returns string if formatted correctly, false if cannot format
 */
function formatValue(value) {
    var toReturn
    var val = value.split('x')
    if (val.length == 1 || val.length == 2) {
        if (val.length == 1) {
            if (isNaN(val[0])) {
                return false
            }

            toReturn = `${val[0]}x${val[0]}`
        } else {
            if (isNaN(val[0]) || isNaN(val[1]) || val[0] == '' || val[1] == '') {
                return false
            }

            toReturn = `${val[0]}x${val[1]}`
        }
        return toReturn
    }

    return false
}

/**
 * Displays overlay over map
 * @param {string} formattedValue in format numberxnumber 
 */
function displayOverlay(formattedValue) {
    console.log(formattedValue, savedConfigurations)
}