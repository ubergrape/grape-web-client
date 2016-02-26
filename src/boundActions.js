import {bindActionCreators} from 'redux'
import {dispatch} from './store'
import * as actions from './actions'
// TODO its a hack, should work withot it.
delete actions.__esModule
export default bindActionCreators(actions, dispatch)
