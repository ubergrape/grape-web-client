function get(fontSize) {
  return {
    fontSize: fontSize,
    lineHeight: 1.5
  }
}

// TODO
// Move it to sizes.js
export default {
  smallest: get(7),
  smaller: get(10),
  small: get(12),
  normal: get(14),
  big: get(16),
  bigger: get(18),
  biggest: get(20)
}
