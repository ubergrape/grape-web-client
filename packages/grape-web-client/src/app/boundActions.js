import { bindActionCreators } from 'redux'
import getStore from './store'
import * as actions from '../actions'

let boundActions

export default function getBoundActions() {
  if (!boundActions) {
    boundActions = bindActionCreators(actions, getStore().dispatch)
  }

  return boundActions
}
