import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import uniqueId from 'lodash/utility/uniqueId'
import {grayBlueLight} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'
import color from 'color'

@injectSheet({
  label: {
    extend: small,
    display: 'block',
    padding: [4, 10, 4, 20],
    background: grayBlueLight,
    cursor: 'pointer',
    '&:hover': {
      isolate: false,
      background: color(grayBlueLight).darken(0.05).hexString()
    }
  },
  checkbox: {
    marginRight: 5,
    cursor: 'pointer'
  }
})
export default class Options extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClickOption: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  render() {
    const {
      classes,
      options,
      onClickOption,
      isLoading
    } = this.props

    if (!options.length) return null

    return (
      <ul>
        {options.map((option) => {
          const inputId = uniqueId()

          return (
            <li key={option.label}>
              <label
                className={classes.label}
                onClick={onClickOption}
                htmlFor={inputId}
              >
                <input
                  className={classes.checkbox}
                  type="checkbox"
                  checked={option.status}
                  onChange={option.handler}
                  disabled={isLoading}
                  id={inputId}
                />
                {option.label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }
}
