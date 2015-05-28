import React from 'react'
import useSheet from 'react-jss'
import assign from 'lodash-es/object/assign'
import pick from 'lodash-es/object/pick'

import sectionStyle from './sectionStyle'

/**
 * One grid section which has a title and items.
 */
export default React.createClass({
  mixins: [useSheet(sectionStyle)],

  render() {
    let {classes} = this.sheet
<<<<<<< Updated upstream
    let {results, label} = this.props
=======
    let {Item, items, label} = this.props

    items = items.map((item, i) => {
      let props = pick(this.props, 'onFocus', 'onSelect', 'onInvisible',
        'visibilityContainment')

      return assign({}, item, props, {
        ref: 'item' + item.id,
        key: 'item' + i
      })
    })
>>>>>>> Stashed changes

    return (
      <section>
        <header className={classes.header}>{label}</header>
        {results.map(result => {
          assign(result, pick(this.props, 'onFocus', 'onSelect', 'onInvisible',
            'visibilityContainment', 'icon'))
          result.ref = 'object' + result.id
          return <Item {...result} />
        })}
      </section>
    )
  }
})
