import PropTypes from 'prop-types'
import React from 'react'
import { defineMessages, intlShape } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import { small } from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

const styles = ({ palette }) => ({
  root: {
    extend: small,
    background: {
      color: palette.background.paper,
      repeat: 'no-repeat',
      position: [12, '50%'],
    },
    backgroundImage: `url(${getColoredIcon({
      name: 'magnifier',
      color: palette.text.secondary,
    })})`,
    border: [1, 'solid', palette.grey[300]],
    padding: [7, 10, 7, 35],
    color: palette.text.secondary,
    borderRadius: sizes.borderRadius.bigger,
    outline: 'none',
    width: '100%',
    '&::-webkit-search-cancel-button': {
      isolate: false,
      WebkitAppearance: 'searchfield-cancel-button !important',
    },
    '&:focus': {
      isolate: false,
      backgroundImage: `url(${getColoredIcon({
        name: 'magnifier',
        color: palette.text.primary,
      })})`,
    },
  },
})

const messages = defineMessages({
  placeholder: {
    id: 'searchMessages',
    defaultMessage: 'Search messages',
  },
})

const Search = ({ classes, onFocus, onChange, intl: { formatMessage } }) => (
  <input
    className={classes.root}
    onFocus={onFocus}
    onChange={onChange}
    placeholder={formatMessage(messages.placeholder)}
    type="search"
  />
)

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
}

export default injectSheet(styles)(Search)
