import React, {Component} from 'react'
import useSheet from 'react-jss'
import pick from 'lodash-es/object/pick'
import {shouldPureComponentUpdate} from 'react-pure-render'

import style from './sectionStyle'

/**
 * One grid section which has a title and items.
 */
@useSheet(style)
export default class Section extends Component {
  static defaultProps = {
    contentClassName: '',
    onDidMount: undefined
  }

  constructor(props) {
    super(props)
    this.items = {}
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    this.props.onDidMount(this)
  }

  render() {
    let {classes} = this.props.sheet
    let {Item} = this.props

    return (
      <section>
        <header className={classes.header}>{this.props.label}</header>
        <div className={this.props.contentClassName} ref="content">
          {this.props.items.map((data, i) => {
            let props = pick(this.props, 'onFocus', 'onSelect', 'onInvisible',
              'visibilityContainment')
            return (
              <Item
                {...data}
                {...props}
                key={'item' + i}
                onDidMount={::this.onItemDidMount}
                onWillUnmount={::this.onItemWillUnmount} />
            )
          })}
        </div>
      </section>
    )
  }

  getContentComponent() {
    return this.refs.content
  }

  onItemDidMount(item) {
    this.items[item.props.id] = item
  }

  onItemWillUnmount(item) {
    delete this.items[item.props.id]
  }
}
