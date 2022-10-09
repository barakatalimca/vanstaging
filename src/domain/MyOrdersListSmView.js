import React from 'react'
import {
  withStyles,
  Box
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'

import OrderStatusChip from './OrderStatusChip'
import { useWishList } from '../helpers/useWishList'
import { Link } from '../components/common/Router'

const MyOrdersListSmView = ({ data = [], classes }) => {
  const setOrderId = useWishList()

  React.useEffect(() => {
    setOrderId.setOrderItemId(data && data[0])
  }, [])

  return (
    <div className={classes.root}>
      {data.map((item) => (
        <Link to={`/user/order-details/${item.order_id}`} key={item.order_id} className={classes.item}>
          <Box key={item.order_id}>
            <Box paddingY={1.5}>
              <Box display='flex' justifyContent='space-between' alignItems='center' marginBottom={2}>
                <b>Order Id</b> {item.order_id}
              </Box>
              <Box display='flex' justifyContent='space-between' alignItems='center' marginBottom={2}>
                <div><b><FormattedMessage id='Ordered On' /></b><br />{item.ordered_on}</div>
                <div style={{ textAlign: 'right' }}><b><FormattedMessage id='Expected delivery' /></b><br />{item.expected_on}</div>
              </Box>
              <Box display='flex' justifyContent='space-between' alignItems='center' marginBottom={2}>
                <div>
                  <b><FormattedMessage id='Status' /></b>
                  <OrderStatusChip
                    value={item.status_color_code}
                    label={item.display_status}
                  />
                </div>
                <div>
                  <b><FormattedMessage id='Total' /></b>
                  {item.total_price}
                </div>
              </Box>
            </Box>
          </Box>
        </Link>

      ))}
      <Box height={300} />
    </div>
  )
}

const styles = (theme) => ({
  item: `
  display: block;
  margin-bottom: ${theme.spacing(2)}px;
  padding: ${theme.spacing(2)}px;
  padding-bottom: 0;
  border-radius: 6;
  box-shadow: 0 1px 1px rgba(0,0,0,0.08), 
              0 2px 2px rgba(0,0,0,0.12), 
              0 4px 4px rgba(0,0,0,0.16), 
              0 8px 8px rgba(0,0,0,0.20);
  `
})

export default withStyles(styles, { withTheme: true })(MyOrdersListSmView)
