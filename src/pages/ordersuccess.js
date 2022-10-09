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
const ordersuccess = () => {
    const location = useLocation()
    const payment = usePayment()
    console.log('resultPagePayment', payment)

    console.log('paymentSuccess', payment?.paymentSuccess)
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

                    <div style={{ textAlign: 'center' }}>
                        <HiBadgeCheck style={{ color: 'rgb(242, 108, 63)', fontSize: '75px', margin: '.5em 0' }} />
                        <Typography variant='h3' style={{ color: '#F26C3F', marginBottom: '35px' }}>
                            <b><FormattedMessage id='THANK YOU FOR YOUR ORDER!' /></b>
                        </Typography>
                        <Typography variant='h5'><FormattedMessage id='Your order id is' /> {data && data}</Typography>
                        <Typography variant='h5'><FormattedMessage id='You will recieve an email confirmation shortly' /> </Typography>
                        <Box display='flex' marginTop={4} alignItems='center' justifyContent='center' padding={2}>
                            <Link to='/'>
                                <Button variant='contained' color='primary' size='large'>
                                    <Typography variant='h5'><FormattedMessage id='Continue Shoppping' /></Typography>
                                </Button>
                            </Link>
                            <Box width={20} />
                            <Link to='/user/my-orders'>
                                <Button variant='contained' color='primary' size='large'>
                                    <Typography variant='h5'><FormattedMessage id='Go to my orders' /></Typography>
                                </Button>
                            </Link>
                        </Box>
                    </div>


                </Box>
            </Page>

        </>
    )
}
const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(ordersuccess)
