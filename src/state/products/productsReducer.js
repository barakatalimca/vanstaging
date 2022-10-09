import { GET_PRODUCTS_LOADING, GET_PRODUCTS_SUCCESS, GET_PRODUCTS_ERROR } from './productsTypes'
const initialSate = {
  products: [],
  loading: false,
  error: ''
}
const countReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_PRODUCTS_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: ''
      }
    case GET_PRODUCTS_ERROR:
      return {
        ...state,
        loading: false,
        products: [],
        error: action.payload
      }
    default: return state
  }
}
export default countReducer
