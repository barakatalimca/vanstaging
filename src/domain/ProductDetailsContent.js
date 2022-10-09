import React, { useState } from 'react'
import {
  withStyles,
  Box,
  Typography
} from '@material-ui/core'

import ProductAttributes from './ProductAttributes'
import ShareProduct from '../components/ShareProduct'

const ProductDetailsContent = ({ data, onChangeAttributes = () => { }, classes, showShare = true }) => {
  if (!data) {
    return <></>
  }

  const [selectedProductSku, setSelectedProductSku] = useState(null)

  const {
    product_id,
    product_name,
    image,
    currency,
    price,
    description,
    product_sku_data,
    product_slug,
    category_slug,
    discount_price
  } = data

  const renderPrice = () => {
    if (discount_price && discount_price !== '') {
      return (
        <>
          <Typography
            variant='body2'
            component='h4'
            style={{ textDecoration: 'line-through' }}
          >
            {`${currency} ${selectedProductSku?.price || price}`}
          </Typography>
          <Typography
            variant='h6'
            component='h3'
            gutterBottom
          >
            {`${currency} ${discount_price}`}
          </Typography>
        </>
      )
    }

    return (
      <Typography
        variant='h6'
        component='h3'
        gutterBottom
      >
        {selectedProductSku?.price
          ? `${currency} ${selectedProductSku?.price}`
          : `${currency} ${price}`}
      </Typography>
    )
  }

  const _onChangeAttributes = (productSkuData) => {
    setSelectedProductSku(productSkuData)
    onChangeAttributes({ ...productSkuData, product_id, product_name, image })
  }

  return (
    <Box className={classes.content}>
      <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
        <Typography
          variant='h5'
          component='h2'
          gutterBottom
        >
          <b>{product_name}</b>
        </Typography>
        {showShare && <ShareProduct />}
      </Box>
      {renderPrice()}
      <Typography variant='subtitle2' component='p'>
        {description}
      </Typography>
      <ProductAttributes
        productSkuListData={product_sku_data}
        onChange={_onChangeAttributes}
      />
    </Box>
  )
}

const styles = (theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column'
  }
})

export default withStyles(styles, { withTheme: true })(ProductDetailsContent)
