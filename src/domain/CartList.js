import React from 'react'
import {
  withStyles,
  Box,
  Divider
} from '@material-ui/core'

import { useAuth, useCart } from '../helpers'
import ProductSkuItemBase from './ProductSkuItemBase'

const CartList = ({ allowLastItemToBeDeleted = true, size = 'normal', classes }) => {
  const cart = useCart()
  const auth = useAuth()

  // const [data, setData] = React.useState([])
  const showRemoveIcon = !allowLastItemToBeDeleted || (auth?.user?.isLoggedIn && cart?.totalUniqueItems > 1)

  const onChangeQuantity = (item, quantity) => {
    cart.updateItemQuantity(item, quantity)
  }

  const onRemoveItem = (item) => {
    cart.removeItem(item)
    // setTimeout(() => {
    //   queryCache.invalidateQueries(CART_LIST_DATA)
    // }, 2000)
  }

  const renderBundledProducts = (item) => {
    if (item.is_bundle === 'Yes' && item.bundled_product) {
      return (
        <div className={classes.bundledProducts}>
          {item.bundled_product.map(bp => (
            <ProductSkuItemBase
              key={bp.product_sku_id}
              data={bp}
              size='small'
              showQuantity
              showPrice={false}
              // canChangeSku
              showRemoveIcon={false}
              showQuantityModifier={false}
              isBundleChildItem
              bundleQuantity={item.quantity}
            />
          ))}
        </div>
      )
    }

    return <></>
  }

  const renderItem = (item) => {
    return (
      <Box>
        <Box display='flex' paddingY={2}>
          <ProductSkuItemBase
            data={item}
            size='small'
            showQuantity={false}
            showPrice={false}
            // canChangeSku={item.is_bundle !== 'Yes'}
            showRemoveIcon={showRemoveIcon}
            showQuantityModifier
            // quantityModifierVariant='modal'
            onChangeQuantity={onChangeQuantity}
            onRemove={onRemoveItem}
          />
        </Box>
        {renderBundledProducts(item)}
      </Box>
    )
  }
  const renderList = () => {
    return cart?.items?.map((item, index) => (
      <Box key={item.id} className={classes.item}>
        {index !== 0 && <Box paddingY={size === 'small' ? 0.5 : 2}><Divider /></Box>}
        {renderItem(item)}
      </Box>
    ))
  }

  // React.useEffect(() => {
  //   setData(cart?.items)
  // }, [cart?.buyNowData])

  return (
    <Box className='cartList'>
      {renderList()}
    </Box>
  )
}

const styles = (theme) => ({
  item: {
  },
  itemImageContainer: {
    height: 80,
    width: 80
  },
  itemSmallImageContainer: {
    height: 50,
    width: 50
  },
  attributes: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: -theme.spacing(0.5),
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  smallAttributeItem: {
    fontSize: '12px'
  },
  bundledProducts: {
    '& > div': {
      transform: 'scale(0.86)',
      transformOrigin: 'left top'
    }
  }
})

export default withStyles(styles, { withTheme: true })(CartList)
