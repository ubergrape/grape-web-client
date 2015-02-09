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
  padding: '5px 7px',
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
  name: {},
  info: {
    color: colors.gainsboroLight,
    fontSize: 10,
    marginLeft: 7
  },
  date: {
    extend: fonts.small,
    padding: '0 8px',
    textTransform: 'uppercase'
  },
  icon: {
    color: '#b9b7bb',
    paddingRight: 5
  }
}
