import React from 'react'
import { withStyles, Box, Typography, Card, CardMedia, CardContent, Button, Divider, CardActionArea } from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { VscClose } from 'react-icons/vsc'
import { RiShoppingBag3Line } from 'react-icons/ri'
import { useWishList } from '../helpers/useWishList'
import { Link, navigate } from '../components/common/Router'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useCart } from '../helpers'
import { FormattedMessage } from 'gatsby-plugin-intl'

const getUnavailabilityText = ({ is_active, in_stock }) => {
  if (is_active === 'No' && in_stock === 'Yes') {
    return <FormattedMessage id='Product Combination Unavailable' />
  }

  if (is_active === 'Yes' && in_stock === 'No') {
    return <FormattedMessage id='Out Of Stock' />
  }

  return <FormattedMessage id='Out Of Stock' />
}

const WishListItem = ({
  data,
  titleColor,
  classes,
  isActive,
  inStock
}) => {
  const UseWishList = useWishList()
  const [disableButton, setDisableButton] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const isBrowser = typeof window !== 'undefined'
  const cart = useCart()
  // const isActive = Boolean(data && data.is_active && data.is_active === 'Yes') ||
  //   Boolean(data && data.in_stock && data.in_stock === 'Yes')

  const addToCart = () => {
    setDisableButton(true)
    const moveToCart = true
    if (isBrowser) {
      window.localStorage.setItem('moveToCart', moveToCart)
    }
    const {
      product_id,
      product_slug,
      product_name,
      product_sku_id,
      price_sap,
      is_bundle,
      category_slug
      // description
    } = data
    if (is_bundle === 'No') {
      cart.addItem({
        product_id,
        product_slug,
        product_name,
        // description,
        product_sku_id,
        id: product_sku_id,
        price: price_sap
      }, 1)

      setTimeout(() => {
        handleDeleteItem()
      }, 100)
      setTimeout(() => {
        setDisableButton(false)
      }, 3000)
    } else {
      navigate(`/product/${category_slug}/${product_slug}`, { state: { fromWishlist: true, wishedId: data.wish_id } })
    }
  }

  const deleteFromList = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleDeleteItem = () => {
    const payload = {
      product_sku_id: data.product_sku_id,
      product_id: data.product_id,
      wished_id: data.wish_id
    }
    UseWishList.deletFromWishList(payload)
    setOpen(false)
  }

  const renderAction = () => {
    // if (!isActive) {
    if (inStock === 'No' || isActive === 'No') {
      return (
        <Box paddingY={1} marginTop={1}>
          <Typography
            variant='body1'
            align='center'
            color='error'
          >
            {getUnavailabilityText(data)}
          </Typography>
        </Box>
      )
    } else {
      return (
        <Box paddingY={1} marginTop={1}>
          <Button
            onClick={addToCart} size='large'
            startIcon={<RiShoppingBag3Line style={{ fontSize: '18px' }} />}
            fullWidth
            disabled={disableButton}
          >
            {data?.is_bundle === 'Yes' ? <FormattedMessage id='View Product' /> : <FormattedMessage id='Move to Cart' />}
          </Button>
        </Box>
      )
    }
  }

  return (
    <>
      <div style={{ position: 'relative', opacity: isActive ? 1 : 0.6 }}>
        <button className={classes.wishListButton} onClick={deleteFromList}>
          <VscClose style={{ fontSize: '35px' }} />
        </button>
        <Link
          to={`/product/${data?.category_slug}/${data?.product_slug}`}
          className={classes.link}
        >
          <Card className={classes.root} elevation={6}>
            <CardActionArea>
              <CardMedia
                component='img'
                height='320'
                alt={data?.product_name}
                image={data?.image}
                title={data?.product_name}
              />

              <CardContent className={classes.content}>
                <Box display='flex' flexDirection='column' flexGrow={1} alignItems='center'>
                  <Typography variant='h5' component='h5' color={titleColor} className={classes.emphasize}>{data?.product_name}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' flexGrow={5} alignItems='center'>
                  <Typography variant='h6' component='h5' className={classes.light}><FormattedMessage id='₹' /> {data?.price_sap}</Typography>

                </Box>
                <Divider />
              </CardContent>
              {/* <CardActions>
                            <Box display='flex' justifyContent='flex-end' flexGrow={1} padding={2}>
                                <Box display='flex' alignItems='center' className={classes.button}>
                                    <span>View Product</span>
                                    <ArrowRight />
                                </Box>
                            </Box>
                        </CardActions> */}
            </CardActionArea>
          </Card>
        </Link>
        {/* {open && <> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          {/* <DialogTitle id="alert-dialog-title">{"You are not signed in!"}</DialogTitle> */}
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>

              <FormattedMessage id='Are You Sure You Want To Remove This ?' />
            </DialogContentText>
          </DialogContent>
          <Box paddingLeft={2} paddingBottom={2}>
            <DialogActions>
              <Button
                onClick={handleClose}
                color='secondary'
              >
                No
              </Button>
              <Button
                onClick={handleDeleteItem}
                color='primary'
                style={{ marginLeft: '7px' }}
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
        {/* </>} */}
        {renderAction()}
      </div>
    </>
  )
}

const styles = (theme) => ({
  root: {
    height: '100%',
    transition: 'all 200ms ease-in',
    background: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      // boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      boxShadow: 'none',
      transform: 'scale(1.05)',
      background: 'transparent'
    }
  },
  link: {
    textDecoration: 'none'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '150px',
    padding: theme.spacing(4),
    paddingBottom: 0
  },
  dark: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    '& button': {
      color: 'inherit'
    }
  },
  button: {
    ...theme.typography.button,
    fontSize: '10px',
    letterSpacing: '0.2em',
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  },
  emphasize: {
    fontWeight: theme.typography.fontWeightBold
  },
  light: {
    fontWeight: theme.typography.fontWeightLight,
    color: '#999',
    textTransform: 'uppercase'
  },
  wishListButton: {
    background: 'transparent',
    color: '#fff',
    border: 'none',
    fontSize: '20px',
    margin: '7px',
    position: 'absolute',
    top: '0',
    right: '0',
    zIndex: '9',
    cursor: 'pointer'
  }
})

export default withStyles(styles, { withTheme: true })(WishListItem)
