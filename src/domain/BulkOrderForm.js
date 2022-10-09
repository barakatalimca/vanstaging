import React, { useState } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Button,
  Snackbar,
  IconButton,
  SnackbarContent,
  CircularProgress,
  Drawer,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core'
import _ from 'lodash'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Fade from 'react-reveal/Fade'
import { useAllProductsData, useI18n } from '../helpers'
import { VscClose } from 'react-icons/vsc'
import Api from '../Api'
import { NaturePeopleOutlined } from '@material-ui/icons'
import ProductSkuItemBase from './ProductSkuItemBase'
import ProductDetailsContent from './ProductDetailsContent'
import { BiArrowBack } from 'react-icons/bi'
import ProductDetailSlider from './ProductDetailSlider'
import { FormattedMessage } from 'gatsby-plugin-intl'

const BulkOrderForm = ({ classes, myProfile }) => {
  const allProducts = useAllProductsData()
  const i18n = useI18n()
  const [loading, setLoading] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [data, setData] = React.useState(null)
  const [selectedProductSku, setSelectedProductSku] = React.useState(null)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [selected, setSelected] = useState(null)
  const [color, setColor] = useState(null)
  const [size, setSize] = useState(null)
  const [colorVariants, setColorVariants] = useState([])
  const [sizeVariants, setSizeVariants] = useState([])
  const { register, handleSubmit, watch, errors, reset } = useForm()

  const productSelected = (value) => {
    setSelected(value)
    // setTimeout(() => {
    // setOpenDrawer(true)
    // }, 100)
    console.log('value', openDrawer)
  }

  // const colorSelected = (value) => {
  //   setColor(value)
  // }
  // const sizeSelected = (value) => {
  //   setSize(value)
  // }

  const onSubmit = (data) => {
    setLoading(true)

    // data.varient = 'Color- ' + color?.display_value + ', Size- ' + size?.display_value
    data.varient = selectedProductSku.attributes
    data.product_id = selected.id
    // console.log('data', data)
    Api.submitBulkOrderForm(data)
      .then((response) => {
        if (response.ok) {
          setLoading(false)
          setShowSnackbar(true)
          setSnackbarText(response.data.message)
          // if (response.data.result === 1) {
          // }
          reset()
          setColor(null)
          setSize(null)
          setSelected(null)
          setColorVariants(null)
          setSizeVariants(null)
        } else {
          setLoading(false)
          setShowSnackbar(true)
          setSnackbarText('Some error occured!')
        }
      })
      .catch((error) => {
        console.log('error', error)
        setLoading(false)
        setShowSnackbar(true)
        setSnackbarText('Some error occured')
      })
  }

  const productData = allProducts?.data?.map((l) => l.product_data)
  const result = productData?.map((l) => l?.map(p => ({ name: p.product_name, id: Number(p.product_id), is_bundle: p.is_bundle })))
  const products = result?.flat(Infinity)
  const _productData = productData?.flat(Infinity)
  const allDataList = _productData?.filter(item => item.is_bundle === 'No')
  const _products = products?.filter(item => item.is_bundle === 'No')

  React.useEffect(() => {
    const _productVariants = allDataList?.find((p) => Number(p.product_id) === selected?.id && p.product_sku_data)
    setData(_productVariants)
    const _attributes = _productVariants?.product_sku_data.map((l) => l.attributes)
    const attributes = _attributes?.flat(Infinity)
    const _color = attributes?.filter((c) => c.attribute === 'color')
    const color = _.uniqBy(_color, 'display_value')
    const _size = attributes?.filter((c) => c.attribute.includes('Size'))
    setColorVariants(color)
    setSizeVariants(_size)
  }, [selected, data])

  return (
    <>
      <Box
        className='' paddingBottom={10}
        flexDirection='column'
      >

        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
          <Box
            display='flex'
            flexDirection='column'
            marginTop={1}
          >
            <Box paddingTop={1} paddingBottom={1}>
              <TextField
                name='name'
                label={i18n.locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                variant='outlined'
                fullWidth
                required
                inputRef={register({ required: true })}
              />
            </Box>

            <Box paddingTop={1} paddingBottom={1}>
              <TextField
                name='email'
                label={i18n.locale === 'ar' ? 'البريد الالكتروني' : 'Email'}
                variant='outlined'
                fullWidth
                required
                inputRef={register({ required: true })}
              />
            </Box>
            <Box paddingTop={1} paddingBottom={1}>
              <Autocomplete
                options={_products}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => { productSelected(value); setOpenDrawer(true) }}
                required
                PopperComponent='bottom-start'
                value={selected || ''}
                menuProps={{ maxHeight: 100 }}
                renderInput={(params) => <TextField
                  {...params} name='product'
                  inputRef={register({ required: true })}
                  label={i18n.locale === 'ar' ? 'اختيار المنتج' : 'Select Product'}
                  value={selected || ''}
                  fullWidth
                  variant='outlined'
                                         />}
              />
              {/* <FormControl className={classes.formControl} style={{ width: '100%' }}>
                <InputLabel id='demo-simple-select-label'><FormattedMessage id='Select Product' /></InputLabel>
                <Select
                  // variant='outlined'
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  native
                  value={selected}
                  fullWidth
                  onChange={(e) => productSelected(e.target.value)}
                >
                  <option aria-label='Select' value='' />
                  {_products.map((item, i) => (
                    <option key={i} value={item.id}>{item.name}</option>
                  ))}
                </Select>
              </FormControl> */}
            </Box>

            {data &&
              <>
                <Box display='flex' justifyContent='space-between' paddingY={2}>
                  {selectedProductSku && <ProductSkuItemBase data={selectedProductSku} size='small' showPrice={false} showQuantity={false} justify='center' />}
                  <Button
                    variant='text'
                    color='primary'
                    size='small'
                    onClick={() => setOpenDrawer(true)}
                  >
                    <FormattedMessage id='Change' />
                  </Button>
                </Box>
                <Drawer
                  anchor='left'
                  open={openDrawer}
                  onClose={() => setOpenDrawer(false)}
                >
                  <>
                    <Box className={classes.drawerContent}>
                      <Box display='flex' alignItems='center' paddingBottom={2}>
                        <IconButton onClick={() => setOpenDrawer(false)}>
                          <BiArrowBack />
                        </IconButton>
                        <Box width={20} />
                        <Typography variant='h5'><FormattedMessage id='Select Variant' /></Typography>
                      </Box>
                      <Box display='flex' flexDirection='column'>
                        <Box marginBottom={4}>
                          <ProductDetailsContent
                            data={data}
                            showShare={false}
                            onChangeAttributes={setSelectedProductSku}
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
                        onClick={() => setOpenDrawer(false)}
                      >
                        <FormattedMessage id='Select Variant' />
                      </Button>
                    </Box>
                  </>
                </Drawer>
              </>}

            {/* {selected && <Fade>
              <Box paddingTop={1} paddingBottom={1} style={{ position: 'relative' }}>
                <Grid container spacing={2}>
                  <Grid item md={6} lg={6} sm={12} xs={12}>
                    <Autocomplete
                      options={colorVariants}
                      getOptionLabel={(option) => option.display_value}
                      onChange={(event, value) => colorSelected(value)}
                      required
                      renderInput={(params) => <TextField
                        {...params} name='Color'
                        inputRef={register({ required: true })}
                        label='Select Product Color'
                        fullWidth
                        variant='outlined'
                      />}
                    />
                  </Grid>
                  <Grid item md={6} lg={6} sm={12} xs={12}>
                    <Autocomplete
                      options={sizeVariants}
                      getOptionLabel={(option) => option.display_value}
                      onChange={(event, value) => sizeSelected(value)}
                      required
                      renderInput={(params) => <TextField
                        {...params} name='Size'
                        ref={register({ required: true })}
                        label='Select Product Size'
                        fullWidth
                        variant='outlined'
                      />}
                    />
                  </Grid>
                </Grid>

              </Box>
            </Fade>} */}
            <Box paddingTop={1} paddingBottom={1}>
              <TextField
                name='quantity'
                inputRef={register({ required: true })}
                label={i18n.locale === 'ar' ? 'العدد' : 'Enter Quantity'}
                fullWidth
                variant='outlined'
                required
              />
            </Box>
            <Box paddingTop={1} paddingBottom={1}>
              <TextField
                name='message'
                inputRef={register({ required: true })}
                label={i18n.locale === 'ar' ? 'اترك ملاحظتك' : 'Write Your Message'}
                fullWidth
                variant='outlined'
                multiline
                rows={8}
                rowsMax={8}
                required
              />
            </Box>
            {errors.email && <span><FormattedMessage id='This field is required' /> </span>}
            {errors.password && <span><FormattedMessage id='This field is required' /></span>}
            <Box paddingTop={1} paddingBottom={1}>
              <Button
                type='submit'
                variant='contained'
                color='secondary'
                disabled={loading}
                size='large'
                style={{ padding: '13.5px 14px', width: '100%' }}
              >
                {loading ? <CircularProgress /> : (<>{i18n.locale === 'ar' ? 'ارسال' : 'Submit'}</>)}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        style={{ bottom: '60px' }}
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        autoHideDuration={4000}
        action={
          <>
            <IconButton size='large' aria-label='close' color='inherit' onClick={() => setShowSnackbar(false)}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: '#000',
            zIndex: '99999'
          }}
          message={<span id='client-snackbar'>{snackbarText}</span>}
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={() => setShowSnackbar(false)}>
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
  }
})
export default withStyles(styles, { withTheme: true })(BulkOrderForm)
