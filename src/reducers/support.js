import conf from 'conf'
import {settings as intercom} from '../utils/intercom'

let href = 'mailto:'
let type

if (conf.customSupportEmailAddress) {
  href += conf.customSupportEmailAddress
  type = 'email'
} else if (window.Intercom) {
  // TODO: move intercom settings to
  // the `grape-web-client` repo from the `chatgrape`.
  href += `${intercom.app_id}@incoming.intercom.io`
  type = 'intercom'
}

const initialState = {
  href,
  type
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
