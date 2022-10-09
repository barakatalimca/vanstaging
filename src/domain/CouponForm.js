import React, { useState } from 'react'
import {
  withStyles,
  CircularProgress,
  Button,
  TextField,
  Divider,
  IconButton
} from '@material-ui/core'
import { IoMdClose } from 'react-icons/io'
import { FormattedMessage } from 'gatsby-plugin-intl'
import clsx from 'clsx'

import { useCart, useCheckout } from '../helpers'

const CouponForm = ({
  classes
}) => {
  const checkout = useCheckout()
  const cart = useCart()

  const [value, setValue] = useState(checkout?.promoCodeDetails.promoCode || checkout?.promocodeValue)

  const submitPromoCode = () => {
    const _buyNowData = cart.buyNowActive ? Object.assign(cart.buyNowData) || '' : null
    checkout.applyPromoCode({ promoCode: value, isBuyNow: cart.buyNowActive, items: [_buyNowData] })
  }
  const removePromoCode = () => {
    setValue('')
    checkout.resetPromoCodeDetails()
  }

  const endAdornment = () => {
    if (checkout?.promoCodeDetails.isLoading) {
      return <CircularProgress style={{ height: '24px', width: '30px' }} />
    }

    if (checkout?.promoCodeDetails.promoCode) {
      return <IconButton onClick={removePromoCode}> <IoMdClose /> </IconButton>
    }

    return <Button variant='contained' color='secondary' onClick={submitPromoCode}> <FormattedMessage id='Apply' /></Button>
  }

  return (
    <>
      <TextField
        id='outlined-basic'
        onChange={(e) => setValue(e.target.value)}
        label={<FormattedMessage id='yourCodeHere' />}
        // defaultValue={checkout?.promoCodeDetails?.promoCode}
        value={value || ''}
        disabled={Boolean(checkout?.promoCodeDetails?.promoCode) || checkout?.promoCodeDetails.isLoading}
        // placeholder='Enter your promo code here'
        variant='outlined'
        error={checkout?.promoCodeDetails.status === 0}
        helperText={checkout?.promoCodeDetails.statusText}
        InputProps={{
          endAdornment: endAdornment()
        }}
        className={clsx(classes.input, checkout?.promoCodeDetails.status === 1 ? classes.inputSuccess : null)}
      />

      {/* {value && <small style={{ color: '#f26b3e', width: '100%' }}>Promo Applied.</small>} */}
    </>
  )
}
const styles = (theme) => ({
  root: {
    // background: '#eee',
  },
  input: {
    '& .MuiInputBase-input': {
      textTransform: 'uppercase'
    }
  },
  inputSuccess: {
    '& .MuiFormHelperText-root': {
      color: theme.palette.success.dark
    }
  },
  loader: {
    height: '20px'
  }
})
export default withStyles(styles, { withTheme: true })(CouponForm)
