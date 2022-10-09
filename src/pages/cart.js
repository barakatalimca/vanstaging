import React, { useEffect } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Breadcrumbs,
  Backdrop,
  CircularProgress
} from '@material-ui/core'
import Fade from 'react-reveal/Fade'
import { FormattedMessage } from 'gatsby-plugin-intl'

import { Image } from '../components'
import Page from '../components/Page'
import Seo from '../components/common/Seo'
import { Link } from '../components/common/Router'
import CartList from '../domain/CartList'
import { CartSummary } from '../domain'
import ProductListSlider from '../domain/ProductListSlider'
import { useCart } from '../helpers'
import { CART_LIST_DATA } from '../Constants'
import emptyCartImage from '../assets/img/empty-basket.png'
import { queryCache } from 'react-query'

const Cart = ({ classes }) => {
  const cart = useCart()

  useEffect(() => {
    queryCache.invalidateQueries(CART_LIST_DATA)
  }, [])

  return (
    <Page>
      <Fade>
        <Seo title='Cart' />
        <Box>
          <Container>
            <Box marginTop={14} marginBottom={5} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='h3' component='h3'><FormattedMessage id='Your Shopping Bag' /></Typography>
              {/* <Link to='/user/wishlist'><Button variant='outlined'>Your Wishlist</Button></Link> */}
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12} md={cart?.isEmpty ? 12 : 9}>
                {cart?.isEmpty && (
                  <Box display='flex' justifyContent='center' height={320}>
                    <Box width={320}>
                      <Image src={emptyCartImage} style={{ objectFit: 'contain' }} />
                    </Box>
                  </Box>
                )}
                <CartList allowLastItemToBeDeleted={false} />
                {/* <Link to='/'><Button variant='outlined'>Continue Shopping</Button></Link> */}
              </Grid>
              {!cart?.isEmpty && (
                <Grid item xs={12} md={3}>
                  {/* <OrderSummary showItemList={false} /> */}
                  <CartSummary />
                </Grid>
              )}
            </Grid>
          </Container>
          <Box paddingTop={5} paddingBottom={5} marginTop={7} style={{ background: '#eee' }}>
            <Container>
              <Box marginTop={5}>
                <ProductListSlider />
              </Box>
            </Container>
          </Box>
        </Box>
      </Fade>
      <Backdrop className={classes.backdrop} open={cart?.status === 'loading'}>
        <CircularProgress color='primary' />
      </Backdrop>
    </Page>
  )
}
const styles = (theme) => ({
  backdrop: {
    zIndex: 999,
    background: '#fff'
  }
})
export default withStyles(styles, { withTheme: true })(Cart)
