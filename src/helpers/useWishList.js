// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from 'react'
import Api from '../Api'
import { navigate } from '../components/common/Router'
import { useQueryCache } from 'react-query'
import { PRODUCT_LIST_DATA } from '../Constants'
import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core'
import { VscClose } from 'react-icons/vsc'
import _ from 'lodash'
import { useI18n } from '.'
const wishListContext = createContext()
const isBrowser = typeof window !== 'undefined'
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideWishList({ children }) {
  const wishList = useProvideWishList()

  return (
    <wishListContext.Provider value={wishList}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={wishList.isSnackbarVisible}
        onClose={wishList.onCloseSnackbar}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={wishList.onCloseSnackbar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: '#000'
          }}
          message={<span id='client-snackbar'>{wishList.snackbarText}</span>}
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={wishList.onCloseSnackbar}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>
    </wishListContext.Provider>)
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useWishList = () => {
  return useContext(wishListContext)
}

// Provider hook that creates auth object and handles state
function useProvideWishList() {
  const [isEmpty, setIsEmpty] = useState(true)
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [data, setData] = useState([])
  const queryCache = useQueryCache()
  const [getOrderId, setOrderId] = useState(null)
  const i18n = useI18n()

  const setOrderItemId = (item) => {
    setOrderId(item?.order_id)
  }
  const getWishList = () => {
    Api.manageWishlistData({ action: 'list' })
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            setData(response.data.data)
            setIsEmpty(false)
            setLoading(false)
            queryCache.invalidateQueries(PRODUCT_LIST_DATA)
          } else {
            setIsEmpty(true)
            setLoading(false)
          }
        }
      })
  }
  const onCloseSnackbar = () => {
    setIsSnackbarVisible(false)
    setSnackbarText('')
  }

  const addToWishList = (productSku) => {
    if (isBrowser) {
      const token = window.localStorage.getItem('token')
      if (token) {
        const {
          product_id,
          product_sku_id
        } = productSku

        const payload = {
          product_id,
          product_sku_id,
          action: 'add'
        }

        Api.manageWishlistData(payload)
          .then((response) => {
            if (response.ok) {
              if (response.data.result === 1) {
                Api.fetchProductListData()
                setReload(reload + 1)
                // setData(response.data.data)
                setIsEmpty(false)
                setLoading(false)
                setIsSnackbarVisible(true)
                const _locale = isBrowser ? window.localStorage.getItem('gatsby-intl-language') : ''
                if (_locale === 'ar') {
                  setSnackbarText('أضيف لقائمة الأماني!')
                } else {
                  setSnackbarText('Added To Wishlist!')
                }
                queryCache.invalidateQueries(PRODUCT_LIST_DATA)
              } else {
                setIsEmpty(true)
                setLoading(false)
              }
            }
          })
      } else {
        setIsSnackbarVisible(true)
        const _locale = isBrowser ? window.localStorage.getItem('gatsby-intl-language') : ''
        if (_locale === 'ar') {
          setSnackbarText('الرجاء تسجيل الدخول!')
        } else {
          setSnackbarText('Please Login!')
        }
      }
    }
    setLoading(true)
  }
  const deletFromWishList = (productSku) => {
    const {
      product_id,
      product_sku_id,
      wished_id
    } = productSku

    const payload = {
      product_id,
      product_sku_id,
      wish_id: wished_id,
      action: 'delete'
    }
    setLoading(true)
    Api.manageWishlistData(payload)
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            Api.fetchProductListData()
            getWishList()
            setIsEmpty(false)
            setIsEmpty(false)
            setIsSnackbarVisible(true)
            setReload(reload + 1)

            if (isBrowser) {
              const moveToCart = window.localStorage.getItem('moveToCart')
              const _locale = window.localStorage.getItem('gatsby-intl-language')
              if (moveToCart) {
                if (_locale === 'ar') {
                  setSnackbarText('تم الانتقال إلى عربة التسوق بنجاح!')
                } else {
                  setSnackbarText('Successfully Moved To Cart!')
                }
                setTimeout(() => {
                  window.localStorage.removeItem('moveToCart')
                }, 2000)
              } else {
                if (_locale === 'ar') {
                  setSnackbarText('تمت الإزالة بنجاح!')
                } else {
                  setSnackbarText('Successfully Removed!')
                }
              }
            }
            queryCache.invalidateQueries(PRODUCT_LIST_DATA)
          } else {
            setIsEmpty(true)
            setLoading(false)
          }
        }
      })
  }
  useEffect(() => {

  }, [])
  // Return the user object and auth methods
  return {
    isEmpty,
    data,
    getOrderId,
    loading,
    isSnackbarVisible,
    snackbarText,
    reload,
    setOrderItemId,
    getWishList,
    addToWishList,
    deletFromWishList,
    onCloseSnackbar
  }
}
