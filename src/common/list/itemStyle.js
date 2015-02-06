'use strict'

import colors from 'ubergrape-theme/base-colors'
import fonts from 'ubergrape-theme/fonts'
import utils from 'ubergrape-jss-utils'

var containerHighlighted = {
  color: colors.white,
  background: colors.grapeLight
}

var container = {
  extend: [utils.ellipsis, fonts.normal],
  padding: '5px 10px',
  color: colors.grapeTypo,
  '&:hover': {
    extend: containerHighlighted
  }
}

export default {
  container: container,
  containerSelected: {
    extend: [container, containerHighlighted]
  },
  name: {
  },
  info: {
    color: colors.gainsboroLight,
    fontSize: 10,
    marginLeft: 7
  }
}
