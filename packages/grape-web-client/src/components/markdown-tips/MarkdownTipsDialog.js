import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { defineMessages, intlShape, injectIntl } from 'react-intl'
import { borderDefault } from 'grape-theme/dist/web-colors'

import Dialog from '../dialog/Dialog'
import MarkdownTips from './MarkdownTips'

const messages = defineMessages({
  title: {
    id: 'markdownTipsDialogTitle',
    defaultMessage: 'Markdown tips',
  },
})

@injectSheet({
  root: {
    width: 525,
    display: 'block',
    padding: 20,
    borderTop: {
      width: 3,
      style: 'solid',
      color: borderDefault,
    },
    maxHeight: '80vh',
    overflowY: 'auto',
  },
})
@injectIntl
export default class MarkdownTipsDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
  }

  render() {
    const {
      intl: { formatMessage },
      sheet: { classes },
      show,
      onHide,
    } = this.props

    return (
      <Dialog show={show} onHide={onHide} title={formatMessage(messages.title)}>
        <div className={classes.root}>
          <MarkdownTips />
        </div>
      </Dialog>
    )
  }
}
