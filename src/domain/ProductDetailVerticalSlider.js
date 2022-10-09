import React from 'react'
import {
  Box,
  Grid,
  Button,
  Dialog,
  withStyles,
  IconButton
} from '@material-ui/core'
import { Link, Element } from 'react-scroll'
import { VscChromeClose } from 'react-icons/vsc'

import { Image } from '../components'
import ProductDetailModalSlider from './ProductDetailModalSlider'

const ProductDetailVerticalSlider = ({ imageList = [], classes }) => {
  const [modal, setModal] = React.useState(false)
  const [index, setIndex] = React.useState('')

  const onZoom = (i) => {
    setModal(true)
    setIndex(i)
  }
  const handleClose = () => {
    setModal(false)
  }

  return (
    <div>
      {imageList.length === 0 && (
        <Box display='flex' justifyContent='center' alignItems='center' style={{ height: '70vh' }}>
          No Images Available
        </Box>
      )}
      <Grid container>
        <Grid item xs={3} lg={1}>
          <nav className='imageScrollerNav'>
            <div className='container-fluid'>
              <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
                <ul className='nav navbar-nav'>
                  {imageList?.map((l, i) => (
                    <li key={l.image}>
                      <Link activeClass='active' className={i} to={i} spy smooth duration={500}>
                        <img src={l.image} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </Grid>
        <Grid item xs={9} md={11} className={classes.imageListContainer}>
          {imageList?.map(({ image }, i) => (
            <Element name={i} className={classes.item} key={image}>
              <Image src={image} onClick={() => onZoom(i)} />
            </Element>
          ))}
        </Grid>
      </Grid>
      <Dialog className={classes.zoomModal} fullScreen open={modal} onClose={handleClose}>
        <IconButton className={classes.imagePopClose} autoFocus color='inherit' onClick={handleClose}>
          <VscChromeClose color='#fff' size='20' />
        </IconButton>

        <ProductDetailModalSlider imgList={imageList} index={index} />
      </Dialog>
    </div>
  )
}

const styles = (theme) => ({
  item: {
    minHeight: '80vh',
    overflow: 'hidden',
    padding: theme.spacing(4, 0),
    position: 'relative',
    '&:first-child': {
      paddingTop: 0
    },
    '& > div': {
      objectFit: 'cover',
      paddingTop: '80%'
    }
  },
  imageListContainer: {
    '& img': {
      cursor: 'zoom-in'
    }
  },
  zoomModal: {
    '& .MuiDialog-paperFullScreen': {
      background: 'transparent'
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

export default withStyles(styles, { withTheme: true })(ProductDetailVerticalSlider)
