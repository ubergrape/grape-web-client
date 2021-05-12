import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import List from 'react-finite-list'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'
import { defineMessages, intlShape, injectIntl } from 'react-intl'
import noop from 'lodash/noop'

import style from './actionsStyle'

const messages = defineMessages({
  insert: {
    id: 'insertAction',
    defaultMessage: 'Insert into message',
  },
  open: {
    id: 'openAction',
    defaultMessage: 'Open',
  },
})

/**
 * Document actions.
 */
class Actions extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    items: PropTypes.array,
    focused: PropTypes.bool,
    focusedAction: PropTypes.object,
    hoveredAction: PropTypes.object,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    focused: false,
    items: [],
    focusedAction: undefined,
    hoveredAction: undefined,
    onFocus: noop,
    onBlur: noop,
    onSelect: noop,
  }

  renderItem = ({ item, focused }) => {
    const {
      sheet: { classes },
      intl: { formatMessage },
    } = this.props
    let focusedClass = ''
    let iconColor = colors.grayBlueDark

    if (focused) {
      focusedClass = this.props.focused
        ? classes.actionFocused
        : classes.actionFocusedInactive
      if (this.props.focused) iconColor = colors.white
    }

    const hovered = this.props.hoveredAction === item
    if (hovered && !this.props.focused) {
      focusedClass = classes.actionFocused
      iconColor = colors.white
    }

    const icon = getColoredIcon({ name: item.icon, color: iconColor })
    const backgroundImage = `url('${icon}')`

    return (
      <div
        className={`${classes.action} ${focusedClass}`}
        /* eslint-disable react/jsx-no-bind */
        onMouseEnter={this.props.onFocus.bind(null, item)}
        onMouseLeave={this.props.onBlur.bind(null, item)}
        /* eslint-enable react/jsx-no-bind */
        key={`action-${item.type}`}
      >
        <span style={{ backgroundImage }} className={classes.icon} />
        <span className={classes.text}>
          {formatMessage(messages[item.type])}
        </span>
      </div>
    )
  }

  render() {
    const { classes } = this.props.sheet
    return (
      <List
        className={classes.actions}
        renderItem={this.renderItem}
        items={this.props.items}
        onSelect={this.props.onSelect}
        focused={this.props.focusedAction}
        forceRerender={this.props.focused}
      />
    )
  }
}

export default injectSheet(style)(injectIntl(Actions))
