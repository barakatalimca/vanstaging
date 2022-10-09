import React, { useEffect, useState } from 'react'
import {
  withStyles,
  Box,
  Button,
  Drawer,
  Typography,
  IconButton,
  Grid,
  Divider,
  FormControl,
  SnackbarContent,
  Snackbar,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  RadioGroup,
  Radio,
  FormControlLabel
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { BiArrowBack } from 'react-icons/bi'
import clsx from 'clsx'

import ExchangeProductItem from './ExchangeProductItem'
import ProductListTabs from './ProductListTabs'
import ProductDetailsContent from './ProductDetailsContent'
import ProductDetailSlider from './ProductDetailSlider'
import CheckoutStepSectionTitle from './CheckoutStepSectionTitle'
import { useAuth, useCheckout, useCustomerOrderData, useI18n, useWallet } from '../helpers'
import AddressListItem from './AddressListItem'
import PaymentMethodList from './PaymentMethodList'
import ProductSkuItemBase from './ProductSkuItemBase'
import { VscClose } from 'react-icons/vsc'
import Api from '../Api'

const getTotalPrice = (sum, item) => sum + Number(item.discount_price && item.discount_price !== '' ? item.discount_price : item.price) * Number(item.quantity)

const ExchangeOrderInteraction = ({ orderDetailsData, isActive = false, onHide = () => { }, classes }) => {
  const auth = useAuth()
  const customerOrderData = useCustomerOrderData()
  const checkout = useCheckout()

  const [isExchangeDrawerOpen, setIsExchangeDrawerOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isExchangeSelectionProductListDrawerOpen, setIsExchangeSelectionProductListDrawerOpen] = useState(false)
  const [isExchangeSelectionProductDetailDrawerOpen, setIsExchangeSelectionProductDetailDrawerOpen] = useState(false)
  const [isExchangeConfirmDrawerOpen, setIsExchangeConfirmDrawerOpen] = useState(false)
  const [selectedReturnItem, setSelectedReturnItem] = useState(null)
  const [selectedProductListItem, setSelectedProductListItem] = useState(null)
  const [selectedProductSku, setSelectedProductSku] = useState(null)
  const [returnExchangeProductSkuPairList, setReturnExchangeProductSkuPairList] = useState([])
  const [priceDiff, setPriceDiff] = useState(0)
  const [shippingCharge, setShippingCharge] = useState(0)
  const [_shippingMethodId, setShippingMethodId] = useState(null)
  const [shippingMethodList, setShippingMethodList] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const wallet = useWallet()
  const i18n = useI18n()
  const { items } = orderDetailsData

  const formattedAmountTotal = `${Math.abs(priceDiff)}`
  // `${orderDetailsData.items[0].currency} ${productSkuList.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)}`

  const onCloseDrawer = () => {
    setIsExchangeDrawerOpen(false)
    setReturnExchangeProductSkuPairList([])
    onHide()
  }

  const onCloseExchangeSelectionProductListDrawer = () => {
    setIsExchangeSelectionProductListDrawerOpen(false)
  }

  const onCloseExchangeSelectionProductDetailDrawer = () => {
    setIsExchangeSelectionProductDetailDrawerOpen(false)
  }

  const onCloseExchangeConfirmDrawer = () => {
    setIsExchangeConfirmDrawerOpen(false)
    setShippingMethodId(null)
    setShippingCharge(null)
    setPaymentMethod(null)
  }

  const onSelectExchangePlaceholderItem = (item) => {
    setIsExchangeSelectionProductListDrawerOpen(true)
    setSelectedReturnItem(item)
  }

  const onSelectExchangeProductListItem = (item) => {
    setIsExchangeSelectionProductDetailDrawerOpen(true)
    setSelectedProductListItem(item)
  }

  const onSelectExchangeItem = () => {
    setIsExchangeSelectionProductDetailDrawerOpen(false)
    setIsExchangeSelectionProductListDrawerOpen(false)
    setReturnExchangeProductSkuPairList(list => [
      ...list,
      {
        returnItem: selectedReturnItem,
        exchangeItem: { ...selectedProductSku, quantity: 1 }
      }
    ])
  }

  const onRemoveExchangeItem = (item) => {
    setReturnExchangeProductSkuPairList(list => list.filter(({ exchangeItem }) => (
      exchangeItem.product_sku_id !== item.product_sku_id
    )))
  }

  const onSelectProceedWithExchange = () => {
    setIsExchangeConfirmDrawerOpen(true)
    if (priceDiff > 0) {
      checkout.fetchPaymentMethodList()
    }
  }

  const onSelectExchangeConfirm = () => {
    setLoading(true)
    customerOrderData.manageOrder({
      action: 'exchange',
      order_id: orderDetailsData.order_id,
      items: returnExchangeProductSkuPairList.map(({ returnItem, exchangeItem }) => (
        {
          return: {
            product_id: returnItem.product_id,
            product_sku_id: returnItem.product_sku_id,
            quantity: returnItem.quantity
          },
          exchange: {
            product_id: exchangeItem.product_id,
            product_sku_id: exchangeItem.product_sku_id,
            quantity: exchangeItem.quantity
          }
        }
      )),
      shipping_address_id: orderDetailsData.shipping_address.address_id,
      billing_address_id: orderDetailsData.billing_address.address_id,
      payment_method: paymentMethod ? paymentMethod === 'WALLET' ? 'WALLET' : paymentMethod.method_id : '',
      price_diff: Number(priceDiff),
      shipping_mode: _shippingMethodId
    })
      .then(response => {
        if (response.ok) {
          setIsExchangeDrawerOpen(false)
          setLoading(false)
          setOpenDialog(false)
          setIsExchangeConfirmDrawerOpen(false)
        }
      })
  }

  const onChangeQuantityReturnItem = ({ item, quantity }) => {
    setReturnExchangeProductSkuPairList(list => list.map(returnExchangePair => {
      if (returnExchangePair.returnItem.product_sku_id === item.product_sku_id) {
        return {
          ...returnExchangePair,
          returnItem: {
            ...returnExchangePair.returnItem,
            quantity
          }
        }
      }

      return returnExchangePair
    }))
  }

  const onChangeQuantityExchangeItem = ({ item, quantity }) => {
    setReturnExchangeProductSkuPairList(list => list.map(returnExchangePair => {
      if (returnExchangePair.exchangeItem.product_sku_id === item?.product_sku_id) {
        return {
          ...returnExchangePair,
          exchangeItem: {
            ...returnExchangePair.exchangeItem,
            quantity
          }
        }
      }

      return returnExchangePair
    }))
  }

  const getExchangeItem = (item) => {
    if (returnExchangeProductSkuPairList.length === 0) {
      return null
    }

    const returnExchangePair = returnExchangeProductSkuPairList
      .find(({ returnItem }) => returnItem.product_sku_id === item?.product_sku_id)

    return returnExchangePair ? returnExchangePair.exchangeItem : null
  }

  const footerInfoText = () => {
    if (priceDiff === 0) {
      return <>{i18n.locale === 'ar' ? 'لا فرق في السعر' : 'No difference in price'}</>
    }

    if (priceDiff > 0) {
      return <>{i18n.locale === 'ar' ? 'انت تحتاج للدفع' : 'You need to pay'}</>
    }

    return <>{i18n.locale === 'ar' ? 'سوف تتلقى في محفظتك' : 'You will receive in your wallet'}</>
  }

  useEffect(() => {
    if (isActive) {
      setIsExchangeDrawerOpen(true)
    }
  }, [isActive])

  useEffect(() => {
    if (returnExchangeProductSkuPairList.length > 0) {
      const totalPriceExchangeItems = returnExchangeProductSkuPairList
        .map(({ exchangeItem }) => exchangeItem)
        .reduce(getTotalPrice, 0)

      const totalPriceReturnItems = returnExchangeProductSkuPairList
        .map(({ returnItem }) => returnItem)
        .reduce(getTotalPrice, 0)

      setPriceDiff(totalPriceExchangeItems - totalPriceReturnItems)
    } else {
      setPriceDiff(0)
    }
  }, [returnExchangeProductSkuPairList])

  React.useEffect(() => {
    if (wallet?.isWalletSelected) {
      setPaymentMethod('WALLET')
    } else {
      setPaymentMethod(null)
    }
  }, [wallet?.isWalletSelected])

  React.useEffect(() => {
    const _items = returnExchangeProductSkuPairList.map((l) => l.exchangeItem)
    const shippingAddressId = orderDetailsData.shipping_address.address_id
    Api.getShippingMethods({ shipping_address_id: shippingAddressId, is_buy_now: 'yes', items: _items })
      .then((response) => {
        const { data, result } = response?.data
        if (result === 1) {
          setShippingMethodList(data)
        }
      })
  }, [returnExchangeProductSkuPairList, orderDetailsData])

  const onChangeShippingMethod = (e) => {
    console.log('e.target.value', e.target.value)
    setShippingMethodId(e.target.value)
    const filter = shippingMethodList.find((l) => l.id === parseInt(e.target.value))
    const _price = parseInt(filter?.price)
    setShippingCharge(_price)
  }

  const _vatAmount = Number(checkout?.vatData.vat_percent) * priceDiff / 100 || 0
  const shippingMethodId = parseInt(_shippingMethodId)
  const _shippingCharge = parseInt(shippingCharge) || 0
  const codCharge = paymentMethod?.method_id === 'COD' ? 5 : 0
  return (
    <>
      {/* EXCHANGE */}
      <Drawer anchor='right' open={isExchangeDrawerOpen} onClose={onCloseDrawer}>
        <>
          <Box className={classes.drawerContent}>
            <Box display='flex' alignItems='center' paddingBottom={2}>
              <IconButton onClick={onCloseDrawer}>
                <BiArrowBack />
              </IconButton>
              <Box width={20} />
              <Typography variant='h5'><FormattedMessage id='Exchange Items' /></Typography>
            </Box>
            <Box display='flex' flexDirection='column' flexGrow={1}>
              {/* {console.log('returnExchangeProductSkuPairList', JSON.stringify(returnExchangeProductSkuPairList))} */}
              {items.every(item => item.can_exchage === 'No') && <Typography variant='body2'><FormattedMessage id='No items to exchange' /></Typography>}
              {items.filter(item => item.can_exchage === 'Yes').map(item => (
                <ExchangeProductItem
                  key={item.product_id}
                  data={item}
                  onSelect={onSelectExchangePlaceholderItem}
                  exchangeItem={getExchangeItem(item)}
                  onChangeReturnQuantity={onChangeQuantityReturnItem}
                  onChangeExchangeQuantity={onChangeQuantityExchangeItem}
                  onRemoveExchangeItem={onRemoveExchangeItem}
                />
              ))}
            </Box>
          </Box>
          <Box className={classes.drawerFooter}>
            <Box textAlign='left'>
              <Typography variant='caption'>{footerInfoText()}</Typography>
              <Typography variant='body1'><b><FormattedMessage id='₹' /> {formattedAmountTotal}</b></Typography>
            </Box>
            <Button
              variant='contained'
              color='secondary'
              size='large'
              onClick={onSelectProceedWithExchange}
              disabled={returnExchangeProductSkuPairList.length === 0}
            >
              <FormattedMessage id='Proceed with Exchange' />{` (${returnExchangeProductSkuPairList.length})`}
            </Button>
          </Box>
        </>
      </Drawer>
      {/* EXCHANGE SELECTION PRODUCT LIST */}
      <Drawer
        anchor='right'
        open={isExchangeSelectionProductListDrawerOpen}
        onClose={onCloseExchangeSelectionProductListDrawer}
      >
        <>
          <Box className={clsx(classes.drawerContent, classes.exchangeSelectionDrawerContent)}>
            <Box display='flex' alignItems='center' paddingBottom={2}>
              <IconButton onClick={onCloseExchangeSelectionProductListDrawer}>
                <BiArrowBack />
              </IconButton>
              <Box width={20} />
              <Typography variant='h5'><FormattedMessage id='Exchange Item' /></Typography>
            </Box>
            <Box display='flex' flexDirection='column'>
              {/* <Grid container>
                <Grid item md={6}>
                  <ProductSkuItemBase
                    data={selectedReturnItem}
                  />
                </Grid>
              </Grid> */}
              <ProductListTabs onClickItem={onSelectExchangeProductListItem} />
            </Box>
          </Box>
        </>
      </Drawer>
      {/* EXCHANGE SELECTION PRODUCT DETAIL */}
      <Drawer
        anchor='right'
        open={isExchangeSelectionProductDetailDrawerOpen}
        onClose={onCloseExchangeSelectionProductDetailDrawer}
      >
        <>
          <Box className={clsx(classes.drawerContent, classes.exchangeSelectionDrawerContent)}>
            <Box display='flex' alignItems='center' paddingBottom={2}>
              <IconButton onClick={onCloseExchangeSelectionProductDetailDrawer}>
                <BiArrowBack />
              </IconButton>
              <Box width={20} />
              <Typography variant='h5'><FormattedMessage id='Exchange Item' /></Typography>
            </Box>
            <Box display='flex' flexDirection='column'>
              <Box className={classes.productDetailSlider}>
                <ProductDetailSlider
                  imgList={selectedProductSku?.image_list}
                  height='66vh'
                />
              </Box>
              <Box marginBottom={4}>
                <ProductDetailsContent
                  data={selectedProductListItem}
                  onChangeAttributes={setSelectedProductSku}
                />
              </Box>
            </Box>
          </Box>
          <Box className={classes.drawerFooter}>
            <Button
              size='large'
              color='primary'
              variant='contained'
              className={classes.actionButton}
              onClick={onSelectExchangeItem}
            >
              <FormattedMessage id='Select Item' />
            </Button>
          </Box>
        </>
      </Drawer>
      {/* EXCHANGE CONFIRM */}
      <Drawer
        anchor='right'
        open={isExchangeConfirmDrawerOpen}
        onClose={onCloseExchangeConfirmDrawer}
      >
        <>
          <Box className={classes.drawerContent}>
            <Box display='flex' alignItems='center' paddingBottom={2}>
              <IconButton onClick={onCloseExchangeConfirmDrawer}>
                <BiArrowBack />
              </IconButton>
              <Box width={20} />
              <Typography variant='h5'><FormattedMessage id='Confirm Exchange' /></Typography>
            </Box>
            <Box display='flex' flexDirection='column'>
              <CheckoutStepSectionTitle><FormattedMessage id='Return' /></CheckoutStepSectionTitle>
              {/* <Box marginBottom={2}> */}
              {returnExchangeProductSkuPairList.map(({ returnItem }) => (
                <ProductSkuItemBase
                  data={returnItem}
                  key={returnItem.product_sku_id}
                />
              ))}
              {/* </Box> */}
              <Box height={40} />
              <CheckoutStepSectionTitle><FormattedMessage id='Exchange' /></CheckoutStepSectionTitle>
              {/* <Box marginBottom={2}> */}
              {returnExchangeProductSkuPairList.map(({ exchangeItem }) => (
                <ProductSkuItemBase
                  data={exchangeItem}
                  key={exchangeItem.product_sku_id}
                />
              ))}
              {/* </Box> */}
              <Box paddingY={3}>
                <Divider />
              </Box>
              <CheckoutStepSectionTitle><FormattedMessage id='Pick Up From / Ship To' /></CheckoutStepSectionTitle>
              <Box marginBottom={2}>
                <Typography variant='caption'><FormattedMessage id='Name' /></Typography>
                <Typography variant='body2'>{orderDetailsData.shipping_address?.name}</Typography>
              </Box>
              <Box marginBottom={2}>
                <Typography variant='caption'><FormattedMessage id='Phone' /></Typography>
                <Typography variant='body2'>{`${orderDetailsData.shipping_address?.code}-${orderDetailsData.shipping_address?.mobile_no}`}</Typography>
              </Box>
              <Box>
                <Typography variant='caption'><FormattedMessage id='Email' /></Typography>
                <Typography variant='body2'>{orderDetailsData.billing_address?.email}</Typography>
              </Box>
              <Box paddingY={3}>
                <Divider />
              </Box>
              <CheckoutStepSectionTitle><FormattedMessage id='Pick Up / Shipping Address' /></CheckoutStepSectionTitle>
              <AddressListItem address={orderDetailsData.shipping_address} />
              <Box paddingY={3}>
                <Divider />
              </Box>
              <CheckoutStepSectionTitle><FormattedMessage id='Billing Address' /></CheckoutStepSectionTitle>
              <AddressListItem address={orderDetailsData.billing_address} />
              <Box paddingY={3}>
                <Divider />
              </Box>
              {priceDiff > 0 && (
                <>
                  <Box>
                    <CheckoutStepSectionTitle><FormattedMessage id='Shipping Method' /></CheckoutStepSectionTitle>
                    <form>
                      {/* <FormControl component='fieldset'>
                        <RadioGroup value={shippingMethodId} aria-label='shippingMethod' name='shippingMethod' onChange={onChangeShippingMethod}>
                          {shippingMethodList?.map(({ id, title, price, currency }) => (
                            <FormControlLabel key={id} value={id} control={<Radio />} label={`${title} (${currency} ${price})`} />
                          ))}
                        </RadioGroup>
                      </FormControl> */}
                      {console.log('shippingMethodId', shippingMethodList)}
                      <FormControl component='fieldset'>
                        <RadioGroup
                          value={shippingMethodId}
                          aria-label='shippingMethod'
                          name='shippingMethod'
                          onChange={onChangeShippingMethod}
                        >
                          {shippingMethodList.map(({ id, title, price, currency }) => (
                            <FormControlLabel
                              key={id}
                              value={id}
                              control={<Radio />}
                              label={`${title} (${currency} ${price})`}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </form>
                  </Box>
                  <Box paddingY={3}>
                    <Divider />
                  </Box>
                  {/* <CheckoutStepSectionTitle><FormattedMessage id='Payment Method' /></CheckoutStepSectionTitle> */}
                  <PaymentMethodList
                    data={checkout.paymentMethodList}
                    onChange={setPaymentMethod}
                    showGift={false}
                  />
                  <Box paddingY={3}>
                    <Divider />
                  </Box>
                  <Box>
                    <CheckoutStepSectionTitle><FormattedMessage id='Additional Charges' /></CheckoutStepSectionTitle>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                      <Typography variant='subtitle1'><FormattedMessage id='Vat' />  ({checkout?.vatData.vat_percent}%)</Typography>
                      <Typography variant='body1'>{orderDetailsData?.currency} {_vatAmount}</Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                      <Typography variant='subtitle1'><FormattedMessage id='Shipping Charges' /></Typography>
                      <Typography variant='body1'>{orderDetailsData?.currency} {_shippingCharge + codCharge}</Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

          </Box>
          <Box className={classes.drawerFooter}>
            <Box textAlign='left'>
              <Typography variant='caption'>{footerInfoText()}</Typography>
              {priceDiff > 0
                ? <Typography variant='body1'><b>{orderDetailsData?.currency} {priceDiff + _vatAmount + _shippingCharge + codCharge}</b></Typography>
                : <Typography variant='body1'><b>{formattedAmountTotal}</b></Typography>}

            </Box>
            <Button
              size='large'
              color='primary'
              variant='contained'
              className={classes.actionButton}
              disabled={priceDiff > 0 && (!paymentMethod || _shippingMethodId === null)}
              onClick={() => setOpenDialog(true)}

            >
              <FormattedMessage id='Confirm Exchange' />
            </Button>
          </Box>
        </>
      </Drawer>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <FormattedMessage id='Are You Sure You Want To Proceed ?' />
          </DialogContentText>
        </DialogContent>
        <Box paddingLeft={2} paddingBottom={2}>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              color='secondary'
              disabled={customerOrderData?.confirmLoading}
            >
              <FormattedMessage id='No' />
            </Button>
            <Button
              onClick={onSelectExchangeConfirm}
              color='primary'
              style={{ marginLeft: '7px' }}
              autoFocus
              disabled={loading}
            >
              {loading ? <CircularProgress /> : <FormattedMessage id='Yes' />}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={customerOrderData?.showSnackbar}
        onClose={customerOrderData?.closeSnackbar}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={customerOrderData?.closeSnackbar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: customerOrderData?.errorColor?.length ? 'red' : '#000'
          }}
          message={<span id='client-snackbar'>{customerOrderData?.snackbarText}</span>}
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={customerOrderData?.closeSnackbar}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>
    </>
  )
}

const styles = (theme) => ({
  actions: {
    '& .MuiDivider-flexItem': {
      margin: theme.spacing(0, 1)
    },
    '& .MuiButton-label': {
      textTransform: 'capitalize'
    }
  },
  drawerContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: 'calc(100% - 60px)',
    overflowY: 'auto',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('md')]: {
      width: '50vw'
    },
    [theme.breakpoints.up('lg')]: {
      width: '45vw'
    }
  },
  exchangeSelectionDrawerContent: {
    [theme.breakpoints.up('md')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('lg')]: {
      width: '66vw'
    }
  },
  drawerFooter: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2)
  },
  productDetailSlider: {
    margin: theme.spacing(0, -2, 4, -2)
  }
})

export default withStyles(styles, { withTheme: true })(ExchangeOrderInteraction)
