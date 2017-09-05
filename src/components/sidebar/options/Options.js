import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import uniqueId from 'lodash/utility/uniqueId'
import {grayBlueLight} from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'
import {spacer} from 'grape-theme/dist/sizes'
import color from 'color'

@injectSheet({
  label: {
    display: 'block',
    padding: [spacer.xs, spacer.s, spacer.xs, spacer.l],
    background: grayBlueLight,
    cursor: 'pointer',
    borderBottom: [1, 'solid', webColors.borderDefault],
    '&:hover': {
      isolate: false,
      background: color(grayBlueLight).darken(0.05).hexString()
    }
  },
  checkbox: {
    WebkitAppearance: 'checkbox',
    marginRight: spacer.xs,
    cursor: 'pointer',
    verticalAlign: 'middle'
  },
  labelText: {
    fontSize: fonts.small.fontSize,
    lineHeight: 1,
    verticalAlign: 'middle'
  }
})
export default class Options extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onClickOption: PropTypes.func
  }

  static defaultProps = {
    onClickOption: null
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
      <div>
        {options.map((option) => {
          const inputId = uniqueId()

          return (
            <div key={option.label}>
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
                <span className={classes.labelText}>{option.label}</span>
              </label>
            </div>
          )
        })}
      </div>
    )
  }
}
