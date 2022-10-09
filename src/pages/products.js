import React, { useEffect, useState } from 'react'
import { withPrefix } from 'gatsby'

import { Box, Container } from '@material-ui/core'
import { Router, useMatch } from '@reach/router'
import { useQuery } from 'react-query'

import Page from '../components/Page'
import CategoriesMenu from '../domain/CategoriesMenu'
import HorizontalScrollMenu from '../components/HorizontalScrollMenu'
import Seo from '../components/common/Seo'
import PageTitle from '../components/common/PageTitle'
import ProductList from '../domain/ProductList'
import SaleList from '../domain/SaleList'
import Fade from 'react-reveal/Fade'
import PromotoinalBanner from '../domain/PromotionalBanner'
import { useAllProductsData } from '../helpers'
import FeaturedListCarousel from '../components/FeaturedListCarousel'

const Products = () => {
  const allProducts = useAllProductsData()
  const match = useMatch(':locale/products/:categorySlug')

  const [allCategoryData, setAllCategoryData] = useState([])
  const [currentCategoryData, setCurrentCategoryData] = useState(null)
  const [productListData, setProductListData] = useState([])

  useEffect(() => {
    if (allProducts && allProducts.data && allProducts.data.length > 0) {
      const filteredData = allProducts.data.find(category => category.category_slug === match.categorySlug)
      setAllCategoryData(allProducts.data)
      setProductListData(filteredData?.product_data)
      setCurrentCategoryData(filteredData)
    }
  }, [allProducts, match])

  return (
    <Page>
      <Fade>
        <Seo title='Products' />
        <Container>
          <Box marginTop={15}>
            <CategoriesMenu data={allCategoryData} />
            <HorizontalScrollMenu />
          </Box>
          <Box marginTop={5}>
            <PageTitle
              title={currentCategoryData?.category_name}
              description={currentCategoryData?.description}
            />
          </Box>
          <Box marginBottom={10}>
            <Router>
              <ProductList
                path=':locale/products/:categorySlug'
                category={currentCategoryData}
                data={productListData}
              />
            </Router>
          </Box>
        </Container>
        {/* <PromotoinalBanner /> */}
        {/* <Container>
          <SaleList />
        </Container> */}
        <FeaturedListCarousel />
      </Fade>
    </Page>
  )
}

export default Products
