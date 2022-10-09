import React, { useState } from 'react'
import { graphql } from 'gatsby'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Divider,
  Breadcrumbs
} from '@material-ui/core'
import Page from '../components/Page'
// import OrderTracker from '../components/OrderTracker'
import Seo from '../components/common/Seo'
import { Link } from '../components/common/Router'
import Fade from 'react-reveal/Fade'
import CartList from '../domain/CartList'
import MyOrdersLgView from '../domain/MyOrdersLgView'
import MyOrdersListSmView from '../domain/MyOrdersListSmView'
import Api from '../Api'
import { FormattedMessage } from 'gatsby-plugin-intl'
import TransactionHistory from '../domain/TransactionHistory'
import IbnForm from '../domain/IbnForm'
import { useWallet } from '../helpers'

const Wallet = ({ classes }) => {
  const [loading, setLoading] = React.useState(false)
  const wallet = useWallet()
  React.useEffect(() => {
    // Api.getWallet()
    //   .then((response) => {
    //     if (response.ok) {
    //       setLoading(false)
    //       setData(response.data)
    //       console.log('response', response.data)
    //       // if (response.data.result === 1) {
    //       // }
    //     } else {
    //       setLoading(false)
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('error', error)
    //     setLoading(false)
    //   })
    wallet.fetchWalletDetails()
  }, [])
  return (
    <Page>
      <Fade>
        <Seo title='My Orders' />
        <Box>
          {console.log('wallet?.data', wallet?.data)}
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
                  <FormattedMessage id='My Wallet' />
                </Typography>
              </Breadcrumbs>
            </Box>
            <Typography variant='h3' gutterBottom><FormattedMessage id='My Wallet' /></Typography>
            <Box marginBottom={5}>
              <Grid className={classes.grid} container alignItems='center' justify='space-between'>
                <Box>
                  <Typography variant='caption'><FormattedMessage id='Balance' /></Typography>
                  <Typography variant='h6'><FormattedMessage id='₹' /> {wallet?.walletBalance}</Typography>
                </Box>
                <Box className={classes.ibn} width={1 / 3.5}><IbnForm /></Box>
              </Grid>
            </Box>
            <Grid container>
              <Grid item md={9} lg={9} sm={12} xs={12}>
                <TransactionHistory data={wallet?.data} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>
    </Page>
  )
}
const styles = (theme) => ({
  grid: {
    [theme.breakpoints.down('md')]: {
      display: 'block',
      '& div': {
        width: '100%',
        marginTop: '7px'
      }
    }
  }
})
export default withStyles(styles, { withTheme: true })(Wallet)
