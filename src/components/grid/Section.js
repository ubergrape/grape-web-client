import React, {Component, PropTypes} from 'react'
import pick from 'lodash/object/pick'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import style from './sectionStyle'

/**
 * One grid section which has a title and items.
 */
@useSheet(style)
export default class Section extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onDidMount: PropTypes.func,
    onItemDidMount: PropTypes.func,
    Item: PropTypes.func,
    items: PropTypes.array,
    label: PropTypes.string,
    contentClassName: PropTypes.string
  }

  static defaultProps = {
    contentClassName: '',
    onDidMount: undefined
  }

  constructor(props) {
    super(props)
    this.items = {}
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onItemDidMount(item) {
    this.items[item.props.id] = item
  }

  onItemWillUnmount(item) {
    delete this.items[item.props.id]
  }

  getContentComponent() {
    return this.refs.content
  }

  render() {
    const {classes} = this.props.sheet
    const {Item} = this.props

    return (
      <section>
        <header className={classes.header}>{this.props.label}</header>
        <div className={this.props.contentClassName} ref="content">
          {this.props.items.map((data, i) => {
            const props = pick(this.props, 'onFocus', 'onSelect', 'onInvisible',
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
  }}
