import conf from '../conf'
import * as types from '../constants/actionTypes'
import { goTo } from './'

export const loginFromEmbedded = () => dispatch => {
  dispatch({ type: types.LOGIN_FROM_EMBEDDED })
  if (conf.organization.ssoEnabled) {
    dispatch(
      goTo(`${conf.server.serviceUrl}/sso/sso?next=${window.location.href}`),
    )
    return
  }
  dispatch(
    goTo(
      `${conf.server.serviceUrl}/accounts/login/?next=${window.location.href}`,
    ),
  )
}
