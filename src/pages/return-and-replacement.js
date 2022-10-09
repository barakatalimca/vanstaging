import React from 'react'
import { Box, Container, Divider, Typography } from '@material-ui/core'

import Page from '../components/Page'
import Seo from '../components/common/Seo'
import PageTitle from '../components/common/PageTitle'
import Fade from 'react-reveal/Fade'
import Api from '../Api'

const ReturnAndReplacementPolicy = (props) => {
  const [data, setData] = React.useState('')

  const getData = () => {
    Api.getReturnPolicy()
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
        <Seo title='Return & Replacement Policy' />
        <Container>
          <Box marginTop={16}>
            {/* <PageTitle title='Return & Replacement Policy' description={data.title} /> */}
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

export default ReturnAndReplacementPolicy
