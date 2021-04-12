import React from 'react'
import PropTypes from 'prop-types'

import { Flex, Text, AvatarItem } from '@ubergrape/aurora-ui'

import { userStatusMap } from '../../../constants/app'

const RowRenderer = ({ people, index, style, onListItemClick, classes }) => {
  // Separator for list blocks with people with existing conversation and without
  if (people[index].text) {
    return (
      <Flex items="flex-end" key={people[index].text} style={style}>
        <Text maxWidth="initial" className={classes.cluster} emphasis>
          {people[index].text}
        </Text>
      </Flex>
    )
  }

  const {
    id,
    firstName,
    lastName,
    displayName,
    avatar,
    status,
    whatIDo,
    pm,
  } = people[index]

  const name =
    !firstName || !lastName ? displayName : `${firstName} ${lastName}`

  return (
    <div style={style} key={id}>
      <Flex>
        <AvatarItem
          src={avatar}
          alt={name}
          name={name}
          status={userStatusMap[status]}
          description={whatIDo}
          size="regular"
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
  classes: PropTypes.object.isRequired,
}

export default RowRenderer
