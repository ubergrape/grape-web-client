import * as types from '../constants/actionTypes'

const initialState = {
  alerts: []
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_ALERT:
      const {payload} = action
      const alerts = state.alerts.filter(alert => alert.type !== payload.type)
      alerts.push(payload)
      return {
        alerts
      }
    case types.HIDE_ALERT:
      return {
        alerts: state.alerts.filter(alert => alert !== action.payload.alert)
      }
    default:
      return state
  }
}
