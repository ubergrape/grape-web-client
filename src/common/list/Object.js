import React from 'react'
import useSheet from 'react-jss'
import objectStyle from './objectStyle'

/**
 * One result for the list section.
 */
let Object = React.createClass({
  mixins: [useSheet(objectStyle)],

  render() {
    let {classes} = this.sheet
    let {id, focused, icon, info, highlighted} = this.props
    let containerClassName = focused ? classes.containerFocused : classes.container
    let date
    if (this.props.date) {
      date = <span className={classes.date}>{this.getLocaleDateString()}</span>
    }
    // TODO: use svg icons, don't use global selectors.
    let iconClassNames = `fa fa-${icon} ` + classes.icon
    return (
      <div onClick={this.select} onMouseOver={this.focus} className={containerClassName} key={id}>
        <span className={iconClassNames}></span>
        <span className={classes.name} dangerouslySetInnerHTML={{__html: highlighted}} />
        <span className={classes.info}>{info}</span>
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

  focus() {
    this.props.focus(this.props.id)
  },

  select() {
    this.props.select(this.props.id)
  }
})

export default Object
