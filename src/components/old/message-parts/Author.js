import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import { gray } from 'grape-theme/dist/base-colors'
import { small } from 'grape-theme/dist/fonts'

class Author extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    author: PropTypes.string,
  }

  static defaultProps = {
    onClick: null,
    className: '',
    author: null,
  }

  render() {
    const { author, onClick, classes, className } = this.props
    return (
      <button onClick={onClick} className={`${classes.root} ${className}`}>
        {author || (
          <FormattedMessage
            id="deletedMember"
            defaultMessage="Deleted member"
          />
        )}
      </button>
    )
  }
}

export default injectSheet({
  root: {
    extend: [small, ellipsis],
    color: gray,
    marginRight: 10,
    fontWeight: 'bold',
    flexShrink: 1,
  },
})(Author)
