import React from 'react'
import {
  withStyles,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  TextField,
  Snackbar,
  IconButton,
  SnackbarContent,
  CircularProgress,
  Typography
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'
import StarRateIcon from '@material-ui/icons/StarRate'
import { VscClose } from 'react-icons/vsc'

import ProductSkuItemBase from './ProductSkuItemBase'
import { theme } from '../providers/ThemeProvider'
import { useAllProductsData } from '../helpers'
import Api from '../Api'
import { FormattedMessage } from 'gatsby-plugin-intl'

const OrderItem = ({ data, classes, OrderId, statusText }) => {
  const allProducts = useAllProductsData()

  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [ratingValue, setRatingValue] = React.useState(0)
  const [reviewText, setReviewText] = React.useState('')
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')

  const {
    is_reviewed,
    status,
    messages
  } = data

  const closeModal = () => {
    setOpen(false)
  }
  const closeSnackbar = () => {
    setShowSnackbar(false)
    setSnackbarText('')
  }

  const openModal = () => {
    setOpen(true)
  }
  const submitReview = () => {
    setLoading(true)
    const payload = { order_id: OrderId, product_id: data?.product_id, review: reviewText, rate: ratingValue.toString() }

    Api.addReview(payload)
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            if (response.data.result === 1) {
              setShowSnackbar(true)
              setSnackbarText(response.data.message)
              setLoading(false)
              allProducts.reloader()
              setTimeout(() => {
                setOpen(false)
                setRatingValue(0)
              }, 1000)
            } else {
              setSnackbarText(response.data.message)
              setLoading(false)
            }
          }
        }
      })
  }
  const renderBundledProducts = (data) => {
    if (data.is_bundle === 'Yes' && data.bundled_product) {
      return (
        <div className={classes.bundledProducts}>
          {data.bundled_product.map(bp => (
            <ProductSkuItemBase
              key={bp.product_sku_id}
              data={bp}
              size='small'
              showQuantity
              showPrice={false}
              showRemoveIcon={false}
              showQuantityModifier={false}
              isBundleChildItem
              bundleQuantity={data.quantity}
            />
          ))}
        </div>
      )
    }
    return <></>
  }
  return (
    <div className={classes.root}>
      <ProductSkuItemBase data={data} />
      <Box paddingTop={1}>
        {renderBundledProducts(data)}
      </Box>
      <Box display='flex' justifyContent='space-between' paddingTop={1}>
        {status &&
          <>
            <Box display='flex' justifyContent='space-between'>
              <Box display='flex' alignItems='center'>
                <small style={{ display: 'flex', alignItems: 'center', marginRight: '7px' }} variant='caption'><b><FormattedMessage id='Status' /> :</b></small>
                <small style={{ display: 'flex', alignItems: 'center' }} variant='caption'><b>{status}</b></small>
              </Box>
            </Box>
          </>}
        {is_reviewed === 'Yes'
          ? <small>Already Reviewed.</small>
          : (
            <>
              {statusText === 'Delivered' &&
                <small onClick={() => openModal()}>
                  <a style={{ display: 'flex', alignItems: 'center', color: '#f26b3e' }}>
                    <StarRateIcon style={{ fontSize: '20px' }} />
                    <span>Rate & Review</span>
                  </a>
                </small>}

            </>
          )}
      </Box>
      {/* {messages && messages.length > 0 && (
        messages.map(m => <Typography variant='subtitle2' key={m}>{m}</Typography>)
      )} */}

      <Dialog
        open={open}
        maxWidth='sm'
        fullWidth='sm'
        onClose={closeModal}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <Box><DialogTitle id='alert-dialog-title'>Rate & Review Product</DialogTitle> </Box>
        <DialogContent>
          <TextField
            id='outlined-multiline-static'
            label='Write Your Review'
            multiline
            rows={4}
            fullWidth
            variant='outlined'
            onChange={(e) => setReviewText(e.target.value)}
          />
          <br />
          <br />
          <Rating
            name='simple-controlled'
            value={ratingValue}
            onChange={(event, newValue) => {
              setRatingValue(newValue)
            }}
          />
        </DialogContent>
        <Box paddingLeft={2} paddingBottom={2}>
          <DialogActions>
            <Button
              onClick={closeModal}
              color='secondary'
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              color='primary'
              disabled={ratingValue === 0 || reviewText.length === 0 || loading}
              style={{ marginLeft: '7px' }}
              autoFocus
            >
              {!loading && 'Submit'}
              {loading && <CircularProgress size={22} className={classes.buttonProgress} />}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSnackbar}
        onClose={closeSnackbar}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={closeSnackbar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: '#000'
          }}
          message={<span id='client-snackbar'>{snackbarText}</span>}
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={closeSnackbar}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>
    </div>
  )
}

const styles = () => ({
  item: {
    height: '100%'
  },
  root: {
    borderBottom: '1px solid #eee',
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    '&:last-child': {
      border: 'none'
    }
  },
  bundledProducts: {
    '& > div': {
      marginBottom: theme.spacing(1)
    }
  }
})

export default withStyles(styles, { withTheme: true })(OrderItem)
