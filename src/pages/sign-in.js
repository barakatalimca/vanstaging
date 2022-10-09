import React, { useState } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Divider
} from '@material-ui/core'
import { OldSocialLogin as SocialLogin } from 'react-social-login'
import Fade from 'react-reveal/Fade'
import { FaFacebookF } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import Page from '../components/Page'
import Seo from '../components/common/Seo'
import { Link } from '../components/common/Router'
import LoginForm from '../domain/LoginForm'
import { useAuth } from '../helpers/useAuth'
import { FormattedMessage } from 'gatsby-plugin-intl'

const SignIn = ({ classes }) => {
  const auth = useAuth()
  const handleSocialLogin = (user, err) => {
    console.log('user', user)
    console.log('err', err)
  }
  return (
    <Page>
      <Seo title='Sign-in' />
      <Box marginTop={16}>
        <Container>
          <Box className={classes.panel}>
            <Box className={classes.innerPanel}>
              <Typography variant='h4'><FormattedMessage id='Welcome' /></Typography>
              <Box paddingY={3}>
                <Divider />
              </Box>
              <Box>
                <LoginForm />
                <Box paddingY={2}>
                  <Typography variant='h6' align='center'>
                    <FormattedMessage id='OR' />
                  </Typography>
                </Box>
                <SocialLogin
                  provider='facebook'
                  appId='2471933969706956'
                  callback={handleSocialLogin}
                >
                  <Button
                    size='large'
                    startIcon={<FaFacebookF />}
                    className='facebookLogin'
                  >
                    <FormattedMessage id='Login with Facebook' />
                  </Button>
                </SocialLogin>
                <Box height={25} />
                <SocialLogin
                  provider='google'
                  appId='448021649445'
                  callback={handleSocialLogin}
                >
                  <Button
                    size='large'
                    startIcon={<FcGoogle />}
                    className='googleLogin'
                  >
                    <FormattedMessage id='Login with Google' />
                  </Button>
                </SocialLogin>
              </Box>
            </Box>
            <Link to='/create-account' className={classes.createAccountLink}>

              <FormattedMessage id='Don`t have an account yet? Create one now.' />
            </Link>
          </Box>
        </Container>
      </Box>
    </Page>
  )
}
const styles = (theme) => ({
  panel: `
    border-radius: 16px;
    box-shadow: 0 2px 1px rgba(0,0,0,0.09), 
                0 4px 2px rgba(0,0,0,0.09), 
                0 8px 4px rgba(0,0,0,0.09), 
                0 16px 8px rgba(0,0,0,0.09),
                0 32px 16px rgba(0,0,0,0.09);
    margin: 0 auto;
    max-width: 440px;
    padding-bottom: ${theme.spacing(6)}px;
    position: relative;
  `,
  innerPanel: `
    background-color: ${theme.palette.background.paper};
    border-radius: 16px;
    padding: ${theme.spacing(4)}px;
    position: relative;
    z-index: 1;
  `,
  createAccountLink: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    borderRadius: 0,
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    paddingTop: 30,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
})
export default withStyles(styles, { withTheme: true })(SignIn)
