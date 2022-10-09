import React from 'react'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import { withStyles } from '@material-ui/core'
import PinchZoomPan from 'react-responsive-pinch-zoom-pan'
import clsx from 'clsx'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

const ProductDetailModalSlider = ({ classes, index, imgList = [] }) => {
  const filtered = [imgList[index], ...imgList]

  return (
    <CarouselProvider
      className={classes.Banner}
      totalSlides={filtered?.length}
      dragEnabled={false}
      touchEnabled={false}
    >
      <div>
        <Slider>
          {filtered?.map(({ image }, i) => (
            <Slide className={classes.item} index={i} key={i}>
              <PinchZoomPan doubleTapBehavior='zoom' position='center' initialScale={1} minScale={0.2} maxScale={4}>
                <img alt='Test Image' src={image} />
              </PinchZoomPan>
            </Slide>
          ))}
        </Slider>
        <ButtonBack className={classes.navButton}><BsChevronLeft /></ButtonBack>
        <ButtonNext className={clsx(classes.navButton, classes.navButtonNext)}><BsChevronRight /></ButtonNext>
      </div>
    </CarouselProvider>
  )
}

const styles = (theme) => ({
  Banner: {
    width: '100%;',
    position: 'relative'
  },
  item: {
    height: '100vh',
    background: '#000',
    borderRight: '1px solid #ddd',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    '& div': {
      cursor: 'grab'
    }
  },
  dotContainer: {
    '& :last-child': {
      borderBottom: 'none'
    }
  },
  sliderImages: {
    width: '100%'
  },
  dotImage: {
    display: 'block',
    height: '99px',
    marginBottom: '14px',
    width: '70px',
    border: 'none',
    borderBottom: '1.1px solid #ddd',
    opacity: '0.4',
    padding: '0',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },
  navButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1),
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    height: '42px',
    width: '42px',
    color: '#fff',
    fontSize: '25px',
    border: 'none'
  },
  navButtonNext: {
    right: '0'
  }
})

export default withStyles(styles, { withTheme: true })(ProductDetailModalSlider)
