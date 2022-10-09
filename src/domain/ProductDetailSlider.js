import React, { useEffect, useState } from 'react'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, DotGroup, Dot } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import {
  withStyles,
  Grid,
  Hidden,
  useTheme,
  Dialog,
  IconButton,
  Box
} from '@material-ui/core'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { useWindowSize } from '../helpers'
import { VscChromeClose } from 'react-icons/vsc'
import ProductDetailModalSlider from './ProductDetailModalSlider'

const ProductDetailSlider = ({ classes, height = '100vh', imgList = [], onChangeIndex = () => { } }) => {
  const theme = useTheme()
  const { width } = useWindowSize()

  const [currentIndex, setCurrentIndex] = useState()
  // const [currentModalSliderIndex, setCurrentModalSliderIndex] = useState(0)
  const [isModalSliderDrawerOpen, setIsModalSliderDrawerOpen] = useState(false)

  const onCloseModalSliderDrawer = () => {
    setIsModalSliderDrawerOpen(false)
  }

  const onClickItem = (index) => {
    setCurrentIndex(index)
    setIsModalSliderDrawerOpen(true)
  }

  useEffect(() => {
    onChangeIndex(currentIndex)
  }, [currentIndex])

  return (
    <>
      <CarouselProvider
        className={classes.Banner}
        totalSlides={imgList?.length}
      >
        <Slider>
          {imgList?.map((l, i) => (
            <Slide className={classes.item} index={i} key={i} style={{ height }}>
              <div className={classes.imageContainer} style={{ height }}>
                <img src={l?.image} onClick={() => onClickItem(i)} />
              </div>
            </Slide>
          ))}

        </Slider>
        <ButtonBack className={classes.ButtonBack}><BsChevronLeft /></ButtonBack>
        <ButtonNext className={classes.ButtonNext}><BsChevronRight /></ButtonNext>
      </CarouselProvider>
      <Dialog className={classes.zoomModal} fullScreen open={isModalSliderDrawerOpen} onClose={onCloseModalSliderDrawer}>
        <Box style={{ background: '#000' }}>
          <IconButton className={classes.imagePopClose} onClick={onCloseModalSliderDrawer}>
            <VscChromeClose color='#fff' size='20' />
          </IconButton>
          <ProductDetailModalSlider imgList={imgList} index={currentIndex} />
        </Box>
      </Dialog>
    </>
  )
}

const styles = (theme) => ({
  Banner: {
    width: '100%;',
    position: 'relative'
  },
  item: {
    background: '#000',
    borderRight: '1px solid #ddd',
    // backgroundPosition: 'center',
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    [theme.breakpoints.down('sm')]: {
      height: '50vh'
    }
  },
  sliderImages: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      // width: '80%'
    }
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
  ButtonNext: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '0',
    background: 'transparent',
    color: '#fff',
    fontSize: '25px !important',
    border: 'none'
  },
  ButtonBack: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '0',
    background: 'transparent',
    color: '#fff',
    fontSize: '25px !important',
    border: 'none'
  },
  dotContainer: {
    '& .carousel__dot--selected': {
      background: '#F26B3E',
      opacity: '1'
    }
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    '& > div': {
      width: '100%',
      height: '100%'
    },
    '& img': {
      // maxHeight: '80vh',
      width: '100%'
    }
  },
  imagePopClose: `
    background-color: rgba(0,0,0,0.4);
    position: absolute !important;
    top: 15px;
    right: 12px;
    z-index: 9;
    color: #fff;
  `
})

export default withStyles(styles, { withTheme: true })(ProductDetailSlider)
