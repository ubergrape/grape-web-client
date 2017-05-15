import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import find from 'lodash/collection/find'
import pick from 'lodash/object/pick'
import debounce from 'lodash/function/debounce'
import {shouldPureComponentUpdate} from 'react-pure-render'

import injectSheet from 'grape-web/lib/jss'
import Section from './Section'
import style from './gridStyle'

/**
 * Items renderer/scroller.
 */
@injectSheet(style)
export default class Grid extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onDidMount: PropTypes.func,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    Item: PropTypes.func,
    focusedItem: PropTypes.object,
    className: PropTypes.string,
    data: PropTypes.array,
    section: PropTypes.object,
    focused: PropTypes.bool
  }

  static defaultProps = {
    className: '',
    section: {}
  }

  constructor(props) {
    super(props)
    this.sections = {}
    this.items = {}
    this.onScrollStop = debounce(this.onScrollStop, 30)
  }

  componentDidMount() {
    const {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidUpdate(prevProps) {
    const currFocused = this.props.focusedItem
    const prevFocused = prevProps.focusedItem
    if (currFocused && prevFocused && prevFocused.id !== currFocused.id) {
      this.onFocus({id: currFocused.id})
    }
  }

  componentWillUnmount() {
    this.sections = {}
    this.items = {}
  }

  onFocus(data) {
    this.props.onFocus(data)
  }

  onInvisible(item, visibilityRect) {
    if (this.scrolling) return

    const viewPortNode = ReactDOM.findDOMNode(this)
    const itemNode = ReactDOM.findDOMNode(item)
    const itemTop = itemNode.offsetTop

    // Scrolling up.
    let scrollTop = itemTop

    // Scrolling down.
    if (visibilityRect.top) {
      const viewPortHeight = viewPortNode.offsetHeight
      let {itemHeight} = this
      if (!itemHeight) itemHeight = itemNode.offsetHeight
      scrollTop = itemTop - viewPortHeight + itemHeight
    }

    viewPortNode.scrollTop = scrollTop
  }

  onScroll() {
    this.scrolling = true
    this.onScrollStop()
  }

  onScrollStop() {
    this.scrolling = false
  }

  onSectionDidMount(component) {
    this.sections[component.props.id] = component
  }

  getSectionComponent(id) {
    return this.sections[id]
  }

  getItemComponent(id) {
    let component
    if (!id) return component

    find(this.sections, section => {
      component = find(section.items, item => item.props.id === id)
      return Boolean(component)
    })

    return component
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div
        className={`${classes.grid} ${this.props.className}`}
        onScroll={::this.onScroll}>

        {this.props.data.map(data => {
          return (
            <Section
              {...data}
              {...pick(this.props, 'onSelect', 'Item', 'focused')}
              {...this.props.section}
              onFocus={::this.onFocus}
              onInvisible={::this.onInvisible}
              onDidMount={::this.onSectionDidMount}
              visibilityContainment={this}
              key={data.id} />
          )
        })}
      </div>
    )
  }
}
