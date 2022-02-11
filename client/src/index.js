// Other modules imports
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

// Import reducers
import reducers from './reducers'

// Own components imports
import { App } from './components/App'

// Create store for asking API 
const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore)

// Initialize app with reducers
ReactDOM.render( 
<Provider store={createStoreWithMiddleware(reducers)}>
    <App />
</ Provider>, document.getElementById('root'))
