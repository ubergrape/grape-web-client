import React from 'react'
import useSheet from 'react-jss'
import infoStyle from './infoStyle'
import * as contents from './infoContents'

/**
 * Info messages for the user for e.g. to explain integrations.
 */
export default React.createClass({
  mixins: [useSheet(infoStyle)],

  getDefaultProps() {
    return {
      canAddIntegrations: true,
      hasIntegrations: true,
      orgName: 'Organisation',
      orgOwner: 'org owner',
      headerHeight: undefined
    }
  },

  render() {
    let {classes} = this.sheet

    let addIntegration
    if (this.props.canAddIntegrations) {
      addIntegration = <button>Add</button>
    }

    let selected = 'basic'
    if (!this.props.hasIntegrations) {
      selected = this.props.canAddIntegrations ? 'canAdd' : 'needsHelp'
    }
    let content = contents[selected](this.props)

    let headerStyle = {height: this.props.headerHeight + 'px'}

    return (
      <article className={classes.info}>
        <header style={headerStyle} className={content.ok ? classes.headerOk : classes.headerNok}></header>
        <div className={content.ok ? classes.bodyOk : classes.bodyNok}>
          {content.title}
          {content.description}
          {addIntegration}
        </div>
      </article>
    )
  }
})
