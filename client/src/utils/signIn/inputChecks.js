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

/**
 * Checks if value is true boolean.
 * @param {boolean} value to check
 * @returns true or false
 */
const isTrue = (value) => {
    return value
}

/**
 * Checks if two provided values equals. 
 * @param {string} val1 
 * @param {string} val2 
 * @returns true if equals, false if not.
 */
const equals = (val1, val2) => {
    return val1 === val2
}

module.exports = {
    notEmpty,
    isEmail,
    isTrue,
    equals
}