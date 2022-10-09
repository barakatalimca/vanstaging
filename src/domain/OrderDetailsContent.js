import React, { useEffect } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Divider,
  Grid,
  Paper
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'

import OrderTracker from './OrderTracker'
import OrderInteractions from './OrderInteractions'
import AddressListItem from './AddressListItem'
import OrderItem from './OrderItem'
import { useCustomerOrderData } from '../helpers/useCustomerOrderData'
import { useAllProductsData, useI18n } from '../helpers'

const OrderDetailsContent = ({ orderData }) => {
  const customerOrderData = useCustomerOrderData()
  const allProducts = useAllProductsData()
  const i18n = useI18n()

  useEffect(() => {
    if (orderData) {
      customerOrderData.fetch(orderData.order_id)
    }
  }, [customerOrderData?.reload, allProducts?.reload, orderData?.order_id])

  if (!customerOrderData?.order) {
    return <></>
  }

  const {
    order_id,
    items,
    currency,
    total_price,
    status_data,
    payment_mode,
    billing_address,
    shipping_address,
    vat_amount,
    shipping_charge,
    discount_amount,
    status_text,
    transaction_ref_no,
    order_on
  } = customerOrderData?.order

  return (
    <>
      <Box paddingTop={1}>

        {items?.map((item, i) => <OrderItem OrderId={order_id} key={i} data={item} statusText={status_text} />)}
        <BillItem label={i18n.locale === 'ar' ? 'تكاليف الشحن' : 'Shipping Cost'} value={`${currency} ${shipping_charge}`} />
        <BillItem label={i18n.locale === 'ar' ? 'الخصم' : 'Discount'} value={`${currency} ${discount_amount}`} />
        <BillItem label={i18n.locale === 'ar' ? 'الضريبة' : 'Vat'} value={`${currency} ${vat_amount}`} />
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='body1'><FormattedMessage id='Total' /></Typography>
          <Typography variant='h6'>{currency} {total_price}</Typography>
        </Box>
      </Box>
      <Box paddingY={2}>
        <Divider />
      </Box>
      <OrderTracker data={status_data} />
      <Tile headerText='Payment Method'>
        {payment_mode !== 'COD' && <Typography variant='body1'>Transaction ID:&nbsp;{transaction_ref_no}</Typography>}
        <Typography variant='body2'>{payment_mode}</Typography>
        <Typography variant='body2'> <FormattedMessage id='Date' /> :&nbsp;{order_on}</Typography>
        <Typography variant='body2'> <FormattedMessage id='Amount' /> :&nbsp; {currency}&nbsp;{total_price}</Typography>
      </Tile>
      <Tile headerText='Ship To'>
        <Typography variant='body2'>{shipping_address?.name}</Typography>
        <Typography variant='body2'>{`${shipping_address?.code}-${shipping_address?.mobile_no}`}</Typography>
        <Typography variant='body2'>{shipping_address?.email}</Typography>
      </Tile>
      <Grid container spacing={2}>
        <Grid item md={6} lg={6} sm={12} xs={12}>
          <Tile headerText='Shipping Address'>
            <AddressListItem address={shipping_address} />
          </Tile>
        </Grid>
        <Grid item md={6} lg={6} sm={12} xs={12}>
          <Tile headerText='Billing Address'>
            <AddressListItem address={billing_address} />
          </Tile>
        </Grid>
      </Grid>
      <Box paddingY={2}>
        <Divider />
      </Box>
      <OrderInteractions orderDetailsData={customerOrderData.order} />
    </>
  )
}

const BillItem = ({ label, value }) => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' paddingBottom={1}>
      <Typography variant='body1'><FormattedMessage id={label} /></Typography>
      <Typography variant='body2'>{value}</Typography>
    </Box>
  )
}

let Tile = ({ headerText, children, classes }) => {
  return (
    <Box paddingY={1}>
      <Paper className={classes.tile} variant='elevation'>
        <div className={classes.tileHeader}>
          <Typography variant='caption' className={classes.tileHeaderText}>
            <FormattedMessage id={headerText} />
          </Typography>
        </div>
        <div className={classes.tileContent}>
          {children}
        </div>
      </Paper>
    </Box>
  )
}

const styles = (theme) => ({
  tile: {
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  tileHeader: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(0.5, 1)
  },
  tileHeaderText: {
    color: theme.palette.common.white
  },
  tileContent: {
    padding: theme.spacing(1)
  }
})

Tile = withStyles(styles, { withTheme: true })(Tile)
export default withStyles(styles, { withTheme: true })(OrderDetailsContent)
