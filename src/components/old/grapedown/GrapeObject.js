import PropTypes from 'prop-types'
import React from 'react'
import markdownIt from 'markdown-it'
import { getOptions, create } from 'grape-web/lib/grape-objects'
import { Link } from 'grape-web/lib/router'

import LinkWithIcon from '../message-parts/link-with-icon/LinkWithIcon'
import Highlight from '../highlight/YellowHighlight'
import conf from '../../../conf'

const { normalizeLinkText } = markdownIt()

export default function GrapeObject({ children, href, user }) {
  const options = getOptions(children[0], normalizeLinkText(href))
  const { id, type, service, slug } = options
  let { url } = options

  if (type === 'user') {
    // TODO stop using strings in options.id, should be both same type.
    const isSelf = user.id === Number(id)
    // Makes sure we have an "@" symbol.
    const name = create(type, options).content
    return isSelf ? (
      <Highlight>{name}</Highlight>
    ) : (
      <Link to={`/chat/pm/${id}`}>{name}</Link>
    )
  }

  if (type === 'room') {
    return (
      <LinkWithIcon
        url={`${conf.server.serviceUrl}/chat/channel/${id}/${slug}`}
        icon="bell"
      >
        {children}
      </LinkWithIcon>
    )
  }

  if (url[0] === '/') {
    url = `${conf.server.serviceUrl}${url}`
  }

  return (
    <LinkWithIcon url={url} icon={service}>
      {children}
    </LinkWithIcon>
  )
}

GrapeObject.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
}
