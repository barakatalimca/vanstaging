import React from 'react'
import { Box, Hidden, withStyles } from '@material-ui/core'
import { useLocation } from '@reach/router'

import Header from './Header'
import NewsLetter from './NewsLetter'
import Footer from './Footer'
import '../styles/styles.css'
import BottomNav from '../domain/BottomNav'

const Page = ({ hideFooter = false, hideBottomNav = false, classes, children }) => {
  const location = useLocation()
  const isBrowser = typeof window !== 'undefined'

  const renderFooter = () => {
    if (hideFooter) return <></>

    return (
      <>
        {location.pathname === '/checkout' || location.pathname === '/cart'
          ? <></>
          : <NewsLetter />}
        <Footer />
      </>
    )
  }
  const renderHeader = () => {
    return (
      <Header url={location.pathname} />
    )
  }

  const renderBottomNav = () => {
    if (hideBottomNav) return <></>
    return (
      <Hidden lgUp>
        <BottomNav />
      </Hidden>
    )
  }
  React.useEffect(() => {
    if (isBrowser) {
      const bt_ads = document.createElement('script')
      bt_ads.setAttribute('async', true)
      bt_ads.setAttribute('type', 'text/javascript')

      
      var node = document.getElementsByTagName('script')[0]
      node.parentNode.insertBefore(bt_ads, node)

      const history = window.location.href
      const notBuyNow = history.includes('/checkout') || history.includes('/payment') || history.includes('/result') || history.includes('/results')
      if (!notBuyNow) {
        window.localStorage.removeItem('buyNow')
      }
      if (!history.includes('/payment')) {
        const hyperPayDiv = document.getElementById('hyperpay')
        hyperPayDiv?.remove()
      }
    }
  }, [location])

  return (
    <Box>
      {renderHeader()}
      <main className={classes.main}>
        {children}
      </main>
      {renderFooter()}
      {renderBottomNav()}
      <div id='bot-container' />
    </Box>
  )
}

const styles = (theme) => ({
  main: {
    minHeight: '78vh'
    // position: 'relative',
    // zIndex: '9'
  }
})

export default withStyles(styles, { withTheme: true })(Page)
