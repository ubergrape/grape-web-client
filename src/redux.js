import boundActions from './boundActions'

export function mapActionsToProps(actionsNamesOrNamesMap) {
  let actionsNames = actionsNamesOrNamesMap
  let namesMap = {}

  if (!Array.isArray(actionsNamesOrNamesMap)) {
    namesMap = actionsNamesOrNamesMap
    actionsNames = Object.keys(actionsNamesOrNamesMap)
  }

  return () => actionsNames.reduce(
      (selectedActions, actionName) => {
        const action = boundActions[actionName]
        // eslint-disable-next-line no-param-reassign
        if (action) selectedActions[namesMap[actionName] || actionName] = action
        return selectedActions
      },
      {}
    )
}
