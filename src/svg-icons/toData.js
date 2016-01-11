const prefix = 'data:image/svg+xml;base64,'

export default function toData(svg) {
  return prefix + btoa(svg)
}
