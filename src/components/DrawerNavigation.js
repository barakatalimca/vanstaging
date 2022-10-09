import React from 'react'
import { withStyles, Box, List, ListItem, ListItemText } from '@material-ui/core'
import { queryCache, useQuery } from 'react-query'

import '../styles/header-navigation.css'
import { Link } from './common/Router'
import { CMS_DATA, MAIN_NAVIGATION_ITEMS, PRODUCT_LIST_DATA } from '../Constants'
import CategoriesMenu from '../domain/CategoriesMenu'
import Api from '../Api'
import { useAuth } from '../helpers/useAuth'
import { changeLocale, useCart, useI18n } from '../helpers'
import { FormattedMessage } from 'gatsby-plugin-intl'

const DrawerNavigation = ({ onClickItem, classes, userMenu, languageMenu, menuList }) => {
  const auth = useAuth()
  const cart = useCart()
  const i18n = useI18n()
  const isBrowser = typeof window !== 'undefined'
  const [_data, setData] = React.useState([])

  const { isLoading, error, data } = useQuery(PRODUCT_LIST_DATA, Api.fetchProductListData)

  const logout = () => {
    auth.signout()
    cart.emptyCart()
    // if (isBrowser) {
    //   window.localStorage.clear()
    //   setTimeout(() => {
    //     navigate('/sign-in')
    //   }, 1000)
    // }
  }
  const handleLanguageChange = (toLocale) => {
    changeLocale(toLocale)
    if (isBrowser) {
      window.localStorage.setItem('languageChanged', true)
    }
    // handleLanguageMenuClose()
  }

  React.useEffect(() => {
    if (data && data.data) {
      setData(data.data.data)
    }
  }, [data])

  React.useEffect(() => {
    if (isBrowser) {
      const isLanguageChanged = window.localStorage.getItem('languageChanged')
      if (!isLanguageChanged) {
        changeLocale('ar')
        Api.setHeaders({ Lang: 'ar' })
      }
    }
  }, [])

  React.useEffect(() => {
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
    <div
      role='presentation'
      onClick={onClickItem}
    >
      <List className={i18n.locale === 'ar' ? classes.listItemContainerRtl : classes.listItemContainer}>
        {menuList &&
          <>
            <ListItem button>
              <Link to='/about'><FormattedMessage id='Company' /></Link>
            </ListItem>
            <ListItem button>
              <Link to='/contact'><FormattedMessage id='Contact' /></Link>
            </ListItem>
            <ListItem button>
              <Link to='/cart'><FormattedMessage id='My Cart' /></Link>
            </ListItem>
            <ListItem button>
              <Link to='/user/wishlist'><FormattedMessage id='My Wishlist' /></Link>
            </ListItem>

          </>}
        {languageMenu && <>
          <ListItem button onClick={() => handleLanguageChange('ar')}>عربى</ListItem>
          <ListItem button onClick={() => handleLanguageChange('en')}>English</ListItem>
                         </>}
        {userMenu &&
          <>
            <ListItem button>
              <Link to='/user/my-profile'><FormattedMessage id='My Profile' /></Link>
            </ListItem>
            <ListItem button>
              <Link to='/user/my-orders'><FormattedMessage id='My Orders' /></Link>
            </ListItem>
            <ListItem button>
              <a onClick={() => logout()}><FormattedMessage id='Logout' /></a>
              {/* <MenuItem onClick={() => logout()}><a>Logout</a></MenuItem> */}
            </ListItem>
          </>}
      </List>
      {menuList && <CategoriesMenu data={_data} mobile />}

    </div>
  )
}

const styles = (theme) => ({
  listItemContainer: {
    '& a': {
      width: '100%'
    }
  },
  listItemContainerRtl: {
    '& a': {
      textAlign: 'right',
      width: '100%'
    }
  }
})

export default withStyles(styles, { withTheme: true })(DrawerNavigation)
