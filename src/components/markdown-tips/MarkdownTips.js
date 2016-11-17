import {mdReact} from 'markdown-react-js'
import React, {PropTypes, PureComponent} from 'react'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import stripIndent from 'common-tags/lib/stripIndent'
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
  },
  inlineStylesTitle: {
    id: 'inlineStyles',
    defaultMessage: 'Inline Styles'
  },
  inlineStylesExample: {
    id: 'inlineStylesExample',
    defaultMessage: 'You can write in *italic*, **bold** and in ~~strike trough~~'
  },
  linksTitle: {
    id: 'links',
    defaultMessage: 'Links'
  },
  linksExample: {
    id: 'linksExample',
    defaultMessage: '[A link to ChatGrape](https://chatgrape.com)'
  },
  codeSnippetsTitle: {
    id: 'codeSnippets',
    defaultMessage: 'Code Snippets'
  },
  codeSnippetsInlineExample: {
    id: 'codeSnippetsInlineExample',
    defaultMessage: 'This is `Inline` Code'
  },
  codeSnippetsBlockExample: {
    id: 'codeSnippetsBlockExample',
    defaultMessage: 'This is a Code Block'
  },
  blockquoteTitle: {
    id: 'blockquote',
    defaultMessage: 'Blockquote'
  },
  blockquoteExample: {
    id: 'blockquoteExample',
    defaultMessage: "> One of the coolest products I've used in a while"
  }
})

@injectSheet(styles)
@injectIntl
export default class MarkdownTips extends PureComponent {
  constructor(props) {
    super(props)
    this.renderer = mdReact()
  }

  static propTypes = {
    intl: intlShape.isRequired,
    sheet: PropTypes.object.isRequired
  }

  renderTip(title, example) {
    const {
      intl: {formatMessage},
      sheet: {classes}
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

  render() {
    return (
      <div>
        <FormattedMessage
          id="markdownTipsPitch"
          defaultMessage="How to improve your chat messages with some nifty styles" />

        {
          this.renderTip(
            messages.inlineStylesTitle,
            messages.inlineStylesExample
          )
        }
        {
          this.renderTip(
            messages.linksTitle,
            messages.linksExample
          )
        }
        {
          this.renderTip(
            messages.codeSnippetsTitle,
            (formatMessage) => stripIndent`
            ${formatMessage(messages.codeSnippetsInlineExample)}
            \`\`\`
            <p>
              ${formatMessage(messages.codeSnippetsBlockExample)}
            </p>
            \`\`\`
            `
          )
        }
        {
          this.renderTip(
            messages.blockquoteTitle,
            messages.blockquoteExample
          )
        }
      </div>
    )
  }
}
