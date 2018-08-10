import PropTypes from 'prop-types'
import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import Dialog from '../dialog/Dialog'

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
    const { show, hideNewConversation } = this.props
    return (
      <Dialog show={show} onHide={hideNewConversation} title="New Conversation">
        <div>Hello World</div>
      </Dialog>
    )
  }
}

export default injectSheet(styles)(NewConversation)
