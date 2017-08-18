import 'custom-event-polyfill'
import 'innersvg-polyfill'

import {init} from './api'

export * from './api'

// Legacy init, remove it.
if (window.CHATGRAPE_CONFIG) {
  const div = document.body.appendChild(document.createElement('div'))
  div.id = 'grape-client'
  div.style.height = '100%'
  init({...window.CHATGRAPE_CONFIG, container: `#${div.id}`})
}
