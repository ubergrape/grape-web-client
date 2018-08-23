import PropTypes from 'prop-types'
import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import A11yDialog from '../a11y-dialog/A11yDialog'

export const styles = {}

class NewConversation extends Component {
  static propTypes = {
    // classes: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    // showNewConversation: PropTypes.func.isRequired,
    hideNewConversation: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // console.log('new conversation dialog')
  }

  render() {
    const { hideNewConversation, show } = this.props
    return (
      <A11yDialog
        id="new-conversation"
        title="New conversation"
        show={show}
        onHide={hideNewConversation}
      />
    )
  }
}

export default injectSheet(styles)(NewConversation)
