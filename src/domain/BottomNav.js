import React, { useState } from 'react'
import {
  withStyles, Box, Typography, Slide, Menu, MenuItem,
  ClickAwayListener, Grow, Popper, MenuList, Paper, useScrollTrigger, Button, Hidden, Drawer, Container, Grid
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { redirectTo } from '@reach/router'
import clsx from 'clsx'
import { RiHeart3Line, RiSearchLine, RiShoppingBag3Line } from 'react-icons/ri'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import { FiSearch, FiUser } from 'react-icons/fi'
import { MdLanguage } from 'react-icons/md'
import { BiHome } from 'react-icons/bi'
import { AiOutlineMenu } from 'react-icons/ai'
import { navigate } from '../components/common/Router'
import DrawerNavigation from '../components/DrawerNavigation'
import { Link } from '../components/common'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { useAuth } from '../helpers/useAuth'
import { useAllProductsData, useCart } from '../helpers'
import { HiCheckCircle } from 'react-icons/hi'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { GrLanguage } from 'react-icons/gr'
import { MegaSearch } from '.'

export const HEADER_HEIGHT = '7rem'

const BottomNav = ({ classes, url }) => {
  const cart = useCart()
  const auth = useAuth()
  const allProducts = useAllProductsData()
  const [isMenuVisible, setIsMenuVisible] = React.useState(false)
  const [isLanguageVisible, setIsLanguageVisible] = React.useState(false)
  const [isUserMenuVisible, setisUserMenuIsvisible] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [value, setValue] = React.useState('recents')

  const handleSearchOpen = () => {
    setIsSearchOpen(true)
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
  }
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const handleMenuIconClick = (event) => {
    setIsMenuVisible(true)
  }
  const handleLanguageIconClick = (event) => {
    setIsLanguageVisible(true)
  }
  const handleUserMenuClick = (event) => {
    setisUserMenuIsvisible(true)
  }

  return (
    <>
      <Drawer anchor='bottom' open={isMenuVisible} onClose={() => setIsMenuVisible(false)}>
        <DrawerNavigation onClickItem={() => setIsMenuVisible(false)} menuList />
      </Drawer>
      <Drawer anchor='bottom' open={isUserMenuVisible} onClose={() => setisUserMenuIsvisible(false)}>
        <DrawerNavigation onClickItem={() => setisUserMenuIsvisible(false)} userMenu />
      </Drawer>
      <Drawer anchor='bottom' open={isLanguageVisible} onClose={() => setIsLanguageVisible(false)}>
        <DrawerNavigation onClickItem={() => setIsLanguageVisible(false)} languageMenu />
      </Drawer>
      <BottomNavigation className={classes.BottomNavigation} value={value} onChange={handleChange}>
        <BottomNavigationAction value='home' icon={<Link to='/'><BiHome style={{ fontSize: '25px' }} /></Link>} />
        <BottomNavigationAction
          value='cart' icon={<>
            <Link to='/cart'>
              <Box className={clsx(classes.headerActionItem, classes.headerActionItemCart)}>
                <RiShoppingBag3Line style={{ fontSize: '24px' }} />
                {!cart?.isEmpty && (
                  <span className={classes.cartCount}>
                    {cart?.totalItems}
                  </span>
                )}
              </Box>
            </Link>
          </>}
        />
        {/* <BottomNavigationAction value='wishlist' icon={<Link to='/user/wishlist'><BsHeart style={{ fontSize: '25px' }} /></Link>} /> */}

        <BottomNavigationAction
          value='user' icon={
            <span>
              {auth?.user?.isLoggedIn ? <>
                <a
                  className='dropdown'
                  onClick={handleUserMenuClick}
                >
                  <Box display='flex' justifyContent='space-between' alignItems='center' style={{ position: 'relative' }}>
                    <FiUser style={{ fontSize: '25px' }} />
                    <HiCheckCircle size={20} className={classes.attributeSelectionIndicator} />

                  </Box>
                </a>
              </>
                : <Link to='/sign-in'><FiUser style={{ fontSize: '25px' }} /></Link>}
            </span>
          }
        />

        <BottomNavigationAction
          value='search' icon={
            <a onClick={handleSearchOpen} disableElevation>
              <FiSearch style={{ fontSize: '25px' }} />
            </a>
          }
        />
        <BottomNavigationAction
          value='language' icon={
            <a onClick={handleLanguageIconClick} disableElevation>
              <GrLanguage style={{ fontSize: '25px' }} />
            </a>
          }
        />
        <BottomNavigationAction
          value='menu' icon={
            <a onClick={handleMenuIconClick} disableElevation>
              <AiOutlineMenu style={{ fontSize: '25px' }} />
            </a>
          }
        />
      </BottomNavigation>
      {isSearchOpen && (
        <Container className={classes.searchContainer}>
          <MegaSearch onClose={handleSearchClose} />
        </Container>
      )}
    </>
  )
}

const styles = (theme) => ({

  attributeSelectionIndicator: {
    borderColor: theme.palette.common.white,
    borderRadius: '50%',
    borderWidth: 4,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    position: 'relative',
    top: -9,
    right: 5,
    zIndex: 1
  },

  BottomNavigation: {
    [theme.breakpoints.down('md')]: {
      // display: 'block',
      position: 'fixed',
      bottom: '0',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '999'
    },
    '& .MuiBottomNavigationAction-wrapper': {
      flexDirection: 'unset'
    },
    '& *': {
      minWidth: 'auto'
    }
  },

  headerActionItem: {
    position: 'relative'
  },
  headerActionItemCart: {
    paddingRight: '15px'
  },
  cartCount: {
    color: '#FFF',
    width: '18px',
    height: '18px',
    marginTop: '-7px',
    display: 'flex',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    fontSize: '11px',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: -1
  },

  dropdownPopper: {
    '& a': {
      width: 'auto',
      fontSize: '14px',
      color: '#000'
    }
  },
  dropdownPopperContent: {
    top: '15px !important'
  },
  searchContainer: {
    backgroundColor: theme.palette.background.paper,
    height: '40vh',
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    [theme.breakpoints.down('md')]: {
      height: '10vh',
      zIndex: '9999'
    }
  }
})

export default withStyles(styles, { withTheme: true })(BottomNav)
