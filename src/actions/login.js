import conf from '../conf'
import * as types from '../constants/actionTypes'
import {goTo} from './'

export const loginFromEmbedded = () => (dispatch) => {
  dispatch({type: types.LOGIN_FROM_EMBEDDED})
  const url = `${conf.server.serviceUrl}/accounts/login/?next=${location.href}`
  dispatch(goTo({url}))
}
