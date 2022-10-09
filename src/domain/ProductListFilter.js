import React, { useEffect, useState } from 'react'
import { withStyles, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, InputBase, TextField } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

import useWindowSize from '../helpers/useWindowSize'

const ProductListFilter = ({ classes }) => {
    const theme = useTheme()
    const { width } = useWindowSize()

    const [selectedCountry, setSelectedCountry] = useState(null)

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value)
        console.log(event.target.value)
    }

    return (
        <>
            <Box className={classes.filter} marginBottom={2}>
                <Typography className={classes.title} variant='h4' component='h4'>Filters</Typography>
            </Box>
            <Box>
                <Typography fontWeight="fontWeightBold" variant='h6' component='h6'>Size</Typography>
            </Box>
        </>
    )
}

const styles = (theme) => ({
    title: {
        background: '#000',
        color: '#fff',
        padding: '0.7rem 1rem',
        borderRadius: '4px'
    },
    filter: {
        position: 'sticky',
        top: '120px'
    }
})

export default withStyles(styles, { withTheme: true })(ProductListFilter)
