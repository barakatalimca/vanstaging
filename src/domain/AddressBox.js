import React, { useState } from 'react'
import { graphql } from 'gatsby'
import {
  withStyles,
  Box,
  Typography,
  Button,
  Grid,
  TextareaAutosize
} from '@material-ui/core'
import { RiPencilFill } from 'react-icons/ri'
import { useForm } from 'react-hook-form'
import { IoMdTrash } from 'react-icons/io'
import TextField from '@material-ui/core/TextField'
const AddressBox = ({ classes }) => {
  const { register, handleSubmit, watch, errors } = useForm()
  const onSubmit = data => console.log(data)
  const [addNew, setAddNew] = useState(false)
  const addnewForm = () => {
    setAddNew(true)
  }
  const cancel = () => {
    setAddNew(false)
  }
  return (
    <>
      <Box marginBottom={5} display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h3' component='h3'>My Address</Typography>
      </Box>
      <address className={classes.addressItem}>
        <Box display='flex' justifyContent='space-between'>
          <b>1</b>
          <Typography variant='h6' style={{ fontSize: '15px', fontStyle: 'normal' }}>
            Kazma Technology Private Limited 504A, 5th Floor, PS Aviator Building, Above Big Bazaar, Chinar Park, Rajarhat
          </Typography>
          <Box>
            <Button size='small'>
              <RiPencilFill style={{ fontSize: '18px' }} />
            </Button>
            <Button size='small'>
              <IoMdTrash style={{ fontSize: '18px' }} />
            </Button>
          </Box>
        </Box>
      </address>
      <address className={classes.addressItem}>
        <Box display='flex' justifyContent='space-between'>
          <b>2</b>
          <Typography variant='h6' style={{ fontSize: '15px', fontStyle: 'normal' }}>
            Kazma Technology Private Limited 504A, 5th Floor, PS Aviator Building, Above Big Bazaar, Chinar Park, Rajarhat
          </Typography>
          <Box>
            <Button size='small'><RiPencilFill style={{ fontSize: '18px' }} /></Button>
            <Button size='small'><IoMdTrash style={{ fontSize: '18px' }} /></Button>
          </Box>
        </Box>
      </address>
      {addNew && <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box paddingTop={1} paddingBottom={1}>
            <Grid container spacing={2}>
              <Grid item md='6'>
                <TextField
                  name='name'
                  label='Name'
                  variant='outlined'
                  fullWidth
                  ref={register({ required: true })}
                />
              </Grid>
              <Grid item md='6'>
                <TextField
                  name='name'
                  label='City'
                  variant='outlined'
                  fullWidth
                  ref={register({ required: true })}
                />
              </Grid>
              <Grid item md='6'>
                <TextField
                  name='name'
                  label='State'
                  variant='outlined'
                  fullWidth
                  ref={register({ required: true })}
                />
              </Grid>
              <Grid item md='6'>
                <TextField
                  name='name'
                  label='Country'
                  variant='outlined'
                  fullWidth
                  ref={register({ required: true })}
                />
              </Grid>
              <Grid item md='12'>
                <Box paddingTop={1} paddingBottom={1}>
                  <TextareaAutosize aria-label='minimum height' rowsMin={3} placeholder='Address' />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Button variant='contained' color='secondary' size='large'>Save</Button>
          <Button style={{ marginLeft: '4px' }} onClick={cancel} size='large'>Cancel</Button>
        </form>
                 </>}

      <Box paddingTop={2} paddingBottom={2}>
        {!addNew && <Button onClick={addnewForm}>Add new +</Button>}
      </Box>
    </>
  )
}
const styles = (theme) => ({
  addressItem: {
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
    marginBottom: '15px',
    '&:last-child': {
      border: 'none'
    },
    '& a img': {
      width: '100px',
      height: '100px',
      borderRadius: '5px',
      objectFit: 'cover'
    },
    '& b': {
      fontStyle: 'normal',
      width: '20px',
      height: '20px',
      border: '1px solid #000',
      textAlign: 'center',
      display: 'inline-table',
      marginRight: '10px',
      marginTop: '5px',
      borderRadius: '50%',
      fontSize: '12px',
      lineHeight: '18px'
    }
  }
})
export default withStyles(styles, { withTheme: true })(AddressBox)
