
import React, { useState } from 'react'
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  withStyles
} from '@material-ui/core'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import { BiChevronDown } from 'react-icons/bi'

import OrderItemSelectable from './OrderItemSelectable'
import { theme } from '../providers/ThemeProvider'
import { FormattedMessage } from 'gatsby-plugin-intl'

const ReturnProductItem = ({ data, cancelItem, isSelected = false, onChangeQuantity = () => { }, classes, ...rest }) => {
  const [quantity, setQuantity] = useState(data.quantity)

  const renderQuantityModifier = () => {
    if (Number(data.quantity) === 1) return <></>
    return (
      <PopupState variant='popover' popupId='demo-popup-menu'>
        {(popupState) => (
          <>
            <Button
              variant='text'
              size='small'
              endIcon={!cancelItem && <BiChevronDown />}
              disabled={!isSelected}
              {...bindTrigger(popupState)}
            >
              <Typography variant='caption'><FormattedMessage id='Qty' /></Typography>&nbsp;<Typography variant='body2'><b>{quantity}</b></Typography>
            </Button>
            {!cancelItem &&
              <>
                <Menu {...bindMenu(popupState)}>
                  {Array.from({ length: data.quantity }, (_, i) => i + 1).map(i => (
                    <MenuItem
                      key={i}
                      onClick={() => {
                        setQuantity(i)
                        onChangeQuantity({ item: data, quantity: i })
                        popupState.close()
                      }}
                    >
                      {i}
                    </MenuItem>
                  ))}
                </Menu>
              </>}

          </>
        )}
      </PopupState>
    )
  }

  return (
    <div className={classes.root}>
      <OrderItemSelectable data={data} isSelected={isSelected} {...rest} />
      <div className={classes.quantityModifier}>
        {renderQuantityModifier()}
      </div>
    </div>
  )
}

const styles = () => ({
  root: {
    borderBottom: '1px solid #eee',
    padding: theme.spacing(2, 2, 2, 0),
    position: 'relative',
    '&:last-child': {
      border: 'none'
    }
  },
  quantityModifier: {
    background: theme.palette.background.default,
    position: 'absolute',
    left: '180px',
    bottom: '20px',
    '& .MuiButton-label': {
      textTransform: 'capitalize'
    }
  }
})

export default withStyles(styles, { withTheme: true })(ReturnProductItem)
