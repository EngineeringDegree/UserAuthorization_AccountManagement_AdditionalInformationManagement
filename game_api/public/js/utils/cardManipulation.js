var image
$(document).ready(init())


function init() {
    image = document.getElementById('card-image-display')
    if (image) {
        var el = document.getElementById('image')
        if (el) {
            el.addEventListener('keyup', displayCardInImage, false)
        }

        var modifyEl = document.getElementById('card-image')
        if (modifyEl) {
            displayCardInImage({ target: { value: modifyEl.value } })
            modifyEl.addEventListener('keyup', displayCardInImage, false)
        }
    }
}

/**
 * Assigns src to target of event value
 * @param {DOMElement} e event emiiter
 */
function displayCardInImage(e) {
    image.src = e.target.value
}