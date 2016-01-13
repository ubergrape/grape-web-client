import React, {Component, PropTypes} from 'react'
import List from 'react-finite-list'
import * as icons from 'grape-web/lib/svg-icons/data'

import {useSheet} from 'grape-web/lib/jss'
import style from './actionsStyle'

/**
 * Document actions.
 */
@useSheet(style)
export default class Actions extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    items: PropTypes.array,
    focused: PropTypes.bool,
    focusedAction: PropTypes.object
  }

  static defaultProps = {
    focused: false
  }

  onSelect(/* action */) {
  }

  renderItem({item, focused}) {
    const {classes} = this.props.sheet
    const backgroundImage = `url('${icons[item.icon]}')`
    let focusedClass = ''
    if (focused) {
      focusedClass = this.props.focused ? classes.actionFocused : classes.actionFocusedBg
    }

    return (
      <div className={`${classes.action} ${focusedClass}`}>
        <span style={{backgroundImage}} className={classes.icon} />
        <span className={classes.text}>{item.text}</span>
      </div>
    )
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <List
        className={classes.actions}
        items={this.props.items}
        renderItem={::this.renderItem}
        onSelect={::this.onSelect}
        focused={this.props.focusedAction}
        ref="list" />
    )
  }
}
