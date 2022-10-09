// import { action } from 'easy-peasy'

const Counter = {
  count: 0,

  increment: action((state, payload) => {
    state.count++
  }),

  decrement: action((state, payload) => {
    state.count--
  })
}

export default Counter
