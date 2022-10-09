import React, { useState } from 'react'
import { graphql } from 'gatsby'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Breadcrumbs
} from '@material-ui/core'
import Page from '../components/Page'
import RegisterForm from '../components/RegisterForm'
import Seo from '../components/common/Seo'
import { Link } from '../components/common/Router'
import Fade from 'react-reveal/Fade'
import { theme } from '../providers/ThemeProvider'
import ProductListSlider from '../domain/ProductListSlider'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import { OldSocialLogin as SocialLogin } from 'react-social-login'
import { FaFacebookF } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import Divider from '@material-ui/core/Divider'
import { FormattedMessage } from 'gatsby-plugin-intl'

const CreateAccount = ({ classes }) => {
  const handleSocialLogin = (user, err) => {
    console.log(user)
    console.log(err)
  }
  const { register, handleSubmit, watch, errors } = useForm()
  const onSubmit = data => console.log(data)

  console.log(watch('example'))
  return (
    <Page>
      <Fade>
        <Seo title='Create Account' />
        <Box marginTop={16}>
          <Container>
            <Box marginBottom={5} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='h3' component='h3'><FormattedMessage id='Create An Account' /></Typography>
              <Link to='/sign-in'><Button variant='outlined'><FormattedMessage id='signin' /></Button></Link>
            </Box>
            <Grid container>

              <Grid item md={6} lg={6} sm={12} xs={12}>
                <RegisterForm />
              </Grid>
              <Grid
                item md={1} lg={1} sm={12} xs={12}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {/* <Typography variant='h3'>Or</Typography> */}
              </Grid>
              <Grid item md={5} lg={5} sm={12} xs={12} className='socialLogin'>
                <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
                  <SocialLogin
                    provider='facebook'
                    appId='YOUR_APP_ID'
                    callback={handleSocialLogin}
                  >
                    <Button size='large' className='facebookLogin'>
                      <FaFacebookF style={{ fontSize: '20px', marginRight: '7px' }} /><FormattedMessage id='Login with Facebook' />
                    </Button>
                  </SocialLogin>
                  <Divider variant='middle' style={{ margin: '15px 0', width: '150px' }} />
                  <SocialLogin
                    provider='google'
                    appId='YOUR_APP_ID'
                    callback={handleSocialLogin}
                  >
                    <Button size='large' className='googleLogin'>
                      <FcGoogle style={{ fontSize: '20px', marginRight: '7px' }} /><FormattedMessage id='Login with Google' />
                    </Button>
                  </SocialLogin>
                  <Divider variant='middle' style={{ margin: '15px 0', width: '70%' }} />
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <p><FormattedMessage id='Already have an account?' /></p> <Link to='/sign-in'><FormattedMessage id='signin' /></Link>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>
    </Page>
  )
}
const styles = (theme) => ({

})
export default withStyles(styles, { withTheme: true })(CreateAccount)
