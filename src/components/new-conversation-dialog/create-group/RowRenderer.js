import React from 'react'
import PropTypes from 'prop-types'

import { Flex, AvatarItem } from '@ubergrape/aurora-ui'

import { userStatusMap } from '../../../constants/app'

const RowRenderer = ({
  members,
  key,
  onMemberRemove,
  onMemberSelect,
  index,
  style,
  classes,
}) => {
  const { id, displayName, isSelected, avatar, status, whatIDo } = members[
    index
  ]

  return (
    <div style={style} key={key}>
      <Flex items="flex-end">
        <AvatarItem
          className={classes.item}
          src={avatar}
          alt={displayName}
          name={displayName}
          size="small"
          isSelected={isSelected}
          excludeFromTabOrder
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
    </div>
  )
}

RowRenderer.defaultProps = {
  className: undefined,
}

RowRenderer.propTypes = {
  members: PropTypes.array.isRequired,
  key: PropTypes.string.isRequired,
  onMemberRemove: PropTypes.func.isRequired,
  onMemberSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default RowRenderer
