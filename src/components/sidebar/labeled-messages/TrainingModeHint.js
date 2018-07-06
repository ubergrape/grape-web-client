import React from 'react'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import { grayBlueLight } from 'grape-theme/dist/base-colors'
import { small } from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import sizes from 'grape-theme/dist/sizes'
import MagicWand from 'grape-web/lib/components/svg-icons/MagicWand'

import linkButton from '../../button/link'
import { spacing } from '../constants'

const TrainingModeHint = ({ classes }) => (
  <div className={classes.hint}>
    <MagicWand className={classes.magicWand} />
    <FormattedMessage
      id="trainingModeHintWithLink"
      defaultMessage="IA: This system is in training mode ({learnMoreLink})"
      values={{
        learnMoreLink: (
          <FormattedMessage
            id="learnMoreLink"
            description="learn more link"
            defaultMessage="learn more"
          >
            {(...nodes) => (
              <a
                href="https://www.chatgrape.com/ia-labels/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.linkButton}
              >
                {nodes}
              </a>
            )}
          </FormattedMessage>
        ),
      }}
    />
  </div>
)

const styles = {
  hint: {
    extend: [small, ellipsis],
    display: 'flex',
    background: grayBlueLight,
    borderTop: [1, 'solid', webColors.borderDefault],
    padding: [5, spacing],
  },
  magicWand: {
    height: sizes.icon.s,
    width: sizes.icon.s,
    marginRight: 5,
  },
  linkButton: {
    extend: [linkButton, small],
  },
}

export default injectSheet(styles)(TrainingModeHint)
