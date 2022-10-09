import React, { useState } from 'react'
import { graphql } from 'gatsby'
import {
  withStyles,
  Box,
  Typography,
  Button,
  Grid,
  TextareaAutosize,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@material-ui/core'
import { RiPencilFill } from 'react-icons/ri'
import { useForm } from 'react-hook-form'
import { IoMdTrash } from 'react-icons/io'
import TextField from '@material-ui/core/TextField'
import { Alert } from '@material-ui/lab'
import { useWallet } from '../helpers'

const WalletBalance = ({ classes }) => {
  const wallet = useWallet()

  React.useEffect(() => {
    wallet.fetchWalletDetails()
  }, [])
  const diableCheck = wallet?.walletBalance < wallet?.finalPrice
  return (
    <>
      {console.log('finalPrice', wallet?.finalPrice)}
      <Box paddingBottom={1}>
        <form>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Alert icon={false} variant='outlined' severity='warning'>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Use your wallet's balance</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox onChange={() => wallet.selectWallet()} checked={wallet?.isWalletSelected} disabled={diableCheck} name='walletBalance' />}
                      label={wallet?.walletBalance}
                    />
                  </FormGroup>
                  {diableCheck && <Typography color='warning' variant='small'>Insufficient wallet balance</Typography>}
                </FormControl>
              </Alert>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  )
}
const styles = (theme) => ({

})
export default withStyles(styles, { withTheme: true })(WalletBalance)
