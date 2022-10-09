import React, { useContext, createContext, useState, useEffect, useCallback } from 'react'
import Api from '../Api'
import { useAddress } from './useAddressData'
import { useCart } from './useCart'

const checkoutContext = createContext()
// Provider component that wraps your app and makes address object ...
// ... available to any child component that calls useAuth().
export function CheckoutProvider ({ children, ...props }) {
  const checkout = useCheckoutProvider({ ...props })
  return <checkoutContext.Provider value={checkout}>{children}</checkoutContext.Provider>
}

export const useCheckout = () => {
  return useContext(checkoutContext)
}

const INITIAL_STATE = {
  shippingAddressId: null,
  shippingMethodId: null,
  isUpdateProfileDataChecked: false,
  shipToFormData: {
    name: null,
    email: null,
    code: null,
    mobile: null
  },
  billingAddressId: null,
  paymentMethodId: null,
  isGiftOptionSelected: false,
  giftMessage: null
}

const INITIAL_PROMOCODE_DETAILS = {
  isLoading: false,
  status: null,
  statusText: null,
  promoCode: null,
  postPromoCodePrice: 0,
  price: 0,
  isBuyNow: null,
  items: null
}

function useCheckoutProvider ({ cart = useCart }) {
  const [checkoutData, setCheckoutData] = useState(INITIAL_STATE)
  const [shippingMethodList, setShippingMethodList] = useState([])
  const [allPaymentMethodList, setAllPaymentMethodList] = useState([])
  const [paymentMethodList, setPaymentMethodList] = useState([])

  const address = useAddress()

  const [vatData, setVatData] = useState({
    vat_percent: 0,
    is_vat_applicable: 'No'
  })
  const [promoCodeDetails, setPromoCodeDetails] = useState(INITIAL_PROMOCODE_DETAILS)
  const [promocodeValue, setPromoCodeValue] = useState(null)

  const {
    shippingAddressId,
    paymentMethodId,
    isGiftOptionSelected
  } = checkoutData

  // const fetchShippingMethodList = useCallback((shippingAddressId) => {
  //   if (isBrowser) {
  //     if (shippingAddressId) {
  //       const buyNow = JSON.parse(window.localStorage.getItem('buyNow'))
  //       Api.getShippingMethods({ shipping_address_id: shippingAddressId, is_buy_now: buyNow ? 'yes' : 'no' })
  //         .then((response) => {
  //           if (response.ok) {
  //             const { data, result } = response?.data
  //             if (result === 1) {
  //               setShippingMethodList(data?.map(item => ({ ...item, id: item.id.toString() })))
  //             } else if (result === 0) {
  //               setShippingMethodList([])
  //             }
  //           }
  //         })
  //     }
  //   }
  // }, [shippingAddressId])
  const removeCheckoutData = () => {
    setCheckoutData(INITIAL_STATE)
    setAllPaymentMethodList([])
    setPaymentMethodList([])
    setVatData({
      vat_percent: 0,
      is_vat_applicable: 'No'
    })
  }
  const fetchShippingMethodList = () => {
    if (!checkoutData.shippingAddressId) {
      return
    }
    setCheckoutData(state => ({ ...state, shippingMethodId: null }))
    const payload = { shipping_address_id: checkoutData.shippingAddressId, is_buy_now: 'no' }

    Api.getShippingMethods(payload)
      .then((response) => {
        if (response.ok) {
          const { data, result } = response?.data
          if (result === 1) {
            setShippingMethodList(data?.map(item => ({ ...item, id: item.id.toString() })))
            setCheckoutData(state => ({ ...state, shippingMethodId: data[0].id.toString() }))
          } else if (result === 0) {
            setShippingMethodList([])
          }
        }
      })
  }

  const fetchPaymentMethodList = () => {
    Api.getPaymentMethods()
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            setAllPaymentMethodList(response.data.data)
            setVatData(response.data.vat_data[0])
          } else {
            setVatData({
              vat_percent: 0,
              is_vat_applicable: 'No'
            })
          }
        }
      })
  }

  const resetPromoCodeDetails = () => {
    setPromoCodeDetails(INITIAL_PROMOCODE_DETAILS)
    setPromoCodeValue(null)
  }

  const applyPromoCode = (payload) => {
    const { promoCode, isBuyNow, items } = payload
    let _payload

    setPromoCodeDetails({ ...INITIAL_PROMOCODE_DETAILS, isLoading: true })
    setPromoCodeValue(promoCode)
    if (isBuyNow) {
      _payload = {
        promocode: promoCode,
        is_buy_now: isBuyNow ? 'Yes' : 'No',
        items
      }
    } else {
      _payload = {
        promocode: promoCode,
        is_buy_now: isBuyNow ? 'Yes' : 'No'
      }
    }

    Api.applyPromoCode(_payload)
      .then((response) => {
        let _promoCodeDetails = { ...INITIAL_PROMOCODE_DETAILS }

        if (response.ok) {
          const { result, message, data } = response.data

          if (result === 1) {
            const { status, status_text, price, discount_price } = data

            _promoCodeDetails = {
              status,
              statusText: status_text,
              price,
              postPromoCodePrice: discount_price,
              promoCode: payload.promoCode,
              isBuyNow: payload.isBuyNow,
              items: payload.items
            }

            setPromoCodeDetails(_promoCodeDetails)
          } else if (result === 0) {
            const { status, status_text, price, discount_price } = data

            _promoCodeDetails = {
              status,
              statusText: status_text,
              // price,
              // postPromoCodePrice: discount_price,
              promoCode: payload.promoCode,
              isBuyNow: payload.isBuyNow,
              items: payload.items
            }
            setPromoCodeDetails(_promoCodeDetails)
          }
        }

        setPromoCodeDetails({ ..._promoCodeDetails, isLoading: false })
      })
  }

  useEffect(() => {
    const { promoCode } = promoCodeDetails
    if (promoCode && promoCode !== '') {
      applyPromoCode({ promoCode })
    }

    fetchShippingMethodList()
  }, [cart().items])

  useEffect(() => {
    fetchShippingMethodList()
  }, [shippingAddressId])

  // useEffect(() => {
  //   if (checkoutData.billingAddressId) {
  //     fetchPaymentMethodList()
  //   }
  // }, [checkoutData.billingAddressId])

  useEffect(() => {
    if (allPaymentMethodList.length > 0) {
      if (isGiftOptionSelected) {
        setPaymentMethodList(allPaymentMethodList.filter(item => item.method_id !== 'COD'))
      } else {
        setPaymentMethodList(allPaymentMethodList)
      }
    }
  }, [allPaymentMethodList])

  useEffect(() => {
    if (paymentMethodList.length > 0) {
      // if (!paymentMethodId) {
      // const paymentMethod = paymentMethodList.find(item => item.method_id === paymentMethodId)
      // setCheckoutData({ paymentMethodId: paymentMethod.id })
      const selectedShippingAddress = address.shippingAddressList.find((l) => l.address_id === checkoutData.shippingAddressId)
      if (selectedShippingAddress?.country_id !== '1') {
        const list = paymentMethodList.filter((l) => l.method_id !== 'COD')
        console.log('list', list)
        setCheckoutData(state => ({ ...state, paymentMethodId: list[0].method_id }))
      } else {
        const list = paymentMethodList
        setCheckoutData(state => ({ ...state, paymentMethodId: list[0].method_id }))
      }
      // setCheckoutData(state => ({ ...state, paymentMethodId: paymentMethodList[0].method_id }))
      // }
    }
  }, [paymentMethodList, checkoutData.shippingAddressId])

  useEffect(() => {
    if (isGiftOptionSelected) {
      setPaymentMethodList(allPaymentMethodList.filter(item => item.method_id !== 'COD'))
      if (paymentMethodId === 'COD') {
        setCheckoutData(state => ({ ...state, paymentMethodId: null }))
      }
    } else {
      setPaymentMethodList(allPaymentMethodList)
    }
  }, [isGiftOptionSelected])

  return {
    setCheckoutData,
    fetchShippingMethodList,
    fetchPaymentMethodList,
    applyPromoCode,
    resetPromoCodeDetails,
    checkoutData,
    paymentMethodList,
    shippingMethodList,
    promoCodeDetails,
    vatData,
    removeCheckoutData,
    promocodeValue
  }
}
