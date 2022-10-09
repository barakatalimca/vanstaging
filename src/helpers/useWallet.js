// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from 'react'
import Api from '../Api'

const walletContext = createContext()

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideWallet({ children }) {
  const wallet = useProvideWallet()

  return (
    <walletContext.Provider value={wallet}>
      {children}

    </walletContext.Provider>)
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useWallet = () => {
  return useContext(walletContext)
}

// Provider hook that creates auth object and handles state
function useProvideWallet() {
  const [walletBalance, setWalletBalance] = useState(0)
  const [isWalletSelected, setIsWalletSelected] = useState(false)
  const [isGiftValue, setIsGiftValue] = useState(false)
  const [giftText, setGiftText] = useState('')
  const [finalPrice, setFinalPrice] = useState(0)
  const [data, setData] = useState([])

  const selectWallet = () => {
    setIsWalletSelected(!isWalletSelected)
  }

  const setIsGift = () => {
    setIsGiftValue(!isGiftValue)
  }
  const setPrice = (payload) => {
    setFinalPrice(payload)
  }

  const fetchWalletDetails = () => {
    Api.getWallet()
      .then((response) => {
        if (response.ok) {
          setData(response.data.data)
          setWalletBalance(response.data?.wallet_balance)
        } else {
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  // Return the user object and auth methods
  return {
    walletBalance,
    data,
    isWalletSelected,
    finalPrice,
    fetchWalletDetails,
    selectWallet,
    setPrice,
    setIsGiftValue,
    setIsWalletSelected,
    setGiftText,
    isGiftValue,
    giftText,
    setIsGift
  }
}
