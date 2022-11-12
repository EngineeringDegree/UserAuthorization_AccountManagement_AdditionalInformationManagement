/**
 * Checks if value is not empty.
 * @param {string} value 
 * @returns true if not empty, false if empty.
 */
const notEmpty = (value) => {
    return (value !== '')
}

/**
 * Checks if value is an email.
 * @param {string} email 
 * @returns true if email, false if empty.
 */
const isEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

module.exports = {
    notEmpty,
    isEmail
}