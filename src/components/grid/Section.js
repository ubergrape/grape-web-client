import React, {Component} from 'react'
import useSheet from 'react-jss'
import pick from 'lodash-es/object/pick'

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

  componentDidMount() {
    this.props.onDidMount(this)
  }

  render() {
    let {classes} = this.props.sheet
    let {Item, items, label} = this.props

    items = items.map((item, i) => {
      let props = pick(this.props, 'onFocus', 'onSelect', 'onInvisible',
        'visibilityContainment')
      return {...item, ...props, key: 'item' + i, onDidMount: ::this.onItemDidMount}
    })

    return (
      <section>
        <header className={classes.header}>{label}</header>
        <div className={this.props.contentClassName} ref="content">
          {items.map(item => <Item {...item} />)}
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
}
