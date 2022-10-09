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
const orderfailed = () => {
    const location = useLocation()
    const payment = usePayment()
    console.log('resultPagePayment', payment)

    console.log('paymentSuccess', payment?.paymentSuccess)
    console.log('paymentSuccessdata', payment?.paymentSuccessData)
    const data = isBrowser ? window.localStorage.getItem('checkoutResponse') : ''
    const paymentResponse = isBrowser ? window.localStorage.getItem('paymentResponse') : ''
    return (
        <>



            <Page title='order failed'>
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
                            {paymentResponse ? <>{paymentResponse}</> : 'Some error occured'}
                        </Typography>
                        <Link to={payment?.paymentSuccess ? '/' : '/cart'}>
                            <Button variant='contained' color='primary' size='large'>
                                {payment?.paymentSuccess ? 'Continue Shopping' : 'Go to cart'}
                            </Button>
                        </Link>
                    </div>



                </Box>
            </Page>

        </>
    )
}
//
const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(orderfailed)
