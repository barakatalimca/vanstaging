import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Breadcrumbs,
  CircularProgress
} from '@material-ui/core'
import Page from '../components/Page'
import Seo from '../components/common/Seo'
import { Link } from '../components/common/Router'
import Fade from 'react-reveal/Fade'
import CartList from '../domain/CartList'
import ProductListItem from '../domain/ProductListItem'
import WishListItem from '../domain/WishListItem'
import OrderSummary from '../domain/OrderSummary'
import { theme } from '../providers/ThemeProvider'
import { navigate } from '@reach/router'
import emptyCartImage from '../assets/img/empty-basket.png'
import { Image } from '../components'
import { useWishList } from '../helpers/useWishList'
import { FormattedMessage } from 'gatsby-plugin-intl'
const Wishlist = ({ classes }) => {
  // const goToWishlist = () => {
  //     navigate('/wishlist')
  // }
  const wishlist = useWishList()

  useEffect(() => {
    wishlist.getWishList()
  }, [])

  return (
    <Page>
      <Fade>
        <Seo title='Wishlist' />
        <Container>
          <Box marginTop={16}>
            <Breadcrumbs aria-label='breadcrumb' className='breadcrumb'>
              <Link color='inherit' to='/'>
                <FormattedMessage id='Home' />
              </Link>
              <Link
                color='inherit'
                to='/my-profile'
              >
                <FormattedMessage id='myProfile' />
              </Link>
              <Typography color='textPrimary'>
                <FormattedMessage id='Wishlist' />
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={5} display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h3' component='h3'><FormattedMessage id='Your Wishlist' /></Typography>
            {/* <Link to='/cart'><Button variant='outlined'>Your Cart</Button></Link> */}
            <Link to='/'><Button variant='outlined'><FormattedMessage id='Continue Shopping' /></Button></Link>
          </Box>
          {wishlist?.isEmpty
            ? <>
              <Box display='flex' justifyContent='center' height={320}>
                <Box width={320}>
                  {wishlist?.loading ? <>
                    <Box display='flex' justifyContent='center' alignItems='center' style={{ height: '50vh' }}>
                      <CircularProgress />
                    </Box>
                  </> : <><Image src={emptyCartImage} style={{ objectFit: 'contain' }} /></>}
                </Box>
              </Box>
            </>
            : <>
              <Box paddingBottom={4}>
                <Grid
                  container
                  direction='row'
                  // justify='center'
                  alignItems='center'
                  spacing={4}
                >
                  {wishlist?.data.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} className={classes.itemContainer}>
                      <Box className={classes.item}>
                        <WishListItem wishlist data={item} isActive={item.is_active} inStock={item.in_stock} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>}

        </Container>
      </Fade>
    </Page>
  )
}
const styles = (theme) => ({
  CartListContainer: {
    paddingRight: '45px'
  },
  itemContainer: {
    [theme.breakpoints.down('sm')]: {
      // padding: '0 50px !important'
    }
  }
})
export default withStyles(styles, { withTheme: true })(Wishlist)
