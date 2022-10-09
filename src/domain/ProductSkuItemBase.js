import React, { useState } from 'react'
import {
  withStyles,
  Box,
  Chip,
  Typography,
  Button,
  Drawer,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Modal
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { BiArrowBack, BiChevronDown, BiTrash } from 'react-icons/bi'
import clsx from 'clsx'

import { Image } from '../components'
import ProductDetailSlider from './ProductDetailSlider'
import ProductDetailsContent from './ProductDetailsContent'
import { useAllProductsData } from '../helpers'
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'

const ProductSkuItemBase = ({
  data,
  row = true,
  size = 'normal',
  justify = 'space-between',
  showQuantity = true,
  showPrice = true,
  canChangeSku = false,
  showQuantityModifier = false,
  quantityModifierVariant = 'steps',
  onChangeQuantity,
  showRemoveIcon = false,
  isBundleChildItem = false,
  bundleQuantity = 1,
  onRemove = () => { },
  classes
}) => {
  const allProducts = useAllProductsData()

  const {
    image,
    product_name,
    currency,
    price,
    discount_price,
    quantity,
    attributes,
    status,
    is_bundle
  } = data

  const [isProductDetailDrawerOpen, setIsProductDetailDrawerOpen] = useState(false)
  const [productSkuData, setProductSkuData] = useState(data)
  const [productData, setProductData] = useState(null)
  const [disableButton, setDisableButton] = useState(false)
  const [isQuantitySelectorModalOpen, setIsQuantitySelectorModalOpen] = useState(false)
  const [isRemoveBundleConfirmOpen, setIsRemoveBundleConfirmOpen] = useState(false)

  // const _price = discount_price && discount_price !== '' ? discount_price : price

  const getProductFromSku = () => {
    const productData = allProducts
      .data
      .map(category => category.product_data) // [[ {product_id} ]]
      .flat()// [{ product_id }]
      .find(({ product_sku_data }) => product_sku_data.some(sku => sku.product_sku_id === productSkuData.product_sku_id))

    setProductData(productData)
  }

  const onIncrementQuantity = () => {
    onChangeQuantity(data, data.quantity + 1)
  }

  const onDecrementQuantity = () => {
    onChangeQuantity(data, data.quantity - 1)
  }

  const onSelectQuantity = (quantity) => {
    onChangeQuantity(data, quantity)
  }

  const onOpenQuantitySelectorModal = () => {
    setIsQuantitySelectorModalOpen(true)
  }

  const onCloseQuantitySelectorModal = () => {
    setIsQuantitySelectorModalOpen(false)
  }

  const onSelectItem = () => {

  }

  const onOpenProductDetailDrawer = () => {
    setIsProductDetailDrawerOpen(true)
    getProductFromSku()
  }

  const onCloseProductDetailDrawer = () => {
    setIsProductDetailDrawerOpen(false)
  }

  const onRemoveBundleConfirmOpen = () => {
    setIsRemoveBundleConfirmOpen(true)
  }

  const onRemoveBundleConfirmClose = () => {
    setIsRemoveBundleConfirmOpen(false)
  }

  const onRemoveBundleConfirmAffirmative = () => {
    setIsRemoveBundleConfirmOpen(false)
    onRemove(data)
    setDisableButton(true)
  }

  const _onRemove = () => {
    if (is_bundle === 'Yes') {
      onRemoveBundleConfirmOpen()
    } else {
      onRemove(data)
      setDisableButton(true)
    }
  }

  const renderQuantityModifer = () => {
    if (!showQuantityModifier) return <></>

    if (quantityModifierVariant === 'modal') {
      return (
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Button
            variant='text'
            size='small'
            endIcon={<BiChevronDown />}
            onClick={onOpenQuantitySelectorModal}
            className={classes.quantityModifierButton}
          >
            <Typography variant='caption'><FormattedMessage id='Qty' /></Typography>&nbsp;<Typography variant='caption'><b>{quantity}</b></Typography>
          </Button>
        </Box>
      )
    }

    return (
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <IconButton size='small' onClick={onDecrementQuantity} disabled={Number(quantity) === 1}>
            <AiOutlineMinusCircle size={20} />
          </IconButton>
          <Box display='flex' alignItems='center' justifyContent='center' width={30}>
            <Typography variant='body2'>{quantity}</Typography>
          </Box>
          <IconButton size='small' onClick={onIncrementQuantity}>
            <AiOutlinePlusCircle size={20} />
          </IconButton>
        </Box>
        <Box>&nbsp;</Box>
        <Box display='flex' alignItems='center'>
          <Typography
            variant={size === 'small' ? 'subtitle2' : 'subtitle1'}
          >
            {console.log('price', parseInt(price) * parseInt(quantity))}
            {currency} {parseInt(price) * parseInt(quantity)}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box
        display='flex'
        flexGrow={1}
        flexDirection={row ? 'row' : 'column'}
        justifyContent='space-between'
        alignItems='space-between'
        className={classes.root}
      >
        <a>
          <img
            src={image}
            className={clsx(classes.image, size === 'small' && classes.smallImage)}
          />
        </a>
        <Box width={20} />
        <Box display='flex' flexDirection='column' flexGrow={1} justifyContent={justify}>
          <div>
            <Box display='flex' justifyContent='space-between'>
              <a><Typography variant='body1' gutterBottom>{product_name}</Typography></a>
              {showRemoveIcon &&
                <IconButton size='small' onClick={_onRemove} disabled={disableButton}>
                  <BiTrash size={20} />
                </IconButton>}
            </Box>
            <Box className={classes.attributes}>
              {attributes?.map((attr) => (
                <small
                  key={attr.attribute}
                  className={classes.attribute}
                >
                  {/* {attr.label}
                  &nbsp; */}
                  <b>{attr.display_value}</b>
                </small>
              ))}
            </Box>
            {canChangeSku && (
              <Button
                variant='text'
                color='primary'
                size='small'
                onClick={onOpenProductDetailDrawer}
              >
                <FormattedMessage id='Change' />
              </Button>
            )}
          </div>
          <Box paddingTop={1} display='flex' justifyContent='space-between'>
            {showQuantity && (
              <Box display='flex' alignItems='center'>
                <Typography variant='caption'><FormattedMessage id='Qty' /></Typography>
                <Box width={4} />
                <Typography variant='body2'><b>{quantity}</b></Typography>
                {isBundleChildItem && (
                  <>
                    <Box width={8} />
                    <IoMdClose />
                    <Box width={4} />
                    <Typography variant='body2'><b>{bundleQuantity}</b></Typography>
                  </>
                )}
              </Box>
            )}
            {showPrice && (
              <Box>
                {discount_price > 0 && (
                  // <strike>
                  <Typography variant='subtitle2'>Discount: {currency}&nbsp;{discount_price}</Typography>
                  // </strike>
                )}
                <Box display='flex' alignItems='center'>
                  <Typography variant='body2'>{currency}&nbsp;<b>{price}</b></Typography>
                </Box>
              </Box>
            )}
          </Box>
          {renderQuantityModifer()}
        </Box>
      </Box>

      <Dialog
        open={isQuantitySelectorModalOpen}
        onClose={onCloseQuantitySelectorModal}
      >
        <DialogTitle id='alert-dialog-title'>Select Quantity</DialogTitle>
        <DialogContent>
          <div className={classes.quantityList}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i + 1} className={classes.quantityItem}>
                <IconButton
                  size='large'
                  onClick={() => onSelectQuantity(i + 1)}
                  className={classes.quantityItemButton}
                >
                  {i + 1}
                </IconButton>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Drawer
        anchor='left'
        open={isProductDetailDrawerOpen}
        onClose={onCloseProductDetailDrawer}
      >
        <>
          <Box className={classes.drawerContent}>
            <Box display='flex' alignItems='center' paddingBottom={2}>
              <IconButton onClick={onCloseProductDetailDrawer}>
                <BiArrowBack />
              </IconButton>
              <Box width={20} />
              <Typography variant='h5'><FormattedMessage id='Modify Item' /></Typography>
            </Box>
            <Box display='flex' flexDirection='column'>
              <Box className={classes.productDetailSlider}>
                <ProductDetailSlider
                  imgList={productSkuData?.image_list}
                  height='66vh'
                />
              </Box>
              <Box marginBottom={4}>
                <ProductDetailsContent
                  data={productData}
                // onChangeAttributes={setSelectedProductSku}
                />
              </Box>
            </Box>
          </Box>
          <Box className={classes.drawerFooter}>
            <Button
              size='large'
              color='primary'
              variant='contained'
              fullWidth
              className={classes.actionButton}
              onClick={onSelectItem}
            >
              <FormattedMessage id='Select Item' />
            </Button>
          </Box>
        </>
      </Drawer>

      <Dialog
        open={isRemoveBundleConfirmOpen}
        onClose={onRemoveBundleConfirmClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Remove Item from Bag</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            This action will remove all of the items in the bundle. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onRemoveBundleConfirmClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={onRemoveBundleConfirmAffirmative} color='primary' autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
const styles = (theme) => ({
  root: {
    height: '100%'
  },
  image: {
    borderRadius: '5px',
    height: '115px',
    objectFit: 'cover',
    width: '115px'
  },
  smallImage: {
    height: '80px',
    width: '85px'
  },
  attributes: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(0, -1)
  },
  attribute: {
    wordWrap: 'nowrap',
    margin: theme.spacing(0.2, 1)
  },
  large: {
    '& div': {
      height: '60px',
      width: '60px'
    }
  },
  drawerContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: 'calc(100% - 60px)',
    overflowY: 'auto',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('md')]: {
      width: '50vw'
    },
    [theme.breakpoints.up('lg')]: {
      width: '33vw'
    }
  },
  drawerFooter: {
    padding: theme.spacing(1)
  },
  quantityModifierButton: {
    textTransform: 'capitalize'
  },
  quantityList: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  quantityItem: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1, 0),
    width: `${100 / 5}%`
  },
  quantityItemButton: {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontSize: '14px',
    height: '36px',
    width: '36px'
  }
})

export default withStyles(styles, { withTheme: true })(ProductSkuItemBase)
