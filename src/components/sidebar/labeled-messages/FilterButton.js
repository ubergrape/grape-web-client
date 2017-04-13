import React, {PropTypes, PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {blue, white} from 'grape-theme/dist/base-colors'
import cn from 'classnames'
import noop from 'lodash/utility/noop'

import Tag from '../../tag'

@injectSheet({
  tag: {
    cursor: 'pointer',
    margin: {
      right: 5,
      bottom: 5
    }
  },
  tagSelected: {
    background: blue,
    color: white
  }
})
export default class FilterButton extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    nameLocalized: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    isSelected: PropTypes.bool
  }

  static defaultProps = {
    onClick: noop,
    isSelected: false
  }

  onClick = () => {
    const {onClick, name} = this.props
    onClick({name})
  }

  render() {
    const {
      classes,
      isSelected,
      color,
      nameLocalized
    } = this.props

    return (
      <Tag
        style={isSelected ? null : {color}}
        className={cn(classes.tag, isSelected && classes.tagSelected)}
        onClick={this.onClick}
      >
        {nameLocalized}
      </Tag>
    )
  }
}
