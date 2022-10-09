import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { composeWithDevTools } from 'redux-devtools-extension'
import appReducer from './App'
import productListReducer from './ProductList'
import Auth from './Auth'

const store = configureStore({
  reducer: {
    app: appReducer,
    productList: productListReducer,
    Auth: Auth
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  }),
  devTools: process.env.NODE_ENV === 'development'
})

export {
  store
}
