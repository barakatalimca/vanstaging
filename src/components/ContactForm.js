import React from 'react'
import { withStyles, useTheme, Box, Container, Paper, TextField, Grid, Typography, Button } from '@material-ui/core'
import { GoogleMap, Marker } from 'react-google-maps'
import { useForm } from 'react-hook-form'

import useWindowSize from '../helpers/useWindowSize'
import ContactMap from './ContactMap'
import Form from './Form'

const ContactForm = ({ classes, map }) => {
  const theme = useTheme()
  const { width } = useWindowSize()

  const { md } = theme.breakpoints.values

  // Mobile View
  if (width <= md) {
    return (
      <>
        <Container>
          <Box paddingY={6}>
            <Form />
          </Box>
        </Container>
        <Box paddingY={6} className={classes.mapMobile}>
          <ContactMap map={map} />
        </Box>
      </>
    )
  }

  // Desktop View
  return (
    <Box className={classes.root}>
      <Box display='flex' alignItems='center' className={classes.content}>
        <Container>
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <Paper elevation={6}>
                <Box padding={6}>
                  <Form />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.mapDesktop}>
        <ContactMap />
      </Box>
    </Box>
  )
}

const styles = (theme) => ({
  root: {
    height: '100vh',
    position: 'relative'
  },
  content: {
    height: '100%',
    position: 'relative',
    zIndex: 1
  },
  mapDesktop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  mapMobile: {
    height: '440px'
  }
})

export default withStyles(styles, { withTheme: true })(ContactForm)
