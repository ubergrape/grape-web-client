import PropTypes from 'prop-types'
import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { shouldPureComponentUpdate } from 'react-pure-render'
import findIndex from 'lodash/findIndex'
import noop from 'lodash/noop'
import {
  white,
  gainsboroLight,
  gainsboroDark,
  grayDark,
  grapeLight,
} from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import color from 'color'

const createState = props => {
  const { data } = props
  const focused = data[0]
  return { data, focused }
}

class Datalist extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    data: PropTypes.array,
    className: PropTypes.string,
    onDidMount: PropTypes.func,
    onSelect: PropTypes.func,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: [],
    className: '',
    onDidMount: noop,
    onSelect: noop,
  }

  constructor(props) {
    super(props)
    this.state = createState(this.props)
  }

  componentDidMount() {
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(createState(nextProps))
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onMouseOver(item) {
    this.focus(item)
  }

  onMouseDown = e => {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
    this.props.onSelect(this.state.focused)
  }

  focus(id) {
    const { data } = this.state
    let index = findIndex(data, item => item === this.state.focused)
    let item

    if (typeof id === 'string') {
      if (id === 'next') index++
      else if (id === 'prev') index--
      item = data[index]
    } else item = id

    if (!item) return

    this.setState({ focused: item })
  }

  renderItem = (listItem, i) => {
    const focused = listItem === this.state.focused
    const {
      item,
      itemFocused,
      icon,
      name,
      note,
      noteFocused,
    } = this.props.classes

    return (
      <button
        onMouseDown={this.onMouseDown}
        /* eslint-disable react/jsx-no-bind */
        onMouseOver={this.onMouseOver.bind(this, listItem)}
        onFocus={this.onMouseOver.bind(this, listItem)}
        /* eslint-enable react/jsx-no-bind */
        className={`${item} ${focused ? itemFocused : ''}`}
        key={i}
      >
        <span className={icon}>{listItem.icon}</span>
        <span className={name}>{listItem.name}</span>
        <span className={`${note} ${focused ? noteFocused : ''}`}>
          {listItem.note}
        </span>
      </button>
    )
  }

  render() {
    const { data } = this.state

    if (!data.length) return null

    const { classes } = this.props

    return (
      <div
        className={`${classes.datalist} ${this.props.className}`}
        data-test="datalist"
      >
        {data.map(this.renderItem)}
      </div>
    )
  }
}

export default injectSheet({
  datalist: {
    background: white,
    border: [1, 'solid', gainsboroLight],
    boxShadow: `0px 3px 4px 0 ${color(grayDark)
      .alpha(0.5)
      .rgbaString()}`,
    overflow: 'auto',
  },
  item: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    extend: fonts.normal,
    padding: [5, 7],
    color: grayDark,
    '&, & *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  itemFocused: {
    color: white,
    background: grapeLight,
  },
  icon: {
    minWidth: 22,
    display: 'inline-block',
    lineHeight: 0,
    textAlign: 'center',
    verticalAlign: 'middle',
    color: gainsboroDark,
  },
  name: {
    lineHeight: 1,
    marginLeft: 5,
    color: 'inherit',
    flex: '0 0 auto',
  },
  note: {
    extend: [fonts.small, ellipsis],
    color: gainsboroDark,
    marginLeft: 6,
  },
  noteFocused: {
    color: white,
  },
})(Datalist)
