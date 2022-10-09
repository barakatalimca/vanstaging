import React from 'react'
import { withStyles, Box } from '@material-ui/core'

const BoxShadow = ({ type = 'dreamySoft', children, classes, ...rest }) => {
  return (
    <Box className={classes[type]} {...rest}>
      {children}
    </Box>
  )
}

const styles = (theme) => ({
  dreamySoft: `
    box-shadow: 0 1px 2px rgba(0,0,0,0.07), 
      0 2px 4px rgba(0,0,0,0.07), 
      0 4px 8px rgba(0,0,0,0.07), 
      0 8px 16px rgba(0,0,0,0.07),
      0 16px 32px rgba(0,0,0,0.07), 
      0 32px 64px rgba(0,0,0,0.07);  
  `
})

export default withStyles(styles, { withTheme: true })(BoxShadow)
