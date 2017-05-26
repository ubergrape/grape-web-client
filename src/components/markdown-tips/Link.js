import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import {gray} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'
import cn from 'classnames'

@injectSheet({
  link: {
    extend: small,
    color: gray
  },
  button: {
    cursor: 'pointer',
    border: 0,
    font: 'inherit',
    color: 'inherit',
    padding: 0,
    textDecoration: 'underline',
    '&:hover, &:focus': {
      isolate: false,
      opacity: 0.8
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

  render() {
    const {classes, className, onClick} = this.props
    const Button = (
      <button className={classes.button} onClick={onClick} key="button">
        markdown
      </button>
    )
    return (
      <FormattedMessage
        id="markdownTipsLinkMessage"
        defaultMessage="You can also use {markdown}"
        values={{markdown: Button}}
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
