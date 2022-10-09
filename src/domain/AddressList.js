import React, { useEffect, useState } from 'react'
import {
  withStyles,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  RadioGroup,
  Box,
  IconButton,
  FormControlLabel,
  Radio
} from '@material-ui/core'
import { RiPencilFill } from 'react-icons/ri'
import { IoMdTrash } from 'react-icons/io'

import Api from '../Api'
import AddressListItem from './AddressListItem'

const AddressList = ({
  data = [],
  selected,
  addressType = 'Shipping',
  onSelectItem = () => { },
  actionsEnabled = true,
  classes
}) => {
  if (data.length === 0) {
    return <></>
  }

  const [selectedValue, setSelectedValue] = useState(null)

  const onChange = ({ target: { value } }) => {
    setSelectedValue(value)
    onSelectItem(value)
  }

  const deleteItem = async (id) => {
    const payload = {
      action: 'delete',
      address_id: id
    }
    const response = await Api.manageAddress(payload)
    if (response.ok) {
      // setSnackBar(true)
      // const newList = addressListState.filter((item) => item.address_id !== id)
      // setAddressListState(newList)
    }
  }

  useEffect(() => {
    if (selected) {
      setSelectedValue(selected)
    }
  }, [selected])

  return (
    <Grid container spacing={2}>
      {data.map((l) => (
        <Grid item xs={12} md={6} key={l.address_id}>
          <Card variant='outlined' className={l.address_id === selectedValue ? classes.selectedCard : ''}>
            <CardActionArea>
              <CardContent>
                <RadioGroup
                  aria-label={addressType}
                  name={addressType}
                  value={selectedValue}
                  onChange={onChange}
                  className={classes.addressList}
                >
                  <>
                    {actionsEnabled
                      ? (
                        <Box paddingY={1} display='flex' justifyContent='space-between'>
                          <AddressListItem address={l} />
                          <Box>
                            <IconButton size='small'>
                              <RiPencilFill />
                            </IconButton>
                            <IconButton size='small' onClick={() => deleteItem(l.address_id)}>
                              <IoMdTrash />
                            </IconButton>
                          </Box>
                        </Box>
                      )
                      : (
                        <FormControlLabel
                          value={l.address_id}
                          control={<Radio />}
                          label={
                            <Box paddingY={1}>
                              <AddressListItem address={l} />
                            </Box>
                          }
                        />
                      )}
                  </>
                </RadioGroup>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

const styles = (theme) => ({
  addressList: {
    '& .MuiFormControlLabel-root': {
      alignItems: 'end'
    }
  },
  selectedCard: {
    background: theme.palette.grey[100],
    borderStyle: 'dashed',
    borderWidth: '3px'
  }
})

export default withStyles(styles, { withTheme: true })(AddressList)
