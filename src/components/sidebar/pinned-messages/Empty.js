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
        defaultMessage="No messages have been pinned yet!"
        description="Headline in the sidebar, pinned messages zero design."
      />
    </h1>
    <p className={classes.description}>
      <FormattedMessage
        id="emptyPinnedMessagesSidebarDescription"
        defaultMessage='Choose "Pin message" in the context menu of any message to make it show up here.'
        description="Description in the sidebar, pinned messages zero design."
      />
    </p>
  </div>
)

export default injectSheet(styles)(Empty)
