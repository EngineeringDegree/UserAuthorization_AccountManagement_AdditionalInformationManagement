/**
 * Check if user has ban
 * @param {User} user object model
 * @returns if user has ban
 */
var checkIfBanned = (user) => {
    var newDate = new Date()
    newDate = newDate.getTime()
    for(let i = user.bans - 1; i >= 0; i--){
        if(bans[i].to > newDate){
            return true
        }
    }

    return false
}

module.exports = { checkIfBanned }