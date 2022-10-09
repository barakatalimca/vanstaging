// Hook (use-auth.js)
import React, { useState, useContext, createContext } from 'react'

import Api from '../Api'
import { navigate } from '../components/common/Router'
import { useWallet } from './useWallet'

const customerOrderContext = createContext()

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAllManageOrders().
export function CustomerOrderDataProvider ({ children }) {
  const data = useCustomerOrderProvider()
  return (
    <customerOrderContext.Provider value={data}>
      {children}
    </customerOrderContext.Provider>
  )
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useCustomerOrderData = () => {
  return useContext(customerOrderContext)
}

// Provider hook that creates auth object and handles state
function useCustomerOrderProvider () {
  const [orderList, setOrderList] = useState([])
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [reload, setReload] = useState(0)
  const [snackbarText, setSnackbarText] = useState('')
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [errorColor, setErrorColor] = useState('')
  const [getOrderId, setOrderId] = useState(null)
  const wallet = useWallet()
  const reloader = () => {
    setReload(prev => prev + 1)
  }
  const closeSnackbar = () => {
    setShowSnackbar(false)
    setSnackbarText('')
    setErrorColor('')
  }

  const setOrderItemId = (item) => {
    setOrderId(item?.order_id)
  }

  const fetchAll = () => {
    setIsLoading(true)
    Api.getMyOrders()
      .then((response) => {
        if (response.ok) {
          const { result, message, data } = response.data
          if (result === 1) {
            setIsLoading(false)
            setOrderList(data)
          } else {
            setIsLoading(false)
          }
        }
      })
  }

  const fetch = (orderId) => {
    setIsLoading(true)
    Api.getMyOrdersDetails(orderId)
      .then((response) => {
        if (response.ok) {
          const { result, message, data } = response.data
          if (result === 1) {
            setIsLoading(false)
            setOrder(data)
          } else {
            setIsLoading(false)
          }
        }
      })
  }

  const manageOrder = async (payload) => {
    setConfirmLoading(true)
    const {
      action,
      payment_method,
      price_diff,
      shipping_mode
    } = payload
    console.log('payload', payload)
    const response = await Api.manageOrder(payload)

    if (response.ok) {
      const { result, message, data } = response.data
      setConfirmLoading(false)
      if (result === 1) {
        reloader()
        setShowSnackbar(true)
        setSnackbarText(response.data.message)
        if (action === 'exchange') {
          if (price_diff > 0) {
            if (payment_method === 'COD' || payment_method === 'WALLET') {
              console.log('payment_method', payment_method)
              wallet.setIsWalletSelected(false)
            } else {
              navigate('/payment', { state: { ...data } })
            }
          }
          fetchAll()
        } else {
        }
      } else {
        setShowSnackbar(true)
        setSnackbarText(response.data.message)
      }
    }

    return response
    // .catch((error) => {
    //   console.log(error)
    //   setShowSnackbar(true)
    //   setSnackbarText('Some error occured!')
    //   setErrorColor('red')
    // })
  }
  // Return the user object and auth methods
  return {
    orderList,
    order,
    errorColor,
    reload,
    snackbarText,
    showSnackbar,
    isLoading,
    confirmLoading,
    reloader,
    fetchAll,
    fetch,
    getOrderId,
    manageOrder,
    closeSnackbar,
    setOrderItemId
  }
}
