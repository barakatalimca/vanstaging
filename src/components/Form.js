import React from 'react'
import { withStyles, useTheme, Box, Container, Paper, TextField, Grid, Typography, Button, CircularProgress, Snackbar, IconButton, SnackbarContent } from '@material-ui/core'
import { GoogleMap, Marker } from 'react-google-maps'
import { useForm } from 'react-hook-form'

import useWindowSize from '../helpers/useWindowSize'
import ContactMap from './ContactMap'
import Api from '../Api'
import { VscClose } from 'react-icons/vsc'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { useI18n } from '../helpers'

const Form = ({ classes, map }) => {
  const [loading, setLoading] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const i18n = useI18n()
  const { register, handleSubmit, watch, errors, reset } = useForm()

  const onSubmit = (e, data) => {
    e.preventDefault()
    setLoading(true)
    console.log('contact form data', data)
    Api.submitContactForm(data)
      .then((response) => {
        if (response.ok) {
          setLoading(false)
          setShowSnackbar(true)
          setSnackbarText(response.data.message)
          // if (response.data.result === 1) {
          // }
          reset()
        } else {
          setLoading(false)
          setShowSnackbar(true)
          setSnackbarText('Some error occured!')
        }
      })
      .catch((error) => {
        console.log('error', error)
        setLoading(false)
        setShowSnackbar(true)
        setSnackbarText('Some error occured')
      })
  }

  return (
    <>
      <Typography variant='body1' gutterBottom>
        <FormattedMessage id='Feel free to get in touch with us' />
      </Typography>
      <form onSubmit={handleSubmit((e, payload) => onSubmit(payload, e))} onReset={reset}>
        <Box marginTop={4}>
          <label>{i18n.locale === 'ar' ? 'اسم' : 'Name'}</label>
          <TextField
            id='outlined-full-width'
            // label={i18n.locale === 'ar' ? 'اسم' : 'Name'}
            // placeholder={i18n.locale === 'ar' ? 'اسمك الكامل' : 'Your full name'}
            fullWidth
            name='name'
            margin='normal'
            variant='outlined'
            inputRef={register({ required: true })}
          />
          <label>{i18n.locale === 'ar' ? 'بريد الالكتروني' : 'Email'}</label>
          <TextField
            id='outlined-full-width'
            // label={i18n.locale === 'ar' ? 'بريد الالكتروني' : 'Email'}
            // placeholder={i18n.locale === 'ar' ? 'عنوان بريدك الإلكتروني' : 'Your email address'}
            fullWidth
            email='email'
            name='email'
            margin='normal'
            variant='outlined'
            inputRef={register({ required: true })}
          />
          {i18n.locale === 'ar' ? 'موضوع' : 'Subject'}
          <TextField
            id='outlined-full-width'
            // label={i18n.locale === 'ar' ? 'موضوع' : 'Subject'}
            // placeholder={i18n.locale === 'ar' ? 'عنوان قصير يتعلق برسالتك' : 'A short title relevant to your message'}
            fullWidth
            subject='subject'
            name='subject'
            margin='normal'
            variant='outlined'
            inputRef={register({ required: true })}
          />
          <TextField
            id='outlined-full-width'
            // label={i18n.locale === 'ar' ? 'رسالة' : 'Message'}
            // placeholder={i18n.locale === 'ar' ? 'اكتب بقدر ما تريد' : 'Write as much as you like'}
            fullWidth
            multiline
            name='message'
            rows={4}
            margin='normal'
            inputRef={register({ required: true })}
            variant='outlined'
          />
        </Box>
        <Box marginTop={4}>
          <Button type='submit' variant='contained' color='primary' size='large' disableElevation disabled={loading}>
            {loading && <CircularProgress />}
            {!loading && <>{i18n.locale === 'ar' ? 'إرسال' : 'Submit'}</>}
          </Button>
        </Box>
      </form>
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
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={() => setShowSnackbar(false)}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>
    </>
  )
}

const styles = (theme) => ({
  root: {
    height: '100vh',
    position: 'relative'
  },
  content: {
    height: '100%',
    position: 'relative',
    zIndex: 1
  },
  mapDesktop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  mapMobile: {
    height: '440px'
  }
})

export default withStyles(styles, { withTheme: true })(Form)
