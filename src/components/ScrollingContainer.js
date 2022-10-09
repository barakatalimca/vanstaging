import React from 'react'
import { withStyles, Box } from '@material-ui/core'

const ScrollingContainer = ({ children, classes }) => {
  return (
    <>
      <Box className={classes.root}>
        {children}
      </Box>
    </>
  )
}

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    padding: theme.spacing(0, 1),
    '& > div': {
      flex: '0 0 auto',
      width: '300px',
      padding: theme.spacing(1)
    }
  }
})

export default withStyles(styles, { withTheme: true })(ScrollingContainer)
