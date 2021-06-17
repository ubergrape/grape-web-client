const defaultEncoding = 'base64'
const prefix = 'data:image/svg+xml;'

export default function svg2base64(svg, encoding = defaultEncoding) {
  let encoded = svg
  if (encoding === 'base64') encoded = btoa(svg)
  return `${prefix + encoding},${encoded}`
}
