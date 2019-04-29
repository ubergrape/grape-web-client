import * as types from '../constants/actionTypes'
import * as typesAlerts from '../constants/alerts'
import conf from '../conf'

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
      alerts = alerts.filter(
        alert =>
          alert.type === typesAlerts.NOTIFICATIONS_REMINDER && !conf.embed,
      )
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
