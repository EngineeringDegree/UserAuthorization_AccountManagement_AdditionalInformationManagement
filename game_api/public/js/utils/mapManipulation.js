/**
 * Function which changes an image in image-display id
 * @param {DOMElement} e event emitter
 */
function imageChanged(e) {
    var imageDisplay = document.getElementById('image-display')
    if (imageDisplay) {
        imageDisplay.src = e.target.value
        var size = document.getElementById('size')
        if (size) {
            drawOverlay(size, false, false, true)
        }
    }
}

/**
 * Function which draws overlay if data is good for it
 * @param {DOMElement} e event emitter
 * @param {string} starting starting position passed when loads
 * @param {string} startingFields fields loaded from database
 * @param {boolean} emittedByLoad if draw was initiated on load (it sends other event emitter, needs to check it)
 */
function drawOverlay(e, starting = false, startingFields = false, emittedByLoad = false) {
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
        displayOverlay(value, starting, startingFields)
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
 * @param {string} starting starting postions
 * @param {string} startingFields starting fields
 */
function displayOverlay(formattedValue, starting, startingFields) {
    var indexToEdit = -1
    for (let i = 0; i < savedConfigurations.length; i++) {
        if (savedConfigurations[i].dimensions == formattedValue) {
            indexToEdit = i
            currentIndex = i
            break
        }
    }

    if (indexToEdit < 0) {
        if (starting && startingFields) {
            var arr = starting.split(',')
            var arrFields = startingFields.split(',')
            savedConfigurations.push({
                dimensions: formattedValue,
                fields: arrFields,
                startingPositions: arr
            })
        } else {
            savedConfigurations.push({
                dimensions: formattedValue,
                fields: [],
                startingPositions: []
            })
        }

        indexToEdit = savedConfigurations.length - 1
        currentIndex = indexToEdit
    }

    var img = document.getElementById('image-display')
    var grid = document.getElementById('field-grid')
    if (img) {
        var width = img.clientWidth
        var height = img.clientHeight
        displayGridOnImageLoad(width, height, formattedValue, indexToEdit)
        img.onload = function () {
            displayGridOnImageLoad(this.width, this.height, formattedValue, indexToEdit)
        }
    }
}

/**
 * Displays grid on image
 * @param {number} width of image
 * @param {number} height of image
 * @param {string} formattedValue of dimensions f.e. 10x10
 * @param {number} indexToEdit of saved configurations
 */
function displayGridOnImageLoad(width, height, formattedValue, indexToEdit) {
    var grid = document.getElementById('field-grid')
    if (grid) {
        grid.innerHTML = ''
        console.log(width, height, formattedValue, indexToEdit, savedConfigurations)
        var val = formattedValue.split('x')
        var blockWidth = width / val[0]
        var blockHeight = height / val[1]
        for (let i = 0; i < val[1]; i++) {
            let divOuter = document.createElement('div')
            divOuter.classList = 'd-flex'
            divOuter.id = `row-${i}`
            for (let j = 0; j < val[0]; j++) {
                let div = document.createElement('div')
                div.classList = 'clickable map-overlay'
                div.id = `field-${j}-${i}`
                div.style.width = `${blockWidth}px`
                div.style.height = `${blockHeight}px`
                divOuter.appendChild(div)
            }
            grid.appendChild(divOuter)
        }
    }
}