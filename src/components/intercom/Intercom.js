import React, {PropTypes} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import SidebarPanel from '../sidebar-panel/SidebarPanel'

const messages = defineMessages({
  title: {
    id: 'grapeTeam',
    defaultMessage: 'Grape Team'
  }
})

function Intercom(props) {
  const {hideSidebar, intl: {formatMessage}} = props
  return (
    <SidebarPanel
      title={formatMessage(messages.title)}
      onClose={hideSidebar}/>
  )
}

Intercom.propTypes = {
  intl: intlShape.isRequired,
  hideSidebar: PropTypes.func.isRequired
}

export default injectIntl(Intercom)
