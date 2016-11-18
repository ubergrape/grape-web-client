import React, {PropTypes, PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import Dialog from '../dialog/Dialog'
import MarkdownTips from './MarkdownTips'
import {dialogStyles as styles} from './theme'

@injectSheet(styles)
export default class MarkdownTipsDialog extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
  }

  render() {
    const {sheet: {classes}, show, onHide} = this.props

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title="Markdown Tips">
        <div className={classes.wrapper}>
          <MarkdownTips />
        </div>
      </Dialog>
    )
  }
}
