import React from 'react'
import { withStyles, Box, Typography, Divider } from '@material-ui/core'

import { defaultTheme } from '../../providers/ThemeProvider'

const PageTitle = ({ title, description, image, classes }) => {
  return (
    <Box marginBottom={5}>
      <Box paddingBottom={5}>
        <Typography variant='h2' component='h1' align='center' gutterBottom={!!description}>
          {title}
        </Typography>
        <Typography variant='body1' align='center'>
          {description}
        </Typography>
      </Box>
      <Divider />
    </Box>
  )
}

const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(PageTitle)
