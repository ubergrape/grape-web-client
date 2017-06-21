import * as raw from './raw'
import dom from './dom'

const cache = {}

/**
 * Modifies `fill` and `stroke` attribute of `path`, caches the resulting string.
 */
export default function getColored({name, color, format = 'data'}) {
  const key = name + color + format

  if (!cache[key]) {
    cache[key] = dom(raw[name])
      .find('path')
      .attr('fill', color)
      .each((node) => {
        if (!node.hasAttribute('stroke')) return
        node.setAttribute('stroke', color)
      })
      // eslint-disable-next-line no-unexpected-multiline
      [format]()
  }

  return cache[key]
}
