import React from 'react'
import ReactCountryFlag from 'react-country-flag'

const CountryFlag = (props) => (
  <ReactCountryFlag
    svg
    style={{
      width: '2em',
      height: '1.5em',
    }}    
    {...props}
  />
)

export default CountryFlag
