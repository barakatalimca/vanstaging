import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { FormattedMessage } from 'gatsby-plugin-intl'

import '../styles/header-navigation.css'
import { Link } from './common/Router'
import HeaderShopDropdown from './HeaderShopDropdown'

const HeaderNavigation = () => {
  const classes = useStyles()

  // const { data } = useSelector(state => state.productList, shallowEqual)

  const [isShopDropdownVisible, setIsShopDropdownVisible] = React.useState(false)

  const hovered = () => {
    setIsShopDropdownVisible(true)
  }

  const hideDropdown = () => {
    setIsShopDropdownVisible(true)
  }

  return (
    <Box display='flex' flexGrow={1} className={classes.root} justifyContent='center'>
      <nav>
        <ul className='navList'>
          {/* <li className={classes.item}> */}
          <li className={`dropdown ${classes.item}`} onMouseOver={hovered} onMouseLeave={hideDropdown}>
            <span><FormattedMessage id='Easy Shop' /></span>
            <HeaderShopDropdown isVisible={isShopDropdownVisible} onHide={hideDropdown} />
          </li>
          {/* <li>
            <Link to='/about' className={classes.item}> <FormattedMessage id='Company' /></Link>
          </li>
          <li>
            <Link to='/contact' className={classes.item}> <FormattedMessage id='Contact' /></Link>
          </li> */}
        </ul>
      </nav>
    </Box>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    '& ul': {
      alignItems: 'center',
      display: 'flex',
      margin: 0,
      padding: '0'
    },
    '& ul li': {
      listStyleType: 'none',
      height: '74px',
      lineHeight: '74px'
    },
    '& ul li > a': {
      height: '100%',
      lineHeight: '74px',
      display: 'block'
      // color: '#fff'
    }
  },
  items: {
    paddingLeft: theme.spacing(2)
  },
  item: {
    // color: theme.palette.secondary.main,
    // color: '#fff',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    textDecoration: 'none',
    textTransform: 'capitalize'
  }
}))

export default HeaderNavigation
