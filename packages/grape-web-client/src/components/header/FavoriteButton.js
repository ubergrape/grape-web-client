import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import IconButton from 'grape-web/lib/components/icon-button'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { FormattedMessage } from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import { iconSize } from './constants'

const pinTip = (
  <FormattedMessage
    id="pinToFavorites"
    description="Pin to favorites tooltip text"
    defaultMessage="Pin to Favorites"
  />
)

const removeTip = (
  <FormattedMessage
    id="removeFromFavorites"
    description="Tooltip text"
    defaultMessage="Remove from Favorites"
  />
)

@injectSheet(({ palette }) => ({
  button: {
    display: 'flex',
    width: iconSize + 16,
    height: iconSize + 16,
  },
  star: {
    color: ({ favorited }) =>
      favorited ? palette.secondary[700] : palette.text.primary,
    width: iconSize,
    height: iconSize,
    '&:hover': {
      isolate: false,
      cursor: 'pointer',
      // TODO Size here should not be needed.
      // https://github.com/cssinjs/react-jss/issues/165
      width: iconSize,
      height: iconSize,
      color: ({ favorited, colors }) =>
        favorited
          ? palette.secondary[500]
          : colors.button || palette.secondary.A200,
    },
  },
}))
export default class Favorite extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.number,
    favorited: PropTypes.bool,
    onFavorize: PropTypes.func.isRequired,
    onUnfavorize: PropTypes.func.isRequired,
  }

  static defaultProps = {
    id: null,
    favorited: false,
  }

  onToggle = () => {
    const { id, favorited, onFavorize, onUnfavorize } = this.props

    if (favorited) onUnfavorize(id)
    else onFavorize(id)
  }

  render() {
    const { favorited, classes } = this.props

    return (
      <Tooltip message={favorited ? removeTip : pinTip}>
        <IconButton onClick={this.onToggle} className={classes.button}>
          <Icon
            name={favorited ? 'starFilled' : 'star'}
            className={classes.star}
          />
        </IconButton>
      </Tooltip>
    )
  }
}
