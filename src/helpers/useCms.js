import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core'
import React, { useState, useEffect, useContext, createContext } from 'react'
import { VscClose } from 'react-icons/vsc'
import { useQuery, useQueryCache } from 'react-query'
import { useI18n } from '.'
import Api from '../Api'
import { navigate } from '../components/common/Router'
import { CMS_DATA } from '../Constants'
import { useCart } from './useCart'

const cmsContext = createContext()
const isBrowser = typeof window !== 'undefined'
// Provider component that wraps your app and makes address object ...
// ... available to any child component that calls useAuth().
export function ProvideCmsData({ children }) {
  const cms = useCMSData()
  return (
    <cmsContext.Provider value={cms}>
      {children}
    </cmsContext.Provider>)
}

// Hook for child components to get the address object ...
// ... and re-render when it changes.
export const useCms = () => {
  return useContext(cmsContext)
}

// Provider hook that creates address object and handles state
function useCMSData() {
  const [homePageData, setHomePageData] = React.useState([])
  const [faqs, setFaqs] = React.useState([])
  const queryCache = useQueryCache()
  const i18n = useI18n()
  const { isLoading, error, data } = useQuery(
    CMS_DATA,
    () => Api.getHomeContent()
  )

  React.useEffect(() => {
    if (data && data.data) {
      setHomePageData(data.data.data)
    }
  }, [data])


  const getFaqData = () => {
    Api.getFaqs()
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            setFaqs(response.data.data)
          } else { }
        }
      })
  }
  const getAboutData = () => {
    Api.getFaqs()
      .then((response) => {
        if (response.ok) {
          if (response.data.result === 1) {
            setFaqs(response.data.data)
          } else { }
        }
      })
  }
  return {
    homePageData,
    getFaqData,
    faqs,
    getAboutData
    // getHomePageData
  }
}
