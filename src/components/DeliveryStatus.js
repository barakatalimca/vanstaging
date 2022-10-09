import React, { useState } from 'react'
import { graphql } from 'gatsby'
import {
    withStyles,
    Box,
    Typography,
    Grid,
    Container,
    Button,
    Breadcrumbs
} from '@material-ui/core'


const DeliveryStatus = ({ classes, status }) => {

    return (
        <>
            <div className='statusContainer'>
                <Typography variant='b' className={status}>{status} on 27 Jun</Typography>
            </div>
        </>
    )
}
const styles = (theme) => ({
    // statusContainer: {
    //     '& span': {
    //         textTransform: 'capitalize',
    //         fontWeight: 'bold',
    //         position: 'relative',
    //         paddingLeft: '15px',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //     }
    // },
    // statusContainer: {
    //     '& span::before': {
    //         content: '',
    //         position: 'relative',
    //         height: '10px',
    //         width: '10px',
    //         borderRadius: '50%',
    //         marginRight: '7px',
    //         backgroundColor: '#000',
    //     }
    // },
    // statusContainer: {
    //     '& .delivered:before': {
    //         content: '',
    //         backgroundColor: 'green',
    //     }
    // },
    // statusContainer: {
    //     '& .cancelled:before': {
    //         content: '',
    //         backgroundColor: 'red',
    //     }
    // },
    // statusContainer: {
    //     '&.ordered:before': {
    //         content: '',
    //         backgroundColor: 'gray',
    //     }
    // },
    // statusContainer: {
    //     '& .returned:before': {
    //         content: '',
    //         backgroundColor: 'orange',
    //     }
    // }
})
export default withStyles(styles, { withTheme: true })(DeliveryStatus) 
