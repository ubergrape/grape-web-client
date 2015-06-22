import React, {Component} from 'react'
import useSheet from 'react-jss'
import find from 'lodash-es/collection/find'
import pick from 'lodash-es/object/pick'
import debounce from 'lodash-es/function/debounce'
import {shouldPureComponentUpdate} from 'react-pure-render'

import Section from './Section'
import style from './gridStyle'

/**
 * Items renderer/scroller.
 */
@useSheet(style)
export default class Grid extends Component {
  static defaultProps = {
    Item: undefined,
    className: '',
    data: undefined,
    section: {},
    onFocus: undefined,
    onSelect: undefined,
    onDidMount: undefined
  }

  componentDidMount() {
    let {onDidMount} = this.props
    if (onDidMount) onDidMount(this)
  }

  constructor(props) {
    super(props)
    this.sections = {}
    this.items = {}
    this.onScrollStop = debounce(this.onScrollStop, 30)
  }

  componentDidUpdate(prevProps) {
    let currFocused = this.props.focusedItem
    let prevFocused = prevProps.focusedItem
    if (currFocused && prevFocused && prevFocused.id != currFocused.id) {
      this.onFocus({id: currFocused.id})
    }
  }

  render() {
    let {classes} = this.props.sheet

    return (
      <div
        className={`${classes.grid} ${this.props.className}`}
        onScroll={::this.onScroll}>
        {this.props.data.map(data => {
          let props = {...data, ...pick(this.props, 'onSelect', 'Item'), ...this.props.section}
          return (
            <Section
              {...props}
              onFocus={::this.onFocus}
              onInvisible={::this.onInvisible}
              onDidMount={::this.onSectionDidMount}
              visibilityContainment={this}
              key={props.id} />
          )
        })}
      </div>
    )
  }

  getSectionComponent(id) {
    return this.sections[id]
  }

  getItemComponent(id) {
    let component
    if (!id) return component

    find(this.sections, section =>  {
      component = find(section.items, item => item.props.id == id)
      return Boolean(component)
    })

    return component
  }

  onFocus(data) {
    this.props.onFocus(data)
  }

  onInvisible(item, visibilityRect) {
    if (this.scrolling) return

    let viewPortNode = React.findDOMNode(this)
    let itemNode = React.findDOMNode(item)
    let itemTop = itemNode.offsetTop

    // Scrolling up.
    let scrollTop = itemTop

    // Scrolling down.
    if (visibilityRect.top) {
      let viewPortHeight = viewPortNode.offsetHeight
      let itemHeight = this.itemHeight
      if (!itemHeight) itemHeight = itemNode.offsetHeight
      scrollTop = itemTop - viewPortHeight + itemHeight
    }

    viewPortNode.scrollTop = scrollTop
  }

  onScroll() {
    this.scrolling = true
    this.onScrollStop()
  }

  onScrollStop() {
    this.scrolling = false
  }

  onSectionDidMount(component) {
    this.sections[component.props.id] = component
  }
}
