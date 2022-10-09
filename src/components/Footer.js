import React from 'react'
import { withStyles, Typography, Grid, List, ListItemText, Box, Container } from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'

import useSiteMetadata from '../helpers/useSiteMetadata'
import SocialLinks from './SocialLinks'
import { Link } from '../components/common/Router'
import { Logo } from '../domain'
import { useAuth } from '../helpers'

const Footer = (props) => {
  const { classes } = props
  const {
    company
  } = useSiteMetadata()
  const auth = useAuth()
  return (
    <footer className={classes.root}>
      <Container>
        <Box paddingY={8} className={classes.content}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={9} lg={9}>
              <Grid container spacing={2} style={{ justifyContent: 'flex-start' }}>
                <Grid item md={3} lg={3} sm={12} xs={12}>
                  <List component='nav' className={classes.nav} aria-label=''>
                    <Link to='/'>
                      <ListItemText primary={<FormattedMessage id='Main Page' />} />
                    </Link>
                    <Link to='/about'>
                      <ListItemText primary={<FormattedMessage id='About us' />} />
                    </Link>
                    <Link to='/bulk-order-enquiry'>
                      <ListItemText primary={<FormattedMessage id='bulkOrderEnquiry' />} />
                    </Link>
                    <Link to='/privacy-policy'>
                      <ListItemText primary={<FormattedMessage id='privacyPolicy' />} />
                    </Link>
                    <Link to='/terms-of-use'>
                      <ListItemText primary={<FormattedMessage id='termsOfUse' />} />
                    </Link>

                  </List>
                </Grid>
                <Grid item md={3} lg={3} sm={12} xs={12}>
                  <List component='nav' className={classes.nav} aria-label=''>
                    <Link to='/return-and-replacement'>
                      <ListItemText primary={<FormattedMessage id='Return & Replacement Policy' />} />
                    </Link>
                    <Link to='/shipping-&-delivery'>
                      <ListItemText primary={<FormattedMessage id='shipping&Delivery' />} />
                    </Link>
                    <Link to='/faqs'>
                      <ListItemText primary={<FormattedMessage id='FAQs' />} />
                    </Link>
                  </List>
                </Grid>
                <Grid item md={3} lg={3} sm={12} xs={12}>
                  <List component='nav' className={classes.nav} aria-label=''>

                    <Link to={auth?.user?.isLoggedIn ? '/user/my-orders' : '/sign-in'}>
                      <ListItemText primary={<FormattedMessage id='myOrders' />} />
                    </Link>
                    <Link to='/'>
                      <ListItemText primary={<FormattedMessage id='How to order' />} />
                    </Link>
                    <Link to='/'>
                      <ListItemText primary={<FormattedMessage id='Tracking' />} />
                    </Link>
                    <Link to='/contact'>
                      <ListItemText primary={<FormattedMessage id='Contact' />} />
                    </Link>
                  </List>
                </Grid>

                <Grid item md={3} lg={3} sm={12} />
              </Grid>
              <SocialLinks isInverted />
              <Box display='flex' justifyContent='space-between'>
                {/* <Typography component='span' variant='caption'>
                  ©{new Date().getFullYear()} {company}{' '}
                  <Hidden only={['xs', 'sm']}>–</Hidden>
                  <Hidden only={['xl', 'lg', 'md']}>
                    <br />
                  </Hidden>{' '}
                  {email}
                </Typography> */}
              </Box>
            </Grid>
            <Grid item md={3} lg={3} sm={12} style={{ textAlign: 'center' }}>
              <div style={{ opacity: 0.6 }}>
                <Logo size={240} />
              </div>
              <Typography variant='caption' style={{ display: 'block' }}>
                ©{new Date().getFullYear()} {company}{' '}
              </Typography>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={7}>
              <Typography variant='h1' component='h2' className={classes.calloutText}>Find your way to professional football</Typography>
            </Grid> */}
          </Grid>
        </Box>
      </Container>
    </footer>
  )
}

const styles = (theme) => ({
  // background-color: ${theme.palette.secondary.main};
  // color: ${theme.palette.common.white};
  root: `
    background-color: #F9FBF7;
    color: #94959A;
    display: flex;
    justify-content: flex-end;  
    overflow: hidden;
    // position: relative;
    text-align: right;
  `,
  graphic: `
    position: absolute;
    right: -10%;
  `,
  content: {
    position: 'relative',
    zIndex: 1,
    '& .MuiListItem-button:hover': {
      background: 'transparent'
    },
    '& .MuiGrid-container': {
      justifyContent: 'space-between'
    }
  },
  nav: {
    '& a': {
      display: 'block',
      margin: theme.spacing(2, 0),
      textAlign: 'left'
    },
    '& a:hover': {
      textDecoration: 'underline'
    },
    '& a *': {
      fontSize: '14px'
    }
  },
  calloutText: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold
  }
})

export default withStyles(styles, { withTheme: true })(Footer)
