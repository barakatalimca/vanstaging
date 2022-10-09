import React, { useEffect, useState, useRef } from 'react'
import { withStyles, Box, Container, Typography, Button, IconButton, Hidden } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { CarouselProvider, Slider, Slide, DotGroup, ButtonBack, ButtonNext } from 'pure-react-carousel'
import { animated, useTrail, config } from 'react-spring'
import { navigate } from '../components/common/Router'
import bg from '../assets/img/featbg.png'
import useWindowSize from '../helpers/useWindowSize'
import useOnScreen from '../helpers/useOnScreen'
import ProductListItem from '../domain/ProductListItem'
import { useAllProductsData } from '../helpers'
import { FormattedMessage } from 'gatsby-plugin-intl'
import ScrollingContainer from '../components/ScrollingContainer'

const ProductListSlider = ({ classes }) => {
  const theme = useTheme()
  const ref = useRef()
  const { width } = useWindowSize()
  const onScreen = useOnScreen(ref)
  const allProducts = useAllProductsData()
  const [slidesCount, setSlidesCount] = useState(1)
  const [isEmptySlideVisible, setEmptySlideVisibility] = useState(false)

  const _data = React.useMemo(() => {
    if (!allProducts || !allProducts.data || allProducts.data.length === 0) return []

    let result = []

    result = _.filter(
      _.flatten(
        _.map(allProducts.data, ({ product_data }) => product_data)
      ),
      (item) => _.indexOf(item.in_sections, 'RECOMMEND') > -1
      // (item) => _.indexOf(item.in_sections, 'NEW_ARRIVAL') > -1
    )

    return result
  }, [allProducts])

  const trail = useTrail(_data.length, {
    config: config.slow,
    opacity: onScreen ? 1 : 0,
    transform: onScreen ? 'translate3d(0px,0,0)' : 'translate3d(500px,0,0)'
  })

  const _setSlidesCount = () => {
    const { sm, md, lg } = theme.breakpoints.values

    setEmptySlideVisibility(false)

    if (width <= md) {
      setSlidesCount(1)
    } else if (width <= lg) {
      setSlidesCount(2)
    } else {
      setEmptySlideVisibility(true)
      setSlidesCount(3)
    }
  }

  useEffect(() => {
    _setSlidesCount()
  }, [width])

  return (
    <>
      <Box className='featured'>
        <Box className={classes.root}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='h3' component='h3'> <FormattedMessage id='You may also like' /></Typography>
          </Box>
          <Box ref={ref} paddingTop={10} marginLeft={-2.5} dir='ltr'>
            <Hidden lgUp>
              <ScrollingContainer>
                {trail.map((props, index) => {
                  return (
                    <div index={index + 1} key={index + 1} className={classes.slideItem}>
                      <Box paddingX={3} className={classes.item}>
                        <animated.div style={props}>
                          <ProductListItem
                            data={_data[index]}
                          />
                        </animated.div>
                      </Box>
                    </div>
                  )
                })}
              </ScrollingContainer>
            </Hidden>
            {/* {trail.map((props, index) => {
                return (
                  <Box paddingX={3} className={classes.item}>
                    <animated.div style={props}>
                      <ProductListItem
                        data={_data[index]}
                      />
                    </animated.div>
                  </Box>
                )
              })} */}
            <Hidden mdDown>
              <CarouselProvider
                isIntrinsicHeight
                totalSlides={_data.length + 1}
                visibleSlides={slidesCount}
                touchEnabled
                isPlaying
                dragEnabled
                // infinite
                className='rsm--carousel--event-list'
              >
                <Slider>
                  {/* {isEmptySlideVisible && <Slide index={0} />} */}
                  {trail.map((props, index) => {
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
                <Hidden mdDown>
                  <Box display='flex' justifyContent='center' marginTop={5} className='rsm--carousel__actions'>
                    <Box marginX={-2}>
                      <ButtonBack className={classes.ButtonBack}>
                        <ChevronLeft className={classes.icon} />
                      </ButtonBack>
                    </Box>
                    <Box marginX={-2}>
                      <ButtonNext className={classes.ButtonNext}>
                        <ChevronRight className={classes.icon} />
                      </ButtonNext>
                    </Box>
                  </Box>
                </Hidden>
                <DotGroup className={classes.DotGroup} />
              </CarouselProvider>
            </Hidden>
          </Box>
          {/* <Box display='flex' justifyContent='center' marginTop={10}>
                    <Button variant='contained' color='primary' size='large' onClick={() => navigate('/events/')}>Show All Events</Button>
                </Box> */}
        </Box>
      </Box>
    </>
  )
}

const styles = (theme) => ({
  root: {
    overflow: 'hidden',
    // '& .carousel__slider': {
    //     overflow: 'visible'
    // }
    [theme.breakpoints.down('md')]: {
      '& div': {
        marginLeft: 0
      }
    }
  },
  item: {
    height: '100%',
    '& *': {
      // alignItems: 'end'
    }
  },
  // navigationButton: {
  //     ...theme.typography.button,
  //     border: 'none',
  //     // color: '#fff',
  //     backgroundColor: 'transparent'
  // },
  ButtonNext: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '0',
    background: 'transparent',
    color: '#000',
    fontSize: '25px !important',
    border: 'none'
  },
  slideItem: {
    [theme.breakpoints.down('sm')]: {
      transform: 'scale(0.8)',
      transformOrigin: '50% 0'
    }
  },
  ButtonBack: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '0',
    background: 'transparent',
    color: '#000',
    fontSize: '25px !important',
    border: 'none'
  },
  icon: {
    fontSize: '4rem'
  },
  DotGroup: {
    textAlign: 'center',
    marginTop: '15px',
    '& button': {
      cursor: 'pointer',
      background: '#999',
      border: 'none',
      height: '12px',
      width: '12px',
      margin: '0 7px',
      borderRadius: '50% !important',
      padding: '0'
    },
    '& .carousel__dot--selected': {
      background: '#F26B3E'
    }
  }
})

export default withStyles(styles, { withTheme: true })(ProductListSlider)
