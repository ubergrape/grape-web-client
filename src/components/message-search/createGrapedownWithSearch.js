import React from 'react'
import omit from 'lodash/object/omit'
import findMatches from 'grape-web/lib/search/findMatches'

import render from '../grapedown/render'
import {renderTag} from '../grapedown/renderers'
import {nonStandardProps} from '../grapedown/utils'


export default function createGrapedownWithSearch(initialProps) {
  const {query, renderHighlight, user} = initialProps
  const renderTagWithUser = (tag, props, children) => renderTag(tag, {...props, user}, children)

  const renderProps = {
    renderTag: (tag, props, children) => {
      if (typeof children[0] !== 'string') {
        return renderTagWithUser(tag, props, children)
      }

      const matches = findMatches(children[0], query).filter(({found}) => found)
      if (!matches.length) return renderTagWithUser(tag, props, children)
      return <span {...omit(props, [...nonStandardProps, 'href'])}>{matches.map(renderHighlight)}</span>
    }
  }

  return props => render({...initialProps, ...props, ...renderProps})
}
