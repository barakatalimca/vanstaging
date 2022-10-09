import React from 'react'
import {
  withStyles,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Grid,
  Button
} from '@material-ui/core'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import clsx from 'clsx'

import { Image } from '../components'
import { Link } from '../components/common/Router'
import DeliveryStatus from '../components/DeliveryStatus'
import { useCart, useCheckout } from '../helpers'
import { useParams, useLocation } from '@reach/router'
import { FormattedMessage } from 'gatsby-plugin-intl'

const OrderSummaryList = ({ classes, myOrders, size = 'normal', hideQuantityModifier = false }) => {
  const [data, setData] = React.useState([])
  const [buynowQuantity, setBuynowQuantity] = React.useState(1)
  const cart = useCart()
  const checkout = useCheckout()
  const location = useLocation()
  const buynow = window !== 'undefined' ? JSON.parse(window.localStorage.getItem('buyNow')) : null
  const value = checkout?.promocodeValue
  const addBuyNowQuantity = () => {
    buynow.quantity = buynow.quantity + 1
    setBuynowQuantity(buynowQuantity + 1)
    if (value) {
      checkout.applyPromoCode({ promoCode: value, isBuyNow: cart.buyNowActive, items: [buynow] })
    }
    console.log('promoCodeDetails', checkout?.promocodeValue)
    if (window !== 'undefined') {
      window.localStorage.setItem('buyNow', JSON.stringify(buynow))
      cart.updateBuyNowData(buynow)
    }
  }
  const substractBuyNowQuantity = () => {
    if (buynow.quantity > 1) {
      buynow.quantity = buynow.quantity - 1
      setBuynowQuantity(buynowQuantity - 1)
      if (value) {
        checkout.applyPromoCode({ promoCode: value, isBuyNow: cart.buyNowActive, items: [buynow] })
      }
      console.log('promoCodeDetails', checkout?.promocodeValue)
      if (window !== 'undefined') {
        window.localStorage.setItem('buyNow', JSON.stringify(buynow))
        cart.updateBuyNowData(buynow)
      }
    }
  }

  React.useEffect(() => {
    if (location.pathname.includes('cart')) {
      setData(cart?.items)
    } else {
      if (buynow) {
        const _data = [buynow]
        setData(_data)
      } else {
        setData(cart?.items)
      }
    }
  }, [cart?.buyNowData, location, cart?.items])

  React.useEffect(() => {
    if (buynow) {
      setBuynowQuantity(buynow.quantity)
    }
  }, [buynow])
  return (
    <Box className='cartList'>
      {console.log('data', data)}
      {data?.length > 0 && <>
        {data?.map((item, index) => (
          <Box key={item.id} className={classes.item}>
            {index !== 0 && <Box paddingY={size === 'small' ? 0.5 : 2}><Divider /></Box>}
            <Grid container alignItems='center'>
              <Grid item xs={12} md={9}>
                <Box display='flex' paddingY={2}>
                  <Link to={`/product/${item.category_slug}/${item.product_slug}/`}>
                    <Box className={clsx(classes.itemImageContainer, size === 'small' && classes.itemSmallImageContainer)}>
                      <Image src={item.image_list ? item.image_list[0].image : item.image} />
                    </Box>
                  </Link>
                  <Box paddingLeft={size === 'small' ? 2 : 3}>
                    <Box display='flex' justifyContent='space-around' flexDirection='column'>
                      <Box marginBottom={size === 'small' ? 0 : 1}>
                        <Link to={`/product/${item.category_slug}/${item.product_slug}/`}>
                          <Typography variant={size === 'small' ? 'subtitle1' : 'h6'}>{item.product_name}</Typography>
                        </Link>
                      </Box>
                      <Box className={classes.attributes}>
                        {item.attributes?.map((attr) => (
                          <Chip
                            key={attr.attribute}
                            variant='outlined'
                            size='small'
                            label={`${attr.label}: ${attr.display_value}`}
                            className={size === 'small' && classes.smallAttributeItem}
                          />
                        ))}
                      </Box>
                      <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography variant='small' style={{ display: 'block', marginTop: '6px' }}>Quanity {buynow ? buynowQuantity : item.quantity}</Typography>
                        <Link to='/cart' style={{ marginTop: '6px', marginLeft: '6px' }}>
                          <Typography variant='small'><FormattedMessage id='Change Quantity' /></Typography>
                        </Link>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                  {buynow && (
                    <Box display='flex' alignItems='center'>
                      <IconButton size='small' onClick={substractBuyNowQuantity} disabled={buynowQuantity === 1}>
                        <AiOutlineMinusCircle size={24} />
                      </IconButton>
                      <Box display='flex' justifyContent='center' width={50}>
                        <Typography variant='h6'>{buynow ? buynowQuantity : item.quantity}</Typography>
                      </Box>
                      <IconButton size='small' onClick={addBuyNowQuantity}>
                        <AiOutlinePlusCircle size={24} />
                      </IconButton>
                    </Box>
                  )}
                  <Box>&nbsp;</Box>
                  <Box display='flex' alignItems='center'>
                    <Typography variant={size === 'small' ? 'subtitle2' : 'subtitle1'}><FormattedMessage id='₹' /> {item.price}</Typography>

                    {/* {!myOrders && !orderDetails && (
                      <>
                        <IconButton size='large'>
                          <VscClose size={32} />
                        </IconButton>
                      </>
                    )} */}
                    {/* {myOrders && !newOrders && <DeliveryStatus status={item.orderStatus} />} */}
                    {myOrders && (
                      <>
                        <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                          <DeliveryStatus status={item.orderStatus} />
                        </Box>
                      </>
                    )}
                    {/* {newOrders && <OrderTracker />} */}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </>}
      {!data?.length > 0 && <>
        {cart?.items?.map((item, index) => (
          <Box key={item.id} className={classes.item}>
            {index !== 0 && <Box paddingY={size === 'small' ? 0.5 : 2}><Divider /></Box>}
            <Grid container alignItems='center'>
              <Grid item xs={12} md={9}>
                <Box display='flex' paddingY={2}>
                  <Link to='/product'>
                    <Box className={clsx(classes.itemImageContainer, size === 'small' && classes.itemSmallImageContainer)}>
                      <Image src={item.image_list ? item.image_list[0].image : item.image} />
                    </Box>
                  </Link>
                  <Box paddingLeft={size === 'small' ? 2 : 3}>
                    <Box display='flex' justifyContent='space-around' flexDirection='column'>
                      <Box marginBottom={size === 'small' ? 0 : 1}>
                        <Link to='/product'>
                          <Typography variant={size === 'small' ? 'subtitle1' : 'h6'}>{item.product_name}</Typography>
                        </Link>
                      </Box>
                      <Box className={classes.attributes}>
                        {item.attributes?.map((attr) => (
                          <Chip
                            key={attr.attribute}
                            variant='outlined'
                            size='small'
                            label={`${attr.label}: ${attr.display_value}`}
                            className={size === 'small' && classes.smallAttributeItem}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                  {!hideQuantityModifier && (
                    <Box display='flex' alignItems='center'>
                      <IconButton size='small' onClick={() => cart?.updateItemQuantity(item, item.quantity - 1)}>
                        <AiOutlineMinusCircle size={24} />
                      </IconButton>
                      <Box display='flex' justifyContent='center' width={50}>
                        <Typography variant='h6'>{item.quantity}</Typography>
                      </Box>
                      <IconButton size='small' onClick={() => cart?.updateItemQuantity(item, item.quantity + 1)}>
                        <AiOutlinePlusCircle size={24} />
                      </IconButton>
                    </Box>
                  )}
                  <Button
                    variant='text'
                    color='secondary'
                    size='small'
                  // onClick={onOpenProductDetailDrawer}
                  >
                    <FormattedMessage id='Change' />
                  </Button>
                  <Box>&nbsp;</Box>
                  <Box display='flex' alignItems='center'>
                    <Typography variant={size === 'small' ? 'subtitle2' : 'subtitle1'}><FormattedMessage id='₹' /> {item.price}</Typography>
                    {/* {!myOrders && !orderDetails && (
                      <>
                        <IconButton size='large'>
                          <VscClose size={32} />
                        </IconButton>
                      </>
                    )} */}
                    {/* {myOrders && !newOrders && <DeliveryStatus status={item.orderStatus} />} */}
                    {myOrders && (
                      <>
                        <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                          <DeliveryStatus status={item.orderStatus} />
                        </Box>
                      </>
                    )}
                    {/* {newOrders && <OrderTracker />} */}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </>}

    </Box>
  )
}

const styles = (theme) => ({
  item: {
  },
  itemImageContainer: {
    height: 80,
    width: 80
  },
  itemSmallImageContainer: {
    height: 70,
    width: 70
  },
  attributes: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: -theme.spacing(0.5),
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  smallAttributeItem: {
    fontSize: '12px'
  }
})

export default withStyles(styles, { withTheme: true })(OrderSummaryList)
