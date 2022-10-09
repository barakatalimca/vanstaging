import React, { useEffect, useState } from 'react'
import {
  withStyles, Box, Container,
  Typography,
  Grid,
  Divider,
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import banner from '../assets/img/offer-img.jpg'
import useWindowSize from '../helpers/useWindowSize'
import ProductListItem from './ProductListItem'

const EVENT_LIST = [{
  id: 6,
  newCollection: false,
  name: 'Vangava Blue',
  price: '246',
  imageUrl: 'https://sayyarapp-deployments-mobilehub-1451989817.s3.amazonaws.com/products/thumb/15984318868502.jpg',
}, {
  id: 7,
  newCollection: false,
  name: 'Vangava Blue',
  price: '246',
  imageUrl: 'https://sayyarapp-deployments-mobilehub-1451989817.s3.amazonaws.com/products/thumb/15984318868502.jpg',
}, {
  id: 8,
  newCollection: false,
  name: 'Vangava Blue',
  price: '246',
  imageUrl: 'https://sayyarapp-deployments-mobilehub-1451989817.s3.amazonaws.com/products/thumb/15984318868502.jpg',
}, {
  id: 9,
  newCollection: false,
  name: 'Vangava Blue',
  price: '246',
  imageUrl: 'https://sayyarapp-deployments-mobilehub-1451989817.s3.amazonaws.com/products/thumb/15984318868502.jpg',
}, {
  id: 10,
  newCollection: false,
  name: 'Vangava Blue',
  price: '246',
  imageUrl: 'https://sayyarapp-deployments-mobilehub-1451989817.s3.amazonaws.com/products/thumb/15984318868502.jpg',
}]

const SalesList = ({ classes }) => {
  const theme = useTheme()
  const { width } = useWindowSize()

  const [data, setData] = useState([])

  useEffect(() => {
    setData(EVENT_LIST)
  }, [])

  return (
    <>
      <Box marginTop={5}>
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          spacing={4}
        >
          {data.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box className={classes.item}>
                <ProductListItem data={item} isEven={index % 2 === 0} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
}

const styles = (theme) => ({
  item: {
    height: '100%'
  }
})

export default withStyles(styles, { withTheme: true })(SalesList)
