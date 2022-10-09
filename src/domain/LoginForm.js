import React, { useState } from 'react'
import { navigate, Link } from '../components/common/Router'
import { redirectTo } from '@reach/router'
import OtpInput from 'react-otp-input'

import {
  withStyles,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FilledInput,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  Divider
} from '@material-ui/core'
import clsx from 'clsx'
import Fade from 'react-reveal/Fade'

import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'

import { useAuth } from '../helpers/useAuth'
import { useCart } from '../helpers'
import PhoneNumberInput from './PhoneNumberInput'
import { FormattedMessage } from 'gatsby-plugin-intl'

const LoginForm = ({ classes }) => {
  const cart = useCart()
  const auth = useAuth({ cart })
  const { register, handleSubmit, watch, errors } = useForm()
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false
  })
  const isBrowser = typeof window !== 'undefined'
  const [otp, setOtp] = React.useState(null)
  const [receivedOtp, setReceivedOtp] = React.useState(null)
  const [resendData, setResendData] = React.useState(null)
  const [wrongOtp, setWrongOtp] = React.useState(false)
  const [loginWithPassword, setLoginWithPassword] = React.useState(false)
  const [forgotPassword, setForgotPassword] = React.useState(false)
  const handleChangeOtp = (data) => {
    setOtp(data)
  }
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const [countryCode, setCountryCode] = React.useState(null)

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const activateWithPasswordForm = () => {
    setLoginWithPassword(true)
    setReceivedOtp(null)
    if (isBrowser) {
      window.localStorage.removeItem('otp')
    }
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  const onSubmitGetOtp = (formData) => {
    // e.preventDefault()
    auth.getOtp(formData)
    setCountryCode(formData.code)
    setResendData(formData)
  }
  const resendOtp = () => {
    resendData.type = 'resend'
    auth.getOtp(resendData)
  }
  const onSubmitWithPassword = (e, payload) => {
    e.preventDefault()
    payload.password = values.password
    auth.signin(payload)
  }
  const onSubmitForgotPassword = (e, payload) => {
    auth.forgotPassword(payload)
  }
  const onSubmitOtp = (e) => {
    setWrongOtp(false)
    e.preventDefault()
    const intValue = parseInt(receivedOtp, 10)
    const intVal = parseInt(otp, 10)
    const intCode = parseInt(countryCode, 10)
    if (intVal === intValue) {
      auth.signInWithOtp(intCode)
    } else {
      setWrongOtp(true)
    }
  }
  const skipOtp = () => {
    setWrongOtp(false)
    const intCode = parseInt(countryCode, 10)
    auth.signInWithOtp(intCode)
  }
  // const [onSubmit] = useMutation(
  //   payload => {
  //     payload.password = values.password
  //     const data = useMutation(LOGIN_USER, Api.loginUser(payload), {
  //       onSuccess: () => {
  //         console.log('this is data', data)
  //       }
  //     })
  //   }
  // )
  React.useEffect(() => {
    setReceivedOtp(auth?.otp)
  }, [auth, otp])
  React.useEffect(() => {
    setLoginWithPassword(false)
    setReceivedOtp(null)
  }, [])
  React.useEffect(() => {
    if (auth.user?.isLoggedIn && !cart.isEmpty) {
      // cart.syncCart()
    }
  }, [auth, cart])

  React.useEffect(() => {
    setForgotPassword(false)
    // setLoginWithPassword(true)
  }, [auth?.reload])

  return (
    <>
      <Box
        className='signInSignUpBox'
      >
        {console.log('loginWithPassword', loginWithPassword)}
        <Typography variant='body2' gutterBottom>
          {loginWithPassword === null && <> <FormattedMessage id='If you are a registered user, please enter your email and password.' /></>}
          {receivedOtp === null && !loginWithPassword && !forgotPassword && <><FormattedMessage id='Please enter your phone number to receive an OTP' /></>}
          {receivedOtp !== null && !loginWithPassword && <><FormattedMessage id='OTP sent to' /> {auth?.phone && <>{auth?.phone}</>} </>}
        </Typography>
        {loginWithPassword &&
          <>
            <form onSubmit={handleSubmit((e, payload) => onSubmitWithPassword(payload, e))}>
              <Box marginTop={1}>
                <Box paddingY={1}>
                  {/* <InputLabel id='demo-simple-select-filled-label'><FormattedMessage id='Email or Mobile Number' /> *</InputLabel> */}
                  <TextField
                    name='email'
                    label={<FormattedMessage id='Email or Mobile Number' />}
                    variant='filled'
                    fullWidth
                    inputRef={register({
                      required: true
                      // pattern: /.+@.+\..+/
                    })}
                    required
                    error={errors.email}
                  // helperText={errors.email ? 'Invalid Email!' : null}
                  />
                </Box>
                <Box paddingY={1} style={{ direction: 'ltr' }}>
                  <FormControl variant='filled' fullWidth>
                    <InputLabel htmlFor='outlined-adornment-password'><FormattedMessage id='Password' /> *</InputLabel>
                    <FilledInput
                      id='outlined-adornment-password'
                      fullWidth
                      inputRef={register({ required: true })}
                      variant='filled'
                      type={values.showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange('password')}
                      required
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                          >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                  </FormControl>
                </Box>

                <Box paddingY={1} display='flex' justifyContent='space-between' alignItems='center'>
                  <a onClick={() => { setForgotPassword(true); setLoginWithPassword(false) }}><small><FormattedMessage id='Forgot Password ?' /></small></a>
                  <a onClick={() => setLoginWithPassword(false)}><small><FormattedMessage id='Sign-in using OTP' /></small></a>
                </Box>
                {auth?.invalid &&
                  <Fade>
                    <Box paddingY={1} display='flex' alignItems='center' justifyContent='center'><span style={{ color: 'red' }}>Invalid Credentials!</span></Box>
                  </Fade>}
                <Box paddingY={1}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='secondary'
                    disabled={auth?.loading}
                    size='large'
                  >
                    {!auth?.loading && <><FormattedMessage id='Submit' /></>}
                    {auth?.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                </Box>
              </Box>
            </form>
          </>}
        {forgotPassword &&
          <>
            <form onSubmit={handleSubmit((e, payload) => onSubmitForgotPassword(payload, e))}>
              <TextField
                name='email'
                label={<FormattedMessage id='Email' />}
                variant='filled'
                fullWidth
                inputRef={register({
                  required: true,
                  pattern: /.+@.+\..+/
                })}
                required
                error={errors.email}
                helperText={errors.email ? 'Invalid Email!' : null}
              />
              <Box paddingY={1} display='flex' justifyContent='space-between' alignItems='center'>
                <a onClick={() => { setForgotPassword(false); setLoginWithPassword(false) }}><small><FormattedMessage id='Sign-in using OTP' /></small></a>
              </Box>
              {auth?.invalid &&
                <Fade>
                  <Box paddingY={1} display='flex' alignItems='center' justifyContent='center'><span style={{ color: 'red' }}>Invalid Email!</span></Box>
                </Fade>}
              <Box paddingY={1}>
                <Button
                  type='submit'
                  variant='contained'
                  color='secondary'
                  disabled={auth?.loading}
                  size='large'
                >
                  {!auth?.loading && <><FormattedMessage id='Submit' /></>}
                  {auth?.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>
              </Box>
            </form>
          </>}
        {receivedOtp === null && !loginWithPassword && !forgotPassword &&
          <>
            <form onSubmit={handleSubmit(onSubmitGetOtp)}>
              <Box>
                <Box paddingY={1}>
                  <PhoneNumberInput
                    register={register}
                    phoneNumberInputName='phone'
                    callingCodeInputName='code'
                    errors={errors}
                  />
                </Box>
                {auth?.otpError &&
                  <>
                    <Fade>
                      <Box paddingY={1} display='flex' alignItems='center' justifyContent='center'><span style={{ color: 'red' }}><FormattedMessage id='An error occurred! Please try again.' /></span></Box>
                    </Fade>
                  </>}
                <Box paddingY={1}>
                  <small>
                    <a onClick={activateWithPasswordForm}><FormattedMessage id='Sign-in using password' /></a>
                  </small>

                </Box>
                <Box paddingY={1}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='secondary'
                    disabled={auth?.loading}
                    size='large'
                  >
                    {!auth?.loading && <><FormattedMessage id='Submit' /></>}
                    {auth?.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                </Box>
              </Box>
            </form>
          </>}
        {receivedOtp !== null && !loginWithPassword &&
          <>
            <form onSubmit={handleSubmit((e, payload) => onSubmitOtp(payload, e))}>
              <Box
                display='flex'
                flexDirection='column'
                marginTop={1}
              >
                <Box
                  paddingY={1} className={classes.otpContainer}
                  style={{ direction: 'ltr' }}
                >
                  <OtpInput
                    value={otp}
                    isInputNum
                    onChange={handleChangeOtp}
                    numInputs={4}
                    shouldAutoFocus
                  // separator={<span>-</span>}
                  />
                  <Box paddingY={2} display='flex' justifyContent='space-between'>
                    <a onClick={() => activateWithPasswordForm()}><small><FormattedMessage id='Sign-in using password' /></small></a>
                    <a onClick={() => skipOtp()}><small><FormattedMessage id='Skip OTP' /></small></a>
                  </Box>
                  <Button
                    type='submit'
                    variant='contained'
                    color='secondary'
                    disabled={auth?.loading || !otp?.length || otp?.length < 4}
                    size='large'
                  >
                    {!auth?.loading && <><FormattedMessage id='Submit' /></>}
                    {auth?.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                  <Box paddingY={2}>
                    <Button
                      // variant='contained'
                      color='secondary'
                      onClick={() => resendOtp()}
                      disabled={auth?.resetLoading}
                      size='large'
                    >
                      {!auth?.resetLoading && <><FormattedMessage id='Resend OTP' /></>}
                      {auth?.resetLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </Button>
                  </Box>
                  <Divider />
                </Box>
                {wrongOtp &&
                  <Fade>
                    <Box paddingY={1} display='flex' alignItems='center' justifyContent='center'><span style={{ color: 'red' }}><FormattedMessage id='Wrong OTP!' /></span></Box>
                  </Fade>}
              </Box>
            </form>
          </>}
      </Box>
    </>
  )
}
const styles = (theme) => ({
  countryCodeSelect: {
    border: 0,
    borderRadius: 0,
    minWidth: 80,
    '& fieldset': {
      border: 0
    }
  },
  otpContainer: {
    '& > div': {
      justifyContent: 'space-between'
    },
    '&  div input': {
      width: '6em !important',
      height: '60px',
      padding: '18.5px 14px',
      marginRight: '15px',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: '4px'
    },
    [theme.breakpoints.down('sm')]: {
      '&  div input': {
        width: '4.3em !important'
      }
    }
  }
})
export default withStyles(styles, { withTheme: true })(LoginForm)
