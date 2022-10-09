import React from 'react'
import PropTypes from 'prop-types'

import { navigate } from '../components/common/Router'
const isBrowser = typeof window !== 'undefined'
// import { isAuthenticated } from '../helpers/auth'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = isBrowser ? window.localStorage.getItem('token') : null

  if (!isAuthenticated) {
    navigate('/sign-in')
    return null
  }

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired
}

export default PrivateRoute
