// import { action } from 'easy-peasy'

const Theme = {
  theme: 'light',

  setTheme: action((state, payload) => {
    state.theme = payload
  })
}

export default Theme
