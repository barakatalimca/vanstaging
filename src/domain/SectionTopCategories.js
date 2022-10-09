import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles, Container, Box, Tab, Hidden, useTheme, Grid, Typography } from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import Fade from 'react-reveal/Fade'
import { FormattedMessage } from 'gatsby-plugin-intl'
import _ from 'lodash'
import 'pure-react-carousel/dist/react-carousel.es.css'
import { Link } from '../components/common/Router'
import { Image } from '../components'
import ProductListItemStylised from './ProductListItemStylised'
import { useAllProductsData, useI18n, useWindowSize } from '../helpers'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import ScrollingContainer from '../components/ScrollingContainer'
import ban from '../assets/img/proBan.png'
const SectionTopCategories = ({ classes }) => {
  const theme = useTheme()
  const { width } = useWindowSize()
  const allProducts = useAllProductsData()
  const i18n = useI18n()
  const [value, setValue] = useState('1')

  const isMainImagePresent = (image) => image && image !== ''
  const getItemCountToBeVisible = (image) => {
    const { sm, md, lg } = theme.breakpoints.values

    if (width <= sm) {
      return 1
    } else if (width <= md) {
      return 2
    } else {
      if (isMainImagePresent(image)) {
        return 3
      }
      return 3
    }
  }

  const handleChange = (_event, newValue) => {
    setValue(newValue)
  }
  const renderCarouselActions = () => {
    if (width <= theme.breakpoints.values.md) {
      return <></>
    }

    return (
      <Box display='flex' justifyContent='center' marginTop={5} className={classes.buttonContainers}>
        <Box marginX={-2}>
          <ButtonBack className={classes.navigationButton}>
            {/* {i18n?.locale === 'ar'
              ? <ChevronRight className={classes.icon} />
              : <ChevronLeft className={classes.icon} />} */}
            <ChevronLeft className={classes.icon} />
          </ButtonBack>
        </Box>
        <Box marginX={-2}>
          <ButtonNext className={classes.navigationButton}>
            {/* {i18n?.locale === 'ar'
              ? <ChevronLeft className={classes.icon} />
              : <ChevronRight className={classes.icon} />} */}
            <ChevronRight className={classes.icon} />
          </ButtonNext>
        </Box>
      </Box>
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
      <Fade>
        <Grid container>
          {/* <Hidden mdDown>
            {isMainImagePresent(category.image_body) && (
              <Grid item xs>
                <Box className={classes.tabPrimaryImageContainer}>
                  <Image src={category.image_body} style={{ height: '500px' }} />
                </Box>
              </Grid>
            )}
          </Hidden> */}
          <Grid item xs>
            <Box style={{ position: 'relative' }}>
              <Hidden lgUp>
                <ScrollingContainer>
                  {category.product_data.map((item, productIndex) => (
                    <div index={productIndex} key={item.product_id}>
                      <ProductListItemStylised productData={item} />
                    </div>
                  ))}
                </ScrollingContainer>
              </Hidden>
              <Hidden mdDown>
                <CarouselProvider
                  isIntrinsicHeight
                  naturalSlideWidth={125}
                  naturalSlideHeight={80}
                  totalSlides={category.product_data.length}
                  isPlaying
                  // infinite
                  style={{ direction: 'ltr' }}
                  visibleSlides={getItemCountToBeVisible(category.image_body)}
                >
                  <Slider>
                    {category.product_data.map((item, productIndex) => (
                      <Slide index={productIndex} key={item.product_id}>
                        <Link to={`/product/${item.category_slug}/${item.product_slug}/`}>
                          <ProductListItemStylised productData={item} />
                        </Link>
                      </Slide>
                    ))}
                  </Slider>
                  {renderCarouselActions()}
                </CarouselProvider>
              </Hidden>

            </Box>
          </Grid>
        </Grid>
      </Fade>
    </TabPanel>
  ))

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.bgImageContainer}>
          <Image
            src={ban}
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Container className={classes.tabPanels}>
          <Typography variant='h4' align='center' className={classes.pageTitle}>
            <FormattedMessage id='PRODUCTS' />
          </Typography>
          <TabContext value={value}>
            <Box display='flex' justifyContent='center' paddingTop={2}>
              <TabList
                onChange={handleChange}
                variant='scrollable'
                scrollButtons='on'
                dir='ltr'
              >
                {tabs}
              </TabList>
            </Box>
            {tabPanels}
          </TabContext>
        </Container>
      </Box>
    </>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

const a11yProps = (index) => {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  }
}

const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      paddingBottom: 0
    }
  },
  bgImageContainer: `
    object-fit: cover;
    opacity: 0.5;
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
  `,
  pageTitle: {
    position: 'relative'
  },
  tabPanels: {
    [theme.breakpoints.down('md')]: {
      padding: 0
    }
  },
  tabPanel: {
    paddingLeft: 0,
    paddingTop: theme.spacing(6),
    paddingRight: 0,
    paddingBottom: 0
  },
  navigationButton: {
    ...theme.typography.button,
    border: 'none',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  icon: {
    fontSize: '4rem',
    color: '#000'
  },
  tabPrimaryImageContainer: {
    height: '500px',
    maxWidth: 320,
    objectFit: 'cover',
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(10),
    width: '100%',
    [theme.breakpoints.down('lg')]: {
      // display: 'none'
    },
    '& img': {
      objectFit: 'cover !important'
    }
  },
  buttonContainers: {
    position: 'absolute',
    bottom: '28vh',
    width: '100%',
    justifyContent: 'space-between'
  }
})

export default withStyles(styles, { withTheme: true })(SectionTopCategories)
