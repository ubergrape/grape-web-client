import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import ListItem from 'grape-web/lib/components/list/listItem'
import injectSheet from 'grape-web/lib/jss'
import { smaller } from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import { grayLighter } from 'grape-theme/dist/base-colors'

import TaskIcon from './TaskIcon'
import IconButton from './IconButton'

@injectSheet({
  item: {
    padding: [5, 10],
    '&:hover': {
      background: grayLighter,
    },
    '&, *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    height: smaller.lineHeight * smaller.fontSize * 2,
    padding: [0, 10],
  },
  text: {
    extend: [smaller, ellipsis],
    display: 'inline-block',
    whiteSpace: 'pre-line',
  },
})
export default class TaskListItem extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  }

  onSelect = () => {
    const { task, onSelect } = this.props
    onSelect(task)
  }

  onRemove = () => {
    const { task, onRemove } = this.props
    onRemove(task)
  }

  render() {
    const {
      classes,
      task: { isConnected, text },
    } = this.props

    return (
      <ListItem className={classes.item}>
        <TaskIcon
          isConnected={isConnected}
          onClick={this.onSelect}
          className={classes.itemIcon}
        />

        <div className={classes.textContainer} onClick={this.onSelect}>
          <span className={classes.text}>{text}</span>
        </div>
        <IconButton icon="close" onClick={this.onRemove} />
      </ListItem>
    )
  }
}
