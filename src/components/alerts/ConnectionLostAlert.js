import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import style from './alertStyle'

@injectSheet(style)
export default class ConnectionLostAlert extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  onReload() {
    window.location.reload()
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <span>
        <FormattedMessage
          id="lostConnectionAlert"
          description="**Describe lostConnectionAlert**: it is alert asking for page reload."
          values={{
            action: (
              <button
                className={classes.buttonLink}
                onClick={this.onReload}
              >
                <FormattedMessage
                  id="reload"
                  defaultMessage="reload"
                />
              </button>
            )
          }}
          defaultMessage="Lost connection to the server — trying to reconnect. You can also try to {action}."
        />
      </span>
    )
  }
}
