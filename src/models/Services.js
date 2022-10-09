// import { action, thunk } from 'easy-peasy'
import BaseModel from './Base'
import { NETWORK_REQUEST } from '../Constants'

const STATIC_DATA = [
  {
    type: null,
    title: null,
    subtitle: '',
    image: null,
    data: [
      {
        title: 'Scouting',
        subtitle: 'Annual scouting events in Arab and African Countries',
        action: null,
        image: '../scouting-pictogram-circle.png'
      },
      {
        title: 'Trials Events',
        subtitle: 'Annual trial events in the GCC, Arab and African countries. See our events page for more info',
        action: null,
        image: '../trial-events-pictogram-circle.png'
      },
      {
        title: 'Talent Development',
        subtitle: 'Nurturing talent through our Academy in Abu Dhabi, Regional FC or partners in Europe',
        action: null,
        image: '../talent-development-pictogram-circle.png'
      },
      {
        title: 'Partnerships',
        subtitle: 'Continuously growing large network of clubs regionally and internationally ',
        action: null,
        image: '../partnerships-pictogram-circle.png'
      },
      {
        title: 'Player Representation',
        subtitle: 'Finding a club, negotiating contracts, long term player development focused pathways ',
        action: null,
        image: '../player-epresentation-pictogram-circle.png'
      },
      {
        title: 'International Camps ',
        subtitle: 'For Teams and Players in the UAE or in Europe',
        action: null,
        image: '../international-camps-pictogram-circle.png'
      },
      {
        title: 'Scholarships & Other Pathways',
        subtitle: 'Continue studying and playing the USA on scholarship or pursue a coaching career',
        action: null,
        image: '../scholarships-pictogram-circle.png'
      }
    ]
  },
  {
    type: null,
    title: 'OUR THREE STAGE APPROACH TO SUCCESS',
    subtitle: '',
    image: null,
    data: [
      {
        title: 'Identify Talent',
        subtitle: 'Annual scouting events in Arab and African Countries',
        action: null,
        image: 'players-huddled-fading-gradient.png'
      },
      {
        title: 'Develop & Optimise',
        subtitle: 'We develop our players either at our football academy or with partner academies in other countries',
        action: null,
        image: 'player-kicks-ball-fading-gradient.png'
      },
      {
        title: 'Connect with Clubs',
        subtitle: 'We provide every player with the best possible opportunities to progress in their football career',
        action: null,
        image: 'ball-in-field-fading-gradient.png'
      }
    ]
  },
  {
    type: null,
    title: 'The Process',
    subtitle: '',
    image: null,
    data: [
      {
        title: 'Register on our website',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'Find the closest event to you',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'Register for the event and pay online',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'Attend the trial event',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'Get scouted by scouts from all over the world',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'RSM will get in touch with those who are successfully selected by clubs',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'RSM will help you prepare all your paperwork, visa, travel arrangements, airport pick up, accommodation, food and training needs. This will be at the players cost.',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'Attend the 1 – 2 week trial at the club in Europe',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'If you are successful, RSM will represent you and help you get settled at your club.',
        subtitle: null,
        action: null,
        image: null
      },
      {
        title: 'If you are not successful, RSM will find you another club for a trial',
        subtitle: null,
        action: null,
        image: null
      }
    ]
  }
]

export default {
  // ...BaseModel(),

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

  // fetched: action((state, payload) => {
  //   state.data = payload
  // })
}
