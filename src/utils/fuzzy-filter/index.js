import Fuse from 'fuse.js'

export function find(search, data, keys, threshold = 0.3) {
  return new Fuse(data, {keys, threshold}).search(search)
}
