import React from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Divider,
  useTheme
} from '@material-ui/core'
import clsx from 'clsx'

import { Parallax } from '../components/common'
import useWindowSize from '../helpers/useWindowSize'
import { useCms } from '../helpers/useCms'

const HomeSecondSection = ({ classes }) => {
  const theme = useTheme()
  const cms = useCms()
  const { width } = useWindowSize()

  const { md } = theme.breakpoints.values
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    setData(cms?.homePageData?.value_section?.content)
  }, [cms?.homePageData])
  const lastItem = data?.length
  return (
    <Parallax
      // bgImage={require('../assets/img/vangava-assurance-bg.png')}
      bgImage={require('../assets/img/background-2535510_1280.jpg')}
      bgImageStyle={{ opacity: 0.6 }}
      strength={200}
      renderLayer={percentage => (
        <Container className={classes.parallaxContainer}>
          <Box display='flex' alignItems='center'>
            <Box
              className={clsx(
                classes.parallaxImageContainer,
                classes.parallaxImageLowerLayerContainer
              )}
              style={{ bottom: `${-30 + percentage * 50}%` }}
            >
              <img
                src={cms?.homePageData?.value_section?.image2}
                className={classes.parallaxImage}
              />
            </Box>
            <Box
              className={clsx(
                classes.parallaxImageContainer,
                classes.parallaxImageUpperLayerContainer,
                classes.parallaxImageUpperLayerShadow,
                'parallaxImageUpperLayerContainer'
              )}
              style={{ top: `${-10 + percentage * 20}%` }}
            >
              <img
                // src={cms?.homePageData?.value_section?.image1}
                src={require('../assets/img/vs.png')}
                style={{ objectFit: 'cover' }}
                className={classes.parallaxImage}
              />
            </Box>
          </Box>
        </Container>
      )}
    >
      <Box className={classes.root}>
        <Container>
          <Box height={width <= md ? '50vh' : 0} />
          <Grid container justify='flex-end'>
            <Grid item sm={12} md={5} lg={5}>
              <Box display='flex' alignItems='center' className={classes.listContainer}>
                <Box paddingRight={6}>
                  {data?.map((item, i) => (
                    <div key={i}>
                      <Box className={classes.listItem} key={i}>
                        <Typography variant='h6' color='primary'>{item.title}</Typography>
                        <Box paddingTop={3}>
                          <Typography variant='body2'>
                            {item.desc}
                          </Typography>
                        </Box>
                      </Box>
                      {lastItem !== i + 1 &&
                        <Box paddingY={4}>
                          <Divider />
                        </Box>}
                    </div>
                  ))}
                  {/* <Box className={classes.listItem}>
                    <Typography variant='h6' color='primary'>Immaculate Craftmanship</Typography>
                    <Box paddingTop={3}>
                      <Typography variant='body2'>The most precise and luxurious universal cotton, shumagh vangava designed of the highest standards in the UK and the ancient manufacturing methods</Typography>
                    </Box>
                  </Box>
                  <Box paddingY={4}>
                    <Divider />
                  </Box>
                  <Box className={classes.listItem}>
                    <Typography variant='h6' color='primary'>Luxury Redefined</Typography>
                    <Box paddingTop={3}>
                      <Typography variant='body2'>The most precise and luxurious universal cotton, shumagh sayyar designed of the highest standards in the UK and the ancient manufacturing methods</Typography>
                    </Box>
                  </Box> */}
                </Box>
                <div>
                  <img src={require('../assets/img/5.png')} />
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Parallax>
  )
}

const styles = (theme) => ({
  parallaxContainer: {
    alignItems: 'center',
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    [theme.breakpoints.down('md')]: {
      height: '50vh'
    },
    [theme.breakpoints.down('sm')]: {
      top: '35px'
    }
  },
  parallaxImageContainer: {
    objectFit: 'contain',
    position: 'relative',
    width: 320
  },
  parallaxImageLowerLayerContainer: {
    height: 480,
    width: 480,
    [theme.breakpoints.down('md')]: {
      width: '305px',
      height: '200px',
      right: '-45px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '305px',
      height: '200px',
      right: '70px'
    }
  },
  parallaxImageUpperLayerContainer: {
    height: 480,
    left: -200,
    width: 360,
    [theme.breakpoints.down('md')]: {
      width: '218px',
      height: '292px'
    }
  },
  parallaxImageUpperLayerShadow: `
  box-shadow: 0 1px 2px rgba(0,0,0,0.07), 
  0 2px 4px rgba(0,0,0,0.07), 
  0 4px 8px rgba(0,0,0,0.07), 
  0 8px 16px rgba(0,0,0,0.07),
  0 16px 32px rgba(0,0,0,0.07), 
  0 32px 64px rgba(0,0,0,0.07);
  `,
  parallaxImage: {
    backgroundColor: 'transparent',
    height: '100%',
    objectFit: 'contain',
    width: '100%'
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100vh',
    [theme.breakpoints.down('md')]: {
      height: 'auto'
    }
  },
  listItem: {
    '& h6': {
      textTransform: 'uppercase',
      fontSize: '15px'
      // letterSpacing: '3px'
    }
  },
  listContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    position: 'relative',
    height: '100%',
    '& img': {
      width: '60px'
    },
    '& span': {
      fontSize: '13px',
      color: '#2E364F'
    }
  }
})

export default withStyles(styles, { withTheme: true })(HomeSecondSection)
