import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  text: '',
  level: 'info',
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_SETTINGS:
      return { ...state, enabled: !action.payload.showIntro }
    case types.SET_ORG:
      return { ...state, ...action.payload.billingWarning }
    case types.SHOW_BILLING_WARNING:
      return { ...state, show: true }
    case types.HIDE_BILLING_WARNING:
      return { ...state, show: false }
    default:
      return state
  }
}
