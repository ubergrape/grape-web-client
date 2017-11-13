import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import IconButton from 'material-ui/IconButton'
import Icon from 'grape-web/lib/svg-icons/Icon'
import {FormattedMessage} from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import {iconSize} from './constants'

const tip = (
  <FormattedMessage
    id="pinToFavorites"
    description="Tooltip text"
    defaultMessage="Pin to Favorites"
  />
)

@injectSheet(({palette}) => ({
  button: {
    display: 'flex',
    width: iconSize + 16,
    height: iconSize + 16
  },
  star: {
    color: ({favorited}) => (favorited ? palette.secondary[700] : palette.text.primary),
    width: iconSize,
    height: iconSize,
    '&:hover': {
      isolate: false,
      cursor: 'pointer',
      // TODO Size here should not be needed.
      // https://github.com/cssinjs/react-jss/issues/165
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
    onFavorize: PropTypes.func.isRequired,
    onUnfavorize: PropTypes.func.isRequired
  }

  static defaultProps = {
    id: null,
    favorited: false
  }

  onToggle = () => {
    const {
      id,
      favorited,
      onFavorize,
      onUnfavorize
    } = this.props

    if (favorited) onUnfavorize(id)
    else onFavorize(id)
  }

  render() {
    const {
      favorited,
      classes
    } = this.props

    return (
      <Tooltip message={tip}>
        <IconButton
          onClick={this.onToggle}
          classes={classes}
        >
          <Icon name={favorited ? 'starFilled' : 'star'} className={classes.star} />
        </IconButton>
      </Tooltip>
    )
  }
}
