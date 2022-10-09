import React from 'react'
import {
  withStyles, Box, Typography,
  Select,
  MenuItem, FormControl,
  InputLabel,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  FormGroup,
  Checkbox
} from '@material-ui/core'
import { navigate } from '../components/common/Router'
import { defaultTheme } from '../providers/ThemeProvider'
import Fade from 'react-reveal/Fade'
import TextField from '@material-ui/core/TextField'
import { useForm } from 'react-hook-form'
import { useAuth } from '../helpers/useAuth'
import { useAddress } from '../helpers/useAddressData'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { useI18n } from '../helpers'

const AddressForm = ({ data, addressType = 'Shipping', myProfile, billingAddress, editItem, checkoutData, classes }) => {
  const auth = useAuth()
  const addresses = useAddress()
  const i18n = useI18n()
  const { register, handleSubmit, errors } = useForm()
  const [sameAsShippingSelected, setSameAsShippingSelected] = React.useState(false)
  const [sameAsShippingAddressData, setSameAsShippingAddressData] = React.useState('')
  const [countryCodes, setCountryCodes] = React.useState(editItem ? editItem?.country_id : '')
  const [StateCodes, setStateCodes] = React.useState(editItem ? editItem.state_id : '')
  const [cityCode, setCityCode] = React.useState(editItem ? editItem?.city_id : '')
  const [pincode, setPincode] = React.useState(editItem ? editItem.zipcode_id : '')

  const [isVat, setIsVat] = React.useState(false)
  const [, setAddressType] = React.useState('')
  // const [sameAsShipping, setSameAsShipping] = React.useState('no')

  const DefaultOption = () => {
    return <option value=''>{i18n.locale === 'ar' ? 'تحديد' : 'Select'}</option>
  }

  const sameAsShipping = () => {
    setSameAsShippingSelected(!sameAsShippingSelected)
  }
  React.useEffect(() => {
    const data = addresses?.addressList?.find((l) => l.address_id === checkoutData?.shippingAddressId)
    if (sameAsShippingSelected) {
      setSameAsShippingAddressData(data)
    } else {
      setSameAsShippingAddressData(null)
      // setCountryCodes(null)
      setStateCodes(null)
      setCityCode(null)
      setPincode(null)
    }
  }, [sameAsShippingSelected])
  const handleIsVat = (event) => {
    setIsVat(!isVat)
  }
  const changeCode = (event) => {
    setCountryCodes(event.target.value)
    setStateCodes(null)
    setCityCode(null)
    auth.getStates(event.target.value)
  }
  const changeState = (event) => {
    setStateCodes(event.target.value)
    auth.getCities(event.target.value)
  }
  const changeCity = (event) => {
    setCityCode(event.target.value)
  }

  const onSubmit = (data) => {
    if (editItem) {
      data.country_id = countryCodes || editItem.country_id
      data.city_id = cityCode || editItem.city_id
      data.state_id = StateCodes || editItem.state_id
      // data.zipcode = data.zipcode || editItem.zipcode
      data.action = 'update'
      data.address_id = editItem.address_id
      data.address_type = editItem.address_type
      addresses.manageAddress(data)
      console.log('this is editItem', editItem.zipcode)
    } else {
      data.country_id = countryCodes
      data.city_id = cityCode
      data.state_id = StateCodes
      data.zipcode = data.zipcode || sameAsShippingAddressData?.zipcode
      data.shipping_same_as_billing = sameAsShippingSelected ? 'yes' : 'no'
      data.action = 'add'
      data.address_type = addressType
      data.is_vat = isVat === true ? 'yes' : 'no'
      addresses.manageAddress(data)
      console.log('this is data', data)
    }
  }

  const getDefaultStateValue = () => {
    if (editItem) {
      return editItem.state_id
    }

    if (sameAsShippingAddressData) {
      return sameAsShippingAddressData?.state_id
    }

    return ''
  }

  const getDefaultCityValue = () => {
    if (editItem) {
      return editItem.city_id
    }

    if (sameAsShippingAddressData) {
      return sameAsShippingAddressData?.city_id
    }

    return ''
  }
  const getDefaultCountryValue = () => {
    if (editItem) {
      return editItem.country_id
    }

    if (sameAsShippingAddressData) {
      return sameAsShippingAddressData?.country_id
    }

    return ''
  }

  // React.useEffect(() => {
  //   if (editItem) {
  //     auth.getStates(countryCodes)
  //     auth.getCities(StateCodes)
  //     auth.getPins(cityCode)
  //   }
  // }, [editItem])
  // React.useEffect(() => {
  //   if (sameAsShippingAddress === true) {
  //     setSameAsShipping('yes')
  //   } else {
  //     setSameAsShipping('no')
  //   }
  // }, [sameAsShippingAddress])
  React.useEffect(() => {
    auth.getCountries()
  }, [])
  React.useEffect(() => {
    if (sameAsShippingAddressData) {
      setCountryCodes(sameAsShippingAddressData.country_id)
    }
  }, [sameAsShippingAddressData])
  React.useEffect(() => {
    if (sameAsShippingAddressData) {
      setStateCodes(sameAsShippingAddressData?.state_id)
      auth.getStates(countryCodes)
    }
  }, [countryCodes])

  React.useEffect(() => {
    if (sameAsShippingAddressData) {
      setCityCode(sameAsShippingAddressData?.city_id)
      auth.getCities(StateCodes)
    }
  }, [StateCodes])

  // React.useEffect(() => {
  //   if (sameAsShippingAddressData) {
  //     setPincode(sameAsShippingAddressData?.zipcode)
  //     // auth.getPins(cityCode)
  //   }
  // }, [cityCode])

  // React.useEffect(() => {
  //   if (editItem) {
  //     setCountryCodes(editItem?.country_id)
  //     // auth.getStates(countryCodes)
  //   }
  // }, [countryCodes])

  React.useEffect(() => {
    if (editItem) {
      setStateCodes(editItem?.state_id)
      auth.getStates(countryCodes)
    }
  }, [countryCodes])

  React.useEffect(() => {
    if (editItem) {
      setCityCode(editItem?.city_id)
      auth.getCities(StateCodes)
    }
  }, [StateCodes])

  // React.useEffect(() => {
  //   if (editItem) {
  //     setPincode(editItem?.zipcode_id)
  //     // auth.getPins(cityCode)
  //   }
  // }, [cityCode])

  const hasDefaultValue = sameAsShippingAddressData
  return (
    <>

      <Box className={classes.root} marginTop={2}>
        {billingAddress && <FormControlLabel
          control={(
            <Checkbox
              onChange={sameAsShipping}
              checked={sameAsShippingSelected}
              name='checked'
            />)}
          label={i18n.locale === 'ar' ? 'نفس عنوان الشحن' : 'Same as shipping address'}
                           />}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* {addressType === 'Billing' && (
            <>
              <TextField
                name='name'
                size='normal'
                label='Name'
                variant='filled'
                inputRef={register({ required: true })}
              />
              <TextField
                name='email'
                size='normal'
                label='Email'
                variant='filled'
                inputRef={register({ required: true })}
              />
            </>
          )} */}
          {/* <InputLabel id='demo-simple-select-filled-label'><FormattedMessage id='Building/Floor/Room' /></InputLabel> */}

          <FormControl variant='filled' className={classes.formControl} fullWidth>
            <InputLabel shrink id='country'><FormattedMessage id='Country' /></InputLabel>
            <Select
              name='country'
              labelId='country'
              value={countryCodes || ''}
              native
              defaultValue={getDefaultCountryValue()}
              onChange={changeCode}
              required
              fullWidth
              inputRef={register({ required: true })}
              label={`${<FormattedMessage id='Country' />}`}
            >
              <DefaultOption />
              {auth?.countries?.map((l, i) => (
                <option key={l.country_id} value={l.country_id}>{l.country_name}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl variant='filled' className={classes.formControl} fullWidth>
            <InputLabel shrink id='Region'><FormattedMessage id='Region' /></InputLabel>
            <Select
              name='state'
              value={StateCodes || ''}
              native
              labelId='Region'
              // label={<FormattedMessage id='Region' />}
              defaultValue={getDefaultStateValue()}
              onChange={changeState}
              required
              fullWidth
              inputRef={register({ required: true })}
            >
              <DefaultOption />
              {auth?.states?.map((l, i) => (
                <option key={l.state_id} value={l.state_id}>{l.state_name}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='filled' className={classes.formControl} fullWidth>
            <InputLabel shrink htmlFor='city'><FormattedMessage id='City' /></InputLabel>
            <Select
              name='city'
              labelId='demo-simple-select-filled-label'
              value={cityCode || ''}
              onChange={changeCity}
              required
              fullWidth
              inputProps={{
                name: 'city',
                id: 'city'
              }}
              native
              defaultValue={getDefaultCityValue()}
              inputRef={register({ required: true })}
            // label={<FormattedMessage id='City' />}
            >
              {/* <MenuItem value=''>
                <em>None</em>
              </MenuItem> */}
              <DefaultOption />
              {auth?.cities?.map((l, i) => (
                <option key={l.city_id} value={l.city_id}>{l.city_name}</option>
              ))}
            </Select>
          </FormControl>
          {/* <InputLabel id='demo-simple-select-filled-label'><FormattedMessage id='Street' /></InputLabel> */}
          <TextField
            name='street'
            size='normal'
            label={<FormattedMessage id='Street' />}
            required
            key={editItem ? editItem.street : sameAsShippingAddressData?.street}
            defaultValue={editItem ? editItem.street : sameAsShippingAddressData?.street || ''}
            variant='filled'
            inputRef={register({ required: true })}
          />
          {/* <InputLabel id='demo-simple-select-filled-label'><FormattedMessage id='Block' /></InputLabel> */}
          <TextField
            name='block'
            label={<FormattedMessage id='Block' />}
            required
            key={editItem ? editItem.block : sameAsShippingAddressData?.block}
            defaultValue={editItem ? editItem.block : sameAsShippingAddressData?.block || ''}
            size='normal'
            variant='filled'
            inputRef={register({ required: true })}
          />
          <TextField
            name='building_floor_room'
            required
            label={<FormattedMessage id='Building/Floor/Room' />}
            key={editItem ? editItem.building_floor_room : sameAsShippingAddressData?.building_floor_room}
            defaultValue={editItem ? editItem.building_floor_room : sameAsShippingAddressData?.building_floor_room || ''}
            size='normal'
            variant='filled'
            inputRef={register({ required: true })}
          />

          {/* <FormControl variant='filled' className={classes.formControl} fullWidth>
            <InputLabel>Pin Codes *</InputLabel>
            <Select
              labelId='demo-simple-select-filled-label'
              value={pincode}
              onChange={changePin}
              required
              fullWidth
              inputRef={register({ required: true })}
              label='Pin Codes *'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {auth?.pins?.map((l, i) => (
                <MenuItem key={l.city_id} value={l.pincode_id}>{l.pincode}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <FormControl variant='filled' className={classes.formControl} fullWidth>
            {/* <InputLabel><FormattedMessage id='Zipcode' /></InputLabel> */}
            <TextField
              name='zipcode'
              // required
              label={<FormattedMessage id='Zipcode' />}
              key={editItem ? editItem.zipcode : sameAsShippingAddressData?.zipcode}
              defaultValue={editItem ? editItem.zipcode : sameAsShippingAddressData?.zipcode || ''}
              size='normal'
              variant='filled'
              inputRef={register({ required: false })}
            />
          </FormControl>
          {addressType === 'Billing' && (
            <>
              {/* <Grid item md={myProfile ? 6 : 3} lg={myProfile ? 6 : 3} sm={12} xs={12}>
                <FormGroup row style={{ height: '55px' }}>
                  <FormControlLabel control={<Checkbox onChange={handleChange} checked={sameAsShippingAddress} name='checkedC' />} label='Same as shipping address' />
                </FormGroup>
              </Grid> */}
              <Box display='flex' alignItems='center'>
                <FormGroup row style={{ height: '55px' }}>
                  <FormControlLabel control={<Checkbox onChange={handleIsVat} checked={isVat} name='checkedC' />} label={i18n.locale === 'ar' ? 'تطبق ضريبة القيمة المضافة' : 'Vat applicable'} />
                </FormGroup>
                {isVat &&
                  <FormControl variant='filled' className={classes.formControl} fullWidth>
                    {/* <InputLabel><FormattedMessage id='Vat No' /></InputLabel> */}
                    <TextField name='vat_no' size='normal' label={<FormattedMessage id='Vat No' />} variant='filled' inputRef={register({ required: false })} />
                  </FormControl>}
              </Box>
            </>
          )}
          {editItem && editItem.address_type === 'Billing' &&
            <>
              {/* <InputLabel><FormattedMessage id='Vat No.' /></InputLabel> */}
              <TextField name='vat_no' defaultValue={editItem && editItem.vat_no} label={<FormattedMessage id='Vat No' />} size='normal' variant='filled' inputRef={register({ required: false })} />
            </>}
          {errors.FullName && <small style={{ color: 'red' }}><FormattedMessage id='This field is required' /></small>}
          {/* {addresses?.successMessage && <Fade><small style={{ color: 'green' }}>{addresses?.successMessage}</small></Fade>} */}
          {addresses?.errorMessage && <Fade><small style={{ color: 'red' }}>{addresses?.errorMessage}</small></Fade>}
          <Box paddingTop={1} paddingBottom={1}>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              disabled={addresses?.loading}
              size='large'
            >
              {!addresses?.loading && <><FormattedMessage id='Save Address' /></>}
              {addresses?.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  )
}

const styles = (theme) => ({
  root: {
    '& .MuiTextField-root, & .MuiFormControl-root': {
      marginBottom: theme.spacing(2),
      width: '100%'
    }
  },
  addressRadio: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    marginTop: '7px',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    }
  }
})

export default withStyles(styles, { withTheme: true })(AddressForm)
