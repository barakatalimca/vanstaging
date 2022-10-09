import React from 'react'
import { Router } from '@reach/router'

import MyProfile from './my-profile'
import MyOrders from './my-orders'
import OrderDetails from './order-details'
import Checkout from './checkout'
import Wishlist from './wishlist'
import Payment from './payment'
import PrivateRoute from '../components/PrivateRoute'

const User = ({ classes }) => {
  return (
    <>
      <Router>
        <PrivateRoute path=':locale/user/my-profile' component={MyProfile} />
        <PrivateRoute path=':locale/user/my-orders' component={MyOrders} />
        <PrivateRoute path=':locale/user/order-details/:orderId' component={OrderDetails} />
        <PrivateRoute path=':locale/user/Checkout' component={Checkout} />
        <PrivateRoute path=':locale/user/wishlist' component={Wishlist} />
        <PrivateRoute path=':locale/payment' component={Payment} />
      </Router>
    </>
  )
}

export default User
