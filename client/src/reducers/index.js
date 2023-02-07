import { combineReducers } from 'redux'
import checkIfLoggedInReducer from './user/checkIfLoggedIn-reducer'
import loginReducer from './user/userLogin-reducer'
import usernameReducer from './user/userUsername-reducer'
import passwordReducer from './user/userPassword-reducer'
import setPasswordReducer from './user/setUserPassword-reducer'
import emailReducer from './user/userEmail-reducer'
import confirmedReducer from './user/userConfirmed-reducer'
import adminReducer from './user/userAdmin-reducer'
import registerReducer from './user/userRegister-reducer'
import authReducer from './user/userAuthorize-reducer'
import getUserReducer from './user/getUser-reducer'
import getCardsReducer from './cards/getCards-reducer'
import getUsersReducer from './users/getUsers-reducer'
import banUserReducer from './user/userBan-reducer'
import addEffectReducer from './cards/addEffectReducer'
import addTypeReducer from './cards/addTypeReducer'
import addNationReducer from './cards/addNationReducer'
import getAllAssetsReducer from './cards/getAllAssetsReducer-reducer'
import addCardReducer from './cards/addCardReducer'
import getEffectsReducer from './cards/getEffects-reducer'
import getNationsReducer from './cards/getNations-reducer'
import getTypesReducer from './cards/getTypes-reducer'
import getCardsRecordsReducer from './cards/getCardsRecords-reducer'
import addFieldReducer from './maps/addField-reducer'
import getFieldsReducer from './maps/getFields-reducer'

/**
 * Combines all reducers.
 */
const rootReducer = combineReducers({
    userLoggedIn: checkIfLoggedInReducer,
    userLogin: loginReducer,
    userRegister: registerReducer,
    authReducer: authReducer,
    getUserReducer: getUserReducer,
    getCardsReducer: getCardsReducer,
    username: usernameReducer,
    password: passwordReducer,
    email: emailReducer,
    confirmed: confirmedReducer,
    admin: adminReducer,
    setPassword: setPasswordReducer,
    users: getUsersReducer,
    userBanned: banUserReducer,
    addEffectReducer: addEffectReducer,
    addTypeReducer: addTypeReducer,
    addNationReducer: addNationReducer,
    getAllAssetsReducer: getAllAssetsReducer,
    addCardReducer: addCardReducer,
    effects: getEffectsReducer,
    nations: getNationsReducer,
    types: getTypesReducer,
    cards: getCardsRecordsReducer,
    addField: addFieldReducer,
    fields: getFieldsReducer
})

export default rootReducer