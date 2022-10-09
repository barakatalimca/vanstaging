import React from 'react'
import { withStyles, Box, Typography } from '@material-ui/core'

import { defaultTheme } from '../../providers/ThemeProvider'

const SectionTitle = (props) => {
  const { title, classes } = props
  return (
    <Box marginBottom={5}>
      <Typography
        component='h2'
        align='center'
        className={classes.text}
      >
        {title}
      </Typography>
    </Box>
  )
}

const styles = (theme) => ({
  text: {
    ...theme.typography.h4,
    fontWeight: defaultTheme.typography.fontWeightBold,
    letterSpacing: '0.5em',
    textTransform: 'uppercase'
  }
})

export default withStyles(styles, { withTheme: true })(SectionTitle)
