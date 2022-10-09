import React, { useState, useEffect } from 'react'
import { withStyles, Box, IconButton, Container, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'

import '../styles/affiliations-carousel.css'
import useWindowSize from '../helpers/useWindowSize'
import SectionTitle from '../components/common/SectionTitle'

const Affiliations = ({ classes }) => {
  const theme = useTheme()
  const { width } = useWindowSize()

  const [slidesCount, setSlidesCount] = useState(1)

  const _setSlidesCount = () => {
    const { sm, md, lg } = theme.breakpoints.values

    if (width <= sm) {
      setSlidesCount(1)
    } else if (width <= md) {
      setSlidesCount(2)
    } else if (width <= lg) {
      setSlidesCount(3)
    } else {
      setSlidesCount(4)
    }
  }

  useEffect(() => {
    _setSlidesCount()
  }, [width])

  return (
    <Box paddingY={16}>
      <Container>
        <SectionTitle title='Affiliations' />
        <Box>
          <CarouselProvider
            naturalSlideWidth={125}
            naturalSlideHeight={80}
            totalSlides={8}
            visibleSlides={slidesCount}
            infinite
            className='rsm--carousel--affiliations'
          >
            <Slider>
              <Slide index={0}>
                <img src={require('../images/affliation-vitoria-guimaraes.png')} />
              </Slide>
              <Slide index={1}>
                <img src={require('../images/affliation-edusoccer.png')} />
              </Slide>
              <Slide index={2}>
                <img src={require('../images/affliation-legacy-sports.png')} />
              </Slide>
              <Slide index={3}>
                <img src={require('../images/affliation-alcorcon.png')} />
              </Slide>
              <Slide index={4}>
                <img src={require('../images/affliation-alcorcon.png')} />
              </Slide>
              <Slide index={5}>
                <img src={require('../images/affliation-vitoria-guimaraes.png')} />
              </Slide>
              <Slide index={6}>
                <img src={require('../images/affliation-edusoccer.png')} />
              </Slide>
              <Slide index={7}>
                <img src={require('../images/affliation-legacy-sports.png')} />
              </Slide>
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
        </Box>
      </Container>
    </Box>
  )
}

const styles = (theme) => ({
  title: {
    fontWeight: 'bold'
  },
  subtitle: {
    marginBottom: theme.spacing(4)
  },
  navigationButton: {
    ...theme.typography.button,
    border: 'none',
    backgroundColor: 'transparent'
  },
  icon: {
    fontSize: '4rem'
  }
})

export default withStyles(styles, { withTheme: true })(Affiliations)
