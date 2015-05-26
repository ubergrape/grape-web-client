import React from 'react'
import useSheet from 'react-jss'
import assign from 'lodash-es/object/assign'
import pick from 'lodash-es/object/pick'

import sectionStyle from './sectionStyle'
import Object from '../object/Object'

/**
 * One grid section which has a title and items.
 */
export default React.createClass({
  mixins: [useSheet(sectionStyle)],

  render() {
    let {classes} = this.sheet
    let {results, label} = this.props

    let objects = results.map(result => {
      assign(result, pick(this.props, 'onFocus', 'onSelect', 'onInvisible',
        'visibilityContainment', 'icon'))
      result.ref = 'object' + result.id
      return <Object {...result} />
    })

    return (
      <section>
        <header className={classes.header}>{label}</header>
        {objects}
      </section>
    )
  }
})
