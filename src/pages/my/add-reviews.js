import React, { useState } from 'react'
import { graphql } from 'gatsby'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Hidden,
  Breadcrumbs
} from '@material-ui/core'
// import OrderTracker from '../components/OrderTracker'
import { Link } from '../../components/common/Router'
import Fade from 'react-reveal/Fade'

import Page from '../../components/Page'
import MyOrdersLgView from '../../domain/MyOrdersLgView'
import MyOrdersListSmView from '../../domain/MyOrdersListSmView'
import Api from '../../Api'
import { FormattedMessage } from 'gatsby-plugin-intl'

const AddReviews = ({ classes }) => {
  const [dataList, setData] = React.useState([])
  React.useEffect(() => {
    Api.getMyOrders()
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            setData(response.data.data)
          }
        }
      })
  }, [])
  // const pastOrders = dataList.filter(item => item.orderStatus !== 'ordered');
  // const newOrders = dataList.filter(item => item.orderStatus === 'ordered');
  return (
    <Page>
      <Fade>
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
                  My Orders
                </Typography>
              </Breadcrumbs>
            </Box>

            <Box marginBottom={5} display='flex' flexDirection='column'>
              <Typography variant='h3' component='h3'>My Orders</Typography>
            </Box>
          </Container>
          {/* <Box paddingTop={1} paddingBottom={1}>
                                    <Typography variant='h6' component='h6'>Recently Ordered</Typography>
                                    <Box paddingTop={2.5}>
                                        <CartList myOrders data={newOrders} newOrders />
                                    </Box>
                                </Box> */}
          <Box paddingBottom={1}>
            <Hidden mdDown>
              <Container>
                <MyOrdersLgView data={dataList} />
              </Container>
            </Hidden>
            <Hidden mdUp>
              <Container>
                <Box>
                  <MyOrdersListSmView myOrders data={dataList} />
                </Box>
              </Container>
            </Hidden>
          </Box>

        </Box>
      </Fade>
    </Page>
  )
}
const styles = (theme) => ({
})
export default withStyles(styles, { withTheme: true })(AddReviews)
