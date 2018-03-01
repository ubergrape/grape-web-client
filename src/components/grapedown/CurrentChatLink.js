import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import inlineLink from '../button/inlineLink'

const styles = () => ({
  link: {
    ...inlineLink
  }
})

const CurrentChatLink = ({classes, href, onClick, channelId, messageId}) => (
  <span
    className={classes.link}
    onClick={() => onClick(channelId, messageId)}
  >
    {href}
  </span>
)

export default injectSheet(styles)(CurrentChatLink)
