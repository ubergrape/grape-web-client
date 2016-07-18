import React, {PropTypes} from 'react'

import {userSelector} from '../../selectors'
import getStore from '../../app/store'

/**
 * Returns true if passed path to a pm chat leads to logged in user.
 */
function isSelf(path) {
  const {slug} = userSelector(getStore().getState())
  return `/chat/${slug}` === path
}

export default function GrapeUser(props) {
  if (isSelf(props.url)) return <span>{props.name}</span>
  return <a href={props.url}>{props.name}</a>
}

GrapeUser.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}
