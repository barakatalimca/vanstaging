import React, { useEffect } from 'react'

import {
  withStyles, Box, Typography,
  Button,
  CircularProgress
} from '@material-ui/core'
import { useLocation } from '@reach/router'

import Page from '../components/Page'
import { Link } from '../components/common/Router'
import { usePayment } from '../helpers'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { FiCheckCircle } from 'react-icons/fi'
import { FaRegCheckCircle } from 'react-icons/fa'
import { HiBadgeCheck } from 'react-icons/hi'
const isBrowser = typeof window !== 'undefined'
//
const Results = () => {
  const location = useLocation()
  const payment = usePayment()
  console.log('resultPagePayment', payment)
  const [loading, setLoading] = React.useState(true)
  useEffect(() => {
    console.log("location.href", location.href)
    // payment.verifyPayment(location.href).then(response => {
    //   console.log("verifypayment response", response)
    //   setLoading(false)
    // })
    let response = payment.verifyPayment(location.href)
    console.log("verifypayment response", response)
    if (response) {
      setLoading(false)
    }

  }, [])
  console.log('loading', loading)
  console.log('paymentSuccessdata', payment?.paymentSuccessData)
  const data = isBrowser ? window.localStorage.getItem('checkoutResponse') : ''
  const paymentResponse = isBrowser ? window.localStorage.getItem('paymentResponse') : ''
  return (
    <>
      <Page title='Order success'>
        <Box style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
        >


          <Box display='flex' justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
            <CircularProgress />
          </Box>

        </Box>
      </Page>
    </>
  )
}
const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(Results)
