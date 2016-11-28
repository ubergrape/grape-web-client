import map from './map'

const getIndex = (layerName, relative) => {
  const index = map[layerName]
  if (!index) throw new Error(`z-index: couldn't find "${layerName}"`)
  const increment = typeof relative === 'number' ? relative : 0
  return index + increment
}

export const zIndex = (layerName) => {
  return getIndex(layerName)
}

export const above = (layerName) => {
  return getIndex(layerName, 1)
}

export const below = (layerName) => {
  return getIndex(layerName, -1)
}
