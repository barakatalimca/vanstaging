import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import { navigate } from '../components/common/Router'

import Api from '../Api'
import { useCart } from './useCart'
import { useCheckout } from './useCheckout'
import { useWallet } from './useWallet'

export default function usePayment() {
  const [data, setData] = React.useState({
    checkoutId: '',
    url: '',
    redirectUrl: '',
    brands: '',
    paymentMethodId: ''
  })
  const [transactionData, setTransactionData] = useState({
    code: '',
    description: '',
    status: '',
    statusText: '',
    status_text: ''
  })
  const [buyNowActive, setBuyNowActive] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentSuccessData, setPaymentSuccessData] = useState('')

  const [checkoutResponse, setCheckoutResponse] = useState(null)
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [buyNowData, setBuyNowData] = useState(null)
  const cart = useCart()
  const checkout = useCheckout()
  const isBrowser = typeof window !== 'undefined'
  const wallet = useWallet()

  React.useEffect(() => {
    if (isBrowser) {
      const buyNow = JSON.parse(window.localStorage.getItem('buyNow'))
      if (buyNow === undefined || buyNow === null) {
        console.log('An error occured while performing buy now!')
        setBuyNowActive(false)
      } else {
        setBuyNowActive(true)
        setBuyNowData(buyNow)
      }
    }
  }, [])

  const initiatePayment = async (checkoutData) => {
    setIsLoading(true)
    const {
      shipToFormData: {
        name,
        code,
        mobile,
        email
      },
      shippingAddressId,
      shippingMethodId,
      billingAddressId,
      paymentMethodId,
      shipping_carrier,
      isGiftOptionSelected,
      giftMessage
    } = checkoutData

    const payload = {
      name,
      email,
      code: code,
      mobile_no: mobile,
      shipping_address_id: shippingAddressId,
      shipping_mode: shippingMethodId,
      billing_address_id: billingAddressId,
      payment_mode: paymentMethodId,
      shipping_carrier: shipping_carrier,
      is_buy_now: checkout?.promoCodeDetails.isBuyNow ? 'Yes' : 'No',
      items: checkout?.promoCodeDetails.items,
      promocode: checkout?.promoCodeDetails.promoCode,
      is_gift: isGiftOptionSelected ? 'Y' : 'N',
      gift_message: giftMessage || ''
    }

    let response
    //console.log('payload', payload)
    if (isBrowser) {
      const buyNow = JSON.parse(window.localStorage.getItem('buyNow'))
      if (!buyNow) {
        //console.log('m1')
        response = await Api.checkout(payload)
        console.log('response1', response)
        if (response.ok) {
          const { data, result, message } = response.data

          window.localStorage.setItem('profile-data', JSON.stringify({
            name: payload.name,
            email: payload.email,
            code: payload.code,
            mobile_no: payload.mobile_no
          }))

          if (result === 1) {
            Api.manageProfile({ action: 'list' })
            setPaymentSuccessData(data)

            window.localStorage.setItem('checkoutResponse', data.order_id)
            wallet.setIsWalletSelected(false)
            wallet.setIsGiftValue(false)

            if (paymentMethodId === 'COD') {
              navigate('/result')
              cart.emptyCart()
            } else if (wallet.isWalletSelected) {
              navigate('/result')
              cart.emptyCart()
            } else {
              navigate('/payment', { state: { ...data } })
            }
          } else if (result === 0) {

          } else {
            setIsSnackbarVisible(true)
            setSnackbarText(message)
          }

          setIsLoading(false)
        }
        checkout.resetPromoCodeDetails()

        setTimeout(() => {
          setIsLoading(false)
        }, 15000)
      } else {

        const productData = JSON.parse(window.localStorage.getItem('buyNow'))
        payload.product_id = productData.product_id
        payload.product_sku_id = productData.product_sku_id
        payload.price = productData.price
        payload.quantity = productData.quantity

        response = Api.buyNow(payload)
        console.log('response2', response)
        if (response.ok) {
          const { data, result, message } = response.data
          window.localStorage.setItem('profile-data', JSON.stringify({
            name: payload.name,
            email: payload.email,
            code: payload.code,
            mobile_no: payload.mobile_no
          }))
          if (result === 1) {
            Api.manageProfile({ action: 'list' })
            setPaymentSuccessData(data)
            window.localStorage.setItem('checkoutResponse', data.order_id)
            wallet.setIsWalletSelected(false)
            wallet.setIsGiftValue(false)

            if (paymentMethodId === 'COD' || paymentMethodId === 'WALLET') {
              navigate('/result')
            } else {
              navigate('/payment')
            }
          } else if (result === 0) {

          } else {
            setIsSnackbarVisible(true)
            setSnackbarText(message)
          }

          setIsLoading(false)
          checkout.resetPromoCodeDetails()
        }


      }
      return response
    }
  }

  const verifyPayment = async (locationPathname) => {
    let resp = {}
    const { query } = queryString.parseUrl(locationPathname)
    // let checkoutId = ''
    ///

    if (query && query.resourcePath) {
      let checkoutId = query.resourcePath?.split('/')[3]

      const payload = { checkoutId }


      Api.verifyPayment(payload).then(response => {
        //response = resp
        console.log('response3', response)

        if (response.ok) {
          const { data, result, message } = response.data
          resp = response.data
          if (result === 1) {
            setPaymentSuccess(true)
            setPaymentSuccessData(data)
            window.localStorage.setItem('checkoutResponse', data.order_id)
            window.localStorage.setItem('paymentResponse', data.status_text || data.status_text)
            const { code, description, status, statusText, status_text } = data

            setTransactionData({
              code, description, status, statusText, status_text
            })

            if (isBrowser) {
              const buyNow = JSON.parse(window.localStorage.getItem('buyNow'))
              if (!buyNow) {
                cart.emptyCart()
              }
            }
            navigate('/ordersuccess')
          } else {
            if (isBrowser) {
              //setPaymentSuccessData('naimul')
              window.localStorage.setItem('paymentResponse', response.data.data.status_text || response.data.status_text)
              navigate('/orderfailed')
            }
          }
        }

      })

    } else {
      setPaymentSuccess(false)
    }
    return resp

  }

  const addToBuyNow = (payload) => {
    if (isBrowser) {
      const token = window.localStorage.getItem('token')
      if (token === undefined || token === null) {
        navigate('/sign-in?referer=/buynow/checkout')
      } else {
        navigate('/checkout')
      }
      window.localStorage.setItem('buyNow', JSON.stringify(payload))
      setBuyNowActive(true)
      setBuyNowData(payload)
    }
  }


  return {
    initiatePayment,
    verifyPayment,
    addToBuyNow,
    data,
    paymentSuccessData,
    buyNowActive,
    buyNowData,
    isSnackbarVisible,
    snackbarText,
    isLoading,
    checkoutResponse,
    paymentSuccess
  }
}
