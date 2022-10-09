import React, { useEffect, useState } from 'react'
import { Box, Container, Breadcrumbs, Typography } from '@material-ui/core'
import { withPrefix } from 'gatsby'
import { Router, useMatch } from '@reach/router'
import { FormattedMessage } from 'gatsby-plugin-intl'

import { Link } from '../components/common/Router'
import Page from '../components/Page'
import Seo from '../components/common/Seo'
import ProductDetails from '../domain/ProductDetails'
import PromotoinalBanner from '../domain/PromotionalBanner'
import FeaturedListCarousel from '../components/FeaturedListCarousel'
import ProductListSlider from '../domain/ProductListSlider'
import { useAllProductsData } from '../helpers'
import { CartModal } from '../domain'

const urlShape = ':locale/product/:categorySlug/:productSlug'

const Product = () => {
  const allProducts = useAllProductsData()
  const match = useMatch(urlShape)

  const [categoryData, setCategoryData] = useState(null)
  const [productData, setProductData] = useState(null)
  const [isCartModalVisible, setIsCartModalVisible] = useState(false)

  const onAddToCart = () => {
    setIsCartModalVisible(true)
  }

  const renderMain = () => {
    return (
      <ProductDetails
        path={withPrefix(urlShape)}
        productData={productData}
        onAddToCart={onAddToCart}
      />
    )
  }

  useEffect(() => {
    if (allProducts && allProducts?.data?.length > 0) {
      const categoryData = allProducts?.data?.find(category => category.category_slug === match?.categorySlug)
      const productData = categoryData?.product_data?.find(product => product.product_slug === match?.productSlug)

      setCategoryData(categoryData)
      setProductData(productData)
    }
  }, [allProducts, match])

  return (
    <Page>
      <Seo title='Product' />
      <Container maxWidth='1600'>
        <Box marginTop={12}>
          <Breadcrumbs aria-label='breadcrumb' className='breadcrumb'>
            <Link color='inherit' to='/'>
              <FormattedMessage id='Home' />
            </Link>
            <Link
              color='inherit'
              to={`/products/${match?.categorySlug}`}
            >
              {categoryData?.category_name}
            </Link>
            <Typography color='textPrimary'>
              {productData?.product_name}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Container>
      <Router>
        {renderMain()}
      </Router>
      <Box paddingTop={10} paddingBottom={10}>
        <ProductListSlider />
      </Box>
      <Box paddingTop={10}>
        {/* <PromotoinalBanner /> */}
        <FeaturedListCarousel />
      </Box>
      <CartModal open={isCartModalVisible} onClose={() => setIsCartModalVisible(false)} />
    </Page>
  )
}

export default Product
