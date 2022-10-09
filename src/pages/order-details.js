import React, { useEffect } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Breadcrumbs
} from '@material-ui/core'
import Page from '../components/Page'
// import OrderTracker from '../components/OrderTracker'
import Seo from '../components/common/Seo'
import { Link } from '../components/common/Router'
import Fade from 'react-reveal/Fade'
import OrderTracker from '../domain/OrderTracker'
import OrderDetailsContent from '../domain/OrderDetailsContent'
import { useWishList } from '../helpers/useWishList'
import { useParams } from '@reach/router'
import Api from '../Api'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { useCustomerOrderData } from '../helpers'

const OrderDetails = ({ classes, props }) => {
  const params = useParams()
  const customerOrderData = useCustomerOrderData()

  useEffect(() => {
    if (params?.orderId) {
      customerOrderData.fetch(params?.orderId)
    }
  }, [params?.orderId])

  return (
    <Page>
      <Fade>
        <Seo title='Order Details' />
        <Box>
          <Container>
            <Box marginTop={16}>
              <Breadcrumbs aria-label='breadcrumb' className='breadcrumb'>
                <Link color='inherit' to='/'><FormattedMessage id='Home' /></Link>
                <Link color='inherit' to='/user/my-orders/'><FormattedMessage id='My Orders' /></Link>
                <Typography color='textPrimary'><FormattedMessage id='Order Details' /></Typography>
              </Breadcrumbs>
            </Box>
            <Box marginBottom={5} display='flex' flexDirection='column'>
              <Typography variant='h4'><FormattedMessage id='Order #' /> {params?.orderId}</Typography>
            </Box>
            <Box paddingBottom={5}>
              <Grid container>
                <Grid md={4} lg={4} sm={12}>
                  {/* <OrderTracker data={data} /> */}
                </Grid>
                <Grid md={8} lg={8} sm={12}>
                  <OrderDetailsContent />
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Fade>
    </Page>
  )
}
const styles = (theme) => ({
  emphasize: {
    fontWeight: theme.typography.fontWeightBold
  }
})
export default withStyles(styles, { withTheme: true })(OrderDetails)
