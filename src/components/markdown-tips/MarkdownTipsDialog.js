import React, {PropTypes, PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Dialog from '../dialog/Dialog'
import MarkdownTips from './MarkdownTips'
import {dialogStyles as styles} from './theme'

const messages = defineMessages({
  title: {
    id: 'markdownTipsDialogTitle',
    defineMessage: 'Markdown tips'
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
        title={formatMessage(messages.title)}>
        <div className={classes.wrapper}>
          <MarkdownTips />
        </div>
      </Dialog>
    )
  }
}
