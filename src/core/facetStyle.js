'use strict'

var container = {
  float: 'left',
  listStyleType: 'none',
  cursor: 'pointer'
}

export default {
  container: container,
  containerActive: {
    extend: container,
    background: 'red'
  }
}
