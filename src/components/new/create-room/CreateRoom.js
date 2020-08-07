import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import { debounce } from 'lodash'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { Icon } from '../icon'
import { Input, InputMultiplePicker } from '../input'
import { InfiniteAutoRowHeightList } from '../list'
import { ColorPicker } from '../color-picker'
import { Button } from '../buttons'
import { ButtonsGroup } from '../buttons-group'
import { Checkbox } from '../checkbox'
import { Textarea } from '../textarea'
import RowRenderer from './RowRenderer/RowRenderer'
import NoRowsRenderer from './NoRowsRenderer/NoRowsRenderer'
import styles from './styles/CreateRoomStyles'

class CreateRoom extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isPublic: PropTypes.bool,
    name: PropTypes.string,
    color: PropTypes.number,
    description: PropTypes.string,
    filter: PropTypes.string,
    error: PropTypes.string,
    visibility: PropTypes.string,
    users: PropTypes.array,
    pickedUsers: PropTypes.array,
    isUsersLoaded: PropTypes.bool,
    onChangeColor: PropTypes.func.isRequired,
    onAddMember: PropTypes.func.isRequired,
    onDeleteMember: PropTypes.func.isRequired,
    onChangeName: PropTypes.func.isRequired,
    onChangeType: PropTypes.func.isRequired,
    onChangeDescription: PropTypes.func.isRequired,
    onSearchUsers: PropTypes.func.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    onChangeView: PropTypes.func.isRequired,
    onCreateRoom: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: undefined,
    isPublic: true,
    name: '',
    color: 0,
    description: '',
    filter: '',
    visibility: 'public',
    users: [],
    pickedUsers: [],
    isUsersLoaded: true,
  }

  componentDidMount() {
    const { visibility, onChangeType, onSearchUsers } = this.props
    if (visibility === 'private') onChangeType(false)
    onSearchUsers()
  }

  onChangeName = ({ target }) => {
    const { value } = target
    this.props.onChangeName(value)
  }

  onChangeType = () => {
    const { isPublic } = this.props
    this.props.onChangeType(!isPublic)
  }

  onChangeDescription = ({ target }) => {
    const { value } = target
    this.props.onChangeDescription(value)
  }

  onChangeFilter = ({ target }) => {
    const { value } = target
    this.onChangeFilterDebounced(value)
  }

  onChangeFilterDebounced = debounce(value => {
    const { onChangeFilter, onSearchUsers } = this.props
    onChangeFilter(value)
    onSearchUsers()
  }, debouncingTime)

  onCancel = () => {
    this.props.onHide()
  }

  onClickBack = () => {
    this.props.onChangeView('tabs')
  }

  onCreateRoom = () => {
    this.props.onCreateRoom()
  }

  isRowLoaded = index => Boolean(this.props.users[index])

  render() {
    const {
      classes,
      name,
      color,
      description,
      isPublic,
      filter,
      users,
      pickedUsers,
      isUsersLoaded,
      error,
      onChangeColor,
      onAddMember,
      onDeleteMember,
    } = this.props

    return (
      <div className={classes.wrapper}>
        <button className={classes.button} onClick={this.onClickBack}>
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
                error={error}
                placeholder="Enter group name ..."
                defaultValue={name}
                styles={{
                  width: 370,
                }}
              />
            </div>
            {!error && (
              <span className={classes.hint}>
                Should represent the topic of the group (maximum of 30
                characters).
              </span>
            )}
          </div>
          <div className={classes.field}>
            <span className={classes.label}>Color</span>
            <div className={classes.content}>
              <ColorPicker
                checked={color}
                onChange={onChangeColor}
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
                checked={!isPublic}
                name="public"
                onChange={this.onChangeType}
              />
              <span className={classes.hintLargeWrapper}>
                {isPublic ? (
                  <span className={classes.hintLarge}>Public conversation</span>
                ) : (
                  <span className={classes.hintLarge}>
                    Private conversation
                  </span>
                )}
              </span>
            </div>
            {isPublic ? (
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
                defaultValue={description}
                placeholder="Enter description ..."
              />
            </div>
            <span className={classes.hint}>
              Optional, but recommended: Help others understand the purpose of
              this group with a short sentence (maximum of 120 characters).
            </span>
          </div>
          <div className={classes.field}>
            <span className={classes.label}>Members</span>
            <div className={classes.content}>
              <InputMultiplePicker
                list={pickedUsers}
                value={filter}
                onChange={this.onChangeFilter}
                onDeleteMember={onDeleteMember}
              />
            </div>
            <span className={classes.hint}>
              Optional. Consider adding other people for lively discussions, if
              you don&apos;t want to chat with yourself.
            </span>
            <div>
              <div>
                {pickedUsers.length > 0 ? (
                  <span className={classes.hintDarkLargeMargin}>
                    Selected people:{' '}
                    <span className={classes.counter}>
                      {pickedUsers.length}
                    </span>
                  </span>
                ) : (
                  <span className={classes.hintDarkLargeMargin}>
                    People you recently interacted with.
                  </span>
                )}
              </div>
              <div className={classes.list}>
                <InfiniteAutoRowHeightList
                  rowHeight={() => 32}
                  loadMoreRows={() => {
                    this.props.onSearchUsers()
                  }}
                  isRowLoaded={this.isRowLoaded}
                  list={users}
                  rowCount={Infinity}
                  minimumBatchSize={50}
                  width={680}
                  threshold={30}
                  rowRenderer={(index, key, style) => (
                    <RowRenderer
                      list={users}
                      index={index}
                      checked={users[index].checked}
                      key={key}
                      style={style}
                      onAddMember={onAddMember}
                      onDeleteMember={onDeleteMember}
                    />
                  )}
                  noRowsRenderer={() => (
                    <NoRowsRenderer
                      isUsersLoaded={isUsersLoaded}
                      filter={filter}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.buttons}>
          <ButtonsGroup>
            <Button type="basic" styleType="minimal" onClick={this.onCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              styleType="standart"
              onClick={this.onCreateRoom}
            >
              Create Group
            </Button>
          </ButtonsGroup>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(CreateRoom)