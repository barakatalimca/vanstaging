// import { action, thunk } from 'easy-peasy'
import BaseModel from './Base'
import { NETWORK_REQUEST } from '../Constants'

const MODEL = {
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
  ageGroup: null,
  country: null,
  address: null,
  location: [],
  teamCount: null,
  playerCountByPosition: [],
  fee: null,
  title: null,
  description: null,
  image: null
}

export default {
  ...BaseModel(),

  model: MODEL,

  fetch: thunk(async (actions, payload, { dispatch, getState, getStoreState, injections: { api } }) => {
    actions.updateStatus(NETWORK_REQUEST.FETCHING)

    // const responses = await Promise.all([
    //   api.fetchHomePageData({ section: 'banner' }),
    //   api.fetchHomePageData({ section: 'whatwedo' }),
    //   api.fetchHomePageData({ section: 'howwework' }),
    //   api.fetchHomePageData({ section: 'affiliations' })
    // ])

    // if (responses) {
    //   actions.fetched(responses)
    // }
    actions.updateStatus(NETWORK_REQUEST.SUCCESS)
  }),

  fetched: action((state, payload) => {
    state.data = payload
  })
}
