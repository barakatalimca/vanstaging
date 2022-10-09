import React, { useEffect, useState } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  Avatar
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import CloseIcon from '@material-ui/icons/Close'

import { useAuth } from '../helpers/useAuth'
import CheckoutStepSectionTitle from './CheckoutStepSectionTitle'
import { useCheckout } from '../helpers'
import { useAddress } from '../helpers/useAddressData'
import OrderSummary from './OrderSummary'
import AddressListItem from './AddressListItem'

const CheckoutStepReview = ({ checkoutData, onSubmit = () => { }, onClickChange = () => { }, classes }) => {
  const auth = useAuth()
  const addresses = useAddress()
  const checkout = useCheckout()

  const {
    shippingAddressId,
    shippingMethodId,
    billingAddressId,
    paymentMethodId
  } = checkoutData

  const shippingAddress = addresses?.shippingAddressList.find(item => item.address_id === shippingAddressId)
  const billingAddress = addresses?.billingAddressList.find(item => item.address_id === billingAddressId)
  const shippingMethod = checkout?.shippingMethodList.find(item => item.id === shippingMethodId)
  const paymentMethod = checkout?.paymentMethodList.find(item => item.method_id === paymentMethodId)

  const renderOrderSummary = () => {
    return (
      <Box>
        {/* <CheckoutStepSectionTitle><FormattedMessage id='Items' /></CheckoutStepSectionTitle> */}
        <OrderSummary
          checkoutData={checkoutData}
          onSubmit={onSubmit}
          showItemList
          hideTitle
          isCheckoutButtonHidden
        />
      </Box>
    )
  }

  const renderMain = () => {
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Card className={classes.item} variant='outlined'>
              <CardContent>
                <CheckoutStepSectionTitle><FormattedMessage id='Shipping Address' /></CheckoutStepSectionTitle>
                <AddressListItem address={shippingAddress} />
              </CardContent>
              <CardActions>
                <Button size='small' color='primary' onClick={() => onClickChange(0, 'checkoutSectionShippingAddress')}>
                  <FormattedMessage id='Change' />
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card className={classes.item} variant='outlined'>
              <CardContent>
                <CheckoutStepSectionTitle><FormattedMessage id='Billing Address' /></CheckoutStepSectionTitle>
                <AddressListItem address={billingAddress} />
              </CardContent>
              <CardActions>
                {/* <Button size='small' color='primary' onClick={() => onClickChange(1)}>
                <FormattedMessage id='Change' />
              </Button> */}
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card className={classes.item} variant='outlined'>
              <CardContent>
                <CheckoutStepSectionTitle><FormattedMessage id='Shipping Method' /></CheckoutStepSectionTitle>
                <Typography variant='body2'>{shippingMethod?.title}</Typography>
                <Box display='flex' alignItems='center'>
                  <Typography variant='subtitle1'>{shippingMethod?.currency}&nbsp;{shippingMethod?.price}</Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size='small' color='primary' onClick={() => onClickChange(0, 'checkoutSectionShippingMethod')}>
                  <FormattedMessage id='Change' />
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card className={classes.item} variant='outlined'>
              <CardContent>
                <CheckoutStepSectionTitle><FormattedMessage id='Payment Method' /></CheckoutStepSectionTitle>
                <Box display='flex' alignItems='center'>
                  <Avatar alt={paymentMethod?.method_id} src={paymentMethod?.image} />
                  <Box width={20} />
                  <Typography variant='body2'>{paymentMethod?.method_id}</Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size='small' color='primary' onClick={() => onClickChange(1, 'checkoutSectionPaymentMethod')}>
                  <FormattedMessage id='Change' />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box paddingX={2}>
      <Grid container spacing={8} className={classes.container}>
        <Grid item xs={12} md={5}>
          {renderOrderSummary()}
        </Grid>
        <Grid item xs={12} md={7}>
          {renderMain()}
        </Grid>
      </Grid>
    </Box>
  )
}

const styles = (theme) => ({
  container: {
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse'
    }
  },
  item: {
    height: '100%',
    marginBottom: theme.spacing(2)
  }
})

export default withStyles(styles, { withTheme: true })(CheckoutStepReview)
