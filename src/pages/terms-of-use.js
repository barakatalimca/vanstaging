import React from 'react'
import { Box, Container, Divider, Typography } from '@material-ui/core'

import Page from '../components/Page'
import Seo from '../components/common/Seo'
import PageTitle from '../components/common/PageTitle'
import Fade from 'react-reveal/Fade'
import Api from '../Api'
const desc = 'The most precise and luxurious universal cotton, shumagh vangava designed of the highest standards in the UK and the ancient manufacturing methods.'
const TermsOfUse = (props) => {
  const [data, setData] = React.useState('')

  const getData = () => {
    Api.getTermsOfUse()
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
        <Seo title='Terms Of Use' />
        <Container>
          <Box marginTop={16}>
            {/* <PageTitle title='Terms Of Use' description={data.title} /> */}
            <Box marginBottom={5}>
              <Box paddingBottom={5}>
                <Typography variant='h2' component='h1' align='center'>
                  {data.title}
                </Typography>
              </Box>
              <Divider />
            </Box>
          </Box>
          <Box marginBottom={10}>
            <Typography variant='body2'>
              {data.description}
            </Typography>
          </Box>
        </Container>
      </Fade>
    </Page>
  )
}

export default TermsOfUse
