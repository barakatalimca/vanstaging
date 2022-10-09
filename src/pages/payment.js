import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from '@reach/router'
import {
  withStyles,
  Box,
  Typography,
  Button,
  Grid,
  Container,
  TextareaAutosize,
  CircularProgress
} from '@material-ui/core'

import { ErrorBoundary, HyperPay } from '../components'
import Logo from '../domain/Logo'
import logo from '../assets/img/logo/logoblack.png'

const Payment = ({ classes }) => {
  const location = useLocation()
  const {
    checkoutId,
    url,
    redirectUrl,
    brands
  } = location.state || {
    checkoutId: null,
    url: null,
    redirectUrl: null,
    brands: null
  }

  if (!checkoutId) {
    return (
      <>
        <Box display='flex' justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    )
  }

  return (
    <ErrorBoundary>

      <Box padding={2}>
        <Container>
          <Box marginY={6} display='flex' justifyContent='center'>
            <Logo />
          </Box>
          <HyperPay
            url={url}
            logo={logo}
            brands={brands}
            redirectUrl={redirectUrl}
          />
        </Container>
      </Box>

    </ErrorBoundary>
  )
}
const styles = (theme) => ({

})
export default withStyles(styles, { withTheme: true })(Payment)
