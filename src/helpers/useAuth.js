import React, { useState, useEffect, useContext, createContext } from 'react'
import { useQueryCache } from 'react-query'
import groupBy from 'lodash/groupBy'
import { VscClose } from 'react-icons/vsc'
import Api from '../Api'
import { navigate } from '../components/common/Router'
import { ADDRESS_LIST_DATA, CART_LIST_DATA, PRODUCT_LIST_DATA } from '../Constants'
import { getNormalizedCartDataForServerSync } from './useCart'
import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core'

const authContext = createContext()

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth ({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>
    {children}
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={auth.isSnackbarVisible}
      onClose={auth.onCloseSnackbar}
      autoHideDuration={4000}
      action={
        <>
          <IconButton size='large' aria-label='close' color='inherit' onClick={auth.onCloseSnackbar}>
            <VscClose fontSize='large' />
          </IconButton>
        </>
      }
    >
      <SnackbarContent
        style={{
          backgroundColor: '#000'
        }}
        message={<span id='client-snackbar'>{auth.snackbarText}</span>}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={auth.onCloseSnackbar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      />
    </Snackbar>
         </authContext.Provider>
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => useContext(authContext)

// Provider hook that creates auth object and handles state
function useProvideAuth () {
  const queryCache = useQueryCache()
  const [user, setUser] = useState(null)
  const [countries, setCountries] = useState([])
  const [reload, setReload] = useState(0)
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [pins, setPins] = useState([])
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null)
  const [selectedBillingAddress, setBillingAddress] = useState(null)
  const [selectedPaymentMethod, setPaymentMethod] = useState(null)
  const [otp, setOtp] = useState(null)
  const [userName, setUserName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [code, setCode] = useState(null)
  const [email, setEmail] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isLoggedIn, setIsLoggedin] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResendLoading] = useState(false)
  const [formData, setFormData] = useState('')
  const [otpError, setOtpError] = useState(false)
  const isBrowser = typeof window !== 'undefined'
  const isUserProfileDataAlreadySaved = user && Object.values(user).every(value => value && value !== '')

  const writeToStorage = (data) => {
    if (!isBrowser) return
    window.localStorage.setItem('profile-data', JSON.stringify({
      name: data.name,
      email: data.email,
      code: data.code,
      mobile_no: data.mobile_no
    }))
  }
  const onCloseSnackbar = () => {
    setIsSnackbarVisible(false)
    setSnackbarText('')
  }
  const readFromStorage = async () => {
    if (!isBrowser) return
    const token = await window.localStorage.getItem('token')
    if (!token) return
    let profileData
    if (token) {
      Api.setHeaders({ Token: token })
      profileData = await window.localStorage.getItem('profile-data')
      if (!profileData) return
      setUser({ ...JSON.parse(profileData), isLoggedIn: true })
    }

    return JSON.parse(profileData)
  }
  const getProfile = () => {
    const payload = {
      action: 'list'
    }
    Api.manageProfile(payload)
      .then((response) => {
        setUser({ ...response.data.data, isLoggedIn: true })
      })
  }

  const performPostLoginProcesses = (data) => {
    writeToStorage(data)
    setUser({ ...data, isLoggedIn: true })
    Api.setHeaders({ Token: data.token })
    queryCache.invalidateQueries()

    const cart = JSON.parse(window.localStorage.getItem('react-use-cart'))

    if (cart?.items?.length > 0) {
      Api.manageCartData({
        action: 'add',
        items: getNormalizedCartDataForServerSync(cart?.items)
      })
        .then(() => {
          queryCache.invalidateQueries(CART_LIST_DATA)
        })
    }

    setTimeout(() => {
      if (isBrowser) {
        const history = window.location.href
        if (history.includes('checkout')) {
          navigate('/checkout')
        } else {
          navigate('/user/my-profile', { replace: true })
        }
      }

      setLoading(false)
    }, 1000)
  }

  // ... to save the user to state.
  const signin = (payload) => {
    setLoading(true)

    Api.loginUser(payload)
      .then((response) => {
        const { result, data, message } = response.data
        if (result === 1) {
          performPostLoginProcesses(data)
          if (isBrowser) {
            const cart = JSON.parse(window.localStorage.getItem('react-use-cart'))
            window.localStorage.setItem('token', data.token)
          }
        } else {
          setInvalid(true)
          setIsSnackbarVisible(true)
          setSnackbarText(message)
          setLoading(false)
        }
      })
    // return firebase
    //   .auth()
    //   .signInWithEmailAndPassword(email, password)
    //   .then(response => {
    //     setUser(response.user)
    //     return response.user
    //   })
  }
  const setShippingAddress = (payload) => {
    setSelectedShippingAddress(payload)
  }
  const setSelectedBillingAddress = (payload) => {
    setBillingAddress(payload)
  }
  const setPayment = (payload) => {
    setPaymentMethod(payload)
  }
  const getOtp = (payload) => {
    setOtpError(false)
    if (payload.type === 'resend') {
      setResendLoading(true)
    } else {
      setLoading(true)
    }
    Api.getOtp(payload)
      .then((response) => {
        if (isBrowser) {
          if (response.ok) {
            if (response.data.result === 1) {
              if (payload.type === 'resend') {
                setResendLoading(false)
              } else {
                setLoading(false)
              }
              const otpReceived = response.data.OTP
              window.localStorage.setItem('otp', otpReceived)
              setOtp(otpReceived)
              window.localStorage.setItem('mobile_no', payload.phone)
              setPhone(payload.phone)
            } else {
              setOtpError(true)
              if (payload.type === 'resend') {
                setResendLoading(false)
              } else {
                setLoading(false)
              }
            }
          }
        }
      })
  }
  const signInWithOtp = (data) => {
    setLoading(true)
    if (isBrowser) {
      const phoneNumber = window.localStorage.getItem('mobile_no')
      const payload = {
        phoneNumber, data
      }
      Api.loginWithOtp(payload)
        .then((response) => {
          const { data, message, result } = response.data
          if (result === 1) {
            performPostLoginProcesses(data)
            window.localStorage.setItem('token', data.token)
          } else {
            setInvalid(true)
            setLoading(false)
            setIsSnackbarVisible(true)
            setSnackbarText(message)
          }
        })
    } else { }
  }
  const signup = (payload) => {
    setLoading(true)
    setErrorMessage(null)
    Api.createAccount(payload)
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            const data = {
              email: payload.email,
              password: payload.password
            }
            setTimeout(() => {
              signin(data)
            }, 1000)
          } else {
            setInvalid(true)
            setLoading(false)
            setErrorMessage(response.data.message)
          }
        }
      })
  }
  const editProfile = (payload) => {
    setLoading(true)
    setErrorMessage(null)
    console.log('auth edit', payload)
    const resp = Api.manageProfile(payload)
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            setLoading(false)

            writeToStorage(payload)
            setUser({ ...payload, isLoggedIn: true })
            navigate('/user/my-profile')
          } else {
            setInvalid(true)
            setLoading(false)
            setErrorMessage(response.data.message)
          }
        }
      })
  }
  const signout = () => {
    if (isBrowser) {
      window.localStorage.clear()
      setUser(null)
      setTimeout(() => {
        navigate('/sign-in')
        Api.setHeaders({ Token: '' })
        queryCache.invalidateQueries(PRODUCT_LIST_DATA)
      }, 500)
      setTimeout(() => {
        queryCache.invalidateQueries(ADDRESS_LIST_DATA)
      }, 1000)
    }
  }

  const getStates = (payload) => {
    Api.getStates(payload)
      .then((res) => {
        if (res.data.result === 1) {
          setStates(res.data.data)
        }
      })
  }
  const forgotPassword = (payload) => {
    setLoading(true)
    setErrorMessage(null)
    Api.forgotPasswordApi(payload)
      .then((response) => {
        if (response.ok) {
          // setStates(res.data.data)
          setReload(prev => prev + 1)
          setLoading(false)
        }
      })
  }
  const getCities = (payload) => {
    Api.getCities(payload)
      .then((res) => {
        if (res.data.result === 1) {
          setCities(res.data.data)
        }
      })
  }
  // const getPins = (payload) => {
  //   Api.getPins(payload)
  //     .then((res) => {
  //       if (res.data.result === 1) {
  //         setPins(res.data.data)
  //       }
  //     })
  // }
  const getCountries = (payload) => {
    Api.getCountries()
      .then((res) => {
        if (res.data?.result === 1) {
          setCountries(res.data.data)
        }
      })
  }
  const manageAddress = (payload) => {
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    Api.manageAddress(payload)
      .then((res) => {
        if (res.data.result === 1) {
          setLoading(false)
          setReload(prev => prev + 1)
          setSuccessMessage(res.data.message)
        } else {
          setLoading(false)
          setErrorMessage(res.data.message)
        }
      })
  }

  useEffect(() => {
    readFromStorage()
  }, [])

  useEffect(() => {
    getCountries()
    setTimeout(() => {
      setSuccessMessage(false)
      setErrorMessage(false)
    }, 2000)
  }, [])

  return {
    user,
    isLoggedIn,
    isUserProfileDataAlreadySaved,
    errorMessage,
    userName,
    invalid,
    loading,
    email,
    phone,
    otp,
    code,
    otpError,
    countries,
    states,
    cities,
    pins,
    reload,
    successMessage,
    selectedShippingAddress,
    selectedBillingAddress,
    selectedPaymentMethod,
    formData,
    resetLoading,
    signin,
    setUser,
    signup,
    signout,
    getCities,
    getOtp,
    signInWithOtp,
    getCountries,
    getStates,
    // getPins,
    manageAddress,
    setShippingAddress,
    setSelectedBillingAddress,
    setPayment,
    editProfile,
    forgotPassword,
    getProfile,
    writeToStorage,
    onCloseSnackbar,
    snackbarText,
    isSnackbarVisible
  }
}
