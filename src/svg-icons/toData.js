const prefix = 'data:image/svg+xml;utf8,'

export default function toData(svg) {
  return prefix + svg
}
