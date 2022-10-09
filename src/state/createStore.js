import { createStore as reduxCreateStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const createStore = () => reduxCreateStore(rootReducer, composeWithDevTools(applyMiddleware(thunk))
)
export default createStore
