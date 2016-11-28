import map from './map'

export const zIndex = (layerName, relative) => {
  const index = map[layerName]
  if (!index) throw new Error(`z-index: couldn't find "${layerName}"`)
  const increment = typeof relative === 'number' ? relative : 0
  return index + increment
}

export const above = (layerName) => {
  return zIndex(layerName, 1)
}

export const below = (layerName) => {
  return zIndex(layerName, -1)
}
