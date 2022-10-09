import React, { useEffect, useState } from 'react'
import {
  withStyles, Box, Typography,
  Button,
  Drawer,
  IconButton,
  Hidden
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import CloseIcon from '@material-ui/icons/Close'

import Api from '../Api'
import AddressListItem from './AddressListItem'
import CheckoutStepSectionTitle from './CheckoutStepSectionTitle'
import AdressForm from '../components/AdressForm'
import PaymentMethodList from './PaymentMethodList'
import { useAddress } from '../helpers/useAddressData'
import { useCheckout } from '../helpers'
import WalletBalance from './WalletBalance'
import OrderSummary from './OrderSummary'

const CheckoutStepPayment = ({ checkoutData, onChange = () => { } }) => {
  const addresses = useAddress()
  const checkout = useCheckout()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const onChangePaymentMethod = paymentMethod => {
    onChange({ paymentMethodId: paymentMethod.method_id })
  }

  const renderOrderSummary = () => {
    return (
      <Hidden mdDown>
        <Box>
          <OrderSummary
            checkoutData={checkoutData}
            showItemList
            isCheckoutButtonHidden
          />
        </Box>
      </Hidden>
    )
  }

  const renderMain = () => {
    return (
      <>
        <Box padding={2} id='checkoutSectionPaymentMethod'>
          <CheckoutStepSectionTitle><FormattedMessage id='Billing Address' /></CheckoutStepSectionTitle>
          {!addresses.billingAddress && (
            <Box paddingY={2}>
              <Button
                variant='outlined'
                onClick={() => setIsDrawerOpen(true)}
              >
                <FormattedMessage id='Add New Billing Address' />
              </Button>
            </Box>
          )}
          {addresses.billingAddress && (
            <Box paddingY={1}>
              <AddressListItem address={addresses.billingAddress} />
            </Box>
          )}
        </Box>
        <Box padding={2}>
          <PaymentMethodList
            data={checkout.paymentMethodList}
            defaultValue={checkoutData?.paymentMethodId}
            onChange={onChangePaymentMethod}
          />
        </Box>
      </>
    )
  }

  useEffect(() => {
    if (checkoutData?.billingAddressId) {
      checkout.fetchPaymentMethodList()
    }
  }, [checkoutData?.billingAddressId])

  useEffect(() => {
    setIsDrawerOpen(false)
  }, [addresses?.addressList])

  useEffect(() => {
    onChange({
      billingAddressId: addresses?.billingAddress?.address_id
    })
  }, [addresses?.billingAddress])

  return (
    <>
      {renderMain()}
      <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box maxWidth={640} padding={4}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography
              variant='h5'
              color='textSecondary'
              gutterBottom
            >
              <FormattedMessage id='Billing Address' />
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <AdressForm addressType='Billing' billingAddress checkoutData={checkoutData} />
        </Box>
      </Drawer>
    </>
  )
}

const styles = () => ({
  root: {
    '& div input': {
      width: '100%'
    },
    '& div': {
      width: '100%'
    }
  }
})

export default withStyles(styles, { withTheme: true })(CheckoutStepPayment)
