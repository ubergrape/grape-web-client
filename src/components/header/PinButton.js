import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'
import IconButton from 'grape-web/lib/components/icon-button'
import Icon from 'grape-web/lib/svg-icons/Icon'
import sizes from 'grape-theme/dist/sizes'

import { PinnedMessages as PinnedMessagesText } from '../i18n'
import Tooltip from '../tooltip/HoverTooltip'

const styles = ({ palette }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  pipeAndButton: {
    display: 'flex',
  },
  button: {
    width: sizes.icon.xs,
    height: sizes.icon.xs,
    fontSize: sizes.icon.xs,
    color: palette.text.secondary,
    '&:hover': {
      isolate: false,
      color: palette.secondary.A200,
    },
  },
  divider: {
    width: 1,
    height: sizes.icon.xs,
    background: palette.blueGrey[400],
    margin: {
      // TODO
      // The problem here is that the left spacer looks visually smaller than the
      // right one, because of how icon looks like.
      // Should we have a spacer for this?
      left: sizes.spacer.xs + 2,
      right: sizes.spacer.xs,
    },
  },
})

const PinButton = ({ classes, className, onClick }) => (
  <div className={cn(classes.root, className)}>
    <Tooltip message={<PinnedMessagesText />}>
      <div className={classes.pipeAndButton}>
        <span className={classes.divider} />
        <IconButton onClick={onClick} className={classes.button}>
          <Icon name="pinFilled" className={classes.icon} />
        </IconButton>
      </div>
    </Tooltip>
  </div>
)

PinButton.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

PinButton.defaultProps = {
  onClick: undefined,
  className: undefined,
}

export default injectSheet(styles)(PinButton)
