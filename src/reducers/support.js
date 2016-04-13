import conf from 'conf'

let href = 'mailto:'
let type

if (conf.customSupportEmailAddress) {
  href += conf.customSupportEmailAddress
  type = 'email'
} else if (window.Intercom) {
  href += `${window.intercomSettings.app_id}@incoming.intercom.io`
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
