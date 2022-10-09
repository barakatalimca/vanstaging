import React, { useEffect, useState } from 'react'
import {
  withStyles, AppBar, Toolbar, Box, Snackbar, IconButton, Menu, MenuItem, Hidden, Container, Grid, Badge
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { RiHeart3Line, RiUser3Line, RiSearchLine, RiShoppingBag3Line } from 'react-icons/ri'
import { MdLanguage } from 'react-icons/md'
import { HiCheckCircle } from 'react-icons/hi'
import { Link } from './common'
import HeaderNavigation from './HeaderNavigation'
import BottomNav from '../domain/BottomNav'
import { useAuth } from '../helpers/useAuth'
import { changeLocale, useAllProductsData, useCart, useCheckout, useI18n, useTranslation } from '../helpers'
import { useIntl, FormattedMessage } from 'gatsby-plugin-intl'

import Logo from '../domain/Logo'
import MegaSearch from '../domain/MegaSearch'
import Api from '../Api'
import { useQueryCache } from 'react-query'
import { CMS_DATA, PRODUCT_LIST_DATA } from '../Constants'
export const HEADER_HEIGHT = '7rem'
export const HEADER_ICON_SIZE = 20

const Header = ({ classes, url }) => {
  const isBrowser = typeof window !== 'undefined'
  const cart = useCart()
  const auth = useAuth()
  const i18n = useI18n()
  const queryCache = useQueryCache()
  const checkout = useCheckout()

  const [scroll, setScroll] = useState(false)
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null)
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const languageMenuId = 'header-language-menu'
  const profileMenuId = 'header-profile-menu'

  const isLanguageMenuOpen = Boolean(languageMenuAnchorEl)
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl)

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchorEl(event.currentTarget)
  }

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null)
  }

  const handleLanguageChange = (toLocale) => {
    changeLocale(toLocale)
    if (isBrowser) {
      window.localStorage.setItem('languageChanged', true)
    }
    handleLanguageMenuClose()
  }
  useEffect(() => {
    if (isBrowser) {
      const isLanguageChanged = window.localStorage.getItem('languageChanged')
      if (!isLanguageChanged) {
        changeLocale('ar')
        Api.setHeaders({ Lang: 'ar' })
      }
    }
  }, [])

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null)
  }

  const handleSearchOpen = () => {
    setIsSearchOpen(true)
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
  }

  const handleLogout = () => {
    auth.signout()
    handleProfileMenuClose()
    cart.emptyCart()
    checkout.removeCheckoutData()
  }

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const renderLanguageMenu = () => {
    return (
      <Menu
        anchorEl={languageMenuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={languageMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isLanguageMenuOpen}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem onClick={() => handleLanguageChange('ar')}>عربى</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
      </Menu>
    )
  }

  const renderProfileMenu = () => {
    return (
      <Menu
        anchorEl={profileMenuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={profileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
      >
        <MenuItem><Link to='/user/my-profile' onClick={handleProfileMenuClose}> <FormattedMessage id='myProfile' /> </Link></MenuItem>
        <MenuItem><Link to='/user/my-orders' onClick={handleProfileMenuClose}><FormattedMessage id='myOrders' /></Link></MenuItem>
        <MenuItem onClick={handleLogout}><a><FormattedMessage id='Logout' /></a></MenuItem>
      </Menu>
    )
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 100)
    })
  }, [])

  useEffect(() => {
    if (isBrowser) {
      const isLanguageChanged = window.localStorage.getItem('languageChanged')
      if (isLanguageChanged) {
        Api.setHeaders({ Lang: i18n.locale })
        queryCache.invalidateQueries(CMS_DATA)
        queryCache.invalidateQueries(PRODUCT_LIST_DATA)
      }
    }
  }, [i18n.locale])

  return (
    <>
      <AppBar
        position='fixed'
        elevation={0}
        color='inherit'
        style={{ direction: i18n.locale === 'ar' ? 'rtl' : 'ltr' }}
        className={classes.root && (scroll || url !== '/' ? 'bg-white' : 'bg-transparent')}
      >
        {isSearchOpen && (
          <Container className={classes.searchContainer}>
            <MegaSearch onClose={handleSearchClose} />
          </Container>
        )}
        <Container>
          <Toolbar className={classes.toolbar}>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs>
                <Logo scroll={scroll} />
              </Grid>
              <Grid item xs>
                <Hidden mdDown>
                  <HeaderNavigation />
                </Hidden>
              </Grid>
              <Grid item xs>
                <Hidden mdDown>
                  <Box className={classes.headerActions}>
                    <IconButton
                      aria-label='current language'
                      aria-controls={languageMenuId}
                      aria-haspopup='true'
                      onClick={handleLanguageMenuOpen}
                      color='inherit'
                    >
                      <MdLanguage size={HEADER_ICON_SIZE} />
                    </IconButton>
                    <IconButton
                      aria-label='search'
                      onClick={handleSearchOpen}
                      color='inherit'
                    >
                      <RiSearchLine size={HEADER_ICON_SIZE} />
                    </IconButton>
                    <Link to='/cart'>
                      <IconButton
                        // aria-label='search'
                        // onClick={handleSearchOpen}
                        color='inherit'
                      >
                        {!cart?.isEmpty
                          ? (
                            <Badge badgeContent={cart?.totalItems} color='primary'>
                              <RiShoppingBag3Line size={HEADER_ICON_SIZE} />
                            </Badge>
                          )
                          : <RiShoppingBag3Line size={HEADER_ICON_SIZE} />}
                      </IconButton>
                    </Link>
                    <Link to='/wishlist'>
                      <IconButton
                        aria-label='wishlist'
                        color='inherit'
                      >
                        <RiHeart3Line size={HEADER_ICON_SIZE} />
                      </IconButton>
                    </Link>
                    {auth?.user?.isLoggedIn
                      ? (
                        <>
                          <span style={{ position: 'relative' }}>
                            <IconButton
                              aria-label='profile menu'
                              aria-controls={profileMenuId}
                              aria-haspopup='true'
                              onClick={handleProfileMenuOpen}
                              color='inherit'
                            >
                              <RiUser3Line size={HEADER_ICON_SIZE} />
                            </IconButton>
                            <HiCheckCircle size={20} className={classes.attributeSelectionIndicator} />
                          </span>
                        </>
                      )
                      : (
                        <Link to='/sign-in'>
                          <IconButton
                            aria-label={<FormattedMessage id='Discounts' />}
                            color='inherit'
                          >
                            <RiUser3Line size={HEADER_ICON_SIZE} />
                          </IconButton>
                        </Link>
                      )}
                  </Box>
                </Hidden>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      {renderLanguageMenu()}
      {renderProfileMenu()}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message='You are being logged out!'
        action={
          <>
            <IconButton size='small' aria-label='close' color='inherit' onClick={closeSnackbar}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </>
        }
      />

    </>
  )
}

const styles = (theme) => ({
  root: {
    backgroundColor: 'transparent',
    // backgroundColor: theme.palette.secondary.main,
    height: HEADER_HEIGHT,
    [theme.breakpoints.down('sm')]: {
      position: 'relative !important'
    },
    [theme.breakpoints.down('md')]: {
      '& div': {
        width: '100%',
        textAlign: 'center'
      }
    }
  },
  toolbar: {
    height: '100%',
    paddingLeft: 0,
    paddingRight: 0
  },
  attributeSelectionIndicator: {
    borderColor: theme.palette.common.white,
    borderRadius: '50%',
    borderWidth: 4,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: 0,
    right: -2,
    zIndex: 1
  },
  headerActions: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'flex-end',
    '& > *': {
      fontSize: '18px',
      lineHeight: '18px',
      margin: theme.spacing(0, 0.5)
    }
  },
  headerActionItem: {
    position: 'relative'
  },
  searchContainer: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 2
  }
})

export default withStyles(styles, { withTheme: true })(Header)
