import React, { useEffect } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Container,
  Hidden,
  Breadcrumbs,
  CircularProgress
} from '@material-ui/core'
import Fade from 'react-reveal/Fade'
import { FormattedMessage } from 'gatsby-plugin-intl'

import Page from '../components/Page'
import Seo from '../components/common/Seo'
import MyOrdersLgView from '../domain/MyOrdersLgView'
import MyOrdersListSmView from '../domain/MyOrdersListSmView'
import { Link } from '../components/common/Router'
import { useCustomerOrderData } from '../helpers'

import emptyCartImage from '../assets/img/empty-basket.png'
import { Image } from '../components'

const MyOrders = () => {
  const customerOrderData = useCustomerOrderData()

  useEffect(() => {
    customerOrderData.fetchAll()
  }, [customerOrderData?.reload])

  return (
    <Page>
      <Seo title='My Orders' />
      <Box>
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
                <FormattedMessage id='My Orders' />
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box marginBottom={5} display='flex' flexDirection='column'>
            <Typography variant='h3' component='h3'><FormattedMessage id='My Orders' /></Typography>
          </Box>
        </Container>
        <Box paddingBottom={1}>
          {customerOrderData?.orderList.length === 0
            ? (
              <Box display='flex' justifyContent='center' height={320}>
                <Box width={320} textAlign='center'>
                  {customerOrderData?.isLoading
                    ? <CircularProgress />
                    : <>
                      <Image src={emptyCartImage} style={{ objectFit: 'contain' }} />
                      <Typography variant='subtitle1'><FormattedMessage id='You have no orders yet' /></Typography>
                    </>}
                </Box>
              </Box>
            )
            : (
              <>
                <Hidden mdDown>
                  <Container>
                    <MyOrdersLgView data={customerOrderData?.orderList} />
                  </Container>
                </Hidden>
                <Hidden mdUp>
                  <Container>
                    <Box>
                      <MyOrdersListSmView myOrders data={customerOrderData?.orderList} />
                    </Box>
                  </Container>
                </Hidden>
              </>
            )}
        </Box>

      </Box>
    </Page>
  )
}
const styles = () => ({
})
export default withStyles(styles, { withTheme: true })(MyOrders)
