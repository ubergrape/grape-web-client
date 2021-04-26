import React from 'react'
import PropTypes from 'prop-types'

import { Flex, GroupItem, Icon } from '@ubergrape/aurora-ui'

const colorMap = {
  '#707782': 1,
  '#97A6BD': 2,
  '#ED8928': 3,
  '#E96038': 4,
  '#A16027': 5,
  '#6257D2': 6,
  '#0080FF': 7,
  '#EA4C3A': 8,
  '#6FC936': 9,
  '#36BDBD': 10,
}

const RowRenderer = ({
  groups,
  key,
  index,
  style,
  onListItemClick,
  classes,
}) => {
  const {
    id,
    name,
    color,
    isPublic,
    membership,
    description,
    membersCount,
  } = groups[index]

  return (
    <div style={style} key={key}>
      <Flex>
        <GroupItem
          className={classes.group}
          name={name}
          description={description}
          members={membersCount}
          color={colorMap[color]}
          {...(!isPublic && { groupType: 'private' })}
          excludeFromTabOrder
          maxWidth={672}
          onClick={() => onListItemClick(id, membership)}
        />
        {membership && (
          <Icon
            className={classes.icon}
            name="person"
            color="danger"
            size="small"
          />
        )}
      </Flex>
    </div>
  )
}

RowRenderer.propTypes = {
  groups: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  key: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  onListItemClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default RowRenderer
