import React from 'react'
import { Box, Container, Divider, Typography } from '@material-ui/core'

import Page from '../components/Page'
import Seo from '../components/common/Seo'
import PageTitle from '../components/common/PageTitle'
import Fade from 'react-reveal/Fade'
import Api from '../Api'
import { FormattedHTMLMessage } from 'gatsby-plugin-intl'
const About = (props) => {
  const [data, setData] = React.useState('')
  const getData = () => {
    Api.getAbout()
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
  const html = data.description
  return (
    <Page>
      <Fade>
        <Seo title='About' />
        <Container>
          <Box marginTop={16}>
            {/* <PageTitle title='About us' description={data.title} /> */}
            <Box marginBottom={5}>
              <Box paddingBottom={5}>
                {/* <Typography variant='h2' component='h1' align='center'>
                  <FormattedHTMLMessage id='About us' />
                </Typography> */}
                {/* <Typography variant='body1' align='center' style={{ marginTop: '16px' }}> */}
                <Typography variant='h2' component='h1' align='center'>
                  {data.title}
                </Typography>
              </Box>
              <Divider />
            </Box>
          </Box>

          <Box marginBottom={10}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Box>
        </Container>
      </Fade>
    </Page>
  )
}

export default About
