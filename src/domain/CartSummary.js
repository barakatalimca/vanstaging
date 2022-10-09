import React from 'react'
// import { navigate } from '../components/common/Router'
import { navigate } from '../components/common/Router'
import { redirectTo } from '@reach/router'
import {
  withStyles,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Divider
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { useCart, useCheckout } from '../helpers'
import { useAuth } from '../helpers/useAuth'
import { usePayment } from '../helpers/'
import CartList from './CartList'
import { CouponForm } from '.'
import { FormattedMessage } from 'gatsby-plugin-intl'

const CartSummary = ({
  onSubmit = () => { },
  hideTitle = false,
  isCheckoutButtonHidden = false,
  classes
}) => {
  const auth = useAuth()
  const payment = usePayment()
  const { register, handleSubmit, watch, errors } = useForm()
  const isBrowser = typeof window !== 'undefined'
  // const { totalItems, cartTotal } = useCart()
  const cart = useCart()
  const checkout = useCheckout()
  const goToCheckout = () => {
    if (isBrowser) {
      const token = window.localStorage.getItem('token')
      if (token === undefined || token === null) {
        navigate('/sign-in?referer=/checkout')
      } else {
        navigate('/checkout')
      }
    }
  }
  const _onSubmit = (formData) => {
    onSubmit(formData)
  }

  return (
    <>

      <Box className={classes.root}>
        <Box marginBottom={3}><Typography variant='h5' component='h5'><FormattedMessage id='Cart Summary' /></Typography></Box>
        {/* <CouponForm /> */}
        <Box display='flex' flexDirection='column' paddingTop={1} paddingBottom={1}>
          <Box display='flex' flexDirection='row' justifyContent='space-between' paddingTop={1} paddingBottom={1}>

            <Typography variant='subtitle1'><FormattedMessage id='Subtotal' /> ({cart?.totalItems} {cart?.totalItems === 1 ? <FormattedMessage id='item' /> : <FormattedMessage id='items' />})</Typography>
            <span><FormattedMessage id='₹' />  {cart?.cartTotal}</span>

          </Box>
          {/* <Box display='flex' flexDirection='row' justifyContent='space-between' paddingTop={1} paddingBottom={1}>
            <Typography variant='subtitle1'><FormattedMessage id='Discounts' /></Typography> <span>-</span>
          </Box> */}
          <Box display='flex' flexDirection='row' justifyContent='space-between' paddingTop={1} paddingBottom={1}>
            <Typography variant='subtitle1'><FormattedMessage id='Subtotal' /></Typography>
            <b><FormattedMessage id='₹' />  {cart?.cartTotal}</b>

          </Box>

          <Box marginTop={3} display='flex' height='50px'>
            {/* <Button disabled={auth.lo} type='submit' style={{ width: '100%' }} variant='contained' color='secondary' size='large'>Checkout</Button> */}
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              disabled={auth?.loading}
              style={{ width: '100%' }}
              size='large'
              onClick={goToCheckout}
            >
              {!auth?.loading && <><FormattedMessage id='Checkout' /></>}
              {auth?.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
          </Box>
        </Box>

      </Box>

    </>
  )
}
const styles = (theme) => ({
  root: {
    // background: '#eee',
  },
  emphasize: {
    fontWeight: theme.typography.fontWeightBold
  }
})
export default withStyles(styles, { withTheme: true })(CartSummary)
