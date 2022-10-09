import React, { useEffect, useState } from 'react'
import {
  withStyles,
  Box,
  Button,
  IconButton
} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { IoMdShare, IoLogoWhatsapp } from 'react-icons/io'
import { VscClose } from 'react-icons/vsc'
import { FaFacebook } from 'react-icons/fa'
import { AiFillTwitterCircle } from 'react-icons/ai'

import { MdEmail } from 'react-icons/md'
import {
  EmailShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton
} from 'react-share'
import { useLocation } from '@reach/router'
import { FormattedMessage } from 'gatsby-plugin-intl'

const ShareProduct = ({ classes }) => {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState('')
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  // const theme = useTheme()
  const location = useLocation()
  useEffect(() => {
    setUrl(location?.href)
  }, [location])
  return (
    <>
      <IconButton
        onClick={handleClickOpen}
        color='inherit'
        size='small'
        style={{ position: 'relative', top: '-5px' }}
      >
        <IoMdShare />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <FormattedMessage id='Share This Product' />
            <VscClose
              onClick={handleClose}
              color='secondary'
              style={{ fontSize: '26px', cursor: 'pointer' }}
            />
          </Box>
        </DialogTitle>
        <DialogContent style={{ minWidth: '350px', paddingBottom: '22px' }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <FacebookShareButton url={url} size={32} round>
              <FaFacebook style={{ fontSize: '30px', color: 'rgb(59, 89, 152)' }} />
            </FacebookShareButton>
            <TwitterShareButton url={url} size={32} round>
              <AiFillTwitterCircle style={{ fontSize: '34px', color: 'rgb(0, 172, 237)' }} />
            </TwitterShareButton>
            <WhatsappShareButton url={url} size={32} round>
              <IoLogoWhatsapp style={{ fontSize: '34px', color: 'rgb(37, 211, 102)' }} />
            </WhatsappShareButton>
            <EmailShareButton url={url} size={32} round>
              <MdEmail style={{ fontSize: '34px' }} />
            </EmailShareButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(ShareProduct)
