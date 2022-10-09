import React from 'react'
import { withStyles, Box, Typography, Container, Hidden } from '@material-ui/core'
import HorizontalScroll from 'react-scroll-horizontal'

import '../styles/header-navigation.css'
import { Link } from '../components/common/Router'

const CategoriesMenu = ({ data = [], mobile }) => {
  const parent = { width: '100%', height: '5em' }

  return (
    <>
      <Hidden mdDown>
        <div className='CategoriesMenu' style={{ display: 'block' }}>
          <Box paddingBottom={5} paddingTop={5}>
            <Container>

              <ul>
                <HorizontalScroll style={parent}>
                  {data.map((category) => (
                    <li key={category.category_id} style={{ width: mobile && 'auto', padding: mobile && '0 7px' }}>
                      <>
                        <Link
                          to={`/products/${category.category_slug}`}
                        >
                          <Box display='flex' alignItems='center'>
                            <img src={category.image} />
                            <Typography variant='h6'>{category.category_name}</Typography>
                          </Box>
                        </Link>
                      </>
                    </li>
                  ))}
                </HorizontalScroll>
              </ul>

            </Container>
          </Box>
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className='CategoriesMenu' style={{ display: 'block', overflowY: 'scroll' }}>
          <Box paddingBottom={5} paddingTop={5}>
            <Container>
              <ul>
                {data.map((category) => (
                  <li key={category.category_id} style={{ width: mobile && 'auto', padding: mobile && '0 7px' }}>
                    <>
                      <Link
                        to={`/products/${category.category_slug}`}
                      >
                        <Box display='block' alignItems='center'>
                          <img src={category.image} />
                          <Typography variant='h6'>{category.category_name}</Typography>
                        </Box>
                      </Link>
                    </>
                  </li>
                ))}
              </ul>
            </Container>
          </Box>
        </div>
      </Hidden>
    </>
  )
}

const styles = (theme) => ({
  root: {
    // backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    '& ul': {
      padding: '0'
    },
    '& ul li': {
      listStyleType: 'none',
      display: 'inline-block',
      height: '74px',
      lineHeight: '74px'
    },
    '& ul li > a': {
      height: '64px',
      lineHeight: '64px',
      display: 'block',
      color: '#fff'
    }
  },
  items: {
    paddingLeft: theme.spacing(2)
  },
  item: {
    // color: theme.palette.secondary.main,
    color: '#fff',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    textDecoration: 'none',
    textTransform: 'capitalize'
  }
})

export default withStyles(styles, { withTheme: true })(CategoriesMenu)
