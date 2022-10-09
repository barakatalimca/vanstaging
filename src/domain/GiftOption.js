import React, { useEffect, useState } from 'react'
import {
  withStyles,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  DialogTitle
} from '@material-ui/core'

import CardGiftcardIcon from '@material-ui/icons/CardGiftcard'
import { FormattedMessage } from 'gatsby-plugin-intl'
import WalletBalance from './WalletBalance'

const GiftOption = ({
  isSelected = false,
  selectedPaymentMethodId,
  message = '',
  onChange = () => { },
  onChangeMessageText = () => { },
  classes
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const _onChange = event => {
    onChange(event.target.checked)
  }

  const _onChangeMessageText = event => {
    onChangeMessageText(event.target.value)
  }

  const onOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const onCloseDialog = () => {
    setIsDialogOpen(false)
  }

  useEffect(() => {
    if (isSelected && selectedPaymentMethodId && selectedPaymentMethodId === 'COD') {
      onOpenDialog()
    }
  }, [isSelected])

  return (
    <>
      <FormControl component='fieldset'>
        <FormControlLabel
          control={<Checkbox onChange={_onChange} checked={isSelected} name='giftOption' />}
          label={
            <Box display='flex' paddingTop={1}>
              <CardGiftcardIcon />
              <Box width={10} />
              <div>
                <span><FormattedMessage id='This order is a gift' /></span>
                <br />
                <small><FormattedMessage id='Cash on Delivery not available' /></small>
              </div>
            </Box>
          }
          className={classes.label}
        />
      </FormControl>
      {isSelected &&
        <>
          <TextField
            label='Add a gift message'
            value={message || ''}
            placeholder='Write as much as you like'
            fullWidth
            onChange={_onChangeMessageText}
            multiline
            name='message'
            rows={3}
            margin='normal'
            variant='outlined'
          />
        </>}
      <Dialog
        open={isDialogOpen}
        onClose={onCloseDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {/* <DialogTitle id='alert-dialog-title'>
          <FormattedMessage id='Gift Option Selected' />
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <FormattedMessage id='Cash on Delivery option not available. The next available payment method has been selected for you.' />
          </DialogContentText>
        </DialogContent>
        <Box paddingLeft={2} paddingBottom={2}>
          <DialogActions>
            <Button
              onClick={onCloseDialog}
              color='secondary'
            >
              <FormattedMessage id='OK' />
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}

const styles = (theme) => ({
  label: {
    alignItems: 'flex-start'
  }
})

export default React.memo(withStyles(styles, { withTheme: true })(GiftOption))
