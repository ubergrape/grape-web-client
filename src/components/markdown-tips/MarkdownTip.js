import {mdReact} from 'markdown-react-js'
import React, {PropTypes, PureComponent} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import {tipsStyles as styles} from './theme'

const messages = defineMessages({
  example: {
    id: 'Example',
    defaultMessage: 'Example'
  },
  result: {
    id: 'Result',
    defaultMessage: 'Result'
  }
})

@injectSheet(styles)
@injectIntl
export default class MarkdownTip extends PureComponent {
  constructor(props) {
    super(props)
    this.renderer = mdReact()
  }

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
          <div className={classes.example}><pre><code>{formattedExample}</code></pre></div>
          <h4 className={classes.subheading}>{formatMessage(messages.result)}</h4>
          <div className={classes.renderedExample} aria-hidden="true">{this.renderer(formattedExample)}</div>
        </div>
      </div>
    )
  }
}
