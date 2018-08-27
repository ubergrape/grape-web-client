import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

const styles = {
  tab: {
    flex: '1 1 0',
    height: 35,
  },
  button: {
    isolate: false,
    width: '100%',
    height: '100%',
    background: 'none',
    border: 0,
    textAlign: 'center',
    fontSize: 17,
    cursor: 'pointer',
    borderBottom: '1px solid #EEEEEE',
    color: '#333333',
  },
  buttonActive: {
    isolate: false,
    borderBottom: '1px solid #098DEC',
    color: '#098DEC',
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
          className={`${classes.button} ${
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
