const create = require('apisauce').create
const isBrowser = typeof window !== 'undefined'
const apiUrl = process.env.API_URL || 'https://niwli.com/van/webservice'

const URIS = {
  PRODUCT_LIST: '/product_list',
  LOGIN: '/login',
  SIGNUP: '/registration',
  GET_OTP: '/login_otp',
  LOGIN_WITH_OTP: '/login_with_otp',
  GET_COUNTRIES: '/country_list',
  WISHLIST: '/manage_wishlist',
  GET_STATES: '/state_list',
  GET_CITIES: '/city_list',
  GET_PINS: '/pincode_list',
  MANAGE_ADDRESS: '/manage_address',
  CHECKOUT: '/check_out',
  MANAGE_CART: '/manage_cart',
  MY_ORDERS: '/order_history',
  MY_ORDER_DETAILS: '/order_details',
  BUY_NOW: '/pay_now',
  GET_PAYMENT_METHODS: '/payment_method',
  MANAGE_PROFILE: '/manage_profile',
  PAYMENT_VERIFY: '/payment_verify',
  SHIPPING_METHOD_LIST: '/shipping_method_list',
  ADD_REVIEW: '/add_review',
  GET_REVIEW: '/review_list',
  GET_HOME_PAGE_DATA: '/home_page_api',
  GET_FAQ_DATA: '/faq',
  APPLY_PROMO: '/applyPromocode',
  GET_ABOUT: '/aboutUs',
  GET_PRIVACY_POLICY: '/privacyPolicy',
  GET_CONTACT: '/contact',
  GET_TERMS_OF_USE: '/termsOfUse',
  GET_RETURN_POLICY: '/returnReplacementPolicy',
  GET_SHIPPING_DELIVERY: '/shippingDelivery',
  MANAGE_ORDER: '/manage_order',
  CONTACT_FORM: '/contact_form',
  BULK_ORDER: '/bulk_order_inquiry',
  WALLET: '/my_wallet',
  SUBSCRIBE: '/subscribe',
  FORGOT_PASSWORD: '/forget_password'
}

const initialLang = isBrowser && window.location.pathname.split('/')[1]
const getToken = () => isBrowser ? window.localStorage.getItem('token') : ''

