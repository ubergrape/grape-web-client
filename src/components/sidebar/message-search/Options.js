import React, {PropTypes} from 'react'
import uniqueId from 'lodash/utility/uniqueId'

export default function Options(props) {
  const {
    classes,
    options,
    onClickOption,
    isLoading
  } = props

  if (!options.length) return null

  return (
    <ul>
      {options.map((option) => {
        const inputId = uniqueId()

        return (
          <li key={option.label}>
            <label
              className={classes.optionLabel}
              onClick={onClickOption}
              htmlFor={inputId}
            >
              <input
                className={classes.optionCheckbox}
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

Options.propTypes = {
  classes: PropTypes.object.isRequired,
  onClickOption: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
}
