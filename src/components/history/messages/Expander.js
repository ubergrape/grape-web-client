import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {useSheet} from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import {styles, maxHeight} from './expanderTheme'
import {ShowMore, ShowLess} from '../../i18n/i18n'

@useSheet(styles)
export default class Expander extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onToggle: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired
  }

  static defaultProps = {
    onToggle: noop,
    isExpanded: false
  }

  constructor(props) {
    super(props)
    this.state = {isEnabled: false}
  }

  componentDidMount() {
    this.update()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    this.update()
  }

  onRef = (node) => {
    this.node = node
  }

  onToggle = () => {
    this.props.onToggle({isExpanded: !this.props.isExpanded})
  }

  update() {
    const {clientHeight} = this.node.firstElementChild
    if (clientHeight > maxHeight) {
      this.setState({isEnabled: true})
    }
  }

  render() {
    const {children, sheet: {classes}, isExpanded} = this.props
    const {isEnabled} = this.state

    return (
      <div ref={this.onRef} className={classes[isExpanded ? 'expandedExpander' : 'collapsedExpander']}>
        {children}
        {isEnabled &&
          <div
            onClick={this.onToggle}
            className={classes[isExpanded ? 'expandedPanel' : 'collapsedPanel']}>
            <button className={classes.button}>
              {isExpanded ? <ShowLess /> : <ShowMore />}
            </button>
          </div>
        }
      </div>
    )
  }
}
