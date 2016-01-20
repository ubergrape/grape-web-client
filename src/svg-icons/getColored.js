import * as raw from './raw'
import dom from './dom'

const cache = {}

/**
 * Modifies `fill` and `stroke` attribute of `path`, caches resulting svg string.
 */
export default function getColored({name, color}) {
  const key = name + color

  if (!cache[key]) {
    cache[key] = dom(raw[name])
      .find('path')
      .attr('fill', color)
      .attr('stroke', color)
      .data()
  }

  return cache[key]
}
