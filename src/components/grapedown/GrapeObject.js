import PropTypes from 'prop-types'
import React from 'react'
import markdownIt from 'markdown-it'
import {getOptions, create} from 'grape-web/lib/grape-objects'

import LinkWithIcon from '../message-parts/LinkWithIcon'
import Highlight from '../highlight/YellowHighlight'
import conf from '../../conf'

const {normalizeLinkText} = markdownIt()

export default function GrapeObject({children, href, user}) {
  const options = getOptions(children[0], normalizeLinkText(href))
  const {id, type, service} = options
  let {url} = options
  let target

  if (conf.embed) target = '_blank'

  if (url[0] === '/') {
    url = `${conf.server.serviceUrl}${url}`
  }

  if (type === 'user') {
    // TODO stop using strings in options.id, should be both same type.
    const isSelf = user.id === Number(id)
    // Makes sure we have an "@" symbol.
    const name = create(type, options).content
    return isSelf ? <Highlight>{name}</Highlight> : <a href={`/chat/pm/${id}:${user.id}`} target={target}>{name}</a>
  }

  if (type !== 'room') target = '_blank'

  return (
    <LinkWithIcon
      url={url}
      icon={type === 'room' ? 'bell' : service}
      target={target}
    >
      {children}
    </LinkWithIcon>
  )
}

GrapeObject.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired
}