const createApiClient = (baseURL = apiUrl) => {
  const api = create({
    baseURL,
    headers: {
      Accept: 'application/json',
      // 'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      Lang: 'ar',
      Source: 'web',
      Token: getToken()
    }
    // timeout: 15000
  })

  const setAuthorizationHeader = (userId) =>
    api.setHeader('UserId', userId)

  const setHeaders = (params) => {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key]
        api.setHeader(key, element)
      }
    }
  }

  const loginUser = payload => {
    const body = {
      email: payload.email,
      password: payload.password
    }
    return api.post(URIS.LOGIN, body)
  }
  const manageWishlistData = payload => {
    const body = payload
    return api.post(URIS.WISHLIST, body)
  }
  const getOtp = payload => {
    const body = {
      mobile_no: payload.phone,
      code: payload.code
    }
    return api.post(URIS.GET_OTP, body)
  }
  const loginWithOtp = payload => {
    const body = {
      mobile_no: payload.phoneNumber,
      code: payload.data
    }
    return api.post(URIS.LOGIN_WITH_OTP, body)
  }
  const getCountries = () => {
    return api.post(URIS.GET_COUNTRIES)
  }
  const getStates = (payload) => {
    const body = {
      country_id: payload
    }
    return api.post(URIS.GET_STATES, body)
  }
  const getCities = (payload) => {
    const body = {
      state_id: payload
    }
    return api.post(URIS.GET_CITIES, body)
  }
  const getPins = (payload) => {
    const body = {
      city_id: payload
    }
    return api.post(URIS.GET_PINS, body)
  }
  const manageAddress = (payload) => {
    return api.post(URIS.MANAGE_ADDRESS, payload)
  }
  const getWallet = (payload) => {
    return api.post(URIS.WALLET)
  }
  const manageOrder = (payload) => {
    return api.post(URIS.MANAGE_ORDER, payload)
  }
  const forgotPasswordApi = (payload) => {
    return api.post(URIS.FORGOT_PASSWORD, payload)
  }
  const applyPromoCode = (payload) => {
    return api.post(URIS.APPLY_PROMO, payload)
  }
  const getShippingMethods = (payload) => {
    return api.post(URIS.SHIPPING_METHOD_LIST, payload)
  }

  const createAccount = payload => {
    const body = {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      code: payload.code,
      mobile_no: payload.mobile_no
    }
    return api.post(URIS.SIGNUP, body)
  }

  const checkout = payload => {
    const body = payload
    return api.post(URIS.CHECKOUT, body)
  }
  const getHomeContent = payload => {
    return api.post(URIS.GET_HOME_PAGE_DATA)
  }
  const submitContactForm = payload => {
    return api.post(URIS.CONTACT_FORM, payload)
  }
  const submitBulkOrderForm = payload => {
    return api.post(URIS.BULK_ORDER, payload)
  }
  const getFaqs = () => {
    return api.post(URIS.GET_FAQ_DATA)
  }
  const getTermsOfUse = () => {
    return api.post(URIS.GET_TERMS_OF_USE)
  }
  const getShippingDelivery = () => {
    return api.post(URIS.GET_SHIPPING_DELIVERY)
  }
  const getReturnPolicy = () => {
    return api.post(URIS.GET_RETURN_POLICY)
  }
  const getAbout = () => {
    return api.post(URIS.GET_ABOUT)
  }
  const getPrivacyPolicy = () => {
    return api.post(URIS.GET_PRIVACY_POLICY)
  }
  const getContact = () => {
    return api.post(URIS.GET_CONTACT)
  }
  const verifyPayment = payload => {
    return api.post(URIS.PAYMENT_VERIFY, payload)
  }
  const submitEmail = payload => {
    return api.post(URIS.SUBSCRIBE, payload)
  }
  const buyNow = payload => {
    const body = payload
    return api.post(URIS.BUY_NOW, body)
  }
  const addReview = payload => {
    const body = payload
    return api.post(URIS.ADD_REVIEW, body)
  }
  const getReviews = payload => {
    const body = payload
    return api.post(URIS.GET_REVIEW, body)
  }

  const fetchProductListData = payload => {
    return api.post(URIS.PRODUCT_LIST)
  }
  const getPaymentMethods = () => {
    return api.post(URIS.GET_PAYMENT_METHODS)
  }

  const manageCartData = payload => {
    return api.post(URIS.MANAGE_CART, payload)
  }
  const getMyOrders = payload => {
    return api.post(URIS.MY_ORDERS, payload)
  }
  const manageProfile = payload => {
    return api.post(URIS.MANAGE_PROFILE, payload)
  }
  const getMyOrdersDetails = payload => {
    const body = {
      order_id: payload
    }
    return api.post(URIS.MY_ORDER_DETAILS, body)
  }

  // kickoff our api functions
  return {
    // client modifiers
    setAuthorizationHeader,
    loginUser,
    fetchProductListData,
    createAccount,
    getOtp,
    loginWithOtp,
    getCountries,
    manageWishlistData,
    getStates,
    getCities,
    getPins,
    manageAddress,
    checkout,
    manageCartData,
    setHeaders,
    getMyOrders,
    getMyOrdersDetails,
    buyNow,
    getPaymentMethods,
    verifyPayment,
    manageProfile,
    getShippingMethods,
    addReview,
    getReviews,
    getHomeContent,
    getFaqs,
    applyPromoCode,
    getAbout,
    getContact,
    getPrivacyPolicy,
    getTermsOfUse,
    getReturnPolicy,
    getShippingDelivery,
    manageOrder,
    submitContactForm,
    submitBulkOrderForm,
    getWallet,
    submitEmail,
    forgotPasswordApi
  }
}

module.exports = createApiClient()
