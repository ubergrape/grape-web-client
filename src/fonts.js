var base = 13

function get(fontSize, lineHeight) {
  return {
    fontSize: fontSize,
    lineHeight: lineHeight + 'px'
  }
}

export default {
  small: get(10, 11.5),
  normal: get(14, 20),
  big: get(16, 20),
  bigger: get(21, 23),
  biggest: get(26, 29)
}
