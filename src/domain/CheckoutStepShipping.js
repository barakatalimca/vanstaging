import React, { useEffect, useState } from 'react'
import {
  withStyles, Box, Typography,
  FormControl,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  IconButton,
  Drawer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Hidden
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { useForm } from 'react-hook-form'
import { useAuth } from '../helpers/useAuth'
import CheckoutStepSectionTitle from './CheckoutStepSectionTitle'
import { useAddress } from '../helpers/useAddressData'
import PhoneNumberInput from './PhoneNumberInput'
import { useCheckout } from '../helpers'
import AddressList from './AddressList'
import AdressForm from '../components/AdressForm'
import { FormattedMessage } from 'gatsby-plugin-intl'
import OrderSummary from './OrderSummary'

const SHIP_TO_FORM_DATA_INITIAL_STATE = {
  name: '',
  code: '',
  mobile: '',
  email: ''
}

const CheckoutStepShipping = ({ errorMessage, checkoutData, classes, myProfile, onChange = () => { } }) => {
  const { register, getValues, errors } = useForm()
  const auth = useAuth()
  const addresses = useAddress()
  const checkout = useCheckout()

  /* State */
  const [_shippingAddressId, setShippingAddressId] = useState(null)
  const [_shippingMethodId, setShippingMethodId] = useState(null)
  const [shipToFormData, setShipToFormData] = useState(SHIP_TO_FORM_DATA_INITIAL_STATE)
  const [isUpdateProfileDataChecked, setIsUpdateProfileDataChecked] = useState(false)
  const [reload, setReload] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [snackbar, setSnackBar] = useState(false)
  const onChangeShipToFormData = () => {
    setShipToFormData(getValues())
    setReload(reload + 1)
  }

  const onCheckUpdateProfileData = () => {
    setIsUpdateProfileDataChecked(state => !state)
  }

  const closeSnackBar = () => {
    setSnackBar(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDeleteItem = () => {

  }

  const onChangeShippingMethod = (e) => {
    setShippingMethodId(e.target.value)
  }

  const renderOrderSummary = () => {
    return (
      <Hidden mdDown>
        <Box>
          <OrderSummary
            checkoutData={checkoutData}
            showItemList
            isCheckoutButtonHidden
          />
        </Box>
      </Hidden>
    )
  }

  const renderMain = () => {
    return (
      <>
        <Box padding={2} id='checkoutSectionShipTo'>
          <CheckoutStepSectionTitle><FormattedMessage id='Ship To' /></CheckoutStepSectionTitle>
          <Grid container>
            <Grid item md={6} lg={6} sm={12} xs={12}>
              <Box paddingY={2}>
                <FormControl variant='outlined' className={classes.formControl} style={{ width: '100%' }}>
                  {/* <InputLabel id='demo-simple-select-outlined-label'><FormattedMessage id='name' /></InputLabel> */}
                  <TextField
                    name='name'
                    disabled={auth?.user?.name}
                    defaultValue={auth?.user?.name}
                    key={auth?.user?.name}
                    label={<FormattedMessage id='name' />}
                    variant='outlined'
                    fullWidth
                    inputRef={register({ required: true })}
                    onBlur={onChangeShipToFormData}
                  />
                </FormControl>
              </Box>
              <Box paddingY={2}>
                <PhoneNumberInput
                  register={register}
                  phoneNumberInputName='mobile'
                  callingCodeInputName='code'
                  disabled={auth?.user?.mobile_no || auth?.user?.mobile}
                  phoneNumberDefaultValue={auth?.user?.mobile_no || auth?.user?.mobile}
                  callingCodeDefaultValue={auth?.user?.code}
                  errors={errors}
                  variant='outlined'
                  onBlur={onChangeShipToFormData}
                />
              </Box>
              <Box paddingY={2}>
                <FormControl variant='outlined' className={classes.formControl} style={{ width: '100%' }}>
                  {/* <InputLabel id='demo-simple-select-outlined-label'><FormattedMessage id='Email' /></InputLabel> */}
                  <TextField
                    name='email'
                    label={<FormattedMessage id='Email' />}
                    variant='outlined'
                    disabled={auth?.user?.email}
                    defaultValue={auth?.user?.email}
                    key={auth?.user?.email}
                    onBlur={onChangeShipToFormData}
                    fullWidth
                    // onChange={onChangeShipToFormData}
                    inputRef={register({ required: true, pattern: /.+@.+\..+/ })}
                  />
                </FormControl>
              </Box>
              {/* {!auth?.isUserProfileDataAlreadySaved && (
              <FormControlLabel
                control={(
                  <Checkbox
                    onChange={onCheckUpdateProfileData}
                    checked={isUpdateProfileDataChecked}
                    name='checked'
                  />)}
                label='Save to account'
              />
            )} */}
            </Grid>
          </Grid>
          {errorMessage && <><Typography variant='p' style={{ color: 'red' }}>{errorMessage}</Typography></>}
        </Box>
        <Box padding={2} id='checkoutSectionShippingAddress'>
          <CheckoutStepSectionTitle><FormattedMessage id='Shipping Address' /></CheckoutStepSectionTitle>
          <AddressList
            data={addresses?.shippingAddressList}
            selected={_shippingAddressId}
            onSelectItem={setShippingAddressId}
            actionsEnabled={false}
            checkoutData={checkoutData}
          />
          <Box paddingY={2}>
            <Button
              variant='outlined'
              onClick={() =>
                setIsDrawerOpen(true)}
            ><FormattedMessage id='Add New Shipping Address' />
            </Button>
          </Box>
        </Box>

        <Box padding={2} id='checkoutSectionShippingMethod'>
          {checkout?.shippingMethodList.length > 0 && (
            <CheckoutStepSectionTitle><FormattedMessage id='Shipping Method' /></CheckoutStepSectionTitle>
          )}
          <form>
            <FormControl component='fieldset'>
              <RadioGroup
                value={_shippingMethodId}
                aria-label='shippingMethod'
                name='shippingMethod'
                onChange={onChangeShippingMethod}
              >
                {checkout?.shippingMethodList.map(({ id, title, price, currency }) => (
                  <FormControlLabel
                    key={id}
                    value={id}
                    control={<Radio />}
                    label={`${title} (${currency} ${price})`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </form>
        </Box>
      </>
    )
  }

  useEffect(() => {
    if (auth && auth.user && auth.user.isLoggedIn) {
      const { name, code, mobile_no, email } = auth.user

      setShipToFormData({
        name,
        code: code,
        mobile: mobile_no,
        email
      })
    }
  }, [auth])

  useEffect(() => {
    if (addresses?.shippingAddressList.length > 0) {
      if (checkoutData?.shippingAddressId) {
        setShippingAddressId(checkoutData?.shippingAddressId)
      } else {
        setShippingAddressId(addresses?.shippingAddressList[0].address_id)
      }
    }
  }, [addresses?.shippingAddressList])

  useEffect(() => {
    if (checkout?.shippingMethodList.length > 0) {
      if (checkoutData?.shippingMethodId) {
        setShippingMethodId(checkoutData?.shippingMethodId)
      } else {
        setShippingMethodId(checkout?.shippingMethodList[0].id)
      }
    }
  }, [checkout?.shippingMethodList])

  useEffect(() => {
    if (checkoutData?.shippingAddressId) {
      setShippingAddressId(checkoutData?.shippingAddressId)
    }
    if (checkoutData?.shippingMethodId) {
      setShippingMethodId(checkoutData?.shippingMethodId)
    }
  }, [checkoutData?.shippingAddressId, checkoutData?.shippingMethodId])

  useEffect(() => {
    setIsDrawerOpen(false)
  }, [addresses?.addressList])

  useEffect(() => {
    const shippingMethod = checkout?.shippingMethodList.find(item => item.id === _shippingMethodId)

    onChange({
      shippingAddressId: _shippingAddressId,
      shippingMethodId: _shippingMethodId,
      isUpdateProfileDataChecked,
      shipToFormData: getValues(),
      shipping_carrier: shippingMethod ? shippingMethod.shipping_carrier : ''
    })
  }, [_shippingAddressId, isUpdateProfileDataChecked, _shippingMethodId, reload])

  // useEffect(() => {
  //   const shippingMethod = checkout?.shippingMethodList.find(item => item.id === _shippingMethodId)

  //   onChange({
  //     shippingAddressId: _shippingAddressId,
  //     shippingMethodId: _shippingMethodId,
  //     isUpdateProfileDataChecked,
  //     shipToFormData: getValues(),
  //     shipping_carrier: shippingMethod ? shippingMethod.shipping_carrier : ''
  //   })
  // }, [_shippingAddressId, isUpdateProfileDataChecked, _shippingMethodId, reload])

  return (
    <>
      {renderMain()}
      <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box maxWidth={640} padding={4}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h5' color='textSecondary' gutterBottom><FormattedMessage id='New Shipping Address' /></Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <AdressForm addressType='Shipping' myProfile={myProfile} />
        </Box>
      </Drawer>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackbar}
        autoHideDuration={6000}
        onClose={closeSnackBar}
        message='Address Deleted!'
        action={
          <>

            <IconButton size='small' aria-label='close' color='inherit' onClick={closeSnackBar}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </>
        }
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {/* <DialogTitle id="alert-dialog-title">{"You are not signed in!"}</DialogTitle> */}
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <FormattedMessage id='Are You Sure You Want To Remove This ?' />
          </DialogContentText>
        </DialogContent>
        <Box paddingLeft={2} paddingBottom={2}>
          <DialogActions>
            <Button
              onClick={handleClose}
              color='secondary'
            >
              <FormattedMessage id='No' />
            </Button>
            <Button
              onClick={handleDeleteItem}
              color='primary'
              style={{ marginLeft: '7px' }}
              autoFocus
            >
              <FormattedMessage id='Yes' />
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}

const styles = (theme) => ({
})

export default withStyles(styles, { withTheme: true })(CheckoutStepShipping)
