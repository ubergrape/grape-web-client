import * as types from '../constants/actionTypes'

const initialState = {
  alerts: [],
}

export default function reduce(state = initialState, action) {
  let alerts
  const { payload } = action

  switch (action.type) {
    case types.SHOW_ALERT:
      alerts = state.alerts.filter(
        stateAlert => stateAlert.type !== payload.type,
      )
      alerts.push(payload)
      return {
        alerts,
      }
    case types.HIDE_ALERT:
      alerts = state.alerts.filter(
        stateAlert => stateAlert.type !== payload.type,
      )
      return {
        alerts,
      }

    default:
      return state
  }
}
