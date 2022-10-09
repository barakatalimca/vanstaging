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
import { FormattedMessage } from 'gatsby-plugin-intl'
import { BsChevronRight } from 'react-icons/bs'
import _ from 'lodash'

import OrderStatusChip from './OrderStatusChip'

const OrderListTable = ({ data = [], onClickRow = () => { }, classes }) => {
  const [selected, setSelected] = React.useState(0)

  const handleClick = (event, rowData) => {
    setSelected(_.findIndex(data, (item) => item.order_id === rowData.order_id))
    onClickRow(data.find(item => item.order_id === rowData.order_id))
  }

  return (
    <div className={classes.root}>
      <TableContainer>
        <Table className={classes.table} stickyHeader size='medium'>
          <TableHead>
            <TableRow>
              <TableCell><FormattedMessage id='Order #' /></TableCell>
              <TableCell><FormattedMessage id='Ordered On' /></TableCell>
              <TableCell><FormattedMessage id='Expected On' /></TableCell>
              <TableCell align='right'><FormattedMessage id='Total Price' /></TableCell>
              <TableCell><FormattedMessage id='Status' /></TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              return (
                <TableRow
                  key={row.order_id}
                  hover
                  onClick={(event) => handleClick(event, row)}
                  tabIndex={-1}
                  selected={index === selected}
                >
                  <TableCell><b>{row.order_id}</b></TableCell>
                  <TableCell style={{ direction: 'ltr' }}>{row.ordered_on}</TableCell>
                  <TableCell style={{ direction: 'ltr' }}>{row.expected_on}</TableCell>
                  <TableCell align='right'>
                    <Box display='flex' justifyContent='flex-end' alignItems='center'>
                      <Typography variant='caption'><FormattedMessage id='₹' /></Typography>
                      <Box paddingX={1}>
                        <b>{row.total_price}</b>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <OrderStatusChip
                      value={row.status_color_code}
                      label={row.display_status}
                    />
                  </TableCell>
                  <TableCell align='right'><BsChevronRight /></TableCell>
                </TableRow>
              )
            })}
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

export default withStyles(styles, { withTheme: true })(OrderListTable)
