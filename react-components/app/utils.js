import boundActions from './boundActions'

export function mapActionsToProps(actionsNames, actionsPropsMap = {}) {
  return () => {
    return actionsNames.reduce(
      (selectedActions, actionName) => {
        const action = boundActions[actionName]
        if (action) selectedActions[actionsPropsMap[actionName] || actionName] = action
        return selectedActions
      },
      {}
    )
  }
}

/**
 * Open a url in browser and MacGap.
 */
export function openUrl(url) {
  if (window.MacGap) {
    return window.MacGap.openURL(url)
  }

  window.open(url)
}
