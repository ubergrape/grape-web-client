import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'grape-web/lib/components/button'
import { noop } from 'lodash'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import sizes from 'grape-theme/dist/sizes'
import fonts from 'grape-theme/dist/fonts'
import { gray, white } from 'grape-theme/dist/base-colors'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import { FormattedMessage, injectIntl } from 'react-intl'

class Login extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onLogin: PropTypes.func,
  }

  static defaultProps = {
    onLogin: noop,
  }

  render() {
    const { classes, onLogin } = this.props

    return (
      <div className={classes.login}>
        <Icon name="grape" className={classes.logo} />
        <FormattedMessage
          id="loginHl"
          defaultMessage="Join the chat!"
          description="Embedded chat login view headline."
        >
          {(...children) => <h2 className={classes.headline}>{children}</h2>}
        </FormattedMessage>
        <FormattedMessage
          id="loginHint"
          defaultMessage="Please log in to join the conversation on Grape."
          description="Embedded chat login view hint."
        >
          {(...children) => <h2 className={classes.hint}>{children}</h2>}
        </FormattedMessage>
        <FormattedMessage
          id="loginSubmit"
          defaultMessage="Log in now"
          description="Embedded chat login view submit button."
        >
          {(...children) => (
            <Button
              raised
              color="primary"
              className={classes.button}
              onClick={onLogin}
            >
              {children}
            </Button>
          )}
        </FormattedMessage>
      </div>
    )
  }
}

export default injectSheet({
  spacer: {
    margin: sizes.spacer.m,
  },
  login: {
    composes: '$spacer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
  },
  logo: {
    composes: '$spacer',
    width: sizes.icon.l,
    height: sizes.icon.l,
  },
  headline: {
    composes: '$spacer',
    extend: fonts.big,
    color: gray,
    textAlign: 'center',
  },
  hint: {
    composes: '$spacer',
    extend: fonts.small,
    color: gray,
    textAlign: 'center',
    width: '100%', // necessary for IE11 to make sure the text doesn't get cut off
  },
  button: {
    isolate: false,
    composes: '$spacer',
    extend: ellipsis,
    color: white,
  },
})(injectIntl(Login))
