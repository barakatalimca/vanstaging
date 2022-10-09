import React, { useEffect, useRef, useState } from 'react'
import { withStyles, Box } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel'
import { animated, useTrail, config } from 'react-spring'

import useWindowSize from '../helpers/useWindowSize'
import useOnScreen from '../helpers/useOnScreen'
import { grey } from '@material-ui/core/colors'

const ProductShowcaseCarousel = ({ data = [], itemCount, classes }) => {
  const theme = useTheme()
  const ref = useRef()
  const { width } = useWindowSize()
  const onScreen = useOnScreen(ref)

  const [slidesCount, setSlidesCount] = useState(1)

  const trail = useTrail(itemCount, {
    config: config.slow,
    opacity: onScreen ? 1 : 0,
    transform: onScreen ? 'translate3d(0px,0,0)' : 'translate3d(500px,0,0)'
  })

  const _setSlidesCount = () => {
    const { sm, md, lg } = theme.breakpoints.values

    if (width <= md) {
      setSlidesCount(1)
    } else if (width <= lg) {
      setSlidesCount(2)
    } else {
      setSlidesCount(3)
    }
  }

  useEffect(() => {
    _setSlidesCount()
  }, [width])

  return (
    <Box className='showcase-item'>
      <CarouselProvider
        isIntrinsicHeight
        totalSlides={itemCount}
        visibleSlides={slidesCount}
        isPlaying={false}
      >
        <Slider>
          {trail.map((props, index) => {
            return (
              <Slide index={index + 1} key={index + 1}>
                <Box paddingX={3}>
                  <animated.div style={props}>
                    <ProductShowcaseCarousel />
                  </animated.div>
                </Box>
              </Slide>
            )
          })}

        </Slider>
        {/* <Box display='flex' justifyContent='center' marginTop={5} className='rsm--carousel__actions'>
        <Box marginX={-2}>
          <ButtonBack className={classes.navigationButton}>
            <ChevronLeft className={classes.icon} />
          </ButtonBack>
        </Box>
        <Box marginX={-2}>
          <ButtonNext className={classes.navigationButton}>
            <ChevronRight className={classes.icon} />
          </ButtonNext>
        </Box>
      </Box> */}
      </CarouselProvider>
    </Box>
  )
}

const styles = (theme) => ({
  root: {
    color: '#fff',
    backgroundColor: grey['100'],
    overflow: 'hidden',
    '& .carousel__slider': {
      overflow: 'visible'
    }
  },
  item: {
    height: '100%',
    '& *': {
      color: '#fff',
      alignItems: 'end'
    }
  },
  navigationButton: {
    ...theme.typography.button,
    border: 'none',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  icon: {
    fontSize: '4rem'
  }
})

export default withStyles(styles, { withTheme: true })(ProductShowcaseCarousel)
