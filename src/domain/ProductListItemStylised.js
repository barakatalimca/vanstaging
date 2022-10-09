import React from 'react'
import { withStyles, Box, Typography, Button } from '@material-ui/core'
import clsx from 'clsx'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { Link } from '../components/common/Router'
import Image from '../components/Image'
import { useAllProductsData } from '../helpers'

const PRIMARY_IMAGE_HEIGHT = 300
const PRIMARY_IMAGE_WIDTH = 250
const SECONDARY_IMAGE_HEIGHT = 180
const SECONDARY_IMAGE_WIDTH = 180

const primaryImageStyles = {
  height: PRIMARY_IMAGE_HEIGHT,
  objectFit: 'cover',
  width: PRIMARY_IMAGE_WIDTH
}

const secondaryImageStyles = {
  height: SECONDARY_IMAGE_HEIGHT,
  objectFit: 'cover',
  width: SECONDARY_IMAGE_WIDTH
}

const ProductListItemStylised = ({ productData, classes }) => {
  if (!productData) {
    return <></>
  }

  const allProductsData = useAllProductsData()

  const {
    is_bundle,
    product_id,
    product_name,
    image,
    product_slug,
    category_slug,
    price,
    currency,
    discount_price,
    product_sku_data,
    bundled_product
  } = productData

  const renderPrimaryImage = () => {
    if (is_bundle === 'Yes') {
      return (
        <Image
          src={image}
          style={primaryImageStyles}
        />
      )
    }

    return (
      <Image
        src={product_sku_data[0]?.image_list[0]?.image}
        style={primaryImageStyles}
      />
    )
  }

  const renderSecondaryImage = () => {
    if (is_bundle === 'Yes') {
      const randomProductIndex = Math.floor(Math.random() * (bundled_product.length - 0) + 0)
      const product = allProductsData.normalizedBundledProductList({ productData })[randomProductIndex]

      return (
        <Image
          src={product?.image}
          style={secondaryImageStyles}
        />
      )
    }

    return (
      <Image
        src={product_sku_data[0]?.image_list[1]?.image}
        style={secondaryImageStyles}
      />
    )
  }

  return (
    <>
      <Box paddingLeft={10.5} paddingRight={4} className={classes.root}>
        <Box className={classes.primaryImageContainer}>
          {renderPrimaryImage()}
        </Box>
        <Box className={classes.secondaryImageContainer}>
          {renderSecondaryImage()}
        </Box>
        <Box marginTop={-3} paddingBottom={1}>
          <Typography variant='body1'><b>{product_name}</b></Typography>
          {discount_price && discount_price !== '' && (
            <>
              <Typography variant='caption'><strike>{currency}&nbsp;{price}</strike></Typography>
              <Typography variant='subtitle2'>{currency}&nbsp;{discount_price}</Typography>
            </>
          )}
          {discount_price === '' && (
            <Typography variant='subtitle2'>{currency}&nbsp;{price}</Typography>
          )}
        </Box>
        <Link to={`/product/${category_slug}/${product_slug}/`}>
          <Button variant='contained' color='primary' size='large'>

            <FormattedMessage id='viewProduct' />
            {/* <BsArrowRight style={{ fontSize: '20px', marginLeft: '12px' }} /> */}
          </Button>
        </Link>
      </Box>
    </>
  )
}

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // height: '100%',
    // transition: 'all 200ms ease-in',
    // background: 'transparent',
    // boxShadow: 'none',
    // '&:hover': {
    //   // boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    //   boxShadow: 'none',
    //   transform: 'scale(1.05)',
    //   background: 'transparent'
    // }
    textAlign: 'center',
    [theme.breakpoints.down('lg')]: {
      transform: 'scale(0.8)',
      transformOrigin: '50% 0'
    }
  },
  primaryImageContainer: {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 65% 100%, 65% 75%, 0 75%)',
    height: PRIMARY_IMAGE_HEIGHT,
    objectFit: 'cover',
    width: PRIMARY_IMAGE_WIDTH
  },
  secondaryImageContainer: {
    height: SECONDARY_IMAGE_HEIGHT,
    position: 'relative',
    left: -SECONDARY_IMAGE_WIDTH / 2.6,
    top: -SECONDARY_IMAGE_HEIGHT / 3,
    width: SECONDARY_IMAGE_WIDTH
  },
  shadowShort: `
  box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
              0 2px 2px rgba(0,0,0,0.11), 
              0 4px 4px rgba(0,0,0,0.11), 
              0 6px 8px rgba(0,0,0,0.11),
              0 8px 16px rgba(0,0,0,0.11);  
  `,
  shadowLong: `
  box-shadow: 0 2px 1px rgba(0,0,0,0.09), 
              0 4px 2px rgba(0,0,0,0.09), 
              0 8px 4px rgba(0,0,0,0.09), 
              0 16px 8px rgba(0,0,0,0.09),
              0 32px 16px rgba(0,0,0,0.09);  
  `
})

export default withStyles(styles, { withTheme: true })(ProductListItemStylised)
