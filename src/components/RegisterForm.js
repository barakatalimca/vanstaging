import React from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  CircularProgress,
  Select,
  MenuItem,
  IconButton,
  TextField
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import clsx from 'clsx'
import Fade from 'react-reveal/Fade'

import { useAuth } from '../helpers/useAuth'
import { FormattedMessage } from 'gatsby-plugin-intl'

const RegisterForm = ({ profileData, myProfile, classes }) => {
  const { register, handleSubmit, watch, errors } = useForm()
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false
  })
  const [countryCodes, setCountryCodes] = React.useState(myProfile && profileData.code)
  const [spaceNotAllowed, setSpaceNotAllowed] = React.useState(false)
  const [invalid, setInvalid] = React.useState(false)

  const changeCode = (event) => {
    setCountryCodes(event.target.value)
  }
  const auth = useAuth()

  const handleChange = (prop) => (event) => {
    if (event.target.value.includes(' ')) {
      event.preventDefault()
      setSpaceNotAllowed(true)
    } else {
      setSpaceNotAllowed(false)
      setValues({ ...values, [prop]: event.target.value })
    }
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const onSubmit = (formData) => {
    if (!myProfile) {
      const payload = {
        ...formData,
        password: values.password,
        code: countryCodes
      }
      if (!invalid) {
        auth.signup(payload)
      }
    } else {
      const payload = {
        action: 'update',
        ...auth?.user,
        ...formData
      }
      console.log('payload', payload)
      auth.editProfile(payload)
    }
  }
  const phneNumber = (e) => {
    const re = /^[0-9\b]+$/
    if (e === '' || re.test(e)) {
      setInvalid(false)
    } else {
      setInvalid(true)
    }
  }
  return (
    <Box
      className='signInSignUpBox'
    >
      {/* {!myProfile && <Typography variant='small'>All fields are required</Typography>} */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display='flex'
          flexDirection='column'
          marginTop={1}
        >
          <Box paddingTop={1} paddingBottom={1}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <FormControl variant='filled' className={classes.formControl} style={{ width: '100%' }}>
                  {/* <InputLabel><FormattedMessage id='name' />*</InputLabel> */}
                  <TextField
                    name='name'
                    variant='outlined'
                    label={<FormattedMessage id='name' />}
                    inputProps={{ maxLength: 50, minLength: 4 }}
                    key={myProfile && profileData.name}
                    defaultValue={myProfile && profileData.name}
                    fullWidth
                    required
                    inputRef={register({ required: true })}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box paddingTop={1} paddingBottom={1}>
            <Grid container spacing={2}>
              <Grid item md={4} sm={4} xs={4}>
                <FormControl variant='outlined' className={classes.formControl} style={{ width: '100%' }}>
                  <InputLabel style={{ backgroundColor: '#fff' }} id='demo-simple-select-outlined-label'><FormattedMessage id='Code' />*</InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    disabled={myProfile}
                    value={countryCodes}
                    onChange={changeCode}
                    required
                    fullWidth
                    inputRef={register({ required: true })}
                  >
                    <MenuItem value=''><em>Select</em></MenuItem>
                    {auth?.countries?.map((l, i) => (
                      <MenuItem key={l.calling_code} value={l.calling_code}>{l.calling_code}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                <FormControl variant='outlined' className={classes.formControl} style={{ width: '100%' }}>
                  {/* <InputLabel id='demo-simple-select-outlined-label'><FormattedMessage id='Phone Number' />*</InputLabel> */}
                  <TextField
                    name='mobile_no'
                    inputProps={{ maxLength: 10, minLength: 9 }}
                    onChange={e => phneNumber(e.target.value)}
                    label={<FormattedMessage id='Phone Number' />}
                    key={myProfile && profileData.mobile_no}
                    defaultValue={myProfile && profileData.mobile_no}
                    variant='outlined'
                    disabled={myProfile}
                    fullWidth
                    type='tel'
                    required
                    inputRef={register({ required: true })}
                  />
                </FormControl>
                {invalid && <small style={{ color: 'red' }}>Invalid Phone Number</small>}
              </Grid>
            </Grid>
          </Box>
          <Box paddingTop={1} paddingBottom={1}>
            <FormControl variant='outlined' className={classes.formControl} style={{ width: '100%' }}>
              {/* <InputLabel id='demo-simple-select-outlined-label'><FormattedMessage id='Email' />*</InputLabel> */}
              <TextField
                name='email'
                label={<FormattedMessage id='Email' />}
                key={myProfile && profileData.email}
                defaultValue={myProfile ? profileData.email : null}
                variant='outlined'
                fullWidth
                inputRef={register({ required: false, pattern: /.+@.+\..+/ })}
              />
            </FormControl>
            {errors.email && <small style={{ color: 'red' }}><FormattedMessage id='Invalid Email!' /></small>}
            {console.log('errors', errors)}
          </Box>
          {!myProfile && (
            <>
              <Box paddingTop={1} paddingBottom={1} style={{ direction: 'ltr' }}>
                <FormControl style={{ width: '100%' }} inputRef={register({ required: false })} className={clsx(classes.margin, classes.textField)} variant='outlined'>
                  <InputLabel htmlFor='outlined-adornment-password'><FormattedMessage id='Password' /> *</InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-password'
                    inputRef={register({ required: false })}
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
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
                {spaceNotAllowed && <small style={{ color: 'red' }}>Space not allowed in password!</small>}
              </Box>
              {/* <Box paddingTop={1} paddingBottom={1}>
                <TextField
                  name='reEnterPassword'
                  ref={register({ required: true })}
                  label='Re-Enter Password'
                  fullWidth
                  // required
                  variant='outlined'
                />
              </Box> */}
            </>
          )}

          {errors.password && <span><FormattedMessage id='This field is required' /></span>}
          {auth?.errorMessage?.length &&
            <Fade>
              <Box paddingY={1} display='flex' alignItems='center' justifyContent='center'><span style={{ color: 'red' }}>{auth?.errorMessage && <>{auth?.errorMessage}</>}</span></Box>
            </Fade>}
          <Box paddingTop={1} paddingBottom={1}>
            <Button
              type='submit'
              disabled={auth?.loading}
              variant='contained'
              color='secondary'
              size='large'
            >
              {!auth?.loading && <>{myProfile ? (<><FormattedMessage id='Save Changes' /></>) : (<><FormattedMessage id='Submit' /></>)}</>}
              {auth?.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}
const styles = (theme) => ({

})
export default withStyles(styles, { withTheme: true })(RegisterForm)
