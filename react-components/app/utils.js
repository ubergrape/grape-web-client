import boundActions from './boundActions'

export function mapActionsToProps(actionsNames) {
  return dispatch => {
    return actionsNames.reduce(
      (selectedActions, actionName) => {
        let action = boundActions[actionName]
        if (action) selectedActions[actionName] = action
        return selectedActions
      },
      {}
    )
  }
}
