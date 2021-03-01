import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import { bigger } from 'grape-theme/dist/fonts'
import { spacer } from 'grape-theme/dist/sizes'
import { blue } from 'grape-theme/dist/base-colors'

import {
  WantToChat,
  NoChannelsToChatIn,
  StartNewConversation,
} from '../i18n/i18n'
import buttonSecondary from '../button/secondary'

const styles = {
  block: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  message: {
    width: 500,
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: `${spacer.l}%`,
  },
  title: {
    fontSize: bigger.fontSize,
    fontWeight: '600',
  },
  body: {
    marginTop: spacer.l,
    textAlign: 'center',
    lineHeight: `${spacer.xl}px`,
  },
  buttons: {
    marginTop: spacer.l,
  },
  button: {
    extend: buttonSecondary,
    backgroundColor: blue,
    borderColor: blue,
    margin: '0 10px',
  },
}

const NoChannels = ({ classes, onNewConversation }) => (
  <div className={classes.block}>
    <div className={classes.message}>
      <h3 className={classes.title}>
        <WantToChat />
      </h3>
      <p className={classes.body}>
        <NoChannelsToChatIn />
      </p>
      <div className={classes.buttons}>
        <button onClick={onNewConversation} className={classes.button}>
          <StartNewConversation />
        </button>
      </div>
    </div>
  </div>
)

export default injectSheet(styles)(NoChannels)
