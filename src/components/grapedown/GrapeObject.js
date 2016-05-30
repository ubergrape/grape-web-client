import React, {PropTypes} from 'react'
import markdownIt from 'markdown-it'
import {create as createObject, getOptions} from 'grape-web/lib/grape-objects'

import LinkWithIcon from '../message-parts/LinkWithIcon'
const {normalizeLinkText} = markdownIt()

export default function GrapeObject(props) {
  const {children, href} = props
  const options = getOptions(children[0], normalizeLinkText(href))
  const {url, name, content, service, type} = createObject(options.type, options)

  if (type === 'chatgrapeuser') {
    // No icon.
    return <a href={url}>{content}</a>
  }

  let icon = service
  let target

  if (type === 'chatgraperoom') {
    target = null
    icon = 'bell'
  }

  return <LinkWithIcon url={url} name={name} icon={icon} target={target} />
}

GrapeObject.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired
}
