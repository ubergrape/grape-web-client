import boundActions from './boundActions'

export function mapActionsToProps(namesMap) {
  const actionsNames = Object.keys(namesMap)

  return () => actionsNames.reduce((props, actionName) => {
    const action = boundActions[actionName]
    // eslint-disable-next-line no-param-reassign
    props[namesMap[actionName]] = action
    return props
  }, {})
}
