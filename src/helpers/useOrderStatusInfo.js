import React from 'react'

export const getOrderStatusColor = (orderStatus) => {
  switch (orderStatus) {
    case 'ordered':
      return 'rgb(63, 81, 181)'
    case 'delivered':
      return 'rgb(56, 142, 60)'
    case 'cancelled':
      return 'rgb(244, 67, 54)'
    case 'returned':
      return 'rgb(33, 150, 243)'
    default:
      return 'gray'
  }
}

const useOrderStatusInfo = () => {
  return {
    getOrderStatusColor
  }
}

export default useOrderStatusInfo
