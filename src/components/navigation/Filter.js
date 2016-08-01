import React, {Component, PropTypes} from 'react'
import {pickHTMLProps} from 'pick-react-known-prop'

export default class Filter extends Component {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const {classes} = this.props.theme
    return (
      <input
        {...pickHTMLProps(this.props)}
        type="search"
        placeholder="Search people and groups…"
        className={classes.filterInput} />
    )
  }
}
