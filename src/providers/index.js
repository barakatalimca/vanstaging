import React from 'react'
import { CssBaseline, NoSsr } from '@material-ui/core'
import { Provider as StateProvider } from 'react-redux'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'

import { ThemeProvider, StylesProvider } from './ThemeProvider'
import { ProvideAuth } from '../helpers/useAuth'
import { ProvideWishList } from '../helpers/useWishList'
import { CustomerOrderDataProvider } from '../helpers/useCustomerOrderData'
import { AllProductsDataProvider, ProvideAddressData, ProvideCmsData, ProvideWallet } from '../helpers'
import { CartProvider } from '../helpers/useCart'
import { CheckoutProvider } from '../helpers/useCheckout'
import { store } from '../store'
import { IntlProvider } from 'react-intl'
import { useMatch } from '@reach/router'

const queryCache = new QueryCache()

// eslint-disable-next-line react/display-name,react/prop-types
const RootProvider = ({ element, locale }) => {
  // const match = useMatch(':locale/')
  return (
    // <I18nextProvider i18n={i18n}>
    <StateProvider store={store}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <NoSsr>
          <IntlProvider locale='ar'>
            <ThemeProvider>
              <StylesProvider>
                <ProvideAuth>
                  <AllProductsDataProvider>
                    <ProvideCmsData>
                      <ProvideAddressData>
                        <ProvideWallet>
                          <CustomerOrderDataProvider>
                            <CssBaseline />
                            <CartProvider>
                              <CheckoutProvider>
                                <ProvideWishList>
                                  {element}
                                </ProvideWishList>
                              </CheckoutProvider>
                            </CartProvider>
                          </CustomerOrderDataProvider>
                        </ProvideWallet>
                      </ProvideAddressData>
                    </ProvideCmsData>
                  </AllProductsDataProvider>
                </ProvideAuth>
              </StylesProvider>
            </ThemeProvider>
          </IntlProvider>
        </NoSsr>
      </ReactQueryCacheProvider>
    </StateProvider>
    // </I18nextProvider>
  )
}

export default RootProvider
