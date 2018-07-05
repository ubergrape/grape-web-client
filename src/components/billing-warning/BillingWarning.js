import compose from 'lodash/function/compose'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl,
} from 'react-intl'

import Dialog from '../dialog/Dialog'
import { styles } from './theme'

const messages = defineMessages({
  title: {
    id: 'grapeTrial',
    defaultMessage: 'Grape Trial',
  },
})

/**
 * Billing warning dialog.
 */

class BillingWarning extends PureComponent {
  static propTypes = {
    enabled: PropTypes.bool,
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    text: PropTypes.string.isRequired,
    showBillingWarning: PropTypes.func.isRequired,
    hideBillingWarning: PropTypes.func.isRequired,
    goToPayment: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    enabled: false,
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.enabled &&
      nextProps.text &&
      this.props.text !== nextProps.text
    ) {
      this.props.showBillingWarning()
    }
  }

  onHide = () => {
    this.props.hideBillingWarning()
  }

  onGoToPayment = () => {
    this.props.goToPayment()
  }

  render() {
    const {
      intl: { formatMessage },
      sheet: { classes },
    } = this.props

    return (
      <Dialog
        title={formatMessage(messages.title)}
        show={this.props.show}
        onHide={this.onHide}
      >
        <div className={classes.content}>
          <div className={classes.text}>{this.props.text}</div>
          <div className={classes.actions}>
            <button onClick={this.onHide} className={classes.continueTrial}>
              <FormattedMessage
                id="continueTrial"
                defaultMessage="Continue Trial"
              />
            </button>
            <button
              onClick={this.onGoToPayment}
              className={classes.enterDetails}
            >
              <FormattedMessage
                id="enterDetails"
                defaultMessage="Enter Details"
              />
            </button>
          </div>
        </div>
      </Dialog>
    )
  }
}

export default compose(
  injectSheet(styles),
  injectIntl,
)(BillingWarning)
