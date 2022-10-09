import React from 'react'
import {
  withStyles,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel
} from '@material-ui/core'

import { useAuth } from '../helpers/useAuth'
import { useCart } from '../helpers'
import { FormattedMessage } from 'gatsby-plugin-intl'

const PhoneNumberInput = ({
  phoneNumberInputName,
  callingCodeInputName,
  register,
  errors,
  classes,
  disabled,
  phoneNumberDefaultValue,
  callingCodeDefaultValue,
  variant = 'standard',
  onBlur = () => { }
}) => {
  const cart = useCart()
  const auth = useAuth({ cart })
  const [callingCode, setCallingCode] = React.useState(null)

  const _onChangeCallingCode = (event) => {
    setCallingCode(event.target.value)
  }

  return (
    <FormControl variant='filled' className={classes.formControl} style={{ width: '100%' }}>
      {/* <InputLabel id='demo-simple-select-filled-label'><FormattedMessage id='Phone Number' /></InputLabel> */}
      <TextField
        name={phoneNumberInputName}
        inputProps={{ maxLength: 10, minLength: 9 }}
        variant={variant}
        label={<FormattedMessage id='Phone Number' />}
        fullWidth
        placeholder='5XXXXXX'
        disabled={disabled}
        defaultValue={phoneNumberDefaultValue}
        key={phoneNumberDefaultValue}
        inputRef={register({ required: true, pattern: /^[0-9]+$/ })}
        required
        type='tel'
        error={errors[phoneNumberInputName]}
        helperText={errors[phoneNumberInputName] ? 'Invalid Phone Number!' : null}
        onBlur={onBlur}
        InputProps={{
          startAdornment: (
            <Select
              native
              name={callingCodeInputName}
              defaultValue={callingCodeDefaultValue || auth?.countries[0]?.calling_code}
              label='Code'
              disabled={disabled}
              onChange={_onChangeCallingCode}
              onBlur={onBlur}
              required
              inputRef={register({ required: true })}
              className={classes.countryCodeSelect}
            >
              {auth?.countries.map(option => (
                <option key={option.calling_code} value={option.calling_code}>
                  {option.calling_code}
                </option>
                // <MenuItem key={l.calling_code} value={l.calling_code}>{l.calling_code}</MenuItem>
              ))}
            </Select>
          )
        }}
      />
    </FormControl>
  )
}
const styles = () => ({
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
    }
  }
})
export default withStyles(styles, { withTheme: true })(PhoneNumberInput)
