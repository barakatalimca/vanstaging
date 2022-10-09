import React, { useEffect, useState, useRef } from 'react'
import { withStyles, Box, Container, Typography, Button, IconButton, Hidden } from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { useTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { CarouselProvider, Slider, Slide, DotGroup, ButtonBack, ButtonNext } from 'pure-react-carousel'
import { animated, useTrail, config } from 'react-spring'
import _ from 'lodash'

import useWindowSize from '../helpers/useWindowSize'
import useOnScreen from '../helpers/useOnScreen'
import ScrollingContainer from './ScrollingContainer'
import ProductListItem from '../domain/ProductListItem'
import { useAllProductsData } from '../helpers'

const FeaturedListCarousel = ({ classes }) => {
  const theme = useTheme()
  const allProducts = useAllProductsData()
  const { width } = useWindowSize()
  const ref = useRef()
  const onScreen = useOnScreen(ref)

  const [slidesCount, setSlidesCount] = useState(1)

  const _data = React.useMemo(() => {
    if (!allProducts || !allProducts.data || allProducts.data.length === 0) return []

    let result = []

    result = _.filter(
      _.flatten(
        _.map(allProducts.data, ({ product_data }) => product_data)
      ),
      (item) => _.indexOf(item.in_sections, 'FEATURED') > -1
    )

    return result
  }, [allProducts])

  const trail = useTrail(_data?.length, {
    config: config.slow,
    opacity: onScreen ? 1 : 0,
    transform: onScreen ? 'translate3d(0px,0,0)' : 'translate3d(500px,0,0)'
  })

  const _setSlidesCount = () => {
    const { sm, md, lg } = theme.breakpoints.values

    if (width <= sm) {
      setSlidesCount(1)
    } else if (width <= md) {
      setSlidesCount(2)
    } else if (width <= lg) {
      setSlidesCount(3)
    } else {
      setSlidesCount(3)
    }
  }

  const renderCarouselActions = () => {
    if (width <= theme.breakpoints.values.md) {
      return <></>
    }

    return (
      <Box display='flex' justifyContent='center' marginTop={5} className='rsm--carousel__actions'>
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
      </Box>
    )
  }

  useEffect(() => {
    _setSlidesCount()
  }, [width])

  return (
    <>
      <Box ref={ref} className={classes.root}>
        <Box className={classes.bg}>
          <img
            src={require('../assets/img/featbg.png')}
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Hidden lgUp>
          <Typography variant='h4' align='center' gutterBottom className={classes.sectionTitle}>
            <FormattedMessage id='BEST SELLING' />
          </Typography>
          <ScrollingContainer>
            {_data.map((item, index) => (
              <div key={index + 1}>
                <ProductListItem
                  data={item}
                />
              </div>))}
          </ScrollingContainer>
        </Hidden>
        <Hidden mdDown>
          <Container className={classes.container}>
            <Typography variant='h4' align='center' gutterBottom className={classes.sectionTitle}>
              <FormattedMessage id='BEST SELLING' />
            </Typography>
            <Box paddingTop={4} dir='ltr'>
              {/* <style
              dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: ${theme.breakpoints.values.sm}px) {
                  .carousel__slider-tray--horizontal { width: ${width * 1.5}% !important }
                }
              `}}
            /> */}
              <CarouselProvider
                isIntrinsicHeight
                totalSlides={_data.length}
                visibleSlides={slidesCount}
                touchEnabled
                dragEnabled
                isPlaying={false}
              // infinite
              >
                <Slider>
                  {/* {isEmptySlideVisible && <Slide index={0} />} */}
                  {_data.map((props, index) => {
                    return (
                      <Slide index={index + 1} key={index + 1} className={classes.slideItem}>
                        <Box paddingX={3} className={classes.item}>
                          <animated.div style={props}>
                            <ProductListItem
                              data={_data[index]}
                            />
                          </animated.div>
                        </Box>
                      </Slide>
                    )
                  })}

                </Slider>
                {renderCarouselActions()}
              </CarouselProvider>
            </Box>
          </Container>
        </Hidden>
      </Box>
    </>
  )
}

const styles = (theme) => ({
  root: {
    backgroundColor: grey['100'],
    overflow: 'hidden',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    position: 'relative',
    height: '100%',
    '& *': {
      color: theme.palette.common.white
    },
    '& .carousel__slider': {
      overflow: 'visible'
    },
    [theme.breakpoints.down('md')]: {
      paddingBottom: 0
    }
  },
  sectionTitle: {
    position: 'relative'
  },
  container: {
    position: 'relative'
  },
  bg: {
    backgroundColor: '#d9d9d9',
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0
  },
  item: {
    height: '100%',
    // [theme.breakpoints.down('sm')]: {
    //   width: '360px',
    // },
    '& *': {
      color: '#fff',
      alignItems: 'flex-start'
    }
  },
  slideItem: {
    [theme.breakpoints.down('sm')]: {
      transform: 'scale(0.8)',
      transformOrigin: '50% 0'
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

export default withStyles(styles, { withTheme: true })(FeaturedListCarousel)
