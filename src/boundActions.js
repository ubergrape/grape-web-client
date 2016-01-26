import {bindActionCreators} from 'redux'
import {dispatch} from './store'
import * as actions from './actions'
delete actions.__esModule
export default bindActionCreators(actions, dispatch)
