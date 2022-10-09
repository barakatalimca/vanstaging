import React, { useState } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Hidden,
  Divider
} from '@material-ui/core'

import { OrderDetailsContent, OrderListTable } from '../domain'

const MyOrdersLgView = ({ data = [], classes }) => {
  const [selectedOrderData, setSelectedOrderData] = useState(null)

  return (
    <>
      <Grid container spacing={4}>
        <Grid item sm={12} lg={7} md={7} xs={12}>
          <Box className={classes.orderList}>
            <OrderListTable data={data} onClickRow={setSelectedOrderData} />
          </Box>
        </Grid>
        <Hidden mdDown>
          <Grid item sm={12} lg={5} md={5} xs={12}>
            <Box className={classes.orderDetailsContent}>
              <Box paddingY={1}>
                <Typography
                  variant='h4'
                  gutterBottom
                >
                  {selectedOrderData?.order_id || data[0]?.order_id}
                </Typography>
              </Box>
              <Box paddingBottom={4}>
                <Divider />
              </Box>
              <OrderDetailsContent orderData={selectedOrderData || data[0]} />
            </Box>
          </Grid>
        </Hidden>
      </Grid>
    </>
  )
}

const styles = (theme) => ({
  orderList: {
    position: 'relative',
    right: -1
  },
  orderDetailsContent: {
    backgroundColor: '#f4f4f4',
    border: '1px solid #dfdfdf',
    borderRadius: theme.spacing(2),
    // margin: theme.spacing(23, 0),
    padding: theme.spacing(6)
  }
})

export default withStyles(styles, { withTheme: true })(MyOrdersLgView)
