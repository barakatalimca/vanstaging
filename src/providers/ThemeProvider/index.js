import React from 'react'
import {
  ThemeProvider as MaterialThemeProvider,
  StylesProvider as MaterialStylesProvider,
  jssPreset
} from '@material-ui/core/styles'
import { create } from 'jss'
import rtl from 'jss-rtl'
import jssTemplate from 'jss-plugin-template'

import theme, { defaultTheme } from './ConfigureTheme'

const jss = create({
  plugins: [...jssPreset().plugins, rtl(), jssTemplate()]
})

const ThemeProvider = ({ children }) => (
  <MaterialThemeProvider theme={theme}>{children}</MaterialThemeProvider>
)

const StylesProvider = ({ children }) => (
  <MaterialStylesProvider jss={jss}>{children}</MaterialStylesProvider>
)

export {
  ThemeProvider,
  StylesProvider,
  theme,
  defaultTheme
}
