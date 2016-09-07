import React, {PropTypes} from 'react'

export default function Options(props) {
  const {
    theme: {classes},
    options,
    searchOnlyInChannel,
    onClickOption,
    isLoading
  } = props

  if (!options.length) return null

  return (
    <ul>
      {options.map((option, i) =>
        <li key={i}>
          <label
            className={classes.optionLabel}
            onClick={onClickOption}>
            <input
              className={classes.optionCheckbox}
              type="checkbox"
              checked={searchOnlyInChannel}
              onChange={option.handler}
              disabled={isLoading} />
              {option.label}
          </label>
        </li>
      )}
    </ul>
  )
}

Options.propTypes = {
  theme: PropTypes.object.isRequired,
  onClickOption: PropTypes.func.isRequired,
  searchOnlyInChannel: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
}
