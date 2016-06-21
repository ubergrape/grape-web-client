import React, {PropTypes} from 'react'

export default function Options(props) {
  const {
    theme,
    options,
    searchOnlyInChannel,
    onClickOption,
    isLoading
  } = props

  // TODO: return `null` once upgraded to React 0.15.
  if (!options.length) return <noscript />

  const {classes} = theme
  return (
    <ul>
    {
      options.map((option, i) => {
        return (
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
        )
      })
    }
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
