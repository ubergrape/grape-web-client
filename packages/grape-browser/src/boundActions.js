import { bindActionCreators } from 'redux'
import getStore from './store'
import * as actions from './actions'

export default bindActionCreators(actions, getStore().dispatch)
