import React, { useEffect, useRef, useState } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Hidden,
  Card,
  CardContent,
  CardActionArea,
  Breadcrumbs
} from '@material-ui/core'
import Fade from 'react-reveal/Fade'
import { BiPencil } from 'react-icons/bi'
import { FiHeart, FiMapPin, FiShoppingBag, FiUser } from 'react-icons/fi'
import { RiMapPinUserLine } from 'react-icons/ri'
import { animated, useTrail, config } from 'react-spring'
import { Router, useMatch } from '@reach/router'
import Page from '../../../components/Page'
import RegisterForm from '../../../components/RegisterForm'
import Seo from '../../../components/common/Seo'
import { Link } from '../../../components/common/Router'
import SelectAdress from '../../../domain/SelectAddress'
import Api from '../../../Api'
import useOnScreen from '../../../helpers/useOnScreen'
import { withPrefix } from 'gatsby'
import { queryCache } from 'react-query'
import { ADDRESS_LIST_DATA } from '../../../Constants'
import { FormattedMessage } from 'gatsby-plugin-intl'

const LINKS = [
  { label: 'Edit Profile', to: '/my/profile/edit', icon: <FiUser />, background: 'linear-gradient(to right, #00c6ff, #0072ff)' },
  { label: 'Billing Address', to: '/my/addresses/billing', icon: <RiMapPinUserLine />, background: 'linear-gradient(to right, #00b4db, #0083b0)' },
  { label: 'Shipping Addresses', to: '/my/addresses/shipping', icon: <FiMapPin />, background: 'linear-gradient(to right, #ad5389, #3c1053)' },
  { label: 'Orders', to: '/user/my-orders', icon: <FiShoppingBag />, background: 'linear-gradient(to right, #ec008c, #fc6767)' },
  { label: 'Wishlist', to: '/wishlist', icon: <FiHeart />, background: 'linear-gradient(to right, #44a08d, #093637)' }
]

const Billing = ({ classes }) => {
  const [profileData, setProfileData] = useState(null)
  const [isEditingProfileData, setIsEditingProfileData] = useState(false)
  const [startAnimatingProfileLinks, setStartAnimatingProfileLinks] = useState(false)
  const match = useMatch(':locale/my/addresses/:type')
  const trail = useTrail(LINKS.length, {
    config: config.slow,
    opacity: startAnimatingProfileLinks ? 1 : 0,
    transform: startAnimatingProfileLinks ? 'translate3d(0px,0,0)' : 'translate3d(0,500px,0)'
  })
  useEffect(() => {
    setTimeout(() => {
      setStartAnimatingProfileLinks(true)
    }, 2000)

    const payload = {
      action: 'list'
    }
    Api.manageProfile(payload)
      .then((response) => {
        console.log('profile data', response.data.data)
        setProfileData(response.data.data)
      })
  }, [])

  if (!profileData) {
    return <></>
  }

  const {
    name,
    code,
    mobile_no,
    email
  } = profileData

  return (
    <Page>
      <Fade>
        <Seo title='My Addresses' />
        <Container>
          <Box marginTop={14}>
            <Breadcrumbs aria-label='breadcrumb' className='breadcrumb'>
              <Link color='inherit' to='/'>
                <FormattedMessage id='Home' />
              </Link>
              <Link
                color='inherit'
                to='/my-profile'
              >
                <FormattedMessage id='myProfile' />
              </Link>
              <Typography color='textPrimary'>
                <FormattedMessage id='Billing Address' />
              </Typography>
            </Breadcrumbs>
          </Box>
          <Grid container spacing={6}>
            <Hidden mdDown>
              <Grid item xs={12} lg={4}>
                <Box className={classes.strip} />
              </Grid>
            </Hidden>
            <Grid item xs={12} lg={8}>
              <Box>
                <SelectAdress myProfile match={match.type} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Fade>
    </Page>
  )
}

const styles = (theme) => ({
  strip: {
    background: 'rgb(255,255,255)',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(227,227,227,1) 100%)',
    minHeight: '100vh',
    overflow: 'hidden',
    '& > div': {
      minHeight: '100vh'
    }
  },
  profileLinkCard: {
    color: theme.palette.common.white,
    height: 200
  },
  profileLinkCardContent: {
    height: '100%',
    overflow: 'hidden',
    position: 'relative'
  },
  profileLinkCardTitle: {
    fontSize: '24px',
    lineHeight: 1.4,
    wordSpacing: '100vw'
  },
  profileLinkCardIcon: `
    font-size: 130px;
    position: absolute;
    right: -50px;
    bottom: -30px;
    opacity: 0.2;  
  `
})

// LinkItem = withStyles(styles, { withTheme: true })(LinkItem)
export default withStyles(styles, { withTheme: true })(Billing)
