import React from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Breadcrumbs,
  Hidden,
  Divider
} from '@material-ui/core'
import Fade from 'react-reveal/Fade'

import Page from '../components/Page'
import Seo from '../components/common/Seo'
import { Link } from '../components/common/Router'
import { SearchField } from '../components'
import { OrderDetailsContent, OrderInteractions, OrderListTable, OrderTracker } from '../domain'
import { FormattedMessage } from 'gatsby-plugin-intl'

const MyOrders = ({ classes }) => {
  return (
    <Page>
      <Fade>
        <Seo title='My Orders' />
        <Container>
          <Grid container>
            <Grid item sm={12} lg='6'>
              <Box marginTop={16}>
                <Breadcrumbs aria-label='breadcrumb' className='breadcrumb'>
                  <Link color='inherit' to='/'>
                    <FormattedMessage id='Home' />
                  </Link>
                  <Link color='inherit' to='/products/'>
                    <FormattedMessage id='Products' />
                  </Link>
                  <Typography color='textPrimary'>
                    <FormattedMessage id='My Orders' />
                  </Typography>
                </Breadcrumbs>
              </Box>
              <Box marginBottom={5} display='flex' justifyContent='space-between'>
                <Typography variant='h3' component='h3'><FormattedMessage id='My Orders' /></Typography>
                <SearchField />
              </Box>
              <Box className={classes.orderList}>
                <OrderListTable data={LIST} />
              </Box>
            </Grid>
            <Hidden lgDown>
              <Grid item sm={12} lg='6'>
                <Box className={classes.orderDetailsContent}>
                  <Box paddingY={1}>
                    <Typography variant='h4' gutterBottom>Order # SAY121</Typography>
                  </Box>
                  <Box paddingBottom={4}>
                    <Divider />
                  </Box>
                  <OrderDetailsContent data={LIST} />
                  <OrderTracker />
                  <OrderInteractions />
                </Box>
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </Fade>
    </Page>
  )
}

const LIST = [
  {
    id: 1,
    orderId: 'SAY9093',
    orderDate: '18/10/2020',
    orderDateFormatted: '18 Oct',
    name: 'Shemagh Scarf 03',
    quantity: '3',
    size: '7',
    color: 'Black',
    price: '204',
   // image: 'https://sayyarapp-deployments-mobilehub-1451989817.s3.amazonaws.com/products/thumb/15984318868502.jpg',
    orderStatus: 'ordered'
  },
  {
    id: 2,
    orderId: 'SAY5864',
    orderDate: '18/10/2020',
    orderDateFormatted: '18 Oct',
    name: 'Shemagh Scarf 03',
    quantity: '3',
    size: '7',
    color: 'Black',
    price: '204',
    image: 'https://vangava.com/van/uploads/product_images/16586640869.jpg',
    orderStatus: 'delivered'
  }, {
    id: 3,
    orderId: 'SAY7998',
    orderDate: '18/10/2020',
    orderDateFormatted: '18 Oct',
    name: 'Shemagh Scarf 03',
    quantity: '3',
    size: '7',
    color: 'Black',
    price: '204',
    image: 'https://vangava.com/van/uploads/product_images/16586640869.jpg',
    orderStatus: 'cancelled'
  }, {
    id: 4,
    orderId: 'SAY1293',
    orderDate: '18/10/2020',
    orderDateFormatted: '18 Oct',
    name: 'Shemagh Scarf 03',
    quantity: '3',
    size: '7',
    color: 'Black',
    price: '204',
    image: 'https://vangava.com/van/uploads/product_images/16586640869.jpg',
    orderStatus: 'returned'
  }

]
const styles = (theme) => ({
  orderList: {
    position: 'relative',
    right: -1
  },
  orderDetailsContent: {
    backgroundColor: '#f4f4f4',
    border: '1px solid #dfdfdf',
    borderRadius: theme.spacing(2),
    margin: theme.spacing(23, 0),
    padding: theme.spacing(6)
  }
})

export default withStyles(styles, { withTheme: true })(MyOrders)
