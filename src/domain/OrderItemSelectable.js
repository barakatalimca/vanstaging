import React from 'react'
import {
  Box,
  Checkbox,
  withStyles
} from '@material-ui/core'

import ProductSkuItemBase from './ProductSkuItemBase'
import { theme } from '../providers/ThemeProvider'

const OrderItemSelectable = ({ data, isSelected = false, onSelect = () => { }, classes }) => {
  const handleChange = () => {
    onSelect(data)
  }

  return (
    <Box display='flex' alignItems='center'>
      <Checkbox
        checked={isSelected}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'Select order item' }}
      />
      <Box width={6} />
      <ProductSkuItemBase data={data} />
    </Box>
  )
}

const styles = () => ({

})

export default withStyles(styles, { withTheme: true })(OrderItemSelectable)
