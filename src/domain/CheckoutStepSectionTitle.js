import React from 'react'
import { withStyles, Box, Typography } from '@material-ui/core'

const CheckoutStepSectionTitle = ({ children, classes }) => {
  return (
    <Box marginBottom={2}>
      <Typography variant='caption' color='textSecondary' className={classes.text}>
        <b>{children}</b>
      </Typography>
    </Box>
  )
}

const styles = (theme) => ({
  text: {
    // letterSpacing: 6,
    textTransform: 'uppercase'
  }
})

export default withStyles(styles, { withTheme: true })(CheckoutStepSectionTitle)
