import React from 'react'
import createRender, {renderTag} from '../grapedown/createRender'
import findMatches from 'grape-web/lib/search/findMatches'

export default function createGrapedownWithSearch({query, renderHighlight, user}) {
  const renderTagWithUser = (tag, props, children) => renderTag(tag, {...props, user}, children)

  const render = createRender({
    onIterate: (tag, props, children) => {
      if (typeof children[0] !== 'string') {
        return renderTagWithUser(tag, props, children)
      }

      const matches = findMatches(children[0], query).filter(({found}) => found)
      if (!matches.length) return renderTagWithUser(tag, props, children)

      return <span {...props}>{matches.map(renderHighlight)}</span>
    }
  })

  return props => render(props.text)
}
