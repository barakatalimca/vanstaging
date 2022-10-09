/* https://github.com/notrab/react-use-cart */
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryCache } from 'react-query'
import useLocalStorage from './useLocalStorage'
import { manageCartData } from '../Api'
import { CART_LIST_DATA } from '../Constants'
import { navigate } from '../components/common/Router'
import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core'
import { VscClose } from 'react-icons/vsc'
import { useAllProductsData } from './useAllProductsData'
import { useI18n } from '.'

const SET_ITEMS = 'SET_ITEMS'
const ADD_ITEM = 'ADD_ITEM'
const UPDATE_ITEM = 'UPDATE_ITEM'
const REMOVE_ITEM = 'REMOVE_ITEM'
const EMPTY_CART = 'EMPTY_CART'

const API_ACTION = {
  LIST: 'list',
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete'
}
const API_QUANTITY_ACTION = {
  ADD: 'add',
  REMOVE: 'remove'
}

const isBrowser = typeof window !== 'undefined'
const token = isBrowser ? window.localStorage.getItem('token') : null

export const initialState = {
  items: [],
  totalItems: 0,
  totalUniqueItems: 0,
  isEmpty: true
}

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({
  children,
  id: cartId,
  defaultItems = [],
  onSetItems,
  onItemAdd,
  onItemUpdate,
  onItemRemove,
  storage = useLocalStorage
}) => {
  const [manageCart, { status }] = useMutation(manageCartData)
  const queryCache = useQueryCache()
  const i18n = useI18n()
  const { data: serverCartListData } = useQuery(
    CART_LIST_DATA,
    () => manageCartData({ action: API_ACTION.LIST })
  )

  const id = cartId || createCartIdentifier()

  const [savedCart, saveCart] = storage(
    cartId ? `react-use-cart-${cartId}` : 'react-use-cart',
    JSON.stringify({
      id,
      ...initialState,
      items: defaultItems
    })
  )

  const [state, dispatch] = useReducer(reducer, JSON.parse(savedCart))

  const fetchItems = () => {
    manageCart({
      action: API_ACTION.LIST
    })
  }

  const _setItems = (serverCartListData) => {
    if (isBrowser) {
      const token = window.localStorage.getItem('token')
      if (token) {
        if (serverCartListData && serverCartListData.data && serverCartListData.data.data) {
          const items = serverCartListData.data.data
          const normalizedItems = items.map(item => ({
            ...item,
            id: item.product_sku_id,
            price: item.price,
            quantity: Number(item.quantity)
          }))
          setItems(normalizedItems)
        } else {
          setItems([])
        }
      }
    }
  }
  const setItems = (items) => {
    dispatch({
      type: SET_ITEMS,
      payload: items
    })

    onSetItems && onSetItems(items)
  }

  const addItem = (item, quantity = 1) => {
    if (quantity <= 0) return
    if (!item.id) throw new Error('You must provide an `id` for items')

    const currentItem = state.items.find((i) => i.id === item.id)

    if (!currentItem && !item.hasOwnProperty('price')) { throw new Error('You must pass a `price` for new items') }

    if (!currentItem) {
      const payload = { ...item, quantity }

      dispatch({ type: ADD_ITEM, payload })

      const _payload = {
        action: API_ACTION.ADD,
        product_id: item.product_id,
        product_sku_id: item.product_sku_id,
        quantity
      }

      if (item.is_bundle === 'Yes') {
        _payload.is_bundle = 'Yes'
        _payload.items = item.items
      }
      const _token = isBrowser ? window.localStorage.getItem('token') : null
      if (!_token) { } else {
        manageCart(_payload)
          // }
          .then((response) => {
            if (response.ok) {
              onItemAdd && onItemAdd(payload)
              setShowSnackbar(true)

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
                  }, 500)
                } else {
                  if (_locale === 'ar') {
                    setSnackbarText('اضيف بنجاح!')
                  } else {
                    setSnackbarText(response.data.message)
                  }
                }
              }

              queryCache.invalidateQueries(CART_LIST_DATA)
            }
          })
      }
    } else {
      const payload = { ...item, quantity: currentItem.quantity + quantity }

      dispatch({
        type: UPDATE_ITEM,
        id: item.id,
        payload
      })

      onItemUpdate && onItemUpdate(payload)
      const _token = isBrowser ? window.localStorage.getItem('token') : null
      if (!_token) { } else {
        manageCart({
          action: API_ACTION.UPDATE,
          product_id: item.product_id,
          product_sku_id: item.product_sku_id,
          // cart_id: currentItem.cart_id,
          is_bundle: item.is_bundle,
          quantity_action: API_QUANTITY_ACTION.ADD,
          quantity
        })
          // }
          .then((response) => {
            if (response.ok) {
              onItemAdd && onItemAdd(payload)
              setShowSnackbar(true)

              queryCache.invalidateQueries(CART_LIST_DATA)
              if (isBrowser) {
                const _locale = window.localStorage.getItem('gatsby-intl-language')
                if (_locale === 'ar') {
                  setSnackbarText('تم التحديث بنجاح')
                } else {
                  setSnackbarText(response.data.message)
                }
              }
              fetchItems()
            }
          })
      }
    }
  }

  const syncCart = () => {
    // if local storage contains items in cart,first add the items into server database
    if (state.items.length !== 0) {
      manageCart({
        action: API_ACTION.ADD,
        items: state.items
      })
        .then(() => {
          manageCart({
            action: API_ACTION.LIST
          })
        })
    } else {
      manageCart({
        action: API_ACTION.LIST
      })
    }
  }

  const updateItem = (id, payload) => {
    dispatch({ type: UPDATE_ITEM, id, payload })

    onItemUpdate && onItemUpdate(payload)
  }

  const updateItemQuantity = (item, quantity) => {
    if (quantity <= 0) {
      onItemRemove && onItemRemove(item)
      const currentItem = state.items.find(({ id }) => id === item.id)

      if (!currentItem) throw new Error('No such item to update')

      // const payload = { ...currentItem, quantity }
      dispatch({ type: REMOVE_ITEM, id: item.id })
      const _token = isBrowser ? window.localStorage.getItem('token') : null
      if (!_token) { } else {
        manageCart({
          action: API_ACTION.DELETE,
          product_sku_id: currentItem.product_sku_id,
          cart_id: currentItem.cart_id,
          product_id: currentItem.product_id,
          is_bundle: item.is_bundle,
          quantity_action: quantity > currentItem.quantity
            ? API_QUANTITY_ACTION.ADD
            : API_QUANTITY_ACTION.REMOVE
        })
          .then((response) => {
            if (response.ok) {
              // setShowSnackbar(true)
              // setSnackbarText(response.data.message)

              queryCache.invalidateQueries(CART_LIST_DATA)
            }
          })
      }
    }

    const currentItem = state.items.find(cartItem => cartItem.id === item.id)

    if (!currentItem) throw new Error('No such item to update')

    const payload = { ...currentItem, quantity }

    dispatch({
      type: UPDATE_ITEM,
      id: item.id,
      payload
    })
    const _token = isBrowser ? window.localStorage.getItem('token') : null
    if (!_token) { } else {
      manageCart({
        action: API_ACTION.UPDATE,
        product_sku_id: currentItem.product_sku_id,
        cart_id: currentItem.cart_id,
        product_id: currentItem.product_id,
        is_bundle: item.is_bundle,
        quantity_action: quantity > currentItem.quantity
          ? API_QUANTITY_ACTION.ADD
          : API_QUANTITY_ACTION.REMOVE
      })
        .then((response) => {
          if (response.ok) {
            onItemUpdate && onItemUpdate(payload)
            // setShowSnackbar(true)
            // setSnackbarText(response.data.message)

            queryCache.invalidateQueries(CART_LIST_DATA)
          }
        })
    }
  }

  const removeItem = (item) => {
    dispatch({ type: REMOVE_ITEM, id: item.id })
    const _token = isBrowser ? window.localStorage.getItem('token') : null
    if (!_token) { } else {
      manageCart({
        action: API_ACTION.DELETE,
        product_sku_id: item.product_sku_id,
        is_bundle: item.is_bundle,
        cart_id: item.cart_id,
        product_id: item.product_id
      })
        .then((response) => {
          if (response.ok) {
            onItemRemove && onItemRemove(id)
            setShowSnackbar(true)
            if (isBrowser) {
              const _locale = window.localStorage.getItem('gatsby-intl-language')
              if (_locale === 'ar') {
                setSnackbarText('تمت الإزالة بنجاح!')
              } else {
                setSnackbarText(response.data.message)
              }
            }
            queryCache.invalidateQueries(CART_LIST_DATA)
          }
        })
    }
  }

  const emptyCart = () =>
    dispatch({
      type: EMPTY_CART
    })

  const getItem = (id) => state.items.find((i) => i.id === id)

  const inCart = (id) => state.items.some((i) => i.id === id)

  const [buyNowActive, setBuyNowActive] = useState(false)

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState(false)
  const [buyNowData, setBuyNowData] = useState(null)

  const onCloseSnackbar = () => {
    setShowSnackbar(false)
    setSnackbarText('')
  }

  const addToBuyNow = (payload) => {
    if (isBrowser) {
      const token = window.localStorage.getItem('token')
      if (token === undefined || token === null) {
        navigate('/sign-in?referer=/buynow/checkout')
      } else {
        navigate('/checkout')
      }
      // window.localStorage.setItem('buyNow', JSON.stringify(payload))
      // setBuyNowActive(true)
      // setBuyNowData(payload)
    }
  }
  const updateBuyNowData = (payload) => {
    setBuyNowData(payload)
  }
  const url = window.location.href

  useEffect(() => {
    saveCart(JSON.stringify(state))
  }, [state, saveCart])

  useEffect(() => {
    _setItems(serverCartListData)
  }, [serverCartListData])

  React.useEffect(() => {
    if (isBrowser) {
      const buyNow = JSON.parse(window.localStorage.getItem('buyNow'))
      if (!buyNow) {
        // console.log('An error occured while performing buy now!')
        setBuyNowActive(false)
        setBuyNowData(null)
      } else {
        setBuyNowActive(true)
        setBuyNowData(buyNow)
      }
    }
  }, [url])
  return (
    <CartContext.Provider
      value={{
        ...state,
        status,
        buyNowActive,
        buyNowData,
        updateBuyNowData,
        fetchItems,
        getItem,
        inCart,
        setItems,
        addItem,
        updateItem,
        updateItemQuantity,
        removeItem,
        emptyCart,
        syncCart,
        addToBuyNow
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSnackbar}
        onClose={onCloseSnackbar}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={onCloseSnackbar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: '#000'
          }}
          message={<span id='client-snackbar'>{snackbarText}</span>}
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={onCloseSnackbar}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>
    </CartContext.Provider>
  )
}

