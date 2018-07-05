import getBoundActions from './boundActions'

export function mapActionsToProps(actionsNamesOrNamesMap) {
  let actionsNames = actionsNamesOrNamesMap
  let namesMap = {}

  if (!Array.isArray(actionsNamesOrNamesMap)) {
    namesMap = actionsNamesOrNamesMap
    actionsNames = Object.keys(actionsNamesOrNamesMap)
  }

  return () =>
    actionsNames.reduce((selectedActions, actionName) => {
      const action = getBoundActions()[actionName]
      const newSelectedActions = selectedActions

      if (action) {
        newSelectedActions[namesMap[actionName] || actionName] = action
      }

      return newSelectedActions
    }, {})
}
