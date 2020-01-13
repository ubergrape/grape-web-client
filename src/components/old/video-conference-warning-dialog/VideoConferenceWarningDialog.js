import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'
import {
  intlShape,
  injectIntl,
  defineMessages,
  FormattedMessage,
} from 'react-intl'

import Dialog from '../dialog/Dialog'
import styles from './theme'

const messages = defineMessages({
  title: {
    id: 'videoConferencingTitle',
    defaultMessage:
      "Sorry, video conferencing isn't supported in this browser.",
  },
})

class VideoConferenceWarningDialog extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    grapecallUrl: PropTypes.string,
    intl: intlShape.isRequired,
    show: PropTypes.bool.isRequired,
    sheet: PropTypes.object.isRequired,
  }

  static defaultProps = {
    grapecallUrl: '',
  }

  onHide = () => {
    this.props.onHide()
  }

  render() {
    const {
      intl: { formatMessage },
      sheet: { classes },
      grapecallUrl,
    } = this.props

    if (!grapecallUrl) return null

    return (
      <Dialog
        width={600}
        title={formatMessage(messages.title)}
        show={this.props.show}
        onHide={this.onHide}
      >
        <div className={classes.content}>
          <span className={cn(classes.text, classes.description)}>
            <FormattedMessage
              id="unsupportedBrowser"
              defaultMessage="Unfortunately, the browser you are using at the moment doesn’t support video conferencing with Grape Call. Please use our {desktopApp} instead."
              values={{
                desktopApp: (
                  <span className={cn(classes.text, classes.bold)}>
                    <FormattedMessage
                      id="desktopApp"
                      defaultMessage="desktop app"
                    />
                  </span>
                ),
              }}
            />
          </span>
          <div className={classes.wrapper}>
            <a
              href={`chatgrape://${grapecallUrl.replace(/(^\w+:|^)\/\//, '')}`}
              className={classes.link}
            >
              <span className={classes.icon} />
              <span className={classes.text}>
                <FormattedMessage
                  id="openInDesktop"
                  defaultMessage="Open in Grape Desktop"
                />
              </span>
            </a>
            <span className={cn(classes.text, classes.download)}>
              <FormattedMessage
                id="downloadGrape"
                defaultMessage="{download}, if you haven’t installed it yet."
                values={{
                  download: (
                    <a
                      href="https://github.com/ubergrape/grape-electron/releases/latest"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        classes.blueLink,
                        classes.text,
                        classes.bold,
                      )}
                    >
                      <FormattedMessage
                        id="downloadGrapeDesktop"
                        defaultMessage="Download Grape Desktop"
                      />
                    </a>
                  ),
                }}
              />
            </span>
          </div>
          <span className={cn(classes.text, classes.alternative)}>
            <FormattedMessage
              id="altenativeBrowser"
              defaultMessage="Alternatively you can use Grape with {browsers} to enjoy the full experience."
              values={{
                browsers: (
                  <span className={cn(classes.text, classes.bold)}>
                    <FormattedMessage
                      id="chromeOrFirefox"
                      defaultMessage="Chrome or Firefox"
                    />
                  </span>
                ),
              }}
            />
          </span>
        </div>
      </Dialog>
    )
  }
}

export default injectSheet(styles)(injectIntl(VideoConferenceWarningDialog))
