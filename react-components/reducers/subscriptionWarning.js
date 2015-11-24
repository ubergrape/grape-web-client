import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  text: '',
  level: 'info'
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_SETTINGS:
      return {...state, enabled: !action.payload.settings.showIntro}
    case types.SET_ORG:
      return {...state, ...action.payload.org.billingWarning}
    case types.SHOW_SUBSCRIPTION_WARNING:
    case types.HIDE_SUBSCRIPTION_WARNING:
      return {...state, ...action.payload}
    default:
      return state
  }
}
