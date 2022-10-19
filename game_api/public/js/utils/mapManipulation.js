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
        savedConfigurations.push({
            dimensions: formattedValue,
            fields: [],
            startingPositions: []
        })

        indexToEdit = savedConfigurations.length - 1
    }

    currentIndex = indexToEdit
    var arrs = formattedValue.split('x')
    var fieldsArr = []
    var startingArr = []
    if (arrs.length == 2) {
        if (starting) {
            var arr = starting.split(',')
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] != '') {
                    startingArr.push(arr[i])
                }
                savedConfigurations[currentIndex].startingPositions = startingArr
            }
        }
        if (startingFields) {
            var arrFields = startingFields.split(',')
            for (let k = 0; k < arrFields.length; k++) {
                if (k % arrs[0] == 0) {
                    fieldsArr.push([])
                }
                fieldsArr[fieldsArr.length - 1].push(arrFields[k])
            }
            savedConfigurations[currentIndex].fields = fieldsArr
        }
    }

    var img = document.getElementById('image-display')
    if (img) {
        var width = img.clientWidth
        var height = img.clientHeight
        displayGridOnImageLoad(width, height, formattedValue)
        img.onload = function () {
            displayGridOnImageLoad(this.width, this.height, formattedValue)
        }
    }
}

/**
 * Displays grid on image
 * @param {number} width of image
 * @param {number} height of image
 * @param {string} formattedValue of dimensions f.e. 10x10
 */
function displayGridOnImageLoad(width, height, formattedValue) {
    var grid = document.getElementById('field-grid')
    if (grid) {
        grid.innerHTML = ''
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
                div.addEventListener('click', changeField, false)
                divOuter.appendChild(div)
            }
            grid.appendChild(divOuter)
        }
    }
    generateBasicFieldsToSavedConfigrations()
}

/**
 * Gets and displays fields which can be used later on map
 */
function getMapFields() {
    $.ajax({
        type: "GET",
        url: `/manage/get/fields/all?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }

            var placeFields = document.getElementById('fields-grid')
            if (placeFields) {
                if (res.fields[0]) {
                    currentField = res.fields[0]._id
                }

                fields = res.fields

                displayFieldsToUse(res.fields, placeFields)
                generateBasicFieldsToSavedConfigrations()
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('error')
        },
        dataType: "json",
        contentType: "application/json"
    })
}

/**
 * Places a fields to choose later to choose terrain
 * @param {array} fields taken from backend 
 * @param {DOMElement} placeFields where to place it
 */
function displayFieldsToUse(fields, placeFields) {
    placeFields.innerHTML = ''
    for (let i = 0; i < fields.length; i++) {
        var el = document.createElement('div')
        if (i == 0) {
            el.classList = 'clickable field-to-place text-center map-overlay'
        } else {
            el.classList = 'clickable field-to-place text-center'
        }
        el.id = fields[i]._id
        el.textContent = fields[i].name
        el.addEventListener('click', changeChoosenField, false)
        placeFields.appendChild(el)
    }

    var el2 = document.createElement('div')
    el2.classList = 'clickable field-to-place text-center'
    el2.id = 'spawnpoints'
    el2.textContent = 'Choose spawnpoint'
    el2.addEventListener('click', chooseSpawnpoint, false)
    placeFields.appendChild(el2)
}

/**
 * Starts choosing spawnpoints
 * @param {DOMElement} e event
 */
function chooseSpawnpoint(e) {
    var els = document.getElementsByClassName('field-to-place')
    for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('map-overlay')
    }

    choosingSpawnpoints = true
    e.target.classList.add('map-overlay')
}

/**
 * Generates first fields to save in configuration
 */
function generateBasicFieldsToSavedConfigrations() {
    if (savedConfigurations[currentIndex]) {
        var dim = savedConfigurations[currentIndex].dimensions
        dim = dim.split('x')
        if (savedConfigurations[currentIndex].fields.length == 0 && currentField) {
            for (let i = 0; i < dim[1]; i++) {
                savedConfigurations[currentIndex].fields.push([])
                for (let j = 0; j < dim[0]; j++) {
                    savedConfigurations[currentIndex].fields[i].push(currentField)
                    var el = document.getElementById(`field-${j}-${i}`)
                    if (el) {
                        for (let k = 0; k < fields.length; k++) {
                            if (fields[k]._id == savedConfigurations[currentIndex].fields[i][j]) {
                                el.textContent = fields[k].name
                            }
                        }
                    }
                }
            }
        }

        for (let i = 0; i < dim[1]; i++) {
            for (let j = 0; j < dim[0]; j++) {
                var el = document.getElementById(`field-${j}-${i}`)
                if (el) {
                    el.classList.remove('spawnpoint')
                    for (let k = 0; k < fields.length; k++) {
                        if (fields[k]._id == savedConfigurations[currentIndex].fields[i][j]) {
                            el.textContent = fields[k].name
                        }
                    }
                }
            }
        }

        for (let i = 0; i < savedConfigurations[currentIndex].startingPositions.length; i++) {
            let el = document.getElementById(savedConfigurations[currentIndex].startingPositions[i])
            if (el) {
                el.classList.add('spawnpoint')
            }
        }

        var mapFields = document.getElementById('map-fields')
        if (mapFields) {
            mapFields.value = savedConfigurations[currentIndex].fields
            mapFields.dispatchEvent(new Event('change'))
        }
    }
}

/**
 * Changes choosen field
 * @param {DOMElement} e changes currentField to target.id
 */
function changeChoosenField(e) {
    var els = document.getElementsByClassName('field-to-place')
    for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('map-overlay')
    }
    currentField = e.target.id
    e.target.classList.add('map-overlay')
    choosingSpawnpoints = false
}

/**
 * Changes fields in saved configuration
 * @param {DOMElement} e target clicked
 */
function changeField(e) {
    var target = e.target.id.split('-')
    if (target[1] && target[2]) {
        if (!choosingSpawnpoints) {
            savedConfigurations[currentIndex].fields[target[2]][target[1]] = currentField
        } else {
            let gotIn = false
            for (let i = 0; i < savedConfigurations[currentIndex].startingPositions.length; i++) {
                if (savedConfigurations[currentIndex].startingPositions[i] == e.target.id) {
                    gotIn = true
                    savedConfigurations[currentIndex].startingPositions.splice(i, 1)
                    break
                }
            }

            if (!gotIn) {
                savedConfigurations[currentIndex].startingPositions.push(e.target.id)
            }
        }
        generateBasicFieldsToSavedConfigrations()
    }
}