const reducer = (state, action) => {
  switch (action.type) {
    case SET_ITEMS:
      return generateCartState(state, action.payload)

    case ADD_ITEM: {
      const items = [...state.items, action.payload]

      return generateCartState(state, items)
    }

    case UPDATE_ITEM: {
      const items = state.items.map((item) => {
        if (item.id !== action.id) return item

        return {
          ...item,
          ...action.payload
        }
      })

      return generateCartState(state, items)
    }

    case REMOVE_ITEM: {
      const items = state.items.filter((i) => i.id !== action.id)

      return generateCartState(state, items)
    }

    case EMPTY_CART:
      return initialState

    default:
      throw new Error('No action specified')
  }
}

export const createCartIdentifier = (len = 12) =>
  [...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join('')

const generateCartState = (state = initialState, items = []) => {
  const totalUniqueItems = calculateUniqueItems(items)
  const isEmpty = totalUniqueItems === 0

  return {
    ...initialState,
    ...state,
    items: calculateItemTotals(items),
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    cartTotal: calculateCartTotal(items),
    isEmpty
  }
}

const calculateItemTotals = (items = []) =>
  items.map((item) => ({
    itemTotal: item.price * item.quantity,
    ...item
  }))

const calculateCartTotal = (items = []) =>
  items.reduce((total, item) => total + item.quantity * item.price, 0)

const calculateTotalItems = (items = []) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

const calculateUniqueItems = (items = []) => items.length

export const getNormalizedProductDataForCart = ({
  isAuthenticated = false,
  productData,
  selectedProductSku,
  selectedProductSkuList,
  bundledProductListNormalizer = () => { }
}) => {
  if (!productData) {
    return []
  }

  const {
    product_id,
    product_slug,
    product_name,
    category_slug,
    product_sku_id,
    discount_price,
    description,
    price,
    image
  } = productData

  if (isAuthenticated) {
    let payload

    if (productData.is_bundle === 'Yes') {
      payload = {
        items: selectedProductSkuList.map(item => ({
          product_id: item.product_id,
          product_sku_ids: item.product_sku_ids.map(item => item.product_sku_id)
        })),
        product_id,
        product_sku_id,
        product_slug,
        category_slug,
        product_name,
        image,
        description,
        is_bundle: 'Yes',
        id: product_sku_id,
        price: discount_price && discount_price !== '' ? discount_price : price
      }
    } else {
      const {
        product_sku_id,
        price,
        discount_price
      } = selectedProductSku
      payload = {
        ...selectedProductSku,
        product_id,
        product_slug,
        category_slug,
        product_name,
        description,
        id: product_sku_id,
        price: discount_price && discount_price !== '' ? discount_price : price
      }
    }

    return payload
  }

  if (productData.is_bundle === 'Yes') {
    const result = []
    const selectedProductSkuListFlattened = selectedProductSkuList
      .map(item => item.product_sku_ids)
      .flat()

    for (const skuItem of selectedProductSkuListFlattened) {
      const skuItemInResult = result
        .findIndex(item => item.product_id === skuItem.product_id) > -1
        ? result.find(item => item.product_id === skuItem.product_id)
        : null

      if (!skuItemInResult) {
        result.push({
          product_id: skuItem.product_id,
          product_sku_ids: [skuItem.product_sku_id],
          quantity: 1
        })
      } else if (skuItemInResult.product_sku_ids.includes(skuItem.product_sku_id)) {
        skuItemInResult.product_sku_ids = skuItemInResult.product_sku_ids.concat(skuItem.product_sku_id)
        skuItemInResult.quantity = skuItemInResult.quantity + 1
      } else {
        result.push({
          product_id: skuItem.product_id,
          product_sku_ids: [skuItem.product_sku_id],
          quantity: 1
        })
      }
    }

    return {
      ...productData,
      id: productData.product_sku_id,
      is_bundle: 'Yes',
      bundled_product: bundledProductListNormalizer({ bundledProductList: result })
        .map(p => ({
          product_id: p.product_id,
          product_sku_id: p.product_sku_data[0].product_sku_id,
          product_name: p.product_name,
          image: p.image,
          attributes: p.product_sku_data[0].attributes,
          quantity: p.quantity
        }))
    }
  } else {
    const {
      product_sku_id,
      price,
      discount_price
    } = selectedProductSku

    return {
      ...selectedProductSku,
      product_id,
      product_slug,
      category_slug,
      product_name,
      description,
      id: product_sku_id,
      price: discount_price && discount_price !== '' ? discount_price : price
    }
  }
}

export const getNormalizedCartDataForServerSync = cartItems => {
  return cartItems.map(item => {
    if (item.is_bundle === 'Yes') {
      return {
        product_id: item.product_id,
        product_sku_id: item.product_sku_id,
        quantity: item.quantity,
        is_bundle: 'Yes',
        items: item.bundled_product.reduce((result = [], skuItem) => {
          const skuItemInResult = result &&
            result.length > 0 &&
            result.findIndex(item => item.product_id === skuItem.product_id) > -1
            ? result.find(item => item.product_id === skuItem.product_id)
            : null
          const qtyArray = Array.from({ length: skuItem.quantity })

          if (!skuItemInResult) {
            result.push({
              product_id: skuItem.product_id,
              product_sku_ids: qtyArray.map(_ => skuItem.product_sku_id)
            })
          } else {
            qtyArray.forEach(_ => skuItemInResult.product_sku_ids.push(skuItem.product_sku_id))
          }

          return result
        }, [])
      }
    } else {
      return {
        product_id: item.product_id,
        product_sku_id: item.product_sku_id,
        quantity: item.quantity
      }
    }
  })
}
