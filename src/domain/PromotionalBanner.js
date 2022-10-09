import React, { useEffect, useState } from 'react'
import {
  withStyles, Box, Container,
  Typography,
  Grid,
  Divider,
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import banner from '../assets/img/ban1.jpg'
import useWindowSize from '../helpers/useWindowSize'
import ProductListItem from './ProductListItem'


const PromotoinalBanner = ({ classes }) => {
  const theme = useTheme()
  const { width } = useWindowSize()
  return (
    <>
      <Box >
        <Box className={classes.promoBanner} paddingLeft={5} paddingRight={5}
          style={{
            backgroundImage: "url(" + banner + ")",
            height: '65vh',
            display: 'flex',
            alignItems: 'flex-end',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          <Box paddingTop={1.5} paddingBottom={1.5} paddingLeft={3} paddingRight={3} style={{ background: '#fff', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
            <Typography variant='h6' component='h5'><b>Winter Special</b></Typography>
          </Box>
        </Box>
      </Box>

    </>
  )
}

const styles = (theme) => ({
  promoBanner: {
    '& ::before': {
      content: '0',
      background: '#000',
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: '0'
    }
  }
})

export default withStyles(styles, { withTheme: true })(PromotoinalBanner)
