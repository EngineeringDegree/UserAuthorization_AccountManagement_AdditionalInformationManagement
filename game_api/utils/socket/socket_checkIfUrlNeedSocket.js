const urls = [

]

const checkIfUrlNeedsSockets = (url) => {
    for (let i = 0; i < urls.length; i++) {
        if (urls[i] == url) {
            return true
        }
    }

    return false
}

module.exports = { checkIfUrlNeedsSockets }