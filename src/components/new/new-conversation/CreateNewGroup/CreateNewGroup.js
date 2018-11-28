import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Icon } from '../../icon'
import { Input } from '../../input'
import { ColorPicker } from '../../color-picker'
import { Checkbox } from '../../checkbox'
import { Textarea } from '../../textarea'
import styles from './../styles/CreateNewGroupStyles'

class CreateNewGroup extends Component {
  onChangeName = ({ target }) => {
    const { value } = target
    this.props.onChangeNewRoomName(value)
  }

  onChangeType = () => {
    const { isPublic } = this.props.newRoom
    this.props.onChangeNewRoomType(!isPublic)
  }

  onChangeDescription = ({ target }) => {
    const { value } = target
    this.props.onChangeNewRoomDescription(value)
  }

  openTabs = () => {
    this.props.onChangeView('tabs')
  }

  render() {
    const { classes, newRoom, onChangeNewRoomColor } = this.props

    return (
      <div className={classes.wrapper}>
        <button className={classes.button} onClick={this.openTabs}>
          <Icon
            name="arrowRight"
            styles={{
              pointerEvents: 'none',
              height: 16,
              width: 16,
            }}
          />
          <span className={classes.buttonText}>Create a new group</span>
        </button>
        <div className={classes.main}>
          <div className={classes.field}>
            <span className={classes.label}>Group name</span>
            <div className={classes.content}>
              <Input
                onChange={this.onChangeName}
                placeholder="Enter group name ..."
                defaultValue={newRoom.name}
                styles={{
                  width: 370,
                }}
              />
            </div>
            <span className={classes.hint}>
              Should represent the topic of the group (maximum of 30 characters)
              .
            </span>
          </div>
          <div className={classes.field}>
            <span className={classes.label}>Color</span>
            <div className={classes.content}>
              <ColorPicker
                checked={newRoom.color}
                onChange={onChangeNewRoomColor}
                colors={[
                  '#737373',
                  '#999193',
                  '#F2BA29',
                  '#FC5B00',
                  '#B91E56',
                  '#84489A',
                  '#317DA8',
                  '#29B6F2',
                  '#5C8505',
                  '#8BCC00',
                ]}
              />
            </div>
            <span className={classes.hint}>
              Add color to help distinguishing your group.
            </span>
          </div>
          <div className={classes.field}>
            <span className={classes.label}>Privacy</span>
            <div className={classes.content}>
              <Checkbox
                checked={!newRoom.isPublic}
                name="public"
                onChange={this.onChangeType}
              />
              <span className={classes.hintLargeWrapper}>
                {newRoom.isPublic ? (
                  <span className={classes.hintLarge}>Public conversation</span>
                ) : (
                  <span className={classes.hintLarge}>
                    Private conversation
                  </span>
                )}
              </span>
            </div>
            {newRoom.isPublic ? (
              <span className={classes.hintDark}>
                This conversation is{' '}
                <span className={classes.highlight}>public</span>. Anybody in
                your organization can join.
              </span>
            ) : (
              <span className={classes.hintDark}>
                This conversation is{' '}
                <span className={classes.highlight}>private</span>. Only group
                members can view it and invite other people to join.
              </span>
            )}
          </div>
          <div className={classes.field}>
            <span className={classes.label}>Description</span>
            <div className={classes.content}>
              <Textarea
                onChange={this.onChangeDescription}
                defaultValue={newRoom.description}
                placeholder="Enter description ..."
              />
            </div>
            <span className={classes.hint}>
              Optional, but recommended: Help others understand the purpose of
              this group with a short sentence (maximum of 120 characters).
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(CreateNewGroup)
