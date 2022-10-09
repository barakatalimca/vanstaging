import React, { useEffect, useState } from 'react'
import {
  withStyles,
  useTheme,
  Box,
  Grid,
  Button,
  Container,
  Hidden,
  Typography,
  Popper,
  Fade,
  Paper,
  TextField
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import { useMatch, useLocation } from '@reach/router'

import { useWindowSize, useCart, useWishList, useAllProductsData, useAuth } from '../helpers'
import ProductDetailSlider from './ProductDetailSlider'
import ProductDetailVerticalSlider from './ProductDetailVerticalSlider'
import ProductDetailsContent from './ProductDetailsContent'
import ProductDetailsOtherInfo from './ProductDetailsOtherInfo'
import Reviews from './Reviews'
import BundledProductDetailsContent from './BundledProductDetailsContent'
import { navigate } from '../components/common/Router'
import { getNormalizedProductDataForCart } from '../helpers/useCart'

const getUnavailabilityText = ({ is_active, in_stock }) => {
  if (is_active === 'No' && in_stock === 'Yes') {
    return <FormattedMessage id='Product combination unavailable' />
  }

  if (is_active === 'Yes' && in_stock === 'No') {
    return <FormattedMessage id='Out of Stock' />
  }

  return <FormattedMessage id='Out of Stock' />
}

const ProductDetails = ({ path, productData, onAddToCart = () => { }, classes }) => {
  const theme = useTheme()
  const { width } = useWindowSize()
  const auth = useAuth()
  const cart = useCart()
  const location = useLocation()
  const wishlist = useWishList()
  const allProductsData = useAllProductsData()

  const [selectedProductSku, setSelectedProductSku] = useState(null)
  const [selectedProductSkuList, setSelectedProductSkuList] = useState([])
  const [isBuyActionDisabled, setIsBuyActionDisabled] = useState(true)
  const [disableIcon, setDisableIcon] = useState(false)
  const [isWished, setIsWished] = useState(false)
  const [disableRemoveIcon, setDisableRemoveIcon] = useState(false)
  const [imageList, setImageList] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [checked, setChecked] = React.useState(false)

  const { md, lg } = theme.breakpoints.values
  const horizontalSectionPadding = width <= lg ? 2 : 0

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }
  const handleCheck = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
    setChecked(true)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'transitions-popper' : undefined

  const addToCart = () => {
    onAddToCart()

    const payload = getNormalizedProductDataForCart({
      isAuthenticated: auth.user && auth.user.isLoggedIn,
      productData,
      selectedProductSku,
      selectedProductSkuList,
      bundledProductListNormalizer: allProductsData.normalizedBundledProductList
    })

    cart.addItem(payload, 1)

    if (auth.user && auth.user.isLoggedIn) {
      if (location.state.fromWishlist) {
        const payload = {
          product_sku_id: productData.product_sku_id,
          product_id: productData.product_id,
          wished_id: location.state.wishedId
        }
        wishlist.deletFromWishList(payload)
      }
    }
  }

  const buyNow = () => {
    addToCart()

    if (auth.user && auth.user.isLoggedIn) {
      navigate('/checkout')
    } else {
      navigate('/sign-in?referer=/buynow/checkout')
    }
  }

  const onAddToWishlist = () => {
    setDisableIcon(true)
    if (productData.is_bundle === 'Yes') {
      wishlist.addToWishList({
        product_sku_id: productData.product_sku_id,
        product_id: productData.product_id
      })
    } else {
      wishlist.addToWishList({
        ...selectedProductSku,
        product_id: productData.product_id
      })
    }
  }

  const onRemoveFromWishlist = () => {
    setDisableRemoveIcon(true)
    if (productData.is_bundle === 'Yes') {
      wishlist.deletFromWishList({
        product_sku_id: productData.product_sku_id,
        product_id: productData.product_id,
        wished_id: productData.wished_id
      })
    } else {
      wishlist.deletFromWishList({
        ...selectedProductSku,
        product_id: productData.product_id
      })
    }
  }

  const renderMain = () => {
    if (!productData) {
      return <></>
    }

    if (productData.is_bundle === 'Yes') {
      return (
        <Box paddingTop={width <= lg ? 4 : 0}>
          <BundledProductDetailsContent
            data={productData}
            onChangeAttributes={setSelectedProductSkuList}
          />
        </Box>
      )
    }

    return (
      <Box paddingX={horizontalSectionPadding} paddingTop={width <= lg ? 4 : 0}>
        <ProductDetailsContent
          data={productData}
          onChangeAttributes={setSelectedProductSku}
        />
      </Box>
    )
  }

  useEffect(() => {
    if (productData) {
      if (productData.is_bundle === 'Yes') {
        if (productData.is_wished === 'Yes') {
          setIsWished(true)
        } else {
          setIsWished(false)
        }
      } else {
        if (selectedProductSku?.is_wished === 'Yes') {
          setIsWished(true)
        } else {
          setIsWished(false)
        }
      }
    }
  }, [productData, selectedProductSku])

  useEffect(() => {
    setDisableIcon(false)
    setDisableRemoveIcon(false)
    console.log('wishlist.reload', wishlist.reload)
  }, [wishlist.reload])

  const renderWishListActions = () => {
    return (
      <Box marginY={2}>
        {isWished && (
          <Button variant='secondary' disabled={disableRemoveIcon} startIcon={<BsHeartFill />} onClick={onRemoveFromWishlist} size='large' fullWidth>
            <FormattedMessage id='Remove from Wishlist' />
          </Button>
        )}
        {!isWished && (
          <Button startIcon={<BsHeart />} disabled={disableIcon} onClick={onAddToWishlist} size='large' fullWidth>
            <FormattedMessage id='addToWishlist' />
          </Button>
        )}
      </Box>
    )
  }

  const renderActions = () => {
    if (productData?.in_stock === 'No') {
      return (
        <>
          <Box display='flex' justifyContent='space-between' alignItems='center' padding={horizontalSectionPadding}>
            <small style={{ paddingRight: '15px' }}>
              Out of stock
            </small>
            {checked
              ? <small style={{ color: '#f26b3e' }}>You Will Be Notified</small>
              : (
                <Button size='small' variant='contained' color='secondary' aria-describedby={id} onClick={handleClick} className={classes.notify}>
                  <small>Notify</small>
                </Button>
              )}

            <Popper id={id} open={open} anchorEl={anchorEl} transition placement='left'>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    <Box paddingY={1} paddingX={1.5} display='flex' justifyContent='space-between' alignItems='center'>
                      <TextField
                        id='outlined-full-width'
                        // label='Name'
                        // multiline
                        placeholder='Your Email'
                        fullWidth
                        margin='normal'
                        variant='outlined'
                      />
                      {/* <Button size='small' variant='contained' color='secondary'> */}
                      <span style={{ margin: '0 7px', cursor: 'pointer' }}><CheckIcon onClick={() => handleCheck()} /></span>
                      <span style={{ margin: '0 7px', cursor: 'pointer' }}><CloseIcon onClick={handleClick} /></span>
                      {/* </Button> */}
                    </Box>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </Box>
        </>
      )
    }

    if (productData?.is_bundle === 'No' && (selectedProductSku?.is_active === 'No' || selectedProductSku?.in_stock === 'No')) {
      return (
        <>
          <Box paddingY={2}>
            <Typography
              variant='body1'
              align='center'
              color='error'
            >
              {getUnavailabilityText(selectedProductSku)}
            </Typography>
          </Box>
          {renderWishListActions()}
        </>
      )
    }

    return (
      <>
        <Box flexGrow={3} paddingTop={3} paddingX={horizontalSectionPadding}>
          <Grid container alignItems='stretch' spacing={2}>
            <Grid item xs={6}>
              <Button
                onClick={addToCart}
                size='large'
                color='secondary'
                variant='contained'
                disabled={isBuyActionDisabled}
                className={classes.actionButton}
              >

                <FormattedMessage id='addToCart' />
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                size='large'
                color='primary'
                variant='contained'
                disabled={isBuyActionDisabled}
                className={classes.actionButton}
                onClick={buyNow}
              >

                <FormattedMessage id='buyNow' />
              </Button>
            </Grid>
          </Grid>
        </Box>
        {renderWishListActions()}
      </>
    )
  }

  useEffect(() => {
    setDisableIcon(false)
    setDisableRemoveIcon(false)
  }, [wishlist])

  useEffect(() => {
    if (productData?.is_bundle === 'Yes') {
      const data = allProductsData.normalizedBundledProductList({ productData })
      let list = data.map(item => ({ image: item.image }))
      list = [{ image: productData.image }, ...list] // add the main image as the first image
      setImageList(list)
    } else {
      if (selectedProductSku) {
        if (selectedProductSku.image_list) {
          setImageList(selectedProductSku?.image_list)
        } else if (selectedProductSku.image) {
          setImageList([{ image: selectedProductSku.image }])
        } else {
          setImageList([{ image: productData?.image }])
        }
      }

      if (!selectedProductSku) {
        setImageList([{ image: productData?.image }])
      }
    }
  }, [productData, selectedProductSku])

  useEffect(() => {
    if (productData && productData?.is_bundle !== 'Yes') {
      setImageList(productData?.product_sku_data[0]?.image_list)
    }
  }, [productData, path])

  useEffect(() => {
    if ((selectedProductSku && selectedProductSku.product_sku_id) || selectedProductSkuList.length > 0) {
      setIsBuyActionDisabled(false)
    } else {
      setIsBuyActionDisabled(true)
    }
  }, [selectedProductSku, selectedProductSkuList])

  return (
    <>
      <Hidden lgUp>
        <ProductDetailSlider
          imgList={imageList}
          height='50vh'
        />
      </Hidden>
      <Container maxWidth='1600' className={classes.container}>
        <Grid container spacing={4}>
          <Hidden mdDown>
            <Grid item xs={12} lg={9}>
              <ProductDetailVerticalSlider
                imageList={imageList}
              />
            </Grid>
          </Hidden>
          <Grid item xs={12} lg={3}>
            <Box style={{ position: 'sticky', top: '105px' }}>
              {renderMain()}
              {renderActions()}
              {/* <Box paddingX={horizontalSectionPadding}>
                <ProductDetailsOtherInfo data={productData} />
              </Box> */}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Reviews productId={productData?.product_id} />
      </Container>
    </>
  )
}

const styles = (theme) => ({
  container: {
    [theme.breakpoints.down('lg')]: {
      padding: 0
    }
  },
  actionButton: {
    height: '50px',
    whiteSpace: 'nowrap',
    width: '100%'
  }
})

export default withStyles(styles, { withTheme: true })(ProductDetails)
