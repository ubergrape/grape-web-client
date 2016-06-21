import conf from 'conf'

import * as types from '../constants/actionTypes'
import {settings as intercom} from '../utils/intercom'

const initialState = {}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HANDLE_INITIAL_DATA: {
      const {customSupportEmailAddress: email} = conf.organization
      let href = 'mailto:'
      let type

      if (email) {
        href += email
        type = 'email'
      } else if (window.Intercom) {
        // TODO: move intercom settings to
        // the `grape-web-client` repo from the `chatgrape`.
        href += `${intercom.app_id}@incoming.intercom.io`
        type = 'intercom'
      }
      return {href, type}
    }
    default:
      return state
  }
}
