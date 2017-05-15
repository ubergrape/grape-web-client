import PropTypes from 'prop-types'
import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import injectSheet from 'grape-web/lib/jss'
import style from './tabsStyle'
import Tab from './Tab'

/**
 * Tabs container.
 */
@injectSheet(style)
export default class Tabs extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    data: PropTypes.array,
    onSelect: PropTypes.func,
    onInvisible: PropTypes.func,
    onDidMount: PropTypes.func
  }

  static defaultProps = {
    data: undefined,
    onSelect: noop,
    onInvisible: noop,
    onDidMount: noop
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  getInnerComponent() {
    return this.refs.inner
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.tabs}>
        <ul className={classes.inner} ref="inner">
          {this.props.data.map(item => {
            const id = item.id || 'all'
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
}
