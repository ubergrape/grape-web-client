import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'

import style from './serviceStyle'
import ServiceIcon from '../service-icon/ServiceIcon'

const Service = ({
  item,
  focused,
  resultsAmount,
  onSelect,
  onFocus,
  sheet: { classes },
}) => (
  <button
    type="button"
    className={`${classes.service} ${focused ? classes.serviceFocused : ''}`}
    onClick={onSelect.bind(null, item)}
    onMouseOver={onFocus.bind(null, item)}
    onFocus={onFocus.bind(null, item)}
  >
    <div className={classes.iconContainer}>
      <ServiceIcon service={item.id} />
    </div>
    <div className={classes.name}>{item.label}</div>
    {resultsAmount && (
      <div className={classes.hint}>
        <FormattedMessage
          id="amountResults"
          defaultMessage="{resultsAmount} {resultsAmount, plural, one {{resultsAmountResult}} other {{resultsAmountResults}}}"
          values={{
            resultsAmount,
            resultsAmountResult: (
              <FormattedMessage
                id="resultsAmountResult"
                defaultMessage="Result"
              />
            ),
            resultsAmountResults: (
              <FormattedMessage
                id="resultsAmountResults"
                defaultMessage="Results"
              />
            ),
          }}
        />
      </div>
    )}
    <div className={classes.return}>&crarr;</div>
  </button>
)

Service.propTypes = {
  sheet: PropTypes.object.isRequired,
  focused: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  resultsAmount: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
}

export default injectSheet(style)(Service)
