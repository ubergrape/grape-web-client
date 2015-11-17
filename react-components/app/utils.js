import { bindActionCreators } from 'redux'
import * as actions from '../actions'

// TODO: possibly use 'reselect': https://github.com/faassen/reselect
export function mapStateToProps(node) {
  return state => {
    return {...state[node]}
  }
}

export function mapActionsToProps(actionsList) {
  return dispatch => {
    let bindedActions = bindActionCreators(actions, dispatch)

    return actionsList.reduce(
      (selectedActions, actionName) => {
        let action = bindedActions[actionName]
        if (action) selectedActions[actionName] = action
        return selectedActions
      },
      {}
    )
  }
}
