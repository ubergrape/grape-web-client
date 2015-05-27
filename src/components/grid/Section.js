import React from 'react'
import useSheet from 'react-jss'
import assign from 'lodash-es/object/assign'
import pick from 'lodash-es/object/pick'

import sectionStyle from './sectionStyle'
import Item from '../item/Item'

/**
 * One grid section which has a title and items.
 */
export default React.createClass({
  mixins: [useSheet(sectionStyle)],

  render() {
    let {classes} = this.sheet
    let {items, label} = this.props

    items = items.map((item, i) => {
      let props = pick(this.props, 'onFocus', 'onSelect', 'onInvisible',
        'visibilityContainment', 'icon')

      return assign({}, item, props, {
        ref: 'item' + item.id,
        key: 'item' + i
      })
    })


    return (
      <section>
        <header className={classes.header}>{label}</header>
        {items.map(item => <Item {...item} />)}
      </section>
    )
  }
})
