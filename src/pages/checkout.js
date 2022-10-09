import React, { useEffect, useState } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Breadcrumbs,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Hidden,
  Snackbar,
  SnackbarContent,
  IconButton,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import Fade from 'react-reveal/Fade'
import { queryCache } from 'react-query'
import Page from '../components/Page'
import Seo from '../components/common/Seo'
import { Link, navigate } from '../components/common/Router'
import { CheckoutStepperIcon, CheckoutStepPayment, CheckoutStepShipping, CheckoutStepperConnector } from '../domain'
import { useCart, useCheckout, useI18n, usePayment, useWallet, useWindowSize } from '../helpers/'
import { useAuth } from '../helpers/useAuth'
import OrderSummary from '../domain/OrderSummary'
import Api, { checkout } from '../Api'
import { VscClose } from 'react-icons/vsc'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { ADDRESS_LIST_DATA, CART_LIST_DATA } from '../Constants'
import CheckoutStepReview from '../domain/CheckoutStepReview'
import { theme } from '../providers/ThemeProvider'
import { FaLeaf } from 'react-icons/fa'

const steps = ['Shipping', 'Payment', 'Review']

const Checkout = ({ classes, props }) => {
  // steppers start
  const auth = useAuth()
  const checkout = useCheckout()
  const payment = usePayment()
  const cart = useCart()
  const i18n = useI18n()
  const wallet = useWallet()
  const { width } = useWindowSize()
  const isBrowser = typeof window !== 'undefined'

  const [activeStep, setActiveStep] = useState(0)
  const [visitedSteps, setVisitedSteps] = useState([])
  const [isDialogCheckoutWarningOpen, setIsDialogCheckoutWarningOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [checkoutWarningMessage, setCheckoutWarningMessage] = useState('')

  const stepperOrientationBreakpoint = theme.breakpoints.values.md

  const onClickStepLabel = (step) => {
    if (visitedSteps.length !== steps.length) {
      return
    }
    setActiveStep(step)
  }
  const handleNext = () => {
    console.log('auth?.user', auth?.user)
    if (isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (activeStep === 0) {
      setLoading(true)
      setErrorMessage(null)
      const _email = checkout?.checkoutData.shipToFormData.email
      const validEmail = (_email.includes('@') && _email.includes('.')) || _email === ''
      if (validEmail) {
        const payload = checkout?.checkoutData.shipToFormData
        payload.action = 'update'
        payload.ibn_no = auth?.user?.ibn_no
        payload.mobile_no = payload.mobile
        Api.manageProfile(payload)
          .then((response) => {
            if (response.ok) {
              if (response.data.result === 1) {
                setLoading(false)
                // auth.writeToStorage(payload)
                auth.setUser({ ...payload, isLoggedIn: true })
                // navigate('/user/my-profile')
                setActiveStep((prevActiveStep) => prevActiveStep + 1)
              } else {
                // setInvalid(true)
                setLoading(false)
                setErrorMessage(response.data.message)
              }
            }
          })
      } else {
        setErrorMessage('Invalid Email!')
        setLoading(false)
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleJumpToStep = (step, anchorLink) => {
    setActiveStep(step)
    setTimeout(() => {
      const element = document.getElementById(anchorLink)
      window.scrollTo({
        behavior: element ? 'smooth' : 'auto',
        top: element ? element.offsetTop : 0
      })
    }, 200)
  }

  const onChangeCheckoutData = (partialCheckoutData) => {
    checkout.setCheckoutData(state => {
      return {
        ...state,
        ...partialCheckoutData
      }
    })
  }

  const onCheckout = () => {
    // navigate('/payment/', { state: { checkoutData } })
    // payment.initiatePayment(checkoutData)

    payment.initiatePayment(checkout?.checkoutData)
      .then(response => {
        if (response.ok) {
          const { result, message } = response.data

          if (result === 0) {
            onOpenDialogCheckoutWarning()
            setCheckoutWarningMessage(message)
          }
        } else {
          onOpenDialogCheckoutWarning()
          setCheckoutWarningMessage(response.status)
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  const onOpenDialogCheckoutWarning = () => {
    setIsDialogCheckoutWarningOpen(true)
  }

  const onCloseDialogCheckoutWarning = () => {
    setIsDialogCheckoutWarningOpen(false)
    setCheckoutWarningMessage('')
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <CheckoutStepShipping errorMessage={errorMessage} checkoutData={checkout?.checkoutData} onChange={onChangeCheckoutData} />
      case 1:
        return <CheckoutStepPayment checkoutData={checkout?.checkoutData} onChange={onChangeCheckoutData} />
      case 2:
        return <CheckoutStepReview checkoutData={checkout?.checkoutData} onSubmit={onCheckout} onClickChange={handleJumpToStep} />
      default:
        return 'Unknown step'
    }
  }

  const getTitleTextAlignment = () => {
    if (width < theme.breakpoints.values.md) return 'center'

    return i18n.locale === 'ar' ? 'right' : 'left'
  }

  const renderStepperNavigation = () => {
    return (
      <div className={classes.stepperNavigationContainer}>
        <Container>
          {activeStep === 0 && (
            <Button
              disabled
              onClick={handleBack}
              variant='contained'
              style={{ boxShadow: 'none', background: '#e0e0e0 !important' }}
              className={classes.stepperNavigationButton}
            >
              <FormattedMessage id='Back' />
            </Button>
          )}
          {!auth?.checkoutSuccess && activeStep !== 0 && (
            <Button
              onClick={handleBack}
              variant='contained'
              style={{ boxShadow: 'none', background: '#e0e0e0 !important' }}
              className={classes.stepperNavigationButton}
            >
              <FormattedMessage id='Back' />
            </Button>)}
          {activeStep === 0 &&
            <Button
              variant='contained'
              color='primary'
              disabled={!(checkout?.checkoutData.shippingAddressId &&
                checkout?.checkoutData.shippingMethodId &&
                checkout?.checkoutData.shipToFormData.name !== ''
                // && checkout?.checkoutData.shipToFormData.email !== ''
              ) || loading}
              onClick={handleNext}
              className={classes.stepperNavigationButton}
            >
              {/* {activeStep === steps.length - 1 ? 'Finish' : <FormattedMessage id='Next' />} */}
              {!loading && <>{activeStep === steps.length - 1 ? <FormattedMessage id='Next' /> : <FormattedMessage id='Next' />}</>}
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>}
          {activeStep === 1 &&
            <Button
              variant='contained'
              color='primary'
              disabled={!(checkout?.checkoutData.paymentMethodId &&
                checkout?.checkoutData.billingAddressId
              )}
              onClick={handleNext}
              className={classes.stepperNavigationButton}
            >
              {activeStep === steps.length - 1 ? 'Finish' : <FormattedMessage id='Next' />}
            </Button>}
          {activeStep === 2 &&
            <Button
              variant='contained'
              color='primary'
              disabled={payment.isLoading}
              onClick={onCheckout}
              className={classes.stepperNavigationButton}
            >
              {!payment.isLoading && <>{activeStep === steps.length - 1 ? <FormattedMessage id='Checkout' /> : <FormattedMessage id='Next' />}</>}
              {payment.isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>}
        </Container>
      </div>
    )
  }

  const renderStepperHeader = () => {
    return (
      <Grid container spacing={6} style={{ direction: 'ltr' }}>
        <Grid item xs={12} lg={activeStep === 2 ? 8 : 12}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<CheckoutStepperConnector />}
          >
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <CheckoutStepperIcon
                        icon={index + 1}
                        active={index === activeStep}
                        completed={visitedSteps.includes(index)}
                      />
                    )}
                    onClick={() => onClickStepLabel(index)}
                  >
                    {i18n.locale === 'ar' ? <>
                      {label === 'Shipping'
                        ? 'الشحن'
                        : label === 'Payment' ? 'دفع'
                          : label === 'Review' ? 'مراجعة' : ''}
                    </> : <>{label}</>}

                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </Grid>
      </Grid>
    )
  }

  const renderStepperContent = () => {
    return (
      <Box paddingTop={4} paddingBottom={8}>
        {getStepContent(activeStep)}
        {renderStepperNavigation()}
      </Box>
    )
  }

  const renderSmallScreenStepper = () => {
    if (width > stepperOrientationBreakpoint) {
      return <></>
    }

    return (
      <Stepper
        nonLinear={visitedSteps.length === steps.length}
        activeStep={activeStep}
        orientation='vertical'
      >
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel
                StepIconComponent={() => (
                  <CheckoutStepperIcon
                    active={index === activeStep}
                    completed={visitedSteps.includes(index)}
                  />
                )}
                onClick={() => onClickStepLabel(index)}
              >
                {label}
              </StepLabel>
              <StepContent>
                <Box paddingBottom={8}>
                  {renderStepperContent(activeStep)}
                  {renderStepperNavigation()}
                </Box>
              </StepContent>
            </Step>
          )
        })}
      </Stepper>
    )
  }

  const renderStepper = () => {
    // if (width <= stepperOrientationBreakpoint) {
    //   return renderSmallScreenStepper()
    // }
    return (
      <>
        {renderStepperHeader()}
        {renderStepperContent()}
      </>
    )
  }

  useEffect(() => {
    queryCache.invalidateQueries(ADDRESS_LIST_DATA)
    queryCache.invalidateQueries(CART_LIST_DATA)

    const buyNow = JSON.parse(window.localStorage.getItem('buyNow')) || null
    const cart = JSON.parse(window.localStorage.getItem('react-use-cart'))

    setTimeout(() => {
      if (cart.items.length > 0 || buyNow !== null) {

      } else {
        navigate('/cart')
      }
    }, 1000)
  }, [])

  useEffect(() => {
    setVisitedSteps(steps => steps.includes(activeStep) ? steps : [...steps, activeStep])
  }, [activeStep])

  return (
    <Page hideFooter hideBottomNav className={classes.page}>
      <Fade>
        <Seo title='Checkout' />
        <Container className={classes.container}>
          <Box paddingBottom={14} paddingTop={14}>
            <Grid container spacing={6}>
              <Grid item xs={12} lg={activeStep === 2 ? 12 : 8}>
                <Typography
                  variant='h3'
                  gutterBottom
                  align={getTitleTextAlignment()}
                >
                  <FormattedMessage id='Checkout' />
                </Typography>
                <Box className={classes.stepperContainer}>
                  {renderStepper()}
                </Box>
              </Grid>
              <Hidden mdDown>
                {activeStep !== 2 && (
                  <Grid item xs={12} lg={4}>
                    <Box paddingTop={10}>
                      <OrderSummary
                        checkoutData={checkout?.checkoutData}
                        isCheckoutButtonHidden
                      />
                    </Box>
                  </Grid>
                )}
              </Hidden>
            </Grid>
          </Box>
        </Container>
      </Fade>
      <Backdrop className={classes.backdrop} open={cart?.status === 'loading'}>
        <CircularProgress color='primary' />
      </Backdrop>
      <Dialog
        open={isDialogCheckoutWarningOpen}
        onClose={onCloseDialogCheckoutWarning}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <FormattedMessage id='Unable to Checkout' />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {checkoutWarningMessage}
          </DialogContentText>
        </DialogContent>
        <Box paddingLeft={2} paddingBottom={2}>
          <DialogActions>
            <Button
              onClick={onCloseDialogCheckoutWarning}
              color='secondary'
            >
              <FormattedMessage id='OK' />
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={payment.isSnackbarVisible}
        onClose={payment.onCloseSnackbar}
        // autoHideDuration={4000}
        action={
          <>
            <IconButton aria-label='close' color='inherit' onClick={payment.onCloseSnackbar}>
              <VscClose fontSize='large' />
            </IconButton>
          </>
        }
      >
        <SnackbarContent
          style={{
            backgroundColor: '#000'
          }}
          message={
            <span id='client-snackbar'>
              {payment.snackbarText ? <>{payment.snackbarText}</> : 'An error occured'}
            </span>
          }
          action={
            <>
              <IconButton size='large' aria-label='close' color='inherit' onClick={payment.onCloseSnackbar}>
                <VscClose fontSize='large' />
              </IconButton>
            </>
          }
        />
      </Snackbar>
    </Page>
  )
}
const styles = (theme) => ({
  page: {
    paddingBottom: theme.spacing(6)
  },
  container: {
    [theme.breakpoints.down('md')]: {
      padding: 0
    }
  },
  stepperContainer: {
    borderBottom: `2px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
    // maxWidth: `${steps.length * 200}px`,
    [theme.breakpoints.up('lg')]: {
      // marginLeft: -theme.spacing(6)
    },
    '& .MuiStepper-root': {
      backgroundColor: 'transparent'
    },
    '& .MuiStepContent-root': {
      // marginLeft: '25px'
    }
  },
  stepsTitle: {
    display: 'flex',
    alignItems: 'center',
    '& i': {
      fontStyle: 'normal',
      fontSize: '13px',
      border: '1px solid #000',
      height: '24px',
      width: '24px',
      lineHeight: '24px',
      textAlign: 'center',
      borderRadius: '50%',
      marginRight: '7px'
    }
  },
  paymentMethodForm: {
    '& div input': {
      width: '100%'
    },
    '& div': {
      width: '100%'
    }
  },
  stepperNavigationContainer: {
    // backgroundColor: theme.palette.grey[300],
    display: 'flex',
    alignItems: 'center',
    height: 60,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    [theme.breakpoints.up('lg')]: {
      height: 80,
      position: 'sticky'
    },
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
      bottom: 0
    },
    '& > .MuiContainer-root': {
      display: 'flex',
      padding: 0
    },
    '& .MuiButton-root.Mui-disabled': {
      backgroundColor: '#e0e0e0 !important'
    }
  },
  stepperNavigationButton: {
    borderRadius: 0,
    height: 60,
    minWidth: 200,
    [theme.breakpoints.up('lg')]: {
      height: 80
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '50vw'
    }
  },
  orderSummaryContainer: {
    // backgroundColor: theme.palette.grey[100],
    // borderRadius: 10,
    // padding: theme.spacing(2)
  },
  backdrop: {
    zIndex: 999,
    background: '#fff'
  }
})
export default withStyles(styles, { withTheme: true })(Checkout)
