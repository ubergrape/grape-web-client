import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import injectSheet from 'grape-web/lib/jss'
import style from './detailEmptyStyle'

/**
 * Empty detail view.
 */
class DetailEmpty extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    images: PropTypes.object,
  }

  static defaultProps = {
    images: {},
  }

  render() {
    const { classes } = this.props.sheet

    return (
      <div className={classes.empty}>
        <img src={this.props.images.noDetail} />
        <span className={classes.note}>
          <FormattedMessage
            id="noDetailForItem"
            defaultMessage="No detail infos for this item"
          />
        </span>
      </div>
    )
  }
}

export default injectSheet(style)(DetailEmpty)
