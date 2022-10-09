import React, { useState } from 'react'
import {
  withStyles,
  CircularProgress,
  Button,
  TextField,
  Divider,
  IconButton,
  Snackbar,
  SnackbarContent
} from '@material-ui/core'
import { IoMdClose } from 'react-icons/io'
import { FormattedMessage } from 'gatsby-plugin-intl'
import clsx from 'clsx'

import { useCart, useCheckout, usePayment } from '../helpers'
import { useAuth } from '../helpers/useAuth'
import Api from '../Api'
import { VscClose } from 'react-icons/vsc'

const IbnForm = ({
  classes
}) => {
  const auth = useAuth()
  const payment = usePayment()
  const checkout = useCheckout()
  const cart = useCart()

  const [value, setValue] = useState(auth?.user?.ibn_no)
  const [isLoading, setIsLoading] = useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [showCross, setShowCross] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const submit = () => {
    setIsLoading(true)
    const payload = { ...auth?.user, ibn_no: value, action: 'update' }
    delete payload.isLoggedIn
    Api.manageProfile(payload)
      .then((response) => {
        setIsLoading(false)
        if (response.ok) {
          Api.manageProfile({ action: 'list' })
            .then((response) => {
              setIsLoading(false)
              if (response.ok) {
                console.log('response', response)
                if (response.data.result === 1) {
                  setShowSnackbar(true)
                  setSnackbarText('Updated Successfully!')
                } else {
                  setShowSnackbar(true)
                  setSnackbarText('Some error occured!')
                }
              }
            })
        }
      })
  }
  const clear = () => {
    setValue('')
    setShowCross(false)
  }

  const endAdornment = () => {
    if (isLoading) {
      return <CircularProgress style={{ height: '24px', width: '30px' }} />
    }

    if (showCross) {
      return <IconButton onClick={clear}> <IoMdClose /> </IconButton>
    }

    return <Button variant='contained' color='secondary' onClick={submit}> <FormattedMessage id='Save' /></Button>
  }

  React.useEffect(() => {
    Api.manageProfile({ action: 'list' })
      .then((response) => {
        setIsLoading(false)
        if (response.ok) {
          if (response.data.result === 1) {
            setValue(response.data.data.ibn_no)
          } else { }
        }
      })
  }, [])

  React.useEffect(() => {
    if (auth?.user?.ibn_no) {
      setShowCross(true)
    }
  }, [auth?.user?.ibn_no])
  return (
    <>
      <TextField
        id='outlined-basic'
        onChange={(e) => setValue(e.target.value)}
        label={<FormattedMessage id='IBAN No.' />}
        defaultValue={value || ''}
        value={value || ''}
        fullWidth
        placeholder='Enter your IBAN No.'
        variant='outlined'
        inputProps={{ maxLength: 24 }}
        InputProps={{
          endAdornment: endAdornment()
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={() => setShowSnackbar(false)}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: '#000'
          }}
          message={<span id='client-snackbar'>{snackbarText}</span>}
          action={
            <IconButton size='large' aria-label='close' color='inherit' onClick={() => setShowSnackbar(false)}>
              <VscClose fontSize='large' />
            </IconButton>
          }
        />
      </Snackbar>
    </>
  )
}
const styles = (theme) => ({
  root: {
    // background: '#eee',
  },
  input: {
    '& .MuiInputBase-input': {
      textTransform: 'uppercase'
    }
  },
  inputSuccess: {
    '& .MuiFormHelperText-root': {
      color: theme.palette.success.dark
    }
  },
  loader: {
    height: '20px'
  }
})
export default withStyles(styles, { withTheme: true })(IbnForm)
