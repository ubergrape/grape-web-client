import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import IconButton from 'material-ui/IconButton'
import Icon from 'grape-web/lib/svg-icons/Icon'

import {iconSize} from './constants'

@injectSheet(({palette}) => ({
  root: {
    '&, & *': {
      isolate: false,
      cursor: 'pointer'
    }
  },
  star: {
    color: ({favorited}) => (favorited ? palette.secondary[700] : palette.text.primary),
    width: iconSize,
    height: iconSize,
    '&:hover': {
      isolate: false,
      // TODO fix a bug in React-JSS. Size here should not be needed.
      width: iconSize,
      height: iconSize,
      color: ({favorited}) => (favorited ? palette.secondary[500] : palette.accent.A200)
    }
  }
}))
export default class Favorite extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.number,
    favorited: PropTypes.bool,
    requestAddChannelToFavorites: PropTypes.func.isRequired,
    requestRemoveChannelFromFavorites: PropTypes.func.isRequired
  }

  static defaultProps = {
    id: null,
    favorited: false
  }

  onToggle = () => {
    const {
      id,
      favorited,
      requestAddChannelToFavorites,
      requestRemoveChannelFromFavorites
    } = this.props

    if (favorited) {
      requestRemoveChannelFromFavorites(id)
      return
    }

    requestAddChannelToFavorites(id)
  }

  render() {
    const {
      favorited,
      classes
    } = this.props

    return (
      <IconButton onClick={this.onToggle} className={classes.root}>
        <Icon name={favorited ? 'starFilled' : 'star'} className={classes.star} />
      </IconButton>
    )
  }
}
