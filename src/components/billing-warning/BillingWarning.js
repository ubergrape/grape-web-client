import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Dialog from '../dialog/Dialog'
import style from './style'

import injectSheet from 'grape-web/lib/jss'

const messages = defineMessages({
  title: {
    id: 'grapeTrial',
    defaultMessage: 'Grape Trial'
  }
})

/**
 * Billing warning dialog.
 */
@injectSheet(style)
@injectIntl
export default class BillingWarning extends Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

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
                id="continueTrial"
                defaultMessage="Continue Trial" />
            </button>
            <button
              onClick={::this.onGoToPayment}
              className={classes.enterDetails}>
              <FormattedMessage
                id="enterDetails"
                defaultMessage="Enter Details" />
            </button>
          </div>
        </div>
      </Dialog>
    )
  }
}
