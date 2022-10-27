/**
 * Check if user confirmed an account
 * @param {User} user object model
 * @returns boolean if user confirmed account
 */
const checkIsConfirmed = (user) => {
    return user.confirmed
}

module.exports = { checkIsConfirmed }