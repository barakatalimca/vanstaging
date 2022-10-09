import React from 'react'
// import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'

import { withStyles, Box, Container, Typography, Grid, Card, CardMedia, CardContent } from '@material-ui/core'
import { Parallax } from './common'
import SectionTitle from './common/SectionTitle'

const OurApproach = ({ data, classes }) => (
  <Parallax bgImage={require('../images/bokeh-bg.png')} strength={600}>
    <Box paddingY={16} className={classes.root}>
      <Container>
        <SectionTitle title='Our Approach' />
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='flex-start'
          spacing={4}
        >
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Card className={classes.item} elevation={0}>
              <CardMedia
                component='img'
                alt='Scouting'
                image='identify-talent.png'
                title='Scouting'
                height='440px'
              />
              <CardContent>
                <Typography variant='h5' component='h3' gutterBottom className={classes.title}>IDENTIFY TALENT</Typography>
                <Typography variant='body1'>Annual scouting events in Arab and African Countries</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Card className={classes.item} elevation={0}>
              <CardMedia
                component='img'
                alt='Scouting'
                image='develop-optimize.png'
                title='Scouting'
                height='440px'
              />
              <CardContent>
                <Typography variant='h5' component='h3' gutterBottom className={classes.title}>DEVELOP &amp; OPTIMIZE</Typography>
                <Typography variant='body1'>We develop our players either at our football academy or with partner academies in other countries</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Card className={classes.item} elevation={0}>
              <CardMedia
                component='img'
                alt='Scouting'
                image='connect-clubs.png'
                title='Scouting'
                height='440px'
              />
              <CardContent>
                <Typography variant='h5' component='h3' gutterBottom className={classes.title}>CONNECT WITH CLUBS</Typography>
                <Typography variant='body1'>We provide every player with the best possible opportunities to progress in their football career</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </Parallax>
)

const styles = (theme) => ({
  root: {
    color: theme.palette.common.white,
    '& img': {
      margin: '0 auto',
      maxWidth: '380px'
    }
  },
  item: {
    backgroundColor: 'transparent',
    color: 'inherit',
    textAlign: 'center'
  },
  title: {
    fontWeight: theme.typography.fontWeightBold
  }
})

export default withStyles(styles, { withTheme: true })(OurApproach)
