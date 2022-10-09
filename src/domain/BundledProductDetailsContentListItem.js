import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Box,
  Typography,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider
} from '@material-ui/core'

import ProductAttributes from './ProductAttributes'
import ShareProduct from '../components/ShareProduct'
import ProductDetailSlider from './ProductDetailSlider'

const BundledProductDetailsContentListItem = ({ data, onChangeAttributes = () => { }, classes }) => {
  if (!data) {
    return <></>
  }

  const {
    product_id,
    product_name,
    image,
    price,
    description,
    product_sku_data,
    product_slug,
    category_slug,
    discount_price,
    quantity
  } = data

  const bundleItemQuantityList = Array.from({ length: quantity })

  const _onChangeAttributes = index => (productSkuData) => {
    onChangeAttributes({
      ...productSkuData,
      product_id,
      product_name,
      image,
      quantity,
      index
    })
  }

  const renderProductAttributes = index => {
    return (
      <ProductAttributes
        productSkuListData={product_sku_data}
        onChange={_onChangeAttributes(index)}
      />
    )
  }

  const renderProductAttributesTabGroup = () => {
    if (quantity === 1) {
      return renderProductAttributes(1)
    }

    return (
      <Box className={classes.productList}>
        {bundleItemQuantityList.map((_, i) => (
          <Box key={i} className={classes.product}>
            <Card elevation={6}>
              <CardMedia>
                <ProductDetailSlider
                  imgList={[]}
                  height='120px'
                />
              </CardMedia>
              <CardContent>
                <Typography variant='subtitle1'>
                  <b>{product_name}</b>
                </Typography>
                <Typography variant='caption'>
                  Product&nbsp;{i + 1} of {quantity}
                </Typography>
                <Box paddingY={1}>
                  <Divider />
                </Box>
                {renderProductAttributes(i + 1)}
              </CardContent>
            </Card>
          </Box>
        ))}

      </Box>
    )

    // return (
    //   <TabContext value={value}>
    //     <Box display='flex' justifyContent='center' className={classes.tabs}>
    //       <TabList
    //         onChange={handleChange}
    //         variant='fullWidth'
    //         scrollButtons='on'
    //         dir='ltr'
    //       >
    //         {tabs}
    //       </TabList>
    //     </Box>
    //     <Box>
    //       {tabPanels}
    //     </Box>
    //   </TabContext>
    // )
  }

  return (
    <Box className={classes.root}>
      <Box paddingX={2}>
        <Typography variant='subtitle2' component='p'>
          {description}
        </Typography>
      </Box>
      {renderProductAttributesTabGroup()}
    </Box>
  )
}

const styles = (theme) => ({
  root: {
    width: '100%'
  },
  tabs: {
    marginTop: theme.spacing(2),
    '& .MuiTabPanel-root': {
      padding: 0
    }
  },
  productList: {
    display: 'flex',
    overflowX: 'auto',
    flexWrap: 'nowrap'
  },
  product: {
    flex: '0 0 auto',
    padding: theme.spacing(2, 1),
    width: '300px',
    '&:first-child': {
      paddingLeft: theme.spacing(2)
    },
    '&:last-child': {
      paddingRight: theme.spacing(2)
    }
  }
})

export default withStyles(styles, { withTheme: true })(BundledProductDetailsContentListItem)
