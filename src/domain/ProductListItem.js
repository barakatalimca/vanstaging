import React from 'react'
import { withStyles, Button, Box, Typography, Card, CardMedia, CardContent, Divider, CardActionArea, IconButton } from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { VscClose } from 'react-icons/vsc'

import { useWishList } from '../helpers/useWishList'
import { Link } from '../components/common/Router'
import { useAuth } from '../helpers/useAuth'
import { FormattedMessage } from 'gatsby-plugin-intl'

const ProductListItem = ({
  data,
  titleColor,
  onClick,
  classes
}) => {
  if (!data) {
    return <></>
  }
  const wishlist = useWishList()
  const auth = useAuth()

  const [disableIcon, setDisableIcon] = React.useState(false)

  const {
    is_bundle,
    product_id,
    product_sku_id,
    product_name,
    product_sku_data,
    image,
    currency,
    price,
    product_slug,
    category_slug,
    discount_price,
    is_wished,
    tag,
    tag_color,
    discount_tag,
    discount
  } = data

  const onAddToWishList = () => {
    let skuId

    if (is_bundle === 'Yes') {
      skuId = product_sku_id
    } else {
      skuId = product_sku_data[0]?.product_sku_id
    }

    wishlist.addToWishList({
      product_id,
      product_sku_id: skuId
    })
    if (auth?.user?.isLoggedIn) {
      setDisableIcon(true)
    } else {
      setTimeout(() => {
        setDisableIcon(false)
      }, 1000)
    }
  }

  const renderWishlistIcon = () => {
    let isWished

    if (is_bundle === 'Yes') {
      isWished = is_wished === 'Yes'
    } else {
      isWished = data?.product_sku_data.some((item) => item.is_wished === 'Yes')
    }

    if (!isWished) {
      return (
        <IconButton
          disabled={disableIcon}
          className={classes.wishListButton}
          onClick={onAddToWishList}
        >
          <FavoriteBorderIcon fontSize='large' />
        </IconButton>
      )
    }

    return (
      <IconButton
        // disabled={disableIcon}
        className={classes.wishListButton}
      // onClick={onAddToWishList}
      >
        <FavoriteIcon fontSize='large' color='error' />
      </IconButton>
    )
  }

  const renderTag = () => {
    if (!tag || tag === '') {
      return <></>
    }

    return (
      <div
        className={classes.tag}
        style={{ backgroundColor: tag_color }}
      >
        {tag}
      </div>
    )
  }

  const renderCard = () => {
    return (
      <Card className={classes.root} elevation={6}>

        <CardActionArea>
          <div className={classes.mediaContainer}>
            {discount_tag !== 'No' && discount &&
              <>
                <div className='ribbon'>
                  <div>{discount}</div>
                </div>
              </>}
            <CardMedia
              component='img'
              height='320'
              alt={product_name}
              image={image}
              title={product_name}
            />
            {renderTag()}
          </div>
          <CardContent className={classes.content}>
            {/* {newCollection && (
              <Box display='flex' flexDirection='column' flexGrow={5} alignItems='center'>
                <Typography variant='body1' component='p' color={titleColor} className={classes.light}>New collection</Typography>
              </Box>
            )} */}
            <Typography variant='body1' align='center'>
              <b>{product_name}</b>
            </Typography>
            <Typography variant='subtitle1' align='center'>
              {currency} {discount_price ? <><strike>{price}</strike> {discount_price}</> : price}
            </Typography>
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
    )
  }

  const renderMain = () => {
    if (onClick) {
      return (
        <div onClick={() => onClick(data)}>
          {renderCard()}
        </div>
      )
    }

    return (
      <Link
        to={`/product/${category_slug}/${product_slug}`}
        className={classes.link}
      >
        {renderCard()}
      </Link>
    )
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        {renderWishlistIcon()}
        {renderMain()}
      </div>
    </>
  )
}

const styles = (theme) => ({
  root: {
    height: '100%',
    transition: 'all 200ms ease-in',
    position: 'relative',
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
  mediaContainer: {
    position: 'relative'
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
    zIndex: '9'
  },
  tag: `
  position: absolute;
  bottom: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  right: 0;
  left: 0;
  text-align: center;
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  font-weight: bold;  
  `
})

export default withStyles(styles, { withTheme: true })(ProductListItem)
