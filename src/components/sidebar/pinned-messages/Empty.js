import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import {FormattedMessage} from 'react-intl'

const styles = ({palette}) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: {
      right: sizes.spacer.l,
      left: sizes.spacer.l
    }
  },
  icon: {
    fontSize: sizes.icon.l,
    marginBottom: sizes.spacer.l
  },
  headline: {
    extend: fonts.bigger,
    color: palette.text.primary,
    marginBottom: sizes.spacer.l,
    textAlign: 'center'
  },
  description: {
    extend: fonts.small,
    color: palette.text.secondary,
    textAlign: 'center'
  }
})

const Empty = ({classes}) => (
  <div className={classes.root}>
    <Icon name="pinColored" className={classes.icon} />
    <h1 className={classes.headline}>
      <FormattedMessage
        id="emptyPinnedMessagesSidebarHeadline"
        defaultMessage="The most important messages go here."
        description="Headline in the sidebar, pinned messages zero design."
      />
    </h1>
    <p className={classes.description}>
      <FormattedMessage
        id="emptyPinnedMessagesSidebarDescription"
        defaultMessage="Group admins can mark the most important messages by clicking the pin button in the context menu."
        description="Description in the sidebar, pinned messages zero design."
      />
    </p>
  </div>
)

export default injectSheet(styles)(Empty)
