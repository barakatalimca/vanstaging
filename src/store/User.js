import { createSlice } from '@reduxjs/toolkit'

import api from '../Api'

const { actions, reducer } = createSlice({
  name: 'ProductList',
  initialState: {
    loading: false,
    data: []
  },
  reducers: {
    fetchDataStarted: (state) => {
      state.loading = true
    },
    fetchDataSuccess: (state, payload) => { // product_list_fetch_success -> ProductList/fetchDataSuccess
      state.data = payload
      state.loading = false
    },
    fetchDataFailure: (state) => {
      state.loading = false
    }
  }
})

export const {
  fetchDataStarted,
  fetchDataSuccess,
  fetchDataFailure
} = actions

export const fetch = () => async (dispatch, getState) => {
  try {
    dispatch(fetchDataStarted())

    const response = await api.fetchProductListData()

    if (response.ok) {
      dispatch(fetchDataSuccess(response.data))
    } else {
      dispatch(fetchDataFailure())
    }
  } catch (error) {
    dispatch(fetchDataFailure())
  }
}

export default reducer
