import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Flex, Text, AvatarItem } from '@ubergrape/aurora-ui'

import { userStatusMap } from '../../../constants/app'

const RowRenderer = ({
  people,
  index,
  style,
  isVisible,
  onListItemClick,
  classes,
}) => {
  // Separator for list blocks with people with existing conversation and without
  if (people[index].isSeparator) {
    return (
      <Flex items="flex-end" key={people[index].text} style={style}>
        <Text maxWidth="initial" className={classes.cluster} emphasis>
          <FormattedMessage
            id="ncdPeopleSeparator"
            defaultMessage="People you already have a conversation with"
          />
        </Text>
      </Flex>
    )
  }

  const { id, displayName, avatar, status, whatIDo, pm } = people[index]

  return (
    <div style={style} key={id}>
      <Flex items="center">
        <AvatarItem
          src={avatar}
          alt={displayName}
          name={displayName}
          status={userStatusMap[status]}
          description={whatIDo}
          isVisible={isVisible}
          avatarImageRenderDelay={500}
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
  isVisible: PropTypes.bool.isRequired,
  onListItemClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default RowRenderer
