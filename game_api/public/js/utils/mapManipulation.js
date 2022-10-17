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
 */
function drawOverlay(e) {
    var overlay = document.getElementById('field-grid')
    if (overlay) {
        console.log(e.target)
    }
}