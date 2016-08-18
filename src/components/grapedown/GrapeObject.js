import React, {PropTypes} from 'react'
import markdownIt from 'markdown-it'
import {create as createObject, getOptions} from 'grape-web/lib/grape-objects'

import LinkWithIcon from '../message-parts/LinkWithIcon'
import Highlight from '../highlight/YellowHighlight'
const {normalizeLinkText} = markdownIt()

export default function GrapeObject(props) {
  const {children, href, user} = props
  const options = getOptions(children[0], normalizeLinkText(href))
  const {url, name, content, service, type} = createObject(options.type, options)

  if (type === 'chatgrapeuser') {
    const isSelf = `/chat/${user.slug}` === url
    return isSelf ? <Highlight>{content}</Highlight> : <a href={url}>{content}</a>
  }

  let icon = service
  let target = '_blank'

  if (type === 'chatgraperoom') {
    target = undefined
    icon = 'bell'
  }

  return <LinkWithIcon url={url} name={name} icon={icon} target={target} />
}

GrapeObject.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  user: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
}
