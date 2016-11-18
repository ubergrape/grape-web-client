import React, {PureComponent} from 'react'
import {
  FormattedMessage,
  defineMessages
} from 'react-intl'
import stripIndent from 'common-tags/lib/stripIndent'

import Tip from './MarkdownTip'

const messages = defineMessages({
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

export default class MarkdownTips extends PureComponent {
  render() {
    return (
      <div>
        <FormattedMessage
          id="markdownTipsPitch"
          defaultMessage="How to improve your chat messages with some nifty styles" />

        <Tip example={messages.inlineStylesExample} title={messages.inlineStylesTitle} />
        <Tip example={messages.linksExample} title={messages.linksTitle} />
        <Tip example={(formatMessage) => (
          stripIndent`
            ${formatMessage(messages.codeSnippetsInlineExample)}

            \`\`\`
            <p>
              ${formatMessage(messages.codeSnippetsBlockExample)}
            </p>
            \`\`\`
          `)}
          title={messages.codeSnippetsTitle} />
        <Tip example={messages.blockquoteExample} title={messages.blockquoteTitle} />
      </div>
    )
  }
}
