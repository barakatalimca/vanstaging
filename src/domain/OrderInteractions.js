import React, { useState } from 'react'
import {
  withStyles,
  Box,
  Button,
  Drawer,
  Typography,
  IconButton,
  Divider,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  SnackbarContent,
  CircularProgress
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { BiArrowBack } from 'react-icons/bi'
import { VscClose } from 'react-icons/vsc'

import ReturnProductItem from './ReturnProductItem'
import ExchangeOrderInteraction from './ExchangeOrderInteraction'
import { useCustomerOrderData } from '../helpers/useCustomerOrderData'

const OrderInteractions = ({ orderDetailsData, classes }) => {
  const { items } = orderDetailsData

  const customerOrderData = useCustomerOrderData()
  const [isCancelDrawerOpen, setIsCancelDrawerOpen] = useState(false)
  const [isReturnDrawerOpen, setIsReturnDrawerOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const [cancelAll, setCancelAll] = useState(false)
  const [cancel, setCancel] = useState(false)

  const [returnAll, setReturnAll] = useState(false)
  const [returnselected, setReturnSelected] = useState(false)
  const [actionText, setActionText] = useState('')

  const [isExchangeActive, setIsExchangeActive] = useState(false)
  const [cancelProductSkuList, setCancelProductSkuList] = useState([])
  const [returnProductSkuList, setReturnProductSkuList] = useState([])
  // const inList = (item, list) => list.some(({ product_sku_id }) => product_sku_id === item.product_sku_id)
  const updatedList = (selectedItem, quantity) => list => {
    if (quantity) {
      return list.map(item =>
        item.product_sku_id === selectedItem.product_sku_id
          ? ({ ...item, selectedQuantity: quantity })
          : item)
    }

    return list.map(item =>
      item.product_sku_id === selectedItem.product_sku_id
        ? ({ ...item, isSelected: !item.isSelected })
        : item)
  }

  const formattedAmountTotal = productSkuList => (
    `${productSkuList.reduce((sum, item) => sum + Number(item.price) * Number(item.selectedQuantity), 0).toFixed(2)}`
    // `${orderDetailsData.items[0].currency} ${productSkuList.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)}`
  )

  const selectedCancelProductSkuList = cancelProductSkuList.filter(item => item.isSelected)
  const selectedReturnProductSkuList = returnProductSkuList.filter(item => item.isSelected)

  const onCloseDrawer = () => {
    setIsCancelDrawerOpen(false)
    setIsReturnDrawerOpen(false)
    setIsExchangeActive(false)
    setCancelProductSkuList([])
    setReturnProductSkuList([])
  }

  const onSelectCancelItem = (item) => {
    setCancelProductSkuList(updatedList(item))
  }

  const onSelectReturnItem = (item) => {
    setReturnProductSkuList(updatedList(item))
  }

  const onChangeQuantityCancelItem = ({ item, quantity }) => {
    setCancelProductSkuList(updatedList(item, quantity))
  }

  const onChangeQuantityReturnItem = ({ item, quantity }) => {
    setReturnProductSkuList(updatedList(item, quantity))
  }

  const openCancelAllDialog = () => {
    setOpenDialog(true)
    setCancelAll(true)
    setCancel(true)
  }

  const cancelDialog = () => {
    setOpenDialog(true)
    setCancel(true)
    setCancelAll(false)
  }

  const openReturnAllDialog = () => {
    setOpenDialog(true)
    setReturnAll(true)
    setReturnSelected(true)
  }
  const returnDialog = () => {
    setOpenDialog(true)
    setReturnSelected(true)
    setReturnAll(false)
  }

  const submitCancel = () => {
    const { order_id } = orderDetailsData

    if (cancelAll) {
      const payload = {
        action: 'cancel-all',
        order_id
      }
      customerOrderData.manageOrder(payload)
    } else {
      const _payload = {
        action: 'cancel',
        order_id,
        items: selectedCancelProductSkuList.map(l => ({
          product_id: l.product_id,
          product_sku_id: l.product_sku_id,
          quantity: l.selectedQuantity
        }))
      }
      customerOrderData.manageOrder(_payload)
    }
  }

  const submitReturn = () => {
    const { order_id } = orderDetailsData

    if (returnAll) {
      const payload = {
        action: 'return-all',
        order_id
      }
      customerOrderData.manageOrder(payload)
    } else {
      const _payload = {
        action: 'return',
        order_id,
        items: selectedReturnProductSkuList.map(l => ({
          product_id: l.product_id,
          product_sku_id: l.product_sku_id,
          quantity: l.selectedQuantity
        }))
      }
      customerOrderData.manageOrder(_payload)
    }
  }

  React.useEffect(() => {
    setOpenDialog(false)
    setIsReturnDrawerOpen(false)
    setIsCancelDrawerOpen(false)
    setCancelAll(false)
    setCancelProductSkuList([])
    setCancelProductSkuList([])
    // setReturnlList([])
    // setCancelList([])
  }, [customerOrderData?.reload])

  React.useEffect(() => {
    if (isCancelDrawerOpen) {
      const initialCancellableItems = items
        .filter(item => item.can_cancel === 'Yes')
        .map(item => ({ ...item, isSelected: false, selectedQuantity: item.quantity }))

      setCancelProductSkuList(initialCancellableItems)
    }
  }, [items, isCancelDrawerOpen])

  React.useEffect(() => {
    if (isReturnDrawerOpen) {
      const initialReturnableItems = items
        .filter(item => item.can_return === 'Yes')
        .map(item => ({ ...item, isSelected: false, selectedQuantity: item.quantity }))

      setReturnProductSkuList(initialReturnableItems)
    }
  }, [items, isReturnDrawerOpen])

  return (
    <>
      <Box paddingY={3}>
        <Grid container alignItems='center' justify='center' className={classes.actions}>
          <Button
            color='secondary'
            size='small'
            onClick={() => setIsCancelDrawerOpen(true)}
          >

            <FormattedMessage id='Cancel Items' />
          </Button>
          <Divider orientation='vertical' flexItem />
          <Button
            color='secondary'
            size='small'
            onClick={() => setIsReturnDrawerOpen(true)}
          >
            <FormattedMessage id='Return Items' />
          </Button>
          <Divider orientation='vertical' flexItem />
          <Button
            color='secondary'
            size='small'
            onClick={() => setIsExchangeActive(true)}
          >
            <FormattedMessage id='Exchange Items' />
          </Button>
        </Grid>
      </Box>
      {/* CANCEL */}
      <Drawer anchor='right' open={isCancelDrawerOpen} onClose={onCloseDrawer}>
        <>
          <Box className={classes.drawerContent}>
            <Box display='flex' alignItems='center' paddingBottom={2}>
              <IconButton onClick={onCloseDrawer}>
                <BiArrowBack />
              </IconButton>
              <Box width={20} />
              <Typography variant='h5'><FormattedMessage id='Cancel Items' /></Typography>
            </Box>
            <Box display='flex' flexDirection='column' flexGrow={1}>
              {cancelProductSkuList.map(item => (
                <ReturnProductItem
                  key={item.product_sku_id}
                  data={item}
                  onSelect={onSelectCancelItem}
                  onChangeQuantity={onChangeQuantityCancelItem}
                  isSelected={item.isSelected}
                  cancelItem
                />
              ))}
              {cancelProductSkuList.length === 0 &&
                <>
                  <Typography variant='body2'>
                    <FormattedMessage id='No items to cancel' />
                  </Typography>
                </>}
            </Box>
          </Box>
          <Box>
            {orderDetailsData.payment_mode !== 'COD' &&
              <Box className={classes.priceDiff}>
                <Typography variant='caption'> <FormattedMessage id='You will receive in your wallet' /> </Typography>
                <Typography variant='body1'><b><FormattedMessage id='₹' /> {formattedAmountTotal(selectedCancelProductSkuList)}</b></Typography>
              </Box>}
            <Box display='flex' padding={2}>
              <Button
                variant='contained'
                color='secondary'
                size='large'
                disabled={cancelProductSkuList.length === 0}
                onClick={() => { openCancelAllDialog(); setActionText('cancelAll') }}
              >
                <FormattedMessage id='Cancel All' />
              </Button>
              <Box width={8} />
              <Button
                variant='contained'
                color='secondary'
                size='large'
                onClick={() => { cancelDialog(); setActionText('cancelItems') }}
                disabled={selectedCancelProductSkuList.length === 0}
              >
                <FormattedMessage id='Cancel Selected' /> {` (${selectedCancelProductSkuList.length})`}
              </Button>
            </Box>
          </Box>
        </>
      </Drawer>
      {/* RETURN */}
      <Drawer anchor='right' open={isReturnDrawerOpen} onClose={onCloseDrawer}>
        <>
          <Box className={classes.drawerContent}>
            <Box display='flex' alignItems='center' paddingBottom={2}>
              <IconButton onClick={onCloseDrawer}>
                <BiArrowBack />
              </IconButton>
              <Box width={20} />
              <Typography variant='h5'><FormattedMessage id='Return Items' /></Typography>
            </Box>
            <Box display='flex' flexDirection='column' flexGrow={1}>
              {returnProductSkuList.map(item => (
                <ReturnProductItem
                  key={item.product_sku_id}
                  data={item}
                  onSelect={onSelectReturnItem}
                  onChangeQuantity={onChangeQuantityReturnItem}
                  isSelected={item.isSelected}
                />
              ))}
              {returnProductSkuList.length === 0 &&
                <>
                  <Typography variant='body2'>
                    <FormattedMessage id='No items to return' />
                  </Typography>
                </>}
            </Box>
          </Box>
          <Box>
            <Box className={classes.priceDiff}>
              <Typography variant='caption'><FormattedMessage id='You will receive in your wallet' /></Typography>
              <Typography variant='body1'><b><FormattedMessage id='₹' /> {formattedAmountTotal(selectedReturnProductSkuList)}</b></Typography>
            </Box>
            <Box display='flex' padding={2}>
              <Button
                variant='contained'
                color='secondary'
                size='large'
                onClick={() => { openReturnAllDialog(); setActionText('returnAll') }}
                disabled={returnProductSkuList.length === 0}
              >
                <FormattedMessage id='Return All' />
              </Button>
              <Box width={8} />
              <Button
                variant='contained'
                color='secondary'
                size='large'
                onClick={() => { returnDialog(); setActionText('returnItems') }}
                disabled={selectedReturnProductSkuList.length === 0}
              >
                <FormattedMessage id='Return Selected' /> {` (${selectedReturnProductSkuList.length})`}
              </Button>
            </Box>
          </Box>
        </>
      </Drawer>
      <ExchangeOrderInteraction
        orderDetailsData={orderDetailsData}
        isActive={isExchangeActive}
        onHide={onCloseDrawer}
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {actionText === 'cancelAll' ? <><FormattedMessage id='Are You Sure You Want To Cancel All Items ?' /></>
              : actionText === 'cancelItems'
                ? <>
                  <FormattedMessage id='Are You Sure You Want To Cancel' />&nbsp;
                  {selectedCancelProductSkuList.length}&nbsp;
                  {selectedCancelProductSkuList.length > 1 ? <FormattedMessage id='Items ?' /> : <FormattedMessage id='Item?' />}
                  </>
                : actionText === 'returnAll' ? <><FormattedMessage id='Are You Sure You Want To Return All Items ?' /></>
                  : actionText === 'returnItems'
                    ? <>
                      <FormattedMessage id='Are You Sure You Want To Return' />&nbsp;
                      {selectedReturnProductSkuList.length}&nbsp;
                      {selectedReturnProductSkuList.length > 1 ? <FormattedMessage id='Items ?' /> : <FormattedMessage id='Item?' />}
                      </>
                    : ''}

          </DialogContentText>
        </DialogContent>
        <Box paddingLeft={2} paddingBottom={2}>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              color='secondary'
              disabled={customerOrderData?.confirmLoading}
            >
              <FormattedMessage id='No' />
            </Button>
            <Button
              onClick={cancel ? submitCancel : returnselected ? submitReturn : null}
              color='primary'
              style={{ marginLeft: '7px' }}
              autoFocus
              disabled={customerOrderData?.confirmLoading}
            >
              {customerOrderData?.confirmLoading ? <CircularProgress /> : <FormattedMessage id='Yes' />}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={customerOrderData?.showSnackbar}
        onClose={customerOrderData?.closeSnackbar}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={customerOrderData?.closeSnackbar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: customerOrderData?.errorColor?.length ? 'red' : '#000'
          }}
          message={<span id='client-snackbar'>{customerOrderData?.snackbarText}</span>}
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={customerOrderData?.closeSnackbar}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>

    </>
  )
}

const styles = (theme) => ({
  actions: {
    '& .MuiDivider-flexItem': {
      margin: theme.spacing(0, 1)
    },
    '& .MuiButton-label': {
      textTransform: 'capitalize'
    }
  },
  drawerContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('md')]: {
      width: '50vw'
    },
    [theme.breakpoints.up('lg')]: {
      width: '45vw'
    }
  },
  exchangeSelectionDrawerContent: {
    [theme.breakpoints.up('md')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('lg')]: {
      width: '66vw'
    }
  },
  drawerFooter: {
    padding: theme.spacing(1, 0)
  },
  priceDiff: {
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2)
  }
})

export default withStyles(styles, { withTheme: true })(OrderInteractions)
