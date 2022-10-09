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
  CardActionArea
} from '@material-ui/core'
import { useIntl, FormattedMessage } from 'gatsby-plugin-intl'
import Fade from 'react-reveal/Fade'
import { BiPencil, BiWallet } from 'react-icons/bi'
import { FiHeart, FiMapPin, FiShoppingBag, FiUser } from 'react-icons/fi'

import { RiMapPinUserLine } from 'react-icons/ri'
import { animated, useTrail, config } from 'react-spring'

import Page from '../components/Page'
import RegisterForm from '../components/RegisterForm'
import Seo from '../components/common/Seo'
import { Link } from '../components/common/Router'
import { useAddress } from '../helpers/useAddressData'
import Api from '../Api'
import { useAuth } from '../helpers/useAuth'
const LINKS = [
  { label: 'Orders', to: '/user/my-orders', icon: <FiShoppingBag />, background: 'linear-gradient(to right, #ec008c, #fc6767)' },
  { label: 'Wishlist', to: '/wishlist', icon: <FiHeart />, background: 'linear-gradient(to right, #44a08d, #093637)' },
  { label: 'Wallet', to: '/wallet', icon: <BiWallet />, background: 'linear-gradient(to right, #c94b4b, #4b134f)' },
  { label: 'Edit Profile', to: '/my/profile/edit', icon: <FiUser />, background: 'linear-gradient(to right, #00c6ff, #0072ff)' },
  { label: 'Billing Address', to: '/my/addresses/billing', icon: <RiMapPinUserLine />, background: 'linear-gradient(to right, #00b4db, #0083b0)' },
  { label: 'Shipping Addresses', to: '/my/addresses/shipping', icon: <FiMapPin />, background: 'linear-gradient(to right, #ad5389, #3c1053)' }
]

const MyProfile = ({ classes }) => {
  const [profileData, setProfileData] = useState(null)
  const [isEditingProfileData, setIsEditingProfileData] = useState(false)
  const [startAnimatingProfileLinks, setStartAnimatingProfileLinks] = useState(false)
  const addresses = useAddress()
  const auth = useAuth()
  const trail = useTrail(LINKS.length, {
    config: config.slow,
    opacity: startAnimatingProfileLinks ? 1 : 0,
    transform: startAnimatingProfileLinks ? 'translate3d(0px,0,0)' : 'translate3d(0,500px,0)'
  })

  useEffect(() => {
    auth.getProfile()
    addresses.getAddressList()
    setTimeout(() => {
      setStartAnimatingProfileLinks(true)
    }, 2000)

    // const payload = {
    //   action: 'list'
    // }
    // Api.manageProfile(payload)
    //   .then((response) => {
    //     setProfileData(response.data.data)
    //   })
  }, [])

  useEffect(() => {
    if (auth?.user) {
      setProfileData(auth?.user)
    }
  }, [auth?.user])

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
        <Seo title='My Profile' />
        <Container>
          <Grid container spacing={6}>
            <Hidden mdDown>
              <Grid item xs={12} lg={4}>
                <Box className={classes.strip} />
              </Grid>
            </Hidden>
            <Grid item xs={12} lg={8}>
              <Box height={120} />
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant='h3' gutterBottom><FormattedMessage id='myProfile' /></Typography>
                {/* {!isEditingProfileData && (
                  <Link to='/my/profile/edit'>
                    <Button
                      color='primary'
                      size='small'
                      // onClick={() => setIsEditingProfileData(true)}
                      startIcon={<BiPencil />}
                    >
                      <FormattedMessage id='Edit Profile' />
                    </Button>
                  </Link>
                )} */}
                {isEditingProfileData && (
                  <Button
                    color='primary'
                    size='small'
                    onClick={() => setIsEditingProfileData(false)}
                  >
                    <FormattedMessage id='Cancel' />
                  </Button>
                )}
              </Box>
              {!isEditingProfileData && (
                <>
                  <Item label={<FormattedMessage id='name' />} value={name} />
                  <Item label={<FormattedMessage id='Mobile' />} value={`+${code}-${mobile_no}`} />
                  <Item label={<FormattedMessage id='Email' />} value={email} />
                </>
              )}
              {isEditingProfileData && (
                <RegisterForm myProfile profileData={profileData} />
              )}
              <Box marginTop={6} paddingBottom={5}>
                <Grid container spacing={2}>
                  {trail.map((props, index) => {
                    return (
                      <Grid item xs={12} md={6} lg={4} key={LINKS[index].to}>
                        <animated.div style={props}>
                          <LinkItem {...LINKS[index]} />
                        </animated.div>
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
              {/* <SelectAdress myProfile /> */}
            </Grid>
          </Grid>
        </Container>
      </Fade>
    </Page>
  )
}

const Item = ({ label, value }) => {
  return (
    <Box paddingY={1}>
      <Typography variant='caption' color='textSecondary' gutterBottom>{label}</Typography>
      <Typography variant='body1'>{value}</Typography>
    </Box>
  )
}

let LinkItem = ({ label, to, icon, background, classes }) => {
  const intl = useIntl()
  return (
    <Link to={to}>
      <CardActionArea>
        <Card className={classes.profileLinkCard} elevation={6} style={{ background }}>
          <CardContent className={classes.profileLinkCardContent}>
            <Typography color='inherit' className={classes.profileLinkCardTitle}>
              {/* {label} */}
              {intl.formatMessage({ id: label })}
            </Typography>
            <div className={classes.profileLinkCardIcon}>
              {icon}
            </div>
          </CardContent>
        </Card>
      </CardActionArea>
    </Link>
  )
}

const styles = (theme) => ({
  strip: {
    background: 'rgb(255,255,255)',
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

LinkItem = withStyles(styles, { withTheme: true })(LinkItem)
export default withStyles(styles, { withTheme: true })(MyProfile)
