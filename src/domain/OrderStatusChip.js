import React from 'react'
import {
  withStyles,
  Box,
  Typography
} from '@material-ui/core'

import { useOrderStatusInfo } from '../helpers'


const OrderStatusChip = ({ value, label, classes }) => {
  const { getOrderStatusColor } = useOrderStatusInfo()

  return (
    <Box display='flex' alignItems='center'>
      <span
        className={classes.dot}
        style={{ backgroundColor: getOrderStatusColor(value) }}
      />
      <Box width={5} />
      <Typography
        variant='caption'
        className={classes.label}
      >
        {label}
      </Typography>
    </Box>
  )
}
const styles = (theme) => ({
  dot: {
    borderRadius: '50%',
    height: 12,
    width: 12
  },
  label: {
    textTransform: 'capitalize'
  }
})

export default withStyles(styles, { withTheme: true })(OrderStatusChip)
