import { create } from 'apisauce'

import envConfig from '../../core/env-config.json'
import { useStores } from '../../providers/StoreProvider'

const environment = process.env.REACT_APP_ENVIRONMENT
const apiUrl = envConfig[environment]['api_url']

export const URIS = {
  HOME: section => `api/HomePage?section=${section}`,
  LOGIN: 'api/Login'
}

const createApiClient = (baseURL = apiUrl) => {
  const api = create({
    baseURL: apiUrl,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    },
    timeout: 15000
  })

  const setAuthorizationHeader = (userId) =>
    api.setHeader('UserId', userId)

  const setHeaders = (params) => {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key]
        api.setHeader(key, element)
      }
    }
  }

  const loginUser = payload => {
    const body = {
      phoneNumber: payload.username,
      passWord: payload.password
    }
    return api.post(URIS.LOGIN, body)
  }

  const fetchHomePageData = payload => {
    return api.get(URIS.HOME(payload.section))
  }

  // kickoff our api functions
  return {
    // client modifiers
    setAuthorizationHeader,
    fetchHomePageData,
    loginUser
  }
}

export default { createApiClient }
