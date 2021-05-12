import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { Flex, AvatarItem } from '@ubergrape/aurora-ui'

import { userStatusMap } from '../../../constants/app'

const RowRenderer = ({
  members,
  onMemberRemove,
  onMemberSelect,
  className,
  index,
  style,
  classes,
}) => {
  const { id, displayName, isSelected, avatar, status, whatIDo } = members[
    index
  ]

  return (
    <Flex items="flex-end" key={id} style={style}>
      <div className={cn(className, classes.itemWrapper)}>
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
      </div>
    </Flex>
  )
}

RowRenderer.defaultProps = {
  className: undefined,
}

RowRenderer.propTypes = {
  members: PropTypes.array.isRequired,
  onMemberRemove: PropTypes.func.isRequired,
  onMemberSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default RowRenderer
