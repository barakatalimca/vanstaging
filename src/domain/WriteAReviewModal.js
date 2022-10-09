import React, { useEffect, useState } from 'react'
import Rating from '@material-ui/lab/Rating'
import {
  withStyles,
  Box,
  Grid,
  Button,
  Typography,
  Divider,
  TextField
} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { Link } from '../components/common/Router'
import DialogTitle from '@material-ui/core/DialogTitle'

const WriteAReviewModal = ({ classes }) => {
  const [open, setOpen] = React.useState(false)
  const [isloggedin, setIsLoggedin] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  };

  const handleClose = () => {
    setOpen(false)
  };
  // const theme = useTheme()
  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        onClick={handleClickOpen}
      >Write A Review
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {!isloggedin && <>
          <DialogTitle id='alert-dialog-title'>You are not signed in!</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Please signin or sign up to post a review.
            </DialogContentText>
          </DialogContent>
          <Box paddingLeft={2} paddingBottom={2}>
            <DialogActions>
              <Button
onClick={handleClose}
                color='secondary'
              >
                Cancel
              </Button>
              <Link to='/sign-in'>
                <Button
                  onClick={handleClose}
                  color='primary'
                  style={{ marginLeft: '7px' }}
                  autoFocus
                >
                  Login
                </Button>
              </Link>
            </DialogActions>
          </Box>
                        </>}
        {isloggedin && <>
          <DialogTitle id='alert-dialog-title'>
            {'Write A Review'}
            <Button
onClick={handleClose}
              color='secondary'
            >
              Cancel
            </Button>
          </DialogTitle>
          <DialogContent>
            <TextField
              name='message'
              // ref={register({ required: true })}
              // label='Write Your Message'
              fullWidth
              variant='outlined'
              multiline
              rows={8}
              rowsMax={8}
              style={{ width: '500px' }}
            />
          </DialogContent>
          <Box paddingLeft={2} paddingBottom={2}>
            <DialogActions>
              <Button
onClick={handleClose}
                color='secondary'
                variant='contained'
              >
                Cancel
              </Button>
              <Button
                // onClick={handleClose}
                color='primary'
                style={{ marginLeft: '7px', marginRight: '15px' }}
                autoFocus
                variant='contained'
              >
                Submit
              </Button>
            </DialogActions>
          </Box>
                       </>}
      </Dialog>
    </>
  )
}

const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(WriteAReviewModal)
