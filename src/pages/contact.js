import React from 'react'
import { Box, Container, Divider, Typography } from '@material-ui/core'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import Page from '../components/Page'
import ContactForm from '../components/ContactForm'
import Seo from '../components/common/Seo'
import PageTitle from '../components/common/PageTitle'
import Fade from 'react-reveal/Fade'
import Api from '../Api'
import { FormattedHTMLMessage } from 'gatsby-plugin-intl'
import { useI18n } from '../helpers'
const Contact = (props) => {
  const [data, setData] = React.useState('')
  const i18n = useI18n()
  const getData = () => {
    Api.getContact()
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            setData(response.data.data)
          }
        }
      })
  }
  React.useEffect(() => {
    getData()
  }, [])

  return (
    <Page>
      <Fade>
        <Seo title='Contact' />
        <Container>
          <Box paddingTop={16}>
            {/* <PageTitle title='Contact' /> */}
            <Box marginBottom={5}>
              <Box paddingBottom={5}>
                <Typography variant='h2' component='h1' align='center'>
                  <FormattedHTMLMessage id='Contact' />
                </Typography>
              </Box>
              <Divider />
            </Box>
          </Box>

          <Box paddingTop={3} paddingBottom={5}>
            <p><FormattedHTMLMessage id='Need help?' /></p>
            {/* <h1>{data.email}</h1> */}
            <h1>support@vangava.com</h1>
            {/* <br /> */}
            <h1 style={{ direction: i18n.locale === 'ar' && 'ltr', textAlign: i18n.locale === 'ar' && 'right' }}>
              {/* <WhatsAppIcon style={{ color: '#34B423' }} /> */}
              <span>
                {/* {data.phone_number} */}
                <a target='_blank' rel='noopener noreferrer' href='//api.whatsapp.com/send?phone=966-555 700 007'>
                  <img src={require('../assets/img/whatsapp.png')} style={{ width: '50px' }} />
                  {/* +966-555 700 007 */}
                </a>
              </span>
            </h1>
          </Box>
        </Container>
        <ContactForm map={data.locationcoords} />
      </Fade>
    </Page>
  )
}

export default Contact
