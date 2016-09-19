export default {
  tooltip: {
    position: 'absolute',
    zIndex: 1
  },
  arrow: {
    position: 'absolute',
    overflow: 'hidden'
  },
  pointer: {
    position: 'absolute',
     // translateZ(0) is fixing arrow rendering in Chrome
     // in case when its parent (`arrow`) has any transform property.
    transform: 'rotate(45deg) translateZ(0)'
  }
}
