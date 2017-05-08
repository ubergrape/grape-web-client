import React from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import {grayBlueLight} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import MagicWand from 'grape-web/lib/svg-icons/components/MagicWand'

import {spacing} from '../sidebar-panel/theme'

const TrainingModeHint = ({classes}) => (
  <div className={classes.hint}>
    <MagicWand className={classes.magicWand} />
    <FormattedMessage
      id="trainingModeHint"
      defaultMessage="IA: This system is in training mode"
    />
  </div>
)

const styles = {
  hint: {
    extend: [small, ellipsis],
    display: 'flex',
    background: grayBlueLight,
    borderTop: [1, 'solid', webColors.borderDefault],
    padding: [5, spacing]
  },
  magicWand: {
    height: '1.2em',
    marginRight: 5
  }
}

export default injectSheet(styles)(TrainingModeHint)

