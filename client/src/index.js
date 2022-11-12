import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { applyMiddleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import App from './components/App'

const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(configureStore)
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={createStoreWithMiddleware({ reducer: reducers })}>
    <App />
  </Provider>
)