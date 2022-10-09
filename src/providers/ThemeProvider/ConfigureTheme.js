import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

export const defaultTheme = createMuiTheme()

let theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1440
    }
  },
  palette: {
    type: 'light',
    primary: {
      // main: '#e0aa25',
      main: '#f26b3e'
    },
    orange: {
    },
    secondary: {
      main: '#000'
    },
    grey: {
      main: '#999'
    }
    // error: {
    // main: red.A400,
    // },
    // background: {
    // default: "#fff",
    // },
  },
  typography: {
    fontFamily: 'Rubik,Roboto, Helvetica, Arial, sans-serif'
  }
})

theme = responsiveFontSizes(theme)

export default theme
