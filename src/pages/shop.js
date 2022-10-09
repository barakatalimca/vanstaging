import React, { useState } from 'react'
import { Box, Container } from '@material-ui/core'

import Page from '../components/Page'
import CategoriesMenu from '../domain/CategoriesMenu'
import HorizontalScrollMenu from '../components/HorizontalScrollMenu'
import Seo from '../components/common/Seo'
import PageTitle from '../components/common/PageTitle'
import ProductList from '../domain/ProductList'
import SaleList from '../domain/SaleList'
// import ProductListFilter from '../domain/ProductListFilter'
import Fade from 'react-reveal/Fade'
import PromotoinalBanner from '../domain/PromotionalBanner'
const desc = 'The most precise and luxurious universal cotton, shumagh vangava designed of the highest standards in the UK and the ancient manufacturing methods.'
const Products = (props) => {
  console.log('products page', props)
  return (
    <Page>
      <Fade>
        <Seo title='Products' />
        <Container>
          <Box marginTop={15}>
            <CategoriesMenu />
            <HorizontalScrollMenu />
          </Box>
          <Box marginTop={5}>
            <PageTitle title='SHAMAGH' description={desc} />
          </Box>
          <Box marginBottom={10}>
            <ProductList />
          </Box>
        </Container>
        {/* <PromotoinalBanner /> */}
        <Container>
          <SaleList />
        </Container>
      </Fade>
    </Page>
  )
}

export default Products
