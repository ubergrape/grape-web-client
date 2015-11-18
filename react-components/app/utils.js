import { bindActionCreators } from 'redux'
import * as actions from '../actions'

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
