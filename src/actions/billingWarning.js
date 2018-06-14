import * as types from '../constants/actionTypes'

export function showBillingWarning() {
  return {
    type: types.SHOW_BILLING_WARNING,
  }
}

export function hideBillingWarning() {
  return {
    type: types.HIDE_BILLING_WARNING,
  }
}
