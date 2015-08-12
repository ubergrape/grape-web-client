import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from './tabsStyle'
import Tab from './Tab'

/**
 * Tabs container.
 */
@useSheet(style)
export default class Tabs extends Component {
  static defaultProps = {
    data: undefined,
    onSelect: noop,
    onInvisible: noop,
    onDidMount: noop
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    this.props.onDidMount(this)
  }

  render() {
    let {classes} = this.props.sheet

    return (
      <div className={classes.tabs}>
        <ul className={classes.inner} ref="inner">
          {this.props.data.map(item => {
            let id = item.id || 'all'
            return (
              <Tab
                {...item}
                onSelect={this.props.onSelect}
                onInvisible={this.props.onInvisible}
                visibilityContainment={this}
                key={id}
                ref={id} />
            )
          })}
        </ul>
      </div>
    )
  }

  getInnerComponent() {
    return this.refs.inner
  }
}
