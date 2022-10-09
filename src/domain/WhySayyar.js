import React from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container
} from '@material-ui/core'

const WhySayyar = ({ classes }) => {
  return (
    <Box marginTop={5} paddingTop={10} paddingBottom={12} className={classes.WhySayyar}>
      <Container>
        <Box
          marginBottom={7}
          display='flex'
          justifyContent='center'
          flexDirection='column'
          alignItems='center'
        >
          <img style={{ width: '220px', marginBottom: '15px' }} src={require('../assets/img/logo/logo-02.png')} />
          <Typography variant='h3' component='h3' align='center'>
            Why Sayyar ?
          </Typography>
        </Box>
        <Grid container className={classes.WhySayyarGrid}>
          <Grid item md={4} lg={4} sm={12} style={{ borderRight: '1px solid #ddd' }}>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <img src={require('../assets/img/icon-01.png')} />
              <Box marginTop={2}>
                <Typography variant='h6' component='h6' className={classes.emphasize} align='center'>Craftsmanship Guarantee</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={4} lg={4} sm={12} style={{ borderRight: '1px solid #ddd' }}>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <img src={require('../assets/img/icon-02.png')} />
              <Box marginTop={2}>
                <Typography variant='h6' component='h6' className={classes.emphasize} align='center'>Free Delivery & Returns</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={4} lg={4} sm={12}>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <img src={require('../assets/img/icon-03.png')} />
              <Box marginTop={2}>
                <Typography variant='h6' component='h6' className={classes.emphasize} align='center'>We Support 24:7</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

const styles = (theme) => ({
  WhySayyar: {
    background: '#eee'
  },
  WhySayyarGrid: {
    '& .MuiGrid-item': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    '& div img': {
      height: '60px'
    }
  },
  emphasize: {
    fontWeight: theme.typography.fontWeightBold
  }
})

export default withStyles(styles, { withTheme: true })(WhySayyar)
