import React, { useEffect, useState } from 'react'
import {
  withStyles,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormGroup,
  Checkbox,
  TextField,
  Box,
  Typography
} from '@material-ui/core'
import { useCheckout, usePayment, useWallet } from '../helpers'
import { CheckoutStepSectionTitle } from '.'
import { FormattedMessage } from 'gatsby-plugin-intl'
import WalletBalance from './WalletBalance'
import { useAddress } from '../helpers/useAddressData'

const PaymentMethodList = ({
  data = [],
  defaultValue,
  onChange = () => { },
  classes
}) => {
  const [value, setValue] = useState(null)
  const [_data, setData] = useState([])
  const wallet = useWallet()
  const checkout = useCheckout()
  const address = useAddress()

  const _onChange = (event) => {
    const value = event.target.value
    setValue(value)
    onChange(data.find(item => item.method_id === value))
  }

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [defaultValue])

  useEffect(() => {
    if (wallet?.isWalletSelected) {
      setValue('WALLET')
      onChange('WALLET')
    }
  }, [wallet?.isWalletSelected])

  useEffect(() => {
    const selectedShippingAddress = address.shippingAddressList.find((l) => l.address_id === checkout.checkoutData.shippingAddressId)

    if (selectedShippingAddress?.country_id !== '1') {
      const list = data.filter((l) => l.method_id !== 'COD')
      setData(list)
    } else {
      const list = data
      setData(list)
    }
  }, [data, checkout, address])

  return (
    <>
      <Box>
        <CheckoutStepSectionTitle><FormattedMessage id='Payment Method' /></CheckoutStepSectionTitle>
        {/* <WalletBalance /> */}
        {console.log('checkout', checkout)}
        {console.log('address', address.shippingAddressList)}
        <FormControl component='fieldset'>
          <RadioGroup
            aria-label='payment-method'
            name='paymentMethod'
            defaultValue={defaultValue}
            value={value}
            onChange={_onChange}
          >
            {_data.map(item => (
              <FormControlLabel
                key={item.method_id}
                value={item.method_id}
                control={<Radio disabled={wallet?.isWalletSelected} />}
                label={item.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  )
}

const styles = (theme) => ({
})

export default React.memo(withStyles(styles, { withTheme: true })(PaymentMethodList))
