import * as types from '../constants/actionTypes'
import partition from 'lodash/collection/partition'

const initialState = {
  alerts: []
}

export default function reducers(state = initialState, action) {
  let alerts
  let alert
  const {payload} = action

  switch (action.type) {
    case types.SHOW_ALERT:
      alerts = state.alerts.filter(stateAlert => stateAlert.type !== payload.type)
      alerts.push(payload)
      return {
        alerts
      }

    case types.HIDE_ALERT:
      alerts = state.alerts.filter(stateAlert => stateAlert.type !== payload.alert.type)
      return {
        alerts
      }

    case types.CLEAR_ALERT_DELAY:
      [alert, alerts] = partition(state.alerts, stateAlert => stateAlert.type === payload.alert.type)
      if (alert.length) {
        alert = {...alert[0], delay: undefined}
        alerts.push(alert)
        return {
          alerts
        }
      }
      return state

    default:
      return state
  }
}
