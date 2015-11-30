import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import Dialog from '../dialog/Dialog'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

/**
 * Billing warning dialog.
 */
@useSheet(style)
export default class BillingWarning extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    if (nextProps.enabled && nextProps.text && this.props.text !== nextProps.text) {
      this.props.showBillingWarning()
    }
  }

  onHide() {
    this.props.hideBillingWarning()
  }

  onGoToPayment() {
    this.props.goToPayment()
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <Dialog
        show={this.props.show}
        onHide={::this.onHide}
        title="Grape Trial">
        <div className={classes.content}>
          <div className={classes.text}>{this.props.text}</div>
          <div className={classes.actions}>
            <button
              onClick={::this.onHide}
              className={classes.continueTrial}>
              Continue Trial
            </button>
            <button
              onClick={::this.onGoToPayment}
              className={classes.enterDetails}
              >
              Enter Details
            </button>
          </div>
        </div>
      </Dialog>
    )
  }
}
