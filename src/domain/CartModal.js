import React from 'react'
import {
  withStyles,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'

import { navigate } from '../components/common/Router'
import CartList from './CartList'

const CartModal = (props) => {
  const { onClose, open, ...other } = props

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    navigate('/cart')
    onClose()
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth='sm'
      fullWidth
      aria-labelledby='confirmation-dialog-title'
      open={open}
      {...other}
    >
      <DialogTitle id='confirmation-dialog-title'>
        <FormattedMessage id='Your Shopping Bag' />
      </DialogTitle>
      <DialogContent dividers>
        <CartList allowLastItemToBeDeleted={false} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleOk} color='primary'>
          <FormattedMessage id='View Bag' />
        </Button>
        <Button onClick={handleCancel} color='primary'>
          <FormattedMessage id='Continue Shopping' />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const styles = (theme) => ({
})

export default withStyles(styles, { withTheme: true })(CartModal)
