import * as types from '../constants/actionTypes'

const initialState = {
  alerts: []
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_ALERT:
      return {
        alerts: [...state.alerts, action.payload]
      }
    case types.HIDE_ALERT:
      return {
        alerts: state.alerts.filter(alert => alert !== action.payload.alert)
      }
    default:
      return state
  }
}
