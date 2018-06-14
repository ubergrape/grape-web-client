import * as raw from './raw'
import dom from './dom'

const cache = {}

/**
 * Modifies `fill` and `stroke` attribute of `path`, caches the resulting string.
 */
export default function getColored({
  name,
  color,
  format = 'data',
  replaceColor = 'currentColor',
}) {
  const key = name + color + format

  if (!cache[key]) {
    const list = dom(raw[name]).find(
      `[fill="${replaceColor}"],[stroke="${replaceColor}"]`,
    )
    list.each(node => {
      if (node.getAttribute('stroke') === replaceColor) {
        node.setAttribute('stroke', color)
      }
      if (node.getAttribute('fill') === replaceColor) {
        node.setAttribute('fill', color)
      }
    })
    cache[key] = list[format]()
  }

  return cache[key]
}
