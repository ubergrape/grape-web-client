import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import theme from '../../constants/theme'

const styles = {
  tab: {
    flex: '1 1 0',
  },
  buttonLarge: {
    isolate: false,
    width: '100%',
    height: 35,
    background: 'none',
    border: 0,
    textAlign: 'center',
    fontSize: theme.fontSizeLargeWeb,
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.colorBorderSeparator}`,
    color: theme.grayDarkest,
    '&:hover': {
      isolate: false,
      borderBottom: `1px solid ${theme.colorIconBaseHoverWeb}`,
    },
  },
  buttonActive: {
    isolate: false,
    borderBottom: `1px solid ${theme.colorTextActive}`,
    color: theme.colorTextActive,
    '&:hover': {
      isolate: false,
      borderBottom: `1px solid ${theme.colorTextActive}`,
      color: theme.colorTextActive,
    },
  },
}

class Tab extends PureComponent {
  handleClick = () => {
    const { index, handleClick } = this.props
    handleClick(index)
  }

  render() {
    const {
      name,
      isCurrentTab,
      sheet: { classes },
    } = this.props
    return (
      <li className={classes.tab}>
        <button
          className={`${classes.buttonLarge} ${
            isCurrentTab ? classes.buttonActive : ''
          }`}
          onClick={this.handleClick}
        >
          {name}
        </button>
      </li>
    )
  }
}

export default injectSheet(styles)(Tab)
