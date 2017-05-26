import PropTypes from 'prop-types'
import React from 'react'
import markdownIt from 'markdown-it'
import {getOptions} from 'grape-web/lib/grape-objects'

import LinkWithIcon from '../message-parts/LinkWithIcon'
import Highlight from '../highlight/YellowHighlight'

const {normalizeLinkText} = markdownIt()

export default function GrapeObject({children, href, user}) {
  const {type, service, url} = getOptions(children[0], normalizeLinkText(href))

  if (type === 'user') {
    const isSelf = `/chat/${user.slug}` === url
    return isSelf ? <Highlight>{children}</Highlight> : <a href={url}>{children}</a>
  }

  let icon = service
  let target = '_blank'

  if (type === 'room') {
    target = undefined
    icon = 'bell'
  }

  return (
    <LinkWithIcon url={url} icon={icon} target={target}>
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
