import React, {PropTypes, PureComponent} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import Grapedown from '../grapedown/Grapedown'
import {OwnBubble as Bubble} from '../history'
import {styles} from './markdownTipTheme'

const messages = defineMessages({
  example: {
    id: 'example',
    defaultMessage: 'Example',
    description: 'Title'
  },
  result: {
    id: 'result',
    defaultMessage: 'Result',
    description: 'Title'
  }
})

@injectSheet(styles)
@injectIntl
export default class MarkdownTip extends PureComponent {
  static propTypes = {
    example: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func
    ]).isRequired,
    intl: intlShape.isRequired,
    sheet: PropTypes.object.isRequired,
    title: PropTypes.object.isRequired
  }

  render() {
    const {
      example,
      intl: {formatMessage},
      sheet: {classes},
      title
    } = this.props

    const formattedExample = (
      typeof example === 'function' ? example(formatMessage) : formatMessage(example)
    ).trim()

    return (
      <div className={classes.section}>
        <h3 className={classes.title}>{formatMessage(title)}</h3>
        <div>
          <h4 className={classes.subheading}>{formatMessage(messages.example)}</h4>
          <div className={classes.example}>
            <pre><code>{formattedExample}</code></pre>
          </div>
          <h4 className={classes.subheading}>{formatMessage(messages.result)}</h4>
          <div aria-hidden="true">
            <Bubble hasArrow>
              <div className={classes.renderedExample}>
                <Grapedown
                  text={formattedExample}
                  user={{}}
                  customEmojis={{}}
                />
              </div>
            </Bubble>
          </div>
        </div>
      </div>
    )
  }
}
