import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import {gray} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'
import cn from 'classnames'
import Button from 'material-ui/Button'

@injectSheet({
  link: {
    extend: small,
    color: gray
  },
  button: {
    textDecoration: 'underline',
    '&[href]:hover': {
      isolate: false,
      textDecoration: 'underline',
      color: 'inherit',
      opacity: 0.8
    },
    '&[href]': {
      display: 'inline',
      color: 'inherit'
    }
  }
})
export default class Link extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: null
  }

  onClick = (e) => {
    e.preventDefault()
    this.props.onClick()
  }

  render() {
    const {classes, className} = this.props
    const button = (
      <Button onClick={this.onClick} className={classes.button} href="#" key="button">
        markdown
      </Button>
    )
    return (
      <FormattedMessage
        id="markdownTipsLinkMessage"
        defaultMessage="You can also use {markdown}"
        values={{markdown: button}}
      >
        {(...nodes) => (
          <span className={cn(classes.link, className)}>
            {nodes}
          </span>
        )}
      </FormattedMessage>
    )
  }
}
