function get(fontSize) {
  return {
    fontSize: fontSize,
    lineHeight: 1.5
  }
}

// TODO
// Move it to sizes.js
export default {
  smaller: get(11),
  small: get(13),
  normal: get(15),
  big: get(17),
  bigger: get(19),
  biggest: get(21)
}
