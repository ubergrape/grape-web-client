import React from 'react'
import PropTypes from 'prop-types'

import { Flex, AvatarItem } from '@ubergrape/aurora-ui'

import { userStatusMap } from '../../../constants/app'

const RowRenderer = ({
  members,
  onMemberRemove,
  onMemberSelect,
  index,
  style,
  classes,
}) => {
  const {
    id,
    firstName,
    lastName,
    displayName,
    isSelected,
    avatar,
    status,
    whatIDo,
  } = members[index]

  const name =
    !firstName || !lastName ? displayName : `${firstName} ${lastName}`

  return (
    <Flex items="flex-end" style={style}>
      <AvatarItem
        className={classes.item}
        src={avatar}
        alt={name}
        name={name}
        size="small"
        isSelected={isSelected}
        onClick={() => {
          if (isSelected) {
            onMemberRemove(id)
            return
          }

          onMemberSelect(id)
        }}
        {...(userStatusMap[status] === 'online' && userStatusMap[status])}
        description={whatIDo}
      />
    </Flex>
  )
}

RowRenderer.propTypes = {
  members: PropTypes.array.isRequired,
  onMemberRemove: PropTypes.func.isRequired,
  onMemberSelect: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default RowRenderer
