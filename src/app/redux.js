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
      const actions = selectedActions
      const action = getBoundActions()[actionName]
      if (action) actions[namesMap[actionName] || actionName] = action
      return actions
    }, {})
}
