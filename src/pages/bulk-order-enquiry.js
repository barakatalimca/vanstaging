import React, { useState } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Divider
} from '@material-ui/core'
import Page from '../components/Page'
import BulkOrderForm from '../domain/BulkOrderForm'
import Seo from '../components/common/Seo'
import Fade from 'react-reveal/Fade'
import { FaWhatsapp, FaRegEnvelope } from 'react-icons/fa'
import { FormattedMessage } from 'gatsby-plugin-intl'

const BulkOrderEnquiry = ({ classes }) => {
  return (
    <Page>
      <Fade>
        <Seo title='Create Account' />
        <Box marginTop={16}>
          <Container>
            <Box marginBottom={5} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='h3' component='h3'>
                <FormattedMessage id='Bulk Order Enquiry' />
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item md={6} lg={6} sm={12} xs={12}>
                <BulkOrderForm />
              </Grid>
              <Grid item md={6} lg={6} sm={12} xs={12} className='socialLogin'>
                <Box display='flex' flexDirection='column' alignItems='center'>
                  <Typography variant='h3' component='h3'>
                    <FormattedMessage id='Contact Us' />
                  </Typography>
                  <Divider variant='middle' style={{ margin: '15px 0', width: '100%' }} />
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <a>
                      <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <FaWhatsapp style={{ fontSize: '15px', marginRight: '7px' }} /> +91 7708482863
                      </Box>
                    </a>
                    <a>
                      <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <FaRegEnvelope style={{ fontSize: '15px', marginRight: '7px' }} /> support@vangava.com
                      </Box>
                    </a>
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
export default withStyles(styles, { withTheme: true })(BulkOrderEnquiry)
