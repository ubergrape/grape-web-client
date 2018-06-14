import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { defineMessages, intlShape, injectIntl } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import { gray, grayLighter } from 'grape-theme/dist/base-colors'
import { bigger, small } from 'grape-theme/dist/fonts'

import { Grapedown } from '../grapedown'
import { OwnBubble as Bubble } from '../history'
import contentStyles from '../message-parts/contentStyles'

const messages = defineMessages({
  example: {
    id: 'example',
    defaultMessage: 'Example',
    description: 'Title',
  },
  result: {
    id: 'result',
    defaultMessage: 'Result',
    description: 'Title',
  },
})

@injectSheet({
  root: {
    display: 'block',
    marginTop: 20,
    paddingTop: 20,
    borderTop: {
      width: 1,
      style: 'solid',
      color: grayLighter,
    },
    '&:first-child': {
      isolate: false,
      marginTop: 0,
    },
  },
  title: {
    extend: bigger,
    marginBottom: 5,
  },
  subheading: {
    extend: small,
    fontStyle: 'italic',
    margin: [20, 0, 5],
    textTransform: 'capitalize',
    color: gray,
  },
  example: {
    extend: contentStyles['& code'],
    width: 'auto',
    display: 'block',
    padding: 10,
    whiteSpace: 'pre-line',
    backgroundColor: grayLighter,
    overflow: 'auto',
  },
  renderedExample: {
    extend: contentStyles,
    '& pre code': {
      isolate: false,
      width: 'auto',
    },
  },
})
@injectIntl
export default class MarkdownTip extends PureComponent {
  static propTypes = {
    example: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
    intl: intlShape.isRequired,
    sheet: PropTypes.object.isRequired,
    title: PropTypes.object.isRequired,
  }

  render() {
    const {
      example,
      intl: { formatMessage },
      sheet: { classes },
      title,
    } = this.props

    const formattedExample = (typeof example === 'function'
      ? example(formatMessage)
      : formatMessage(example)
    ).trim()

    return (
      <div className={classes.root}>
        <h3 className={classes.title}>{formatMessage(title)}</h3>
        <div>
          <h4 className={classes.subheading}>
            {formatMessage(messages.example)}
          </h4>
          <div className={classes.example}>
            <pre>
              <code>{formattedExample}</code>
            </pre>
          </div>
          <h4 className={classes.subheading}>
            {formatMessage(messages.result)}
          </h4>
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
