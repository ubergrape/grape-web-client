import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {TYPES as QUERY_TYPES} from '../query/constants'
import QueryModel from '../query/Model'
import parseQuery from '../query/parse'

export default class Input extends Component {
  static propTypes = {
    onInput: PropTypes.func,
    onKeyDown: PropTypes.func,
    onChangeFilters: PropTypes.func,
    onBlur: PropTypes.func,
    type: PropTypes.string,
    focused: PropTypes.bool,
    filters: PropTypes.array,
    search: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    onInput: noop,
    onKeyDown: noop,
    onChangeFilters: noop,
    onBlur: noop,
    type: undefined,
    focused: true,
    filters: undefined,
    search: undefined,
    placeholder: '',
    className: ''
  }

  constructor(props) {
    super(props)
    this.query = new QueryModel({onChange: ::this.onChangeQuery})
    this.query.set({
      trigger: QUERY_TYPES[this.props.type],
      filters: props.filters,
      search: props.search
    }, {silent: true})
    this.state = this.createState(props)
  }

  componentDidMount() {
    if (this.state.focused) this.focus()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filters && String(nextProps.filters) !== String(this.query.get('filters'))) {
      this.onChangeFilters(nextProps)
    }
    if (nextProps.search !== undefined && nextProps.search !== this.query.get('search')) {
      this.query.set('search', nextProps.search, {silent: true})
    }
    const nextState = this.createState(nextProps)
    this.setState(nextState)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidUpdate(prevProps, prevState) {
    if (this.state.focused && !prevState.focused) {
      this.focus()
    }
  }

  onInput = (e) => {
    const queryStr = QUERY_TYPES[this.props.type] + e.target.value
    const query = parseQuery(queryStr)
    this.query.set(query)
  }

  onBlur = (e) => {
    this.setState({focused: false})
    this.props.onBlur(e)
  }

  onChangeQuery = () => {
    const query = this.query.toJSON()
    this.setState({value: query.key})
    this.props.onInput(query)
  }

  onKeyDown = (e) => {
    e.detail = {query: this.query.toJSON()}
    this.props.onKeyDown(e)
  }

  onChangeFilters = ({filters}) => {
    this.query.set('filters', filters, {silent: true})
    this.props.onChangeFilters(this.state.value)
  }

  createState({focused}) {
    return {
      focused,
      value: this.query.get('key')
    }
  }

  focus() {
    return ReactDOM.findDOMNode(this.refs.input).focus()
  }

  render() {
    return (
      <input
        value={this.state.value}
        type="text"
        className={this.props.className}
        placeholder={this.props.placeholder}
        ref="input"
        data-test="input"
        onChange={this.onInput}
        onKeyDown={this.onKeyDown}
        onBlur={this.onBlur} />
    )
  }
}
