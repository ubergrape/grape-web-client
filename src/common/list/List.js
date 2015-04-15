import React from 'react'
import useSheet from 'react-jss'
import cloneDeep from 'lodash-es/lang/cloneDeep'
import assign from 'lodash-es/object/assign'
import pick from 'lodash-es/object/pick'

import Section from './Section'
import listStyle from './listStyle'

/**
 * List for search results.
 */
let List = React.createClass({
  mixins: [useSheet(listStyle)],

  getDefaultProps() {
    return {
      height: null,
      className: '',
      data: null,
      focus: null,
      select: null
    }
  },

  render() {
    let {data} = this.props
    let classes = this.sheet.classes
    let sections

    if (data.length) {
      sections = data.map(function (section) {
        assign(section, pick(this.props, 'focus', 'select'))
        return <Section {...section}  key={section.service}/>
      }, this)
    }

    let style = {
      height: `${this.props.height}px`
    }

    return (
      <div
        className={`${classes.container} ${this.props.className}`}
        style={style}
        >
        {sections}
      </div>
    )
  }
})

export default List
