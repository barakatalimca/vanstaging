import React, { useEffect } from 'react'
// import { navigate } from '../components/common/Router'
import { navigate } from '../components/common/Router'
import {
  withStyles,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'

import { useCart, useCheckout, useWallet } from '../helpers'
import { useAuth } from '../helpers/useAuth'
import CouponForm from './CouponForm'
import CartList from './CartList'
import CheckoutStepSectionTitle from './CheckoutStepSectionTitle'
import GiftOption from './GiftOption'

const OrderSummary = ({
  checkoutData,
  hideTitle = false,
  showItemList = true,
  isCheckoutButtonHidden = false,
  classes
}) => {
  const auth = useAuth()
  const cart = useCart()
  const checkout = useCheckout()
  const wallet = useWallet()

  const [finalPrice, setFinalPrice] = React.useState(null)
  const [discount, setDiscount] = React.useState(0)

  const {
    shippingMethodId,
    paymentMethodId,
    isGiftOptionSelected,
    giftMessage
  } = checkoutData
  const isBrowser = typeof window !== 'undefined'
  const buynow = isBrowser ? JSON.parse(window.localStorage.getItem('buyNow')) : null
  const codShippingCost = paymentMethodId === 'COD' ? 0 : 0
  const selectedShippingMethod = checkout
    ? checkout.shippingMethodList.find(({ id }) => id === shippingMethodId)
    : { price: '-', currency: '' }
  const shippingPrice = selectedShippingMethod?.price ? Number(selectedShippingMethod?.price) + codShippingCost : 0
  const postPromoCodePrice = checkout?.promoCodeDetails?.postPromoCodePrice || 0
  const currency = selectedShippingMethod?.currency || ''
  const _vatAmount = Number(checkout?.vatData.vat_percent) * finalPrice / 100
  const onChangeGiftOption = value => {
    checkout.setCheckoutData(state => ({ ...state, isGiftOptionSelected: value }))
  }

  const onChangeGiftMessage = text => {
    checkout.setCheckoutData(state => ({ ...state, giftMessage: text }))
  }

  const onCheckout = () => {
    const token = window.localStorage.getItem('token')
    if (token === undefined || token === null) {
      navigate('/sign-in?referer=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  useEffect(() => {
    let price = 0

    if (cart?.buyNowData) {
      price = Number(cart?.buyNowData.price * cart?.buyNowData?.quantity)
    } else {
      price = Number(cart?.cartTotal)
    }

    if (postPromoCodePrice === 0) {
      setDiscount(0)
      // setFinalPrice(price + shippingPrice)
      setFinalPrice(price)
      // wallet.setPrice(price + shippingPrice)
      wallet.setPrice(price)
    } else if (postPromoCodePrice > 0) {
      setDiscount(price - postPromoCodePrice)
      // setDiscount(price)
      // setFinalPrice(postPromoCodePrice + shippingPrice)
      setFinalPrice(postPromoCodePrice)
      // wallet.setPrice(postPromoCodePrice + shippingPrice)
      wallet.setPrice(postPromoCodePrice)
    }
  }, [checkout?.promoCodeDetails, shippingPrice, buynow, cart, postPromoCodePrice])

  return (
    <>
      <Box className={classes.OrderSummary}>
        {!hideTitle && (
          <Box marginBottom={3}><Typography variant='h5' component='h5'> <FormattedMessage id='orderSummary' /> </Typography></Box>
        )}
        {showItemList && <CartList size='small' />}
        <Box paddingY={2}>
          {/* <CheckoutStepSectionTitle><FormattedMessage id='Gift Option' /></CheckoutStepSectionTitle> */}
          <GiftOption
            isSelected={isGiftOptionSelected}
            message={giftMessage}
            selectedPaymentMethodId={paymentMethodId}
            onChange={onChangeGiftOption}
            onChangeMessageText={onChangeGiftMessage}
          />
        </Box>
        <Box paddingY={2}>
          <Box paddingBottom={1}>
            <CouponForm />
          </Box>
          <CheckoutStepSectionTitle><FormattedMessage id='Bill Details' /></CheckoutStepSectionTitle>
          {/* <SummaryItem
            label={cart?.buyNowActive ? <FormattedMessage id='Subtotal' /> + '(1)' : <FormattedMessage id='Subtotal' /> + '(' + cart?.totalItems + ')'}
            value={`SAR ${cart?.buyNowActive ? cart?.buyNowData?.price : cart?.cartTotal}`}
          /> */}
          <Box display='flex' flexDirection='row' justifyContent='space-between' paddingTop={1} paddingBottom={1}>
            {cart?.buyNowActive ? (
              <>
                <Typography variant='subtitle1'>
                  <FormattedMessage id='Subtotal' /> {buynow?.quantity}
                </Typography>
                <span>{currency}&nbsp;{cart?.buyNowData?.price}</span>
              </>
            )
              : (
                <>
                  <Typography variant='subtitle1'>
                    <FormattedMessage id='Subtotal' />
                    {/* ({cart?.totalItems} item{cart?.totalItems === 1 ? '' : 's'}) */}
                  </Typography>
                  <span>{currency}&nbsp;{cart?.cartTotal}</span>
                </>
              )}
          </Box>
          {/* <SummaryItem
            label={<FormattedMessage id='Shipping Costs' />}
            value={`${currency} ${paymentMethodId === 'COD' ? shippingPrice - 5 : shippingPrice || '0'}`}
          /> */}
          <SummaryItem
            label={<FormattedMessage id='Shipping Costs' />}
            value={`${currency} ${shippingPrice || '0'}`}
          />
          {/* {paymentMethodId === 'COD' && (
            <SummaryItem
              label={<FormattedMessage id='Cash on Delivery Charges' />}
              value={`${currency} ${codShippingCost}`}
            />
          )} */}
          <SummaryItem
            label={<FormattedMessage id='Discounts' />}
            value={`${currency} ${discount ? discount.toFixed(2) : discount}`}
          />
          {_vatAmount > 0 && (
            <SummaryItem
              label={<FormattedMessage id='Vat' />}
              value={`${currency} ${_vatAmount.toFixed(2)}`}
            />
          )}

          <Box paddingY={1}>
            <Divider />
          </Box>
          {/* {finalPrice ? <> */}
          <SummaryItem
            label={<FormattedMessage id='Total' />}
            // value={`${currency} ${(_vatAmount + finalPrice).toFixed(2)}`}
            value={`${currency} ${(_vatAmount + finalPrice + shippingPrice).toFixed(2)}`}
            // value={`${currency} ${Math.round((_vatAmount + Number.EPSILON + finalPrice) * 100) / 100} `}
            valueTextVariant='h5'
          />
          {/* </>
            : <>
              <SummaryItem
                label='Total'
                value={`SAR ${checkout?.promoCodeDetails?.postPromoCodePrice || cart?.buyNowActive ? cart?.buyNowData?.price : cart?.cartTotal}`}
                valueTextVariant='h5'
              />
            </>} */}

        </Box>
        {!isCheckoutButtonHidden && (
          <Box marginTop={3} display='flex' height='50px'>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              disabled={auth?.loading}
              fullWidth
              size='large'
              onClick={onCheckout}
            >
              {!auth?.loading && <><FormattedMessage id='Checkout' /></>}
              {auth?.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
          </Box>
        )}
      </Box>

    </>
  )
}

const SummaryItem = ({ label, value, valueTextVariant = 'body2' }) => {
  return (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='space-between'
      paddingY={1}
    >
      <Typography variant='subtitle1'>{label}</Typography>
      <Typography variant={valueTextVariant}>{value}</Typography>
    </Box>
  )
}

const styles = (theme) => ({
  OrderSummary: {
    // background: '#eee',
  },
  emphasize: {
    fontWeight: theme.typography.fontWeightBold
  }
})

export default withStyles(styles, { withTheme: true })(OrderSummary)
