import React, { useState } from 'react'
import {
  withStyles,
  Typography
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'

const AddressListItem = ({ address, classes }) => {
  if (!address) return <></>

  const {
    address_type,
    building_floor_room,
    block,
    street,
    state_name,
    state,
    zipcode,
    pincode,
    country_name,
    country,
    city,
    city_name,
    vat_no
  } = address

  return (
    <>
      <Item><b style={{ margin: '0 8px' }}><FormattedMessage id='Country' /></b>{country_name || country}</Item>
      <Item><b style={{ margin: '0 8px' }}><FormattedMessage id='Region' /></b>{state_name || state}</Item>
      <Item><b style={{ margin: '0 8px' }}><FormattedMessage id='City' /></b>{city_name || city}</Item>
      <Item><b style={{ margin: '0 8px' }}><FormattedMessage id='Building/Floor/Room' /></b> {building_floor_room}</Item>
      <Item><b style={{ margin: '0 8px' }}><FormattedMessage id='Block' /></b>{block}</Item>
      <Item><b style={{ margin: '0 8px' }}><FormattedMessage id='Street' /></b>{street}</Item>
      <Item><b style={{ margin: '0 8px' }}><FormattedMessage id='Zipcode' /></b>{zipcode || pincode}</Item>
      {address_type === 'Billing' && <>{vat_no && <Item><b style={{ margin: '0 8px' }}><FormattedMessage id='Vat No' /></b>{vat_no}</Item>}</>}
    </>
  )
}

const Item = ({ children }) => (
  <Typography variant='body2'>
    {children}
  </Typography>
)

const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(AddressListItem)
