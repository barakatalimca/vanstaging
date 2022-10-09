import React from 'react'
import {
  withStyles,
  Box,
  Typography,
  FormControl,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  IconButton,
  Card,
  SnackbarContent,
  Drawer
} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { RiPencilFill } from 'react-icons/ri'
import CloseIcon from '@material-ui/icons/Close'
import { VscClose } from 'react-icons/vsc'
import { IoMdTrash } from 'react-icons/io'

import AddressListItem from './AddressListItem'
import AdressForm from '../components/AdressForm'
import { useAuth } from '../helpers/useAuth'
import { useAddress } from '../helpers/useAddressData'

const SelectAdress = ({ data, classes, myProfile, match, onChange = () => { } }) => {
  const auth = useAuth()
  const addresses = useAddress()
  const [selectedShippingAdress, setSelectedShippingAdress] = React.useState(null)
  const [addressListState, setAddressListState] = React.useState([])
  const [loadingState, setLoadingState] = React.useState(true)
  const [openModal, setOpenModal] = React.useState(false)
  const [openForm, setOpenFrom] = React.useState(false)
  const [editItem, setEditItem] = React.useState('')
  const [deleteItem, setDeleteItem] = React.useState('')
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [addNewDrawer, setAddNewDrawerOpen] = React.useState(false)
  const [addBillingDrawer, setAddBillingDrawer] = React.useState(false)
  const deleteModal = (id) => {
    setOpenModal(true)
    setDeleteItem(id)
  }
  const cancel = () => {
    setOpenModal(false)
  }

  React.useEffect(() => {
    setAddressListState(addresses.addressList)
  }, [addresses.addressList])

  React.useEffect(() => {
    setIsDrawerOpen(false)
    setAddNewDrawerOpen(false)
    setAddBillingDrawer(false)
  }, [addresses.reload])

  const shippingAddressList = addressListState?.filter((l) => (l.address_type === 'Shipping')) || []
  const billingAddressList = addressListState?.filter((l) => (l.address_type === 'Billing')) || []

  const handleChangeShippingAddress = (event) => {
    setSelectedShippingAdress(event.target.value)
    const shippingAddress = shippingAddressList.filter((l) => (l.address_id === event.target.value))
    onChange({ type: 'shipping', addressId: event.target.value, shippingAddressText: shippingAddress })
  }

  const [open, setOpen] = React.useState(false)
  const [snackbar, setSnackBar] = React.useState(false)
  const closeSnackBar = () => {
    setSnackBar(false)
  }

  const openEditForm = (item) => {
    setOpenFrom(true)
    setIsDrawerOpen(true)
    setEditItem(item)
  }

  const handleClose = () => {
    setOpen(false)
  }
  // const handleDeleteItem = () => {

  // }

  const handleDeleteItem = async () => {
    const payload = {
      action: 'delete',
      address_id: deleteItem
    }
    addresses.deleteAddress(payload)
    // const response = await Api.manageAddress(payload)
    // if (response.ok) {
    //   setSnackBar(true)
    //   queryCache.invalidateQueries(ADDRESS_LIST_DATA)
    //   const newList = addressListState.filter((item) => item.address_id !== id)
    //   setAddressListState(newList)
    // }
  }
  React.useEffect(() => {
    setOpenModal(false)
  }, [addresses.reload])

  return (
    <Box padding={2}>
      <Grid container spacing={8}>
        <Grid item xs={12} lg={9}>
          {match === 'billing' ? <>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant={match === 'billing' ? 'h3' : 'body1'} color={match === 'billing' ? 'secondary' : 'textSecondary'} gutterBottom><FormattedMessage id='Billing Address' /></Typography>
              {!billingAddressList.length > 0 && <><Button onClick={() => setAddBillingDrawer(true)}><FormattedMessage id='Add new' /></Button></>}
            </Box>
            {billingAddressList.length === 0 && (
              <Typography variant='subtitle1' color='textSecondary'><FormattedMessage id='Please add a billing address' /></Typography>
            )}
            {billingAddressList.length > 0 && (
              <FormControl component='fieldset' style={{ width: '100%' }}>
                {billingAddressList.map((l, i) => (
                  <>
                    <Card variant='outlined' style={{ marginBottom: '16px' }}>
                      <Box paddingY={1} display='flex' justifyContent='space-between' alignItems='flex-start' padding={2}>
                        <Box>
                          <AddressListItem address={l} />
                        </Box>
                        {myProfile && <>
                          <Box>
                            <IconButton size='small' onClick={() => openEditForm(l)}>
                              <RiPencilFill style={{ fontSize: '15px', color: '#000' }} />
                            </IconButton>
                          </Box>
                        </>}
                      </Box>
                    </Card>
                  </>
                ))}
              </FormControl>
            )}
          </>
            : <>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant={match === 'shipping' ? 'h3' : 'body1'} color={match === 'shipping' ? 'secondary' : 'textSecondary'} gutterBottom><FormattedMessage id='Shipping Addresses' /></Typography>
                <Button onClick={() => setAddNewDrawerOpen(true)}><FormattedMessage id='Add new' /></Button>
              </Box>
              {shippingAddressList.length === 0 && (
                <Typography variant='subtitle1' color='textSecondary'><FormattedMessage id='Please add a shipping address' /></Typography>
              )}
              {shippingAddressList.length > 0 && (
                <FormControl component='fieldset' style={{ width: '100%' }}>
                  <RadioGroup aria-label='shipping' name='shipping1' value={selectedShippingAdress} onChange={handleChangeShippingAddress} className={classes.addressList}>
                    {shippingAddressList.map((l, i) => (
                      <>
                        {myProfile
                          ? (
                            <Card variant='outlined' style={{ marginBottom: '16px' }}>
                              <Box paddingY={1} display='flex' justifyContent='space-between' padding={2}>
                                <Box display='block'>
                                  <AddressListItem address={l} />
                                </Box>
                                <Box>
                                  <IconButton size='small' onClick={() => openEditForm(l)}>
                                    {/* <IconButton size='small' onClick={() => setIsDrawerOpen(l)}> */}
                                    <RiPencilFill />
                                  </IconButton>
                                  <IconButton size='small' onClick={() => deleteModal(l.address_id)}>
                                    <IoMdTrash />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Card>
                          )
                          : (
                            <FormControlLabel
                              value={l.address_id} control={<Radio />} label={
                                <Box paddingY={1}>
                                  <AddressListItem address={l} />
                                </Box>
                              }
                            />
                          )}
                      </>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            </>}
        </Grid>
        <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <Box maxWidth={640} padding={4}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='body1' gutterBottom><FormattedMessage id='Edit Address' /></Typography>
              <IconButton onClick={() => setIsDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <AdressForm billingAddressCount={billingAddressList} editItem={editItem} myProfile={myProfile} />
          </Box>
        </Drawer>
        <Drawer anchor='right' open={addNewDrawer} onClose={() => setAddNewDrawerOpen(false)}>
          <Box maxWidth={640} padding={4}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='body1' gutterBottom><FormattedMessage id='Add New Shipping Address' /></Typography>
              <IconButton onClick={() => setAddNewDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <AdressForm billingAddressCount={billingAddressList} myProfile={myProfile} />
          </Box>
        </Drawer>
        <Drawer anchor='right' open={addBillingDrawer} onClose={() => setAddBillingDrawer(false)}>
          <Box maxWidth={640} padding={4}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='body1' gutterBottom><FormattedMessage id='Add New Billing Address' /></Typography>
              <IconButton onClick={() => setAddBillingDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <AdressForm billingAddressCount={billingAddressList} myProfile={myProfile} addressType='Billing' />
          </Box>
        </Drawer>
        {/* {match === 'shipping' || !openForm ? <>
					<Grid item xs={12} lg={6}>
						<Typography variant='body1' gutterBottom>Add New Shipping Address</Typography>
						<AdressForm billingAddressCount={billingAddressList} myProfile={myProfile} />
					</Grid>
				</> : <></>} */}
        {/* {openForm ? <>
          <Grid item xs={12} lg={6}>
            <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              <Box maxWidth={640} padding={4}>
                <Typography variant='body1' gutterBottom>Edit Address</Typography>
                <AdressForm billingAddressCount={billingAddressList} editItem={editItem} myProfile={myProfile} />
              </Box>
            </Drawer>

          </Grid>
        </> :
          <>
            {match === 'shipping' && <>
              <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box maxWidth={640} padding={4}>
                  <Typography variant='body1' gutterBottom>Add New Shipping Address</Typography>
                  <AdressForm billingAddressCount={billingAddressList} myProfile={myProfile} />
                </Box>
              </Drawer>
            </>}
          </>} */}

      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbar}
        onClose={closeSnackBar}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={closeSnackBar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: '#000'
          }}
          message={<span id='client-snackbar'><FormattedMessage id='Address Deleted!' /></span>}
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={closeSnackBar}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>
      <Dialog
        open={openModal}
        onClose={cancel}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <FormattedMessage id='Are You Sure You Want To Remove This ?' />
          </DialogContentText>
        </DialogContent>
        <Box paddingLeft={2} paddingBottom={2}>
          <DialogActions>
            <Button
              onClick={cancel}
              color='secondary'
            >
              <FormattedMessage id='No' />
            </Button>
            <Button
              onClick={handleDeleteItem}
              color='primary'
              style={{ marginLeft: '7px' }}
              autoFocus
            >
              <FormattedMessage id='Yes' />
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

const styles = (theme) => ({
  addressList: {
    '& .MuiFormControlLabel-root': {
      alignItems: 'end'
    }
  }
})

export default withStyles(styles, { withTheme: true })(SelectAdress)
