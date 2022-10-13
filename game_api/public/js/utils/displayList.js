var pageListenerUtils = document.getElementById('pageListener')

/**
 * Function which displays returned info in list of elements in admin panel
 * @param {Array} records returned
 * @param {Number} page of current pages
 * @param {Number} pages of all pages
 * @param {DOMelement} place where to display that info 
 * @param {DOMelement} pagesDisplay where to display pages info 
 * @param {String} param parameter to ask in link
 * @param {String} el which we are listing
 */
function displayReturnedInfo(records, currentPage, pages, place, pagesDisplay, param, el) {
    if (place && pagesDisplay) {
        place.innerHTML = ''
        pagesDisplay.innerHTML = ''
        for (let i = 0; i < records.length; i++) {
            let element = document.createElement('div')
            let link = document.createElement('a')
            link.textContent = records[i].name
            link.href = `/manage/${el}/modify?${param}=${records[i]._id}`
            element.appendChild(link)
            place.appendChild(element)
        }

        if (records.length == 0) {
            let element = document.createElement('div')
            element.textContent = "Nothing to see here!"
            place.appendChild(element)
        }

        for (let i = 0; i < pages; i++) {
            if (i + 1 == currentPage) {
                let element = document.createElement('div')
                element.textContent = i + 1
                pagesDisplay.appendChild(element)
            } else {
                let element = document.createElement('a')
                element.textContent = i + 1
                element.classList.add('clickable')
                element.addEventListener('click', setPage, false)
                element.pageNum = i + 1
                element.href = "#"
                pagesDisplay.appendChild(element)
            }
        }
    }

    function setPage(e) {
        e.preventDefault()
        page = e.currentTarget.pageNum
        if (pageListenerUtils) {
            pageListenerUtils.value = page
            pageListenerUtils.dispatchEvent(new Event("change"))
        }
    }
}