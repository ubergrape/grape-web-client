import React from 'react'
import useSheet from 'react-jss'
import pick from 'lodash-es/object/pick'

import sectionStyle from './sectionStyle'

/**
 * One grid section which has a title and items.
 */
export default React.createClass({
  mixins: [useSheet(sectionStyle)],

  getDefaultProps() {
    contentClassName: ''
  },

  render() {
    let {classes} = this.sheet
    let {Item, items, label} = this.props

    items = items.map((item, i) => {
      let props = pick(this.props, 'onFocus', 'onSelect', 'onInvisible',
        'visibilityContainment')
      return {...item, ...props, ref: 'item' + item.id, key: 'item' + i}
    })

    return (
      <section>
        <header className={classes.header}>{label}</header>
        <div className={this.props.contentClassName} ref="content">
          {items.map(item => <Item {...item} />)}
        </div>
      </section>
    )
  },

  getContentClientRect() {
    return this.refs.content.getDOMNode().getBoundingClientRect()
  }
})
