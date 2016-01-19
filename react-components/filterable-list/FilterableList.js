import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'


@useSheet(style)
export default class InviteChannelMembers extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: Boolean(this.props.items.length),
      filtered: null
    }
  }

  componentDidMount() {
    if (this.state.focused) this.refs.filter.focus()
  }

  componentWillReceiveProps(nexProps) {
    this.setState({
      focused: this.shouldInputFocus(nexProps)
    })
  }

  componentDidUpdate() {
    if (this.state.focused) this.refs.filter.focus()
  }

  onClick(item) {
    this.props.onClick(item)
  }

  onSelectedClick(item) {
    this.props.onSelectedClick(item)
  }

  onFilterClick() {
    this.setState({
      focused: this.shouldInputFocus(this.props)
    })
  }

  onFilterChange() {
    const value = this.refs.filter.value.toLowerCase()

    if (!value) {
      this.setState({
        filtered: null
      })
      return
    }

    const filtered = this.props.items
      .filter(this.props.filter.bind(null, value))
      .sort(this.props.sort.bind(null, value))

    this.setState({filtered})
  }

  shouldInputFocus({items}) {
    const itemsLength = items.length
    const {filtered} = this.state
    const filteredLength = filtered && filtered.length || 0

    return itemsLength && itemsLength > filteredLength
  }

  renderInput() {
    if (!this.state.focused) return null

    return (
      <input
        ref="filter"
        onChange={::this.onFilterChange} />
    )
  }

  render() {
    const {filtered} = this.state
    const items = filtered || this.props.items
    return (
      <div>
        <div onClick={::this.onFilterClick}>
          <ul>
            {
              this.props.selected.map((item, i) => {
                return (
                  <li
                    key={i}
                    onClick={this.onSelectedClick.bind(this, item)}>
                    {item.displayName}
                    <i className="mdi mdi-close-circle-outline"></i>
                  </li>
                )
              }, this)
            }
          </ul>
          {this.renderInput()}
        </div>
        <ul>
          {
            items.map((item, i) => {
              return (
                <li
                  key={i}
                  onClick={this.onClick.bind(this, item)}>
                  {item.displayName}
                </li>
              )
            }, this)
          }
        </ul>
      </div>
    )
  }
}
