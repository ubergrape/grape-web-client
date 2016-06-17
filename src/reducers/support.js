import conf from 'conf'
import {settings as intercom} from '../utils/intercom'

const initialState = {}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    default: {
      let href = 'mailto:'
      let type

      console.log(conf)
      if (conf.organization.customSupportEmailAddress) {
        href += conf.organization.customSupportEmailAddress
        type = 'email'
      } else if (window.Intercom) {
        // TODO: move intercom settings to
        // the `grape-web-client` repo from the `chatgrape`.
        href += `${intercom.app_id}@incoming.intercom.io`
        type = 'intercom'
      }

      return {href, type}
    }
  }
}
