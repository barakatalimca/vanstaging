import React from 'react'
import {
  withStyles,
  Typography,
  Grid,
  Box,
  Container,
  Button,
  CircularProgress,
  Snackbar,
  IconButton,
  SnackbarContent,
  Hidden
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { VscClose } from 'react-icons/vsc'

import Api from '../Api'
import { useI18n } from '../helpers'
import { Logo } from '../domain'

const NewsLetter = (props) => {
  const { classes } = props
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const i18n = useI18n()

  const submit = () => {
    setLoading(true)
    Api.submitEmail({ email: email })
      .then((response) => {
        setLoading(false)
        if (response.ok) {
          console.log('response', response)
          if (response.data.result === 1) {
            setShowSnackbar(true)
            setEmail('')
            setSnackbarText(response.data.message)
          } else {
            setShowSnackbar(true)
            setSnackbarText(response.data.message)
          }
        }
      })
      .catch((error) => {
        setShowSnackbar(true)
        setSnackbarText('Some error occured:' + error)
      })
  }

  return (
    <Box className={classes.root}>
      <Container>
        <Grid container alignItems='center'>
          <Hidden mdDown>
            <Grid item sm={12} md={5}>
              <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Logo isInverted size={320} />
              </Box>
            </Grid>
          </Hidden>
          <Grid item sm={12} md={7}>
            <Typography variant='h4' gutterBottom>
              <FormattedMessage id='Sign up for our newsletter to receive special offers, news & events' />
            </Typography>
            <Box display='flex' paddingTop={4}>
              <input
                className={classes.input}
                placeholder={i18n.locale === 'ar' ? 'أدخل عنوان بريدك الالكتروني' : 'Enter Your Email Address'}
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                disabled={loading}
                variant='contained'
                className={classes.button}
                onClick={() => submit()}
              >
                {!loading && <b><FormattedMessage id='Ok' /></b>}
                {loading && <b><CircularProgress /></b>}

              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
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
    </Box>
  )
}

const styles = (theme) => ({
  root: {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    // position: 'relative',
    height: '50vh',
    [theme.breakpoints.down('sm')]: {
      height: '40vh',
      '& > div > div .MuiGrid-item': {
        width: '100%'
      },
      '& h4': {
        marginTop: '0',
        textAlign: 'center'
      }
    }
  },
  input: `
    border: 3px solid #fff;
    background: transparent;
    color: #fff;
    padding: 15px;
    width: 90%;
    height: 60px;
    font-size: 15px;
  `,
  // NewsLetterForm: {
  //   '& button': {
  //     background: '#fff',
  //     color: '#000',
  //     boxShadow: 'none',
  //     borderRadius: '0'
  //   },
  //   '& ::-webkit-input-placeholder ': {
  //     color: '#fff'
  //   }
  // },
  button: {
    background: '#fff',
    color: '#000',
    boxShadow: 'none',
    borderRadius: '0'
  }

})

export default withStyles(styles, { withTheme: true })(NewsLetter)
