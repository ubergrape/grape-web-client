import boundActions from './boundActions'

export function mapActionsToProps(actionsNames, actionsPropsMap = {}) {
  return dispatch => {
    return actionsNames.reduce(
      (selectedActions, actionName) => {
        let action = boundActions[actionName]
        if (action) selectedActions[actionsPropsMap[actionName] || actionName] = action
        return selectedActions
      },
      {}
    )
  }
}
