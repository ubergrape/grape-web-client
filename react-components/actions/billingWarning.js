import * as types from '../constants/actionTypes'

export function showBillingWarning() {
  return {
    type: types.SHOW_BILLING_WARNING,
    payload: {
      show: true
    }
  }
}

export function hideBillingWarning() {
  return {
    type: types.HIDE_BILLING_WARNING,
    payload: {
      show: false
    }
  }
}
