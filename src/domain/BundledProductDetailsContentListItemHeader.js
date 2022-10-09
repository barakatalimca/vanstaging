
import React from 'react'
import {
  withStyles,
  Box,
  Typography,
  Avatar,
  Badge
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'

const BundledProductDetailsContentListItemHeader = ({ data, index = 1, classes }) => {
  if (!data) {
    return <></>
  }

  const {
    category_name,
    product_name,
    quantity,
    image
  } = data

  return (
    <Box display='flex' alignItems='center' paddingX={2}>
      <Badge
        badgeContent={quantity}
        color="secondary"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar variant='square' src={image} className={classes.img} />
      </Badge>
      <Box width={20} />
      <Box>
        <Typography variant='caption' component='small' color='textSecondary'>
          {category_name}
        </Typography>
        <Typography
          variant='body1'
          component='h3'
        >
          <b>{product_name}</b>
        </Typography>
      </Box>
    </Box>
  )
}

const styles = (theme) => ({
  number: {
    alignItems: 'center',
    display: 'flex',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '50%',
    color: theme.palette.common.white,
    height: 40,
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    width: 40
  },
  img: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
})

export default withStyles(styles, { withTheme: true })(BundledProductDetailsContentListItemHeader)
