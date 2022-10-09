import React from 'react'
import {
  withStyles
} from '@material-ui/core'

import { Timeline } from '../components'

const OrderTracker = ({ data, classes }) => {
  return (
    <>
      <Timeline data={data} />
    </>
  )
}

const styles = (theme) => ({
  emphasize: {
    fontWeight: theme.typography.fontWeightBold
  }
})

export default withStyles(styles, { withTheme: true })(OrderTracker)
