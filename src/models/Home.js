// import { action, thunk } from 'easy-peasy'
import BaseModel from './Base'
import { NETWORK_REQUEST } from '../Constants'

const STATIC_DATA = [
  {
    type: 'string',
    title: 'string',
    subtitle: 'string',
    image: 'string',
    data: [
      {
        id: 0,
        title: 'string',
        subtitle: 'string',
        action: {
          title: 'string',
          url: 'string'
        },
        image: 'string',
        data: [
          null
        ]
      }
    ]
  },
  {
    type: 'string',
    title: 'What We Do',
    subtitle: '',
    image: null,
    data: [
      {
        title: 'Scouting',
        subtitle: 'Annual scouting events in Arab and African Countries',
        action: null,
        image: 'scouting-pictogram-circle.png'
      },
      {
        title: 'Trials Events',
        subtitle: 'Annual trial events in the GCC, Arab and African countries. See our events page for more info',
        action: null,
        image: 'trial-events-pictogram-circle.png'
      },
      {
        title: 'Talent Development',
        subtitle: 'Nurturing talent through our Academy in Abu Dhabi, Regional FC or partners in Europe',
        action: null,
        image: 'talent-development-pictogram-circle.png'
      },
      {
        title: 'Partnerships',
        subtitle: 'Continuously growing large network of clubs regionally and internationally ',
        action: null,
        image: 'partnerships-pictogram-circle.png'
      },
      {
        title: 'Player Representation',
        subtitle: 'Finding a club, negotiating contracts, long term player development focused pathways ',
        action: null,
        image: 'player-epresentation-pictogram-circle.png'
      },
      {
        title: 'International Camps ',
        subtitle: 'For Teams and Players in the UAE or in Europe',
        action: null,
        image: 'international-camps-pictogram-circle.png'
      },
      {
        title: 'Scholarships & Other Pathways',
        subtitle: 'Continue studying and playing the USA on scholarship or pursue a coaching career',
        action: null,
        image: 'scholarships-pictogram-circle.png'
      }
    ]
  }
]

export default {
  ...BaseModel(),

  data: STATIC_DATA,

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
