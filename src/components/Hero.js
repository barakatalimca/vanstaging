import React from 'react'
import { withStyles, Button, Container, Typography, Box, Grid } from '@material-ui/core'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import { FormattedMessage } from 'gatsby-plugin-intl'

import '../styles/hero.css'
import { useCms } from '../helpers/useCms'
import ReactPlayer from 'react-player'

const Hero = ({ classes }) => {
  const cms = useCms()
  const [video, setVideo] = React.useState('')

  React.useEffect(() => {
    setVideo(cms?.homePageData?.video_data?.video_file)
  }, [cms?.homePageData, video])

  return (
    <>
      {/* <video
        width=''
        loop
        autoPlay
        id='vid'
        muted
        style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
      >
        <source src={require('../assets/videos/vangava2.mp4')} type='video/mp4' />
      </video> */}
      {/* <ReactPlayer url={video} muted loop playing width='100%' height='100vh' /> */}

      <CarouselProvider
        // naturalSlideWidth={1440}
        naturalSlideWidth={100}
        naturalSlideHeight={200}
        totalSlides={cms?.homePageData?.banner_data?.length}
        // infinite
        touchEnabled
        dragEnabled
        isPlaying
        className={`rsm--carousel--hero ${classes.root}`}
      >
        <Slider>
          {cms?.homePageData?.banner_data?.map((item, i) => (
            <Slide index={i} key={item.banner}>
              <div className='bannerBg' style={{ backgroundImage: `url(${item.banner_image})`, height: '100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', position: 'relative' }}>
                <Container>
                  <Box paddingX={10} className='bannerContent'>
                    <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Grid item md={6}>
                        <Typography variant='h2' component='h1' gutterBottom className={classes.title}>

                          {item.banner_title}
                        </Typography>
                        <Typography variant='subtitle1' className={classes.subtitle}>
                          {item.banner_sub_title}
                        </Typography>
                        <a href={item.button_url}>
                          <Button variant='contained' color='primary' size='large'>
                            {item.banner_button_text}
                          </Button>
                        </a>

                      </Grid>
                    </Grid>

                  </Box>
                </Container>
              </div>
              {/* <img src={item.banner_image} /> */}
            </Slide>
          ))}

        </Slider>
        <div className='rsm--carousel__actions'>
          <ButtonBack className={classes.navigationButton}>
            <ChevronLeft className={classes.icon} />
          </ButtonBack>
          <ButtonNext className={classes.navigationButton}>
            <ChevronRight className={classes.icon} />
          </ButtonNext>
        </div>
      </CarouselProvider>
    </>
  )
}

const styles = (theme) => ({
  root: {
    direction: 'ltr',
    '& .carousel__slider': {
      // height: `calc(100vh - ${HEADER_HEIGHT})`
      height: '100vh'
    },
    '& .carousel__inner-slide': {
      // height: `calc(100vh - ${HEADER_HEIGHT})`
      height: '100vh'
    },
    [theme.breakpoints.down('md')]: {
      '& img': {
        width: 'auto'
      },
      '& .carousel__slider': {
        height: '50vh'
      },
      '& .carousel__inner-slide': {
        height: '50vh'
      }
    }
  },
  title: {
    fontWeight: 'bold'
  },
  subtitle: {
    marginBottom: theme.spacing(4)
  },
  navigationButton: {
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  icon: {
    fontSize: '3rem'
  },
  carouselContainer: {
    '& .BrainhubCarousel__arrows': `
      position: absolute;
      z-index: 3;
      background-color: #f26b3e;    
    `,
    '& .BrainhubCarousel__arrowRight': `
      right: 0px;
    `,
    '& .BrainhubCarousel__arrowLeft': `
      left: 0px;
    `
  }
})

export default withStyles(styles, { withTheme: true })(Hero)
