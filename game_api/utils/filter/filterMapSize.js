/**
 * Filteres and creates good size string to save or return false if size string was in bad format
 * @param {string} size to filter
 * @returns false if bad data, sizeToSave string if good data 
 */
const filterMapSize = (size) => {
    let sizeToSave = ''
    let sizeTemp
    size = size.split('x')
    if (size.length == 1 || size.length == 2) {
        if (size.length == 1) {
            sizeTemp = size[0] / 1
            if (isNaN(sizeTemp)) {
                return false
            }
            sizeToSave = `${size[0]}x${size[0]}`
        } else {
            sizeTemp = size[0] / 1
            if (isNaN(sizeTemp) || sizeTemp == '') {
                return false
            } else {
                sizeTemp = size[1] / 1
                if (isNaN(sizeTemp) || sizeTemp == '') {
                    return false
                }
                sizeToSave = `${size[0]}x${size[1]}`
            }
        }
    }

    return sizeToSave
}

module.exports = { filterMapSize }