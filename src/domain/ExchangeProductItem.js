import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  withStyles
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import { BiChevronDown } from 'react-icons/bi'
import { CgArrowsExchange } from 'react-icons/cg'

import ProductSkuItemBase from './ProductSkuItemBase'
import { theme } from '../providers/ThemeProvider'
import { IoMdClose } from 'react-icons/io'
import { AiOutlineMinus } from 'react-icons/ai'
import { FaEquals, FaMinus } from 'react-icons/fa'

const SEPARATOR_WIDTH = 80

const getTotalPrice = (sum, item) => sum + Number(item.discount_price && item.discount_price !== '' ? item.discount_price : item.price) * Number(item.quantity)

const ExchangeProductItem = ({
  data,
  exchangeItem,
  onChangeReturnQuantity = () => { },
  onChangeExchangeQuantity = () => { },
  onSelect = () => { },
  onRemoveExchangeItem = () => { },
  classes,
  ...rest
}) => {
  const [returnQuantity, setReturnQuantity] = useState(data.quantity)
  const [exchangeQuantity, setExchangeQuantity] = useState(1)

  const renderReturnItem = () => {
    return (
      <>
        <ProductSkuItemBase data={data} row={false} {...rest} />
        {Number(data.quantity) > 1 && (
          <>
            <div className={classes.quantityModifier}>
              <QuantityModifier
                defaultValue={data.quantity}
                maxValue={data.quantity}
                onChange={setReturnQuantity}
                disabled={!exchangeItem}
                title={!exchangeItem
                  ? <FormattedMessage id='Return quantity can be modified after selecting an exchange item' />
                  : <FormattedMessage id='Select return quantity' />}
              />
            </div>
          </>
        )}
      </>
    )
  }

  const renderExchangeItem = () => {
    if (!exchangeItem) {
      return (
        <Button
          variant='text'
          size='large'
          className={classes.emptyExchangeItem}
          onClick={() => onSelect(data)}
        >
          <FormattedMessage id='Select item to exchange with' />
        </Button>
      )
    }

    return (
      <>
        <ProductSkuItemBase data={exchangeItem} row={false} {...rest} />
        <div className={classes.quantityModifier}>
          <QuantityModifier
            defaultValue={exchangeItem.quantity}
            maxValue={10}
            onChange={setExchangeQuantity}
          />
        </div>
        <IconButton
          size='small'
          variant='contained'
          aria-label='remove exchange item'
          onClick={() => onRemoveExchangeItem(exchangeItem)}
          className={classes.removeIcon}
        >
          <IoMdClose />
        </IconButton>
      </>
    )
  }

  const renderPriceDiff = () => {
    console.log(data, exchangeItem)
    if (!exchangeItem) {
      return <></>
    }

    const exchangeValue = exchangeItem ? Number(exchangeItem.price) * Number(exchangeItem.quantity) : 0
    const returnValue = Number(data.price) * Number(data.quantity)
    const priceDiff = exchangeValue - returnValue

    return (
      <Box paddingTop={2}>
        <Grid container spacing={2} alignItems='center' justify='center'>
          <Grid item>
            <Typography variant='caption'><FormattedMessage id='Exchange Value' /></Typography>
            <Typography variant='body2'>{data.currency}&nbsp;<b>{exchangeValue}</b></Typography>
          </Grid>
          <Grid item>
            <FaMinus />
          </Grid>
          <Grid item>
            <Typography variant='caption'><FormattedMessage id='Return Value' /></Typography>
            <Typography variant='body2'>{data.currency}&nbsp;<b>{returnValue}</b></Typography>
          </Grid>
          <Grid item>
            <FaEquals />
          </Grid>
          <Grid item>
            <Typography variant='caption'><FormattedMessage id='Difference' /></Typography>
            <Typography variant='body2'>{data.currency}&nbsp;<b>{priceDiff}</b></Typography>
          </Grid>
        </Grid>
      </Box>
    )
  }

  useEffect(() => {
    onChangeReturnQuantity({ item: data, quantity: returnQuantity })
  }, [returnQuantity])

  useEffect(() => {
    onChangeExchangeQuantity({ item: exchangeItem, quantity: exchangeQuantity })
  }, [exchangeQuantity])

  return (
    <div className={classes.root}>
      <div className={classes.pair}>
        <div className={classes.data}>
          {renderReturnItem()}
        </div>
        <Box display='flex' alignItems='center' justifyContent='center' width={SEPARATOR_WIDTH}>
          <CgArrowsExchange size={40} />
        </Box>
        <div className={classes.exchangeItem}>
          {renderExchangeItem()}
        </div>
      </div>
      {/* {renderPriceDiff()} */}
    </div>
  )
}

const QuantityModifier = ({ defaultValue, maxValue, onChange = () => { }, disabled = false }) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <PopupState variant='popover' popupId='return-item-quantity-menu'>
      {(popupState) => (
        <>
          <Button
            variant='text'
            size='small'
            endIcon={<BiChevronDown />}
            disabled={disabled}
            {...bindTrigger(popupState)}
          >
            <Typography variant='caption'>
              <FormattedMessage id='Qty' />
            </Typography>&nbsp;<Typography variant='body2'><b>{value}</b></Typography>
          </Button>
          <Menu {...bindMenu(popupState)}>
            {Array.from({ length: maxValue }, (_, i) => i + 1).map(i => (
              <MenuItem
                key={i}
                onClick={() => {
                  setValue(i)
                  onChange(i)
                  popupState.close()
                }}
              >
                {i}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </PopupState>
  )
}

const styles = () => ({
  root: {
    borderBottom: '1px solid #eee',
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  pair: {
    // backgroundColor: theme.palette.grey[200],
    display: 'flex',
    position: 'relative',
    '&:last-child': {
      border: 'none'
    }
  },
  data: {
    position: 'relative',
    width: `calc(50% - ${SEPARATOR_WIDTH / 2}px)`
  },
  exchangeItem: {
    position: 'relative',
    width: `calc(50% - ${SEPARATOR_WIDTH / 2}px)`,
    '& .MuiButton-label': {
      textTransform: 'capitalize'
    }
  },
  emptyExchangeItem: {
    backgroundColor: theme.palette.grey[200],
    border: `5px dashed ${theme.palette.grey[600]}`,
    height: '100%',
    width: '100%'
  },
  quantityModifier: {
    background: theme.palette.background.default,
    position: 'absolute',
    left: 0,
    bottom: 0,
    '& .MuiButton-root': {
      padding: 0,
      paddingTop: theme.spacing(1)
    },
    '& .MuiButton-label': {
      textTransform: 'capitalize'
    }
  },
  removeIcon: {
    background: theme.palette.grey[300],
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1
  }
})

export default withStyles(styles, { withTheme: true })(ExchangeProductItem)
