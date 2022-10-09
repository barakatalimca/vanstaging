import React from 'react'
import { Link } from '../components/common/Router'
import { withStyles, Box, Typography, Button, Grid, Container } from '@material-ui/core'
const LIST = [{
    id: 1,
    name: 'Poultry',
    imageUrl: 'https://vangava.com/van/uploads/category_icon/poultryicon.jpg',
},
{
    id: 2,
    name: 'Beef/Veal',
    imageUrl: 'https://vangava.com/van/uploads/product_image/beef.jpg',
},
{
    id: 3,
    name: 'Sea Food',
    imageUrl: 'https://vangava.com/van/uploads/product_image/seafood.jpg',
},
{
    id: 4,
    name: 'Mutton',
    imageUrl: 'https://vangava.com/van/uploads/product_image/mutton.jpg',
},
]
const NavDropDown = ({ data, classes, }) => {
    const [dataList, setData] = React.useState([])

    React.useEffect(() => {
        setData(LIST)
    }, [])
    return (
        <>
            
        </>
    )
}
const styles = (theme) => ({

})
export default withStyles(styles, { withTheme: true })(NavDropDown)