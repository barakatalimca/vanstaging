import React, { useEffect, useRef, useState } from 'react'
import { Box, Typography, Grid, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { animated, config, useChain, useSpring, useTransition } from 'react-spring'
import { FormattedMessage } from 'gatsby-plugin-intl'

import '../styles/header-navigation.css'
import { Link } from './common/Router'
import { useAllProductsData } from '../helpers'
import Image from './Image'

const HeaderShopDropdown = ({
  isVisible = false,
  onHide = () => { }
}) => {
  const classes = useStyles()
  const allProducts = useAllProductsData()

  const [topCategoryListData, setTopCategoryListData] = useState([])

  const springRef = useRef()
  const { size, opacity, ...rest } = useSpring({
    ref: springRef,
    config: config.stiff,
    from: { size: '20%' },
    to: { size: isVisible ? '100%' : '20%' }
  })

  const transRef = useRef()
  const transitions = useTransition(
    isVisible ? topCategoryListData : [],
    item => item.category_id,
    {
      ref: transRef,
      unique: true,
      trail: 400 / topCategoryListData.length,
      from: { opacity: 0, transform: 'scale(0)' },
      enter: { opacity: 1, transform: 'scale(1)' },
      leave: { opacity: 0, transform: 'scale(0)' }
    }
  )

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(isVisible ? [springRef, transRef] : [transRef, springRef], [0, isVisible ? 0.1 : 0.6])

  useEffect(() => {
    if (allProducts?.data?.length > 5) {
      setTopCategoryListData(allProducts?.data?.slice(0, -1))
    } else {
      setTopCategoryListData(allProducts?.data)
    }
  }, [allProducts?.data])

  // if (!isVisible) {
  //   return <></>
  // }

  return (
    <div className='NavDropDown'>
      <Box paddingBottom={5} paddingTop={5}>
        <Container>
          <Grid container spacing={2}>
            <Grid item md={2} lg={2} sm={12}>
              <section>
                {allProducts?.data?.map((category, i) => (
                  <Link
                    key={category.category_id}
                    onClick={onHide}
                    to={`/products/${category.category_slug}`}
                  >
                    {category.category_name}
                  </Link>
                ))}
              </section>
            </Grid>
            <Grid item md={10} lg={10} sm={12}>
              <div className={classes.topCategoryList}>
                {transitions.map(({ item, key, props }) => (
                  <animated.div
                    style={props}
                    key={key}
                  >
                    <Link
                      onClick={onHide}
                      to={`/products/${item.category_slug}`}
                    >
                      <Box>
                        <Box>
                          <Image src={item.image} style={{ objectFit: 'cover' }} />
                        </Box>
                        <Typography variant='subtitle2' className={classes.categoryName}>{item.category_name}</Typography>
                      </Box>
                    </Link>
                  </animated.div>
                ))}
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  topCategoryList: {
    display: 'flex',
    '& > div': {
      padding: theme.spacing(1),
      width: '25%'
    }
  },
  categoryName: `
    color: #000;
    margin-top: ${theme.spacing(1)}px;
    font-weight: bold;
    text-transform: uppercase;
  `
}))

export default HeaderShopDropdown
