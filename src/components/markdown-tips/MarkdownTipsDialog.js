import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Dialog from '../dialog/Dialog'
import MarkdownTips from './MarkdownTips'
import {styles} from './markdownTipsDialogTheme'

const messages = defineMessages({
  title: {
    id: 'markdownTipsDialogTitle',
    defaultMessage: 'Markdown tips'
  }
})

@injectSheet(styles)
@injectIntl
export default class MarkdownTipsDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
  }

  render() {
    const {
      intl: {formatMessage},
      sheet: {classes},
      show,
      onHide
    } = this.props

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title={formatMessage(messages.title)}
      >
        <div className={classes.wrapper}>
          <MarkdownTips />
        </div>
      </Dialog>
    )
  }
}
