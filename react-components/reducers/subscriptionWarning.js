import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  text: '',
  level: 'info'
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_ORG:
      const {billingWarning} = action.payload.org
      if (billingWarning) return {...state, ...billingWarning, show: true}
      return state
    case types.HIDE_SUBSCRIPTION_WARNING:
      return {...state, ...action.payload}
    default:
      return state
  }
}
