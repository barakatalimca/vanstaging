import React from 'react'
import {
  withStyles,
  IconButton,
  Button
} from '@material-ui/core'
import { HiCheckCircle } from 'react-icons/hi'
import clsx from 'clsx'
import _ from 'lodash'

const ProductAttribute = ({
  attributeData,
  selectedAttributes = [],
  onClickAttribute = () => { },
  classes
}) => {
  if (!attributeData) {
    return <></>
  }

  const {
    attribute,
    value,
    display_value
  } = attributeData

  const _onClickAttribute = (_e) => {
    onClickAttribute(attributeData)
  }

  if (attribute === 'color') {
    return (
      <IconButton
        key={value}
        title={display_value}
        onClick={_onClickAttribute}
        className={clsx(classes.attribute, classes.attributeColor)}
        style={{ backgroundColor: value }}
      >
        {_.findIndex(selectedAttributes, { value }) > -1 && (
          <HiCheckCircle size={20} className={classes.attributeSelectionIndicator} />
        )}
      </IconButton>
    )
  }

  return (
    <Button
      key={value}
      title={display_value}
      onClick={_onClickAttribute}
      className={clsx(
        classes.attribute,
        classes.attributeNonColor,
        _.findIndex(selectedAttributes, attr => attr.value === value) > -1
          ? classes.attributeSelected
          : null
      )}
      mode='outlined'
      size='small'
    >
      {display_value}
    </Button>
  )
}

const styles = (theme) => ({
  attribute: `
    box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
                0 2px 2px rgba(0,0,0,0.11), 
                0 4px 4px rgba(0,0,0,0.11), 
                0 6px 8px rgba(0,0,0,0.11),
                0 8px 16px rgba(0,0,0,0.11);
    font-weight: bold;
    height: 36px;
    margin: ${theme.spacing(0.5)}px;
    min-width: 36px;
    position: relative;
  `,
  attributeColor: `
    width: 36px;
  `,
  attributeNonColor: `
  `,
  attributeSelectionIndicator: {
    borderColor: theme.palette.common.white,
    borderRadius: '50%',
    borderWidth: 4,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: -4,
    right: -4,
    zIndex: 1
  },
  attributeSelected: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: 'none',
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.text.primary
    }
  }
})

export default withStyles(styles, { withTheme: true })(ProductAttribute)
