import React from 'react'
import { withStyles, Box, Grid, Typography } from '@material-ui/core'
import Fade from 'react-reveal/Fade'

import ProductListItem from './ProductListItem'

const ProductList = ({ category, data = [], onClickItem, classes }) => {
  if (data.length === 0) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Typography>No Products Available</Typography>
      </Box>
    )
  }

  return (
    <Fade>
      <Box paddingBottom={5}>
        <Grid
          container
          direction='row'
          alignItems='center'
          spacing={6}
        >
          {data.map((product) => (
            <Grid className={classes.itemContainer} item xs={12} sm={6} md={4} key={product.product_id}>
              <Box className={classes.item}>
                <ProductListItem
                  categoryData={category}
                  data={product}
                  onClick={onClickItem}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  )
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

export default withStyles(styles, { withTheme: true })(ProductList)
