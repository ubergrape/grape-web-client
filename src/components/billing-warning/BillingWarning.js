import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Dialog from '../dialog/Dialog'
import style from './style'

import {useSheet} from 'grape-web/lib/jss'

const messages = defineMessages({
  title: {
    id: 'GrapeTrial',
    defaultMessage: 'Grape Trial'
  }
})

/**
 * Billing warning dialog.
 */
@useSheet(style)
class BillingWarning extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    text: PropTypes.string.isRequired,
    showBillingWarning: PropTypes.func.isRequired,
    hideBillingWarning: PropTypes.func.isRequired,
    goToPayment: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enabled && nextProps.text && this.props.text !== nextProps.text) {
      this.props.showBillingWarning()
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onHide() {
    this.props.hideBillingWarning()
  }

  onGoToPayment() {
    this.props.goToPayment()
  }

  render() {
    const {formatMessage} = this.props.intl
    const {classes} = this.props.sheet
    return (
      <Dialog
        title={formatMessage(messages.title)}
        show={this.props.show}
        onHide={::this.onHide}>
        <div className={classes.content}>
          <div className={classes.text}>{this.props.text}</div>
          <div className={classes.actions}>
            <button
              onClick={::this.onHide}
              className={classes.continueTrial}>
              <FormattedMessage
                id="ContinueTrial"
                defaultMessage="Continue Trial" />
            </button>
            <button
              onClick={::this.onGoToPayment}
              className={classes.enterDetails}>
              <FormattedMessage
                id="EnterDetails"
                defaultMessage="Enter Details" />
            </button>
          </div>
        </div>
      </Dialog>
    )
  }
}

export default injectIntl(BillingWarning)
