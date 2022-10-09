import { GET_PRODUCTS_LOADING, GET_PRODUCTS_SUCCESS, GET_PRODUCTS_ERROR } from './productsTypes'
// import { create } from 'apisauce'
import axios from 'axios'

export const fetchProductsRequest = () => {
  return {
    type: GET_PRODUCTS_LOADING
  }
}

const fetchProductsSuccess = data => {
  return {
    type: GET_PRODUCTS_SUCCESS,
    payload: data
  }
}
const fetchProductsFailure = error => {
  return {
    type: GET_PRODUCTS_ERROR,
    payload: error
  }
}
const base = 'https://cors-anywhere.herokuapp.com/https://van/webservice/'
export const fetchProducts = () => {
  const axios = require('axios')
  const data = ''

  const config = {
    method: 'post',
    url: base + 'product_list',
    headers: {
      Lang: 'en',
      Source: 'web'
    },
    data: data
  }

  axios(config)
    .then(response => {
      const data = response.data.data
      dispatch(fetchProductsSuccess(data))
    })
    .catch(error => {
      const errorMsg = error.message
      dispatch(fetchProductsFailure(errorMsg))
    })
}
