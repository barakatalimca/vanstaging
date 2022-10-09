import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core'
import React, { useState, useEffect, useContext, createContext } from 'react'
import { VscClose } from 'react-icons/vsc'
import { useQuery, useQueryCache } from 'react-query'
import Api from '../Api'
import { navigate } from '../components/common/Router'
import { ADDRESS_LIST_DATA } from '../Constants'
import { useCart } from './useCart'

const addressContext = createContext()
const isBrowser = typeof window !== 'undefined'
// Provider component that wraps your app and makes address object ...
// ... available to any child component that calls useAuth().
export function ProvideAddressData ({ children }) {
  const address = useAddressData()
  return (
    <addressContext.Provider value={address}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={address.isSnackbarVisible}
        onClose={address.onCloseSnackbar}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={address.onCloseSnackbar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: '#000'
          }}
          message={<span id='client-snackbar'>{address.snackbarText}</span>}
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={address.onCloseSnackbar}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>
    </addressContext.Provider>)
}

// Hook for child components to get the address object ...
// ... and re-render when it changes.
export const useAddress = () => {
  return useContext(addressContext)
}

// Provider hook that creates address object and handles state
function useAddressData () {
  const [addressList, setAddressList] = React.useState([])
  const [states, setStates] = useState([])
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState(null)
  const [successMessage, setSuccessMessage] = React.useState(null)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [reload, setReload] = useState(0)
  const [cities, setCities] = useState([])
  const [pins, setPins] = useState([])
  const queryCache = useQueryCache()
  const { isLoading, error, data } = useQuery(
    ADDRESS_LIST_DATA,
    () => Api.manageAddress({ action: 'list' })
  )

  React.useEffect(() => {
    if (data && data.data) {
      setAddressList(data.data.data)
    }
  }, [data])

  const billingAddressList = addressList?.filter((l) => (l?.address_type === 'Billing')) || []
  const billingAddress = addressList?.find((l) => (l?.address_type === 'Billing'))

  const shippingAddressList = addressList?.filter((l) => (l?.address_type === 'Shipping')) || []

  const onCloseSnackbar = () => {
    setIsSnackbarVisible(false)
    setSnackbarText('')
  }

  const getStates = (payload) => {
    Api.getStates(payload)
      .then((res) => {
        if (res.data.result === 1) {
          setStates(res.data.data)
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
  const getPins = (payload) => {
    Api.getPins(payload)
      .then((res) => {
        if (res.data.result === 1) {
          setPins(res.data.data)
        }
      })
  }
  const emptyList = () => {
    setAddressList([])
  }
  const getAddressList = () => {
    Api.manageAddress({ action: 'list' })
      .then((res) => {
        if (res.data.result === 1) {
          setAddressList(res.data.data)
        } else {
        }
      })
  }
  const manageAddress = (payload) => {
    setLoading(true)
    Api.manageAddress(payload)
      .then((res) => {
        if (res.data.result === 1) {
          setLoading(false)
          setSuccessMessage(res.data.message)
          setReload(prev => prev + 1)
          setSnackbarText(res.data.message)
          setIsSnackbarVisible(true)
          queryCache.invalidateQueries(ADDRESS_LIST_DATA)
        } else {
          setLoading(false)
          setErrorMessage(res.data.message)
        }
      })
  }
  const deleteAddress = (payload) => {
    Api.manageAddress(payload)
      .then((res) => {
        if (res.data.result === 1) {
          setReload(prev => prev + 1)
          setSnackbarText(res.data.message)
          setIsSnackbarVisible(true)
          queryCache.invalidateQueries(ADDRESS_LIST_DATA)
        } else {
          setLoading(false)
          setErrorMessage(res.data.message)
        }
      })
  }

  return {
    getCities,
    getStates,
    getPins,
    manageAddress,
    onCloseSnackbar,
    billingAddressList,
    isSnackbarVisible,
    snackbarText,
    loading,
    billingAddress,
    shippingAddressList,
    addressList,
    reload,
    errorMessage,
    successMessage,
    deleteAddress,
    emptyList,
    getAddressList
  }
}
