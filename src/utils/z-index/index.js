import warning from 'warning'
import map from './map'

export const zIndex = (layerName, relative) => {
  const index = map[layerName]
  warning(index, `Could not find z-index layer ${layerName}`)
  const increment = typeof relative === 'number' ? relative : 0
  return index + increment
}

export const above = layerName => zIndex(layerName, 1)

export const below = layerName => zIndex(layerName, -1)
