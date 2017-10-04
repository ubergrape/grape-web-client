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
  const {type, service} = options
  let {url} = options
  let target

  if (conf.embed) target = '_blank'

  if (url[0] === '/') {
    url = `${conf.server.serviceUrl}${url}`
  }

  if (type === 'user') {
    const isSelf = `/chat/${user.slug}` === url
    // Makes sure we have an "@" symbol.
    const name = create(type, options).content
    return isSelf ? <Highlight>{name}</Highlight> : <a href={url} target={target}>{name}</a>
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
    slug: PropTypes.string.isRequired
  }).isRequired
}
