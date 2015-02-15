import React from 'react'
import useSheet from 'react-jss'
import objectStyle from './objectStyle'

/**
 * One result for the list section.
 */
let Object = React.createClass({
  mixins: [useSheet(objectStyle)],

  render() {
    let classes = this.sheet.classes
    let containerClassName = this.props.selected ? classes.containerSelected : classes.container
    let date = ''
    if (this.props.date) {
      date = <span className={classes.date}>{this.getLocaleDateString()}</span>
    }
    // TODO: use svg icons, don't use global selectors.
    let iconClassNames = `fa fa-${this.props.icon} ` + classes.icon
    return (
      <div onClick={this.pick} onMouseOver={this.select} className={containerClassName} key={this.props.id}>
        <span className={iconClassNames}></span>
        <span className={classes.name} dangerouslySetInnerHTML={{__html: this.props.highlighted}} />
        <span className={classes.info}>{this.props.info}</span>
        {date}
      </div>
    )
  },

  getLocaleDateString() {
    // TODO We need to centralize current locale constant.
    return this.props.date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  },

  select() {
    this.props.select(this.props.id)
  },

  pick() {
    this.props.pick(this.props.id)
  }
})

export default Object
