import React, { useEffect, useState } from 'react'
import Rating from '@material-ui/lab/Rating'
import {
  withStyles,
  Box,
  Grid,
  Button,
  Typography,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton
} from '@material-ui/core'
import { FormattedMessage } from 'gatsby-plugin-intl'
import CloseIcon from '@material-ui/icons/Close'

import Api from '../Api'

const Reviews = ({ classes, productId }) => {
  const [data, setData] = useState([])
  const [open, setOpen] = React.useState(false)

  const closeModal = () => {
    setOpen(false)
  }
  useEffect(() => {
    Api.getReviews({ product_id: productId })
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            setData(response.data.data)
          }
        }
      })
  }, [productId])
  const slicedData = data.length > 4 ? data.slice(0, 4) : data
  return (
    <>
      <Box paddingTop={5} paddingBottom={5} className='reviewsContent'>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h4'> <FormattedMessage id='Customer Reviews' /></Typography>
        </Box>
        <Box paddingTop={2}>
          <Grid container spacing={8} className={classes.commentContainer}>
            {slicedData.map((l, i) => (
              <Grid item md='6' lg='6' sm={12} className={classes.commentItem} key={l.review_id}>
                <Box paddingBottom={1.5}>
                  <Typography variant='h6'>
                    <Box display='flex' alignItems='center' paddingBottom={1} justifyContent='space-between'>
                      <><small>{l.customer}</small></>
                      <small style={{ fontSize: '13px', color: '#BBB9C6', paddingLeft: '7px', display: 'inline-flex', alignItems: 'center' }}>
                        {/* <span style={{ marginRight: '8px', display: 'flex' }}><Rating name='size-small' readOnly defaultValue={2} size='small' /></span> */}
                        {l.date}
                      </small>
                    </Box>
                  </Typography>
                  <Rating name='size-small' readOnly defaultValue={Number(l.rate)} size='small' />
                  <Typography>
                    <small>{l.review}</small>
                  </Typography>
                </Box>
                <Divider />
              </Grid>
            ))}
            {slicedData.length === 0 && <><Box padding={4}><Typography style={{ color: '#999' }} variant='body2'><FormattedMessage id='No Reviews' />.</Typography></Box></>}
            {data.length > 4 && <Box paddingX={4}><a style={{ color: '#f26b3e' }} onClick={() => setOpen(true)}><FormattedMessage id='View All Reviews' /></a></Box>}
          </Grid>
        </Box>
      </Box>
      <Dialog
        open={open}
        maxWidth='lg'
        fullWidth='lg'
        onClose={closeModal}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <DialogTitle id='alert-dialog-title'><FormattedMessage id='Customer Reviews' /></DialogTitle>
          <IconButton
            aria-label='current language'
            aria-haspopup='true'
            onClick={closeModal}
            color='inherit'
          >
            <CloseIcon size={24} />
          </IconButton>
        </Box>
        <DialogContent>
          <Grid container>
            {data.map((l, i) => (
              <Grid item md='6' lg='6' sm={12} className={classes.commentItem} key={l.review_id}>
                <Box padding={1}>
                  <Typography variant='h6'>
                    <Box display='flex' alignItems='center' paddingBottom={1} justifyContent='space-between'>
                      <><small>{l.customer}</small></>
                      <small style={{ fontSize: '12px', color: '#BBB9C6', paddingLeft: '7px' }}>{l.date}</small>
                    </Box>
                  </Typography>
                  <Typography>
                    <small>{l.review}</small>
                  </Typography>
                  <Rating name='size-small' readOnly defaultValue={Number(l.rate)} size='small' />
                  <br />
                  <Divider />
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <Box paddingLeft={2} paddingBottom={2}>
          <DialogActions>
            <Button
              onClick={closeModal}
              color='secondary'
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}

const styles = (theme) => ({
  ratingContainer: {
    '& > fieldset': {
      padding: '0'
    }
  },
  commentItem: {
    '&:last-child > hr': {
      display: 'none'
    }
  }
})

export default withStyles(styles, { withTheme: true })(Reviews)
