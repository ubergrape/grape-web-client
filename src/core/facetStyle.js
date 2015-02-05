'use strict'

var container = {
  float: 'left',
  listStyleType: 'none',
  cursor: 'pointer'
}

export default {
  container: container,
  containerSelected: {
    extend: container,
    background: 'red'
  }
}
