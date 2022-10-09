import React from 'react'
import {
  withStyles,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core'
import { BsChevronRight } from 'react-icons/bs'
import _ from 'lodash'
import moment from 'moment'

import OrderStatusChip from './OrderStatusChip'
import { useWishList } from '../helpers/useWishList'
import { FormattedMessage } from 'gatsby-plugin-intl'

const TransactionHistory = ({ data = [], classes }) => {
  return (
    <div className={classes.root}>
      <TableContainer>
        <Table className={classes.table} stickyHeader size='medium'>
          <TableHead>
            <TableRow>
              <TableCell><FormattedMessage id='Order Id' /></TableCell>
              <TableCell><FormattedMessage id='Date' /></TableCell>
              <TableCell><FormattedMessage id='Time' /></TableCell>
              <TableCell align='right'><FormattedMessage id='Amount' /></TableCell>
              <TableCell><FormattedMessage id='Type' /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((l) => (
              <TableRow
                hover
                key={l.id}
              >
                <TableCell><b>{l.id}</b></TableCell>
                <TableCell>{moment(l.txn_date).format('MMMM Do YYYY')}</TableCell>
                <TableCell>{moment(l.txn_date).format('hh:mm A')}</TableCell>
                <TableCell align='right'>
                  <Box display='flex' justifyContent='flex-end' alignItems='center'>
                    <Typography variant='caption'><FormattedMessage id='₹' /></Typography>
                    <Box paddingX={1}>
                      <b>{l.txn_amount}</b>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {/* <OrderStatusChip
                    value='green'
                    label='Success'
                  /> */}
                  {l.txn_type}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>
      <Box height={300} />
    </div>
  )
}
const styles = (theme) => ({
  root: {
    display: 'unset',
    '& .MuiTableContainer-root': {
      position: 'sticky',
      top: '8em'
    },
    '& .MuiTableCell-head': {
      color: 'rgba(0, 0, 0, 0.5)'
    },
    '& .MuiTableCell-body': {
      padding: theme.spacing(3, 1),
      cursor: 'pointer'
    },
    '& .MuiTableRow-root.Mui-selected': {
      backgroundColor: '#f4f4f4',
      border: '1px solid #dfdfdf',
      borderRight: 0
    },
    '& .MuiTableRow-root.Mui-selected .MuiTableCell-body': {
      // color: theme.palette.common.white
      color: '#000'
    }
  }
})

export default withStyles(styles, { withTheme: true })(TransactionHistory)
