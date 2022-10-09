import React from 'react'
import {
  withStyles, Box, Typography, Slide, Menu, MenuItem,
  ClickAwayListener, Grow, Popper, MenuList, Paper, useScrollTrigger, Button, Hidden, Drawer, Container, Grid
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { redirectTo } from '@reach/router'
import clsx from 'clsx'
import { RiHeart3Line, RiSearchLine, RiShoppingBag3Line } from 'react-icons/ri'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import { FiUser } from 'react-icons/fi'
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

export const HEADER_HEIGHT = '7rem'

const BottomNav = ({ classes, url }) => {
  const cart = useCart()
  const auth = useAuth()
  const allProducts = useAllProductsData()
  const [isMenuVisible, setIsMenuVisible] = React.useState(false)
  const [isUserMenuVisible, setisUserMenuIsvisible] = React.useState(false)
  const [value, setValue] = React.useState('recents')
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const handleMenuIconClick = (event) => {
    setIsMenuVisible(true)
  }
  const handleUserMenuClick = (event) => {
    setisUserMenuIsvisible(true)
  }

  return (
    <>
    </>
  )
}

const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(BottomNav)
