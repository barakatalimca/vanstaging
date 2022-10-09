import React from 'react'
import {
  withStyles, Box, IconButton, Button
} from '@material-ui/core'
import { BiArrowBack } from 'react-icons/bi'
import { navigate } from '../components/common/Router'

export const HEADER_HEIGHT = '7rem'
export const HEADER_ICON_SIZE = 20

const CheckoutHeader = ({ classes }) => {
  const goBack = () => window ? window.history.back() : null

  return (
    <>
      <Box display='flex' justifyContent='center' alignItems='center' padding={2}>
        <img src={require('../assets/img/logo/logoblack.png')} style={{ width: '170px' }} />
        <div className={classes.backButton}>
          {/* <Button
            variant='text'
            color='secondary'
            className={classes.button}
            startIcon={<BiArrowBack />}
          >
            Back
          </Button> */}
          <IconButton size='large' onClick={goBack}><BiArrowBack /></IconButton>
        </div>
      </Box>
    </>
  )
}

const styles = (theme) => ({
  backButton: {
    padding: theme.spacing(1),
    position: 'absolute',
    left: 0
  }
})

export default withStyles(styles, { withTheme: true })(CheckoutHeader)
