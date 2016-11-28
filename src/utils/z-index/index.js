import map from './map'

const getIndex = (layerName, relative) => {
  const index = map[layerName]
  if (!index) throw new Error(`z-index: could find "${layerName}"`)

  let increment
  switch (relative) {
    case 'above':
      increment = 1
    case 'below':
      increment = -1
    default:
      increment = 0
  }

  return index + increment
}

export const zIndex = (layerName) => {
  return getIndex(layerName)
}

export const above = (layerName) => {
  return getIndex(layerName, 'above')
}

export const below = (layerName) => {
  return getIndex(layerName, 'below')
}
