import React, {PropTypes} from 'react'

import SidebarPanel from '../sidebar-panel/SidebarPanel'

export default function Intercom({hideSidebar}) {
  return (
    <SidebarPanel
      title={"Grape Team"}
      onClose={hideSidebar}/>
  )
}

Intercom.propTypes = {
  hideSidebar: PropTypes.func.isRequired
}
