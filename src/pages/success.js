import React, { useEffect } from 'react'

import {
  withStyles, Box, Typography,
  Button
} from '@material-ui/core'
import { useLocation } from '@reach/router'

import Page from '../components/Page'
import { Link } from '../components/common/Router'
import { usePayment } from '../helpers'

const OrderSuccess = () => {
  //   const location = useLocation()
  //   const payment = usePayment()

  //   useEffect(() => {
  //     payment.verifyPayment(location.href)
  //   }, [])

  return (
    <Page title='Not Found'>
      <Box style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
      >
        <div style={{ textAlign: 'center' }}>
          <Typography variant='h5' style={{ color: '#F26C3F', marginBottom: '35px' }}>
						Your order was placed successfully!
          </Typography>
          <Link to='/user/my-orders'><Button variant='contained' color='primary'>Go to my orders</Button></Link>
        </div>
      </Box>
    </Page>
  )
}
const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(OrderSuccess)
