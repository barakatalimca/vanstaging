import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles, Box, Typography, Tab } from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'

import ProductList from './ProductList'
import { useAllProductsData } from '../helpers'

const ProductListTabs = ({ onClickItem, classes }) => {
  const allProducts = useAllProductsData()

  const [value, setValue] = useState('1')

  const handleChange = (_event, newValue) => {
    setValue(newValue)
  }

  const renderTabPanelContent = category => {
    if (category.product_data.length === 0 ||
      category.product_data.every(item => item.is_bundle === 'Yes')) {
      return (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <Typography>No Products Available</Typography>
        </Box>
      )
    }

    return (
      <ProductList
        category={category}
        data={category.product_data.filter(item => item.is_bundle === 'No')}
        onClickItem={onClickItem}
      />
    )
  }

  const tabs = allProducts?.data?.map(({ category_id, category_name }, i) => (
    <Tab
      key={category_id}
      value={(i + 1).toString()}
      label={category_name}
      {...a11yProps(i + 1)}
    />
  ))

  const tabPanels = allProducts?.data?.map((category, i) => (
    <TabPanel
      key={category.category_id}
      value={(i + 1).toString()}
      className={classes.tabPanel}
    >
      {renderTabPanelContent(category)}
    </TabPanel>
  ))

  return (
    <Box paddingBottom={5}>
      <TabContext value={value}>
        <Box display='flex' justifyContent='center'>
          <TabList
            onChange={handleChange}
            variant='scrollable'
            scrollButtons='on'
            dir='ltr'
          >
            {tabs}
          </TabList>
        </Box>
        <Box paddingBottom={10}>
          {tabPanels}
        </Box>
      </TabContext>
    </Box>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

const a11yProps = (index) => {
  return {
    id: `scrollable-category-tab-${index}`,
    'aria-controls': `scrollable-product-list-tabpanel-${index}`
  }
}

const styles = (theme) => ({
  item: {
    height: '100%'
  },
  itemContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: '0 50px !important'
    }
  }
})

export default withStyles(styles, { withTheme: true })(ProductListTabs)
