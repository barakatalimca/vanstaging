import React from 'react'
import { withStyles } from '@material-ui/styles'
import { useLocation } from '@reach/router'

import { Link } from '../components/common/Router'

import logoDarkEn from '../assets/img/logo/logoblack.png'
import logoLightEn from '../assets/img/logo/logowhite.png'
import logoDarkAr from '../assets/img/logo/logoblack.png'
import logoLightAr from '../assets/img/logo/logowhite.png'
import { useI18n } from '../helpers'

const Logo = ({ size = 180, scroll, isInverted, classes }) => {
  const location = useLocation()
  const i18n = useI18n()

  const url = location?.pathname
  const logoDark = i18n.locale === 'ar' ? logoDarkAr : logoDarkEn
  const logoLight = i18n.locale === 'ar' ? logoLightAr : logoLightEn

  if (scroll) {
    return <Link to='/'><img style={{ width: `${size}px` }} src={logoDark} /></Link>
  }

  if (url === '/') {
    return <Link to='/'><img style={{ width: `${size}px` }} src={logoLight} /></Link>
  }

  if (isInverted) {
    return <Link to='/'><img style={{ width: `${size}px` }} src={logoLight} /></Link>
  }

  return <Link to='/'><img style={{ width: `${size}px` }} src={logoDark} /></Link>
}

const styles = (theme) => ({
})

export default withStyles(styles, { withTheme: true })(Logo)
