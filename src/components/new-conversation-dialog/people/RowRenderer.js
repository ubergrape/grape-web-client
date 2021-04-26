import React from 'react'
import PropTypes from 'prop-types'

import { Flex, AvatarItem } from '@ubergrape/aurora-ui'

import { userStatusMap } from '../../../constants/app'

const RowRenderer = ({ people, index, style, onListItemClick }) => {
  const { id, displayName, avatar, status, whatIDo, pm } = people[index]

  return (
    <div style={style}>
      <Flex items="center">
        <AvatarItem
          src={avatar}
          alt={displayName}
          name={displayName}
          status={userStatusMap[status]}
          description={whatIDo}
          size="regular"
          /*
            680px - 8px of scrollbar width.
            Without maxWidth value text ellipsis will not work.
            Without scrollbar length of item will be a bit small (for 8px)
            then whole width of container. There's no custom scrollbar for list,
            so I can't calculate in dynamicaly.
          */
          excludeFromTabOrder
          onClick={() => onListItemClick(id, pm)}
        />
      </Flex>
    </div>
  )
}

RowRenderer.propTypes = {
  people: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  onListItemClick: PropTypes.func.isRequired,
}

export default RowRenderer
