import {bindActionCreators} from 'redux'
import {dispatch} from './store'
import * as actions from './actions'
export default bindActionCreators(actions, dispatch)